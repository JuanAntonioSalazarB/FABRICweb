"use server";

import { OpenAI } from 'openai';
import { connectToDatabase } from '@/lib/mongodb';
import { Settings, SystemPrompt, LocalKnowledge } from '@/lib/models';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const DEFAULT_SYSTEM_PROMPT = `
Eres la Inteligencia Artificial Consultora de Migración y Remediación de FABRIC (Boutique de Ingeniería Crítica Oracle).
Tu tono es directo, profesional, técnico, con una postura de ingeniería rigurosa. No usas lenguaje corporativo vacío ("sinergias", "agilidad transformacional"). Hablas con datos, hechos, y experiencia operativa.

Conocimiento clave de FABRIC:
- **Modelo Operativo**: Solo asignamos ingenieros senior con más de 8 años de experiencia promedio. Hitos con Fixed-Price por fase (asumimos desviaciones técnicas).
- **Garantía Contractual (Cláusula 7.2)**: Si no estabilizamos el primer cierre contable del cliente en producción en la fecha acordada por causas de nuestra ingeniería, no facturamos los servicios de estabilización hasta lograrlo.
- **Caso APE Plazas**: Rescate de la facturación masiva de arrendamientos en Oracle Fusion Cloud en 2026. Logramos el Go-Live el 06 de abril y el primer cierre de abril sin incidencias de severidad alta.
- **Caso Aplazo**: Estabilización del subledger de cuentas por cobrar en 8 semanas, alineándolo con el General Ledger (GL) mediante reglas personalizadas de SLA de base de datos.
- **Doctrina**:
  1. Entrega en primer ciclo crítico (no solo en el Go-Live técnico).
  2. Solo ingenieros seniors, cero juniors asignados.
  3. Compromiso Fixed-Price.
  4. Cero reportes manuales paralelos (corregimos Fusion para no usar hojas de cálculo externas).
  5. Transición formal con especificaciones FSO (Objetos de Solución) y diagramas vivos.
- **Servicios**: Rescate de Fusion Fallido, Migraciones Legacy (SAP S/4, EBS R12, JD Edwards), Implementación Greenfield.
- **Criterios de Admisión**: Solo trabajamos con corporativos con facturaciones altas y severidad real que estén dispuestos a seguir la doctrina.

Responde de forma concisa, imitando un prompt de terminal técnica, brindando detalles concretos sobre bases de datos Oracle, integraciones Web Services REST/SOAP, y conciliaciones fiscales de CFDI en México.
`;

export async function chatAction(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
  try {
    const userQuestion = messages[messages.length - 1].content;
    let responseText = '';
    let source = '';

    // Load configurations from Database
    let systemPromptValue = DEFAULT_SYSTEM_PROMPT;
    let localKnowledgeValue = '';
    let activeModel = 'gpt-4o';
    let activeTemp = 0.1;

    try {
      const conn = await connectToDatabase();
      if (conn) {
        const sysPromptDoc = await SystemPrompt.findOne().sort({ updatedAt: -1 });
        const localKnowledgeDoc = await LocalKnowledge.findOne().sort({ updatedAt: -1 });
        const settings = await Settings.findOne();

        if (sysPromptDoc && sysPromptDoc.content) {
          systemPromptValue = sysPromptDoc.content;
        } else if (settings?.systemPrompt) {
          systemPromptValue = settings.systemPrompt;
        }

        if (localKnowledgeDoc && localKnowledgeDoc.content) {
          localKnowledgeValue = localKnowledgeDoc.content;
        } else if (settings?.localKnowledge) {
          localKnowledgeValue = settings.localKnowledge;
        }

        if (settings) {
          if (settings.openaiModel) activeModel = settings.openaiModel;
          if (settings.temperature !== undefined) activeTemp = settings.temperature;
        }
      }
    } catch (dbErr) {
      console.warn('Could not load custom settings from DB for chat, using defaults:', dbErr);
    }

    if (!openai) {
      console.log('OpenAI API Key not configured. Returning mock response.');
      const lowerQuestion = userQuestion.toLowerCase();
      
      // Simple keyword matching for mock
      let foundInLocalMock = false;
      if (localKnowledgeValue.trim() !== '') {
        const words = lowerQuestion.split(/\s+/).filter(w => w.length > 4);
        for (const word of words) {
          if (localKnowledgeValue.toLowerCase().includes(word)) {
            foundInLocalMock = true;
            break;
          }
        }
      }

      if (foundInLocalMock) {
        responseText = `[Consola IA - Respuesta de Conocimiento Local (MOCK)]\nSe detectó información relevante sobre su consulta en el Conocimiento Local guardado.\n\nExtracto: "${localKnowledgeValue.substring(0, 150)}..."\n\nRespuesta de especificación técnica de FabricSoft: "El proceso de sincronización local se ejecuta antes de enviar a Oracle REST APIs."`;
        source = 'local_knowledge';
      } else {
        responseText = `[Consola IA - Respuesta de ChatGPT Core (MOCK)]\nRespondiendo según el Prompt del Sistema.\n\nSystem Prompt: "${systemPromptValue.substring(0, 100)}..."\n\nRespuesta de ingeniería de FABRIC: "Priorizamos la estabilización del subledger general y las conexiones REST API sin parches manuales. Analizando arquitectura legacy."`;
        source = 'chatgpt_core';
      }

      return {
        success: true,
        response: responseText,
        source: source
      };
    }

    // Step 1: Check in Local Knowledge using gpt-4o-mini as decision engine
    if (localKnowledgeValue.trim() !== '') {
      try {
        const promptToSearchLocal = `Eres un motor de búsqueda local de documentación de FabricSoft. Tienes acceso al siguiente texto de CONOCIMIENTO LOCAL:
---
${localKnowledgeValue}
---
Pregunta del usuario: "${userQuestion}"

Tu tarea es determinar si el CONOCIMIENTO LOCAL de arriba contiene la respuesta a la pregunta del usuario.
Si el CONOCIMIENTO LOCAL contiene la información para responder la pregunta, responde a la pregunta de manera concisa basándote ÚNICAMENTE en el conocimiento local proporcionado.
Si el CONOCIMIENTO LOCAL NO contiene la respuesta, debes responder EXACTAMENTE con la palabra: NOT_FOUND`;

        const chatCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: promptToSearchLocal }],
          max_tokens: 300,
          temperature: 0.1
        });

        const localResponse = chatCompletion?.choices?.[0]?.message?.content?.trim() || '';

        if (localResponse !== 'NOT_FOUND' && !localResponse.includes('NOT_FOUND')) {
          responseText = localResponse;
          source = 'local_knowledge';
        }
      } catch (localErr: any) {
        console.error("Error checking local knowledge via OpenAI in chatAction:", localErr);
      }
    }

    // Step 2: Fallback to ChatGPT Core with System Prompt if not answered yet
    if (!responseText) {
      const response = await openai.chat.completions.create({
        model: activeModel,
        messages: [
          { role: 'system', content: systemPromptValue },
          ...messages
        ],
        temperature: activeTemp,
      });
      responseText = response.choices[0].message.content || '';
      source = 'chatgpt_core';
    }

    return {
      success: true,
      response: responseText,
      source: source
    };
  } catch (error: any) {
    console.error('Error in chatAction:', error);
    return { success: false, error: error.message };
  }
}

