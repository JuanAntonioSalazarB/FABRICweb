"use client";

import { useEffect, useRef } from "react";
import { translationDictionary } from "@/locales/dictionary";

interface ClientTranslatorProps {
  lang: "es" | "en";
}

// Extend Node interface in TypeScript to store original values
interface TranslatableTextNode extends Text {
  __originalText?: string;
}

interface TranslatableElement extends HTMLElement {
  __originalPlaceholder?: string;
}

export default function ClientTranslator({ lang }: ClientTranslatorProps) {
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    // Helper to translate a single text node
    const translateTextNode = (node: TranslatableTextNode) => {
      const text = node.nodeValue;
      if (!text) return;

      const trimmed = text.trim();
      if (!trimmed) return;

      // Initialize original text if not already stored
      if (node.__originalText === undefined) {
        node.__originalText = text;
      }

      if (langRef.current === "en") {
        const normalized = trimmed.replace(/\s+/g, " ");
        const translated = translationDictionary[normalized] || translationDictionary[trimmed];
        if (translated) {
          const leadingSpace = text.match(/^\s*/)?.[0] || "";
          const trailingSpace = text.match(/\s*$/)?.[0] || "";
          node.nodeValue = leadingSpace + translated + trailingSpace;
        }
      } else {
        node.nodeValue = node.__originalText;
      }
    };

    // Helper to translate element properties (like placeholders)
    const translateElement = (element: TranslatableElement) => {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        const placeholder = element.getAttribute("placeholder");
        if (placeholder) {
          if (element.__originalPlaceholder === undefined) {
            element.__originalPlaceholder = placeholder;
          }

          if (langRef.current === "en") {
            const placeholderTrimmed = placeholder.trim();
            const normalized = placeholderTrimmed.replace(/\s+/g, " ");
            const translated = translationDictionary[normalized] || translationDictionary[placeholderTrimmed];
            if (translated) {
              element.setAttribute("placeholder", translated);
            }
          } else {
            element.setAttribute("placeholder", element.__originalPlaceholder);
          }
        }
      }
    };

    // Main DOM walker
    const translateDOM = (root: Node) => {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              const tag = el.tagName;
              if (
                tag === "SCRIPT" ||
                tag === "STYLE" ||
                tag === "NOSCRIPT" ||
                el.classList.contains("notranslate")
              ) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) {
          translateTextNode(node as TranslatableTextNode);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          translateElement(node as TranslatableElement);
        }
      }
    };

    // Translate the entire document initially
    translateDOM(document.body);

    // Debounce timer to avoid excessive re-translations
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // MutationObserver: when new content is added (modals, lazy sections),
    // immediately translate added nodes AND schedule a full-body re-sweep
    // 80ms later to catch React sub-renders that arrive slightly after.
    const observer = new MutationObserver((mutations) => {
      if (langRef.current !== "en") return;

      // Immediately translate directly added nodes
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            translateDOM(node);
          } else if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node as TranslatableTextNode);
          }
        });
      });

      // Schedule a full-body sweep for sub-renders React finishes slightly later
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        translateDOM(document.body);
      }, 80);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [lang]);

  return null;
}
