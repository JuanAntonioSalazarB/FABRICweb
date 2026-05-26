<?php
/**
 * FABRIC - Oracle Critical Engineering
 * Script PHP para envío de enlaces de Google Meet de Mesas Técnicas
 */

// Deshabilitar salida de errores directa para prevenir fugas de información
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Permitir solicitudes CORS desde el dashboard de Next.js
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Solo procesar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("success" => false, "error" => "Método no permitido. Utilizar POST."));
    exit;
}

// Recoger los datos enviados en formato JSON o POST regular
$input = json_decode(file_get_contents('php://input'), true);

$nombre = isset($input['client-name']) ? htmlspecialchars($input['client-name']) : (isset($_POST['client-name']) ? htmlspecialchars($_POST['client-name']) : '');
$email = isset($input['client-email']) ? filter_var($input['client-email'], FILTER_SANITIZE_EMAIL) : (isset($_POST['client-email']) ? filter_var($_POST['client-email'], FILTER_SANITIZE_EMAIL) : '');
$empresa = isset($input['company']) ? htmlspecialchars($input['company']) : (isset($_POST['company']) ? htmlspecialchars($_POST['company']) : '');
$fecha = isset($input['date']) ? htmlspecialchars($input['date']) : (isset($_POST['date']) ? htmlspecialchars($_POST['date']) : '');
$horario = isset($input['time-slot']) ? htmlspecialchars($input['time-slot']) : (isset($_POST['time-slot']) ? htmlspecialchars($_POST['time-slot']) : '');
$enlace = isset($input['meet-link']) ? filter_var($input['meet-link'], FILTER_SANITIZE_URL) : (isset($_POST['meet-link']) ? filter_var($_POST['meet-link'], FILTER_SANITIZE_URL) : '');

// Validaciones básicas
if (empty($nombre) || empty($email) || empty($fecha) || empty($horario) || empty($enlace)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "error" => "Faltan campos obligatorios para el envío (nombre, email, fecha, horario, enlace)."));
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "error" => "Dirección de correo electrónico inválida."));
    exit;
}

// Configurar destinatarios: correo del usuario y correo del administrador
$adminEmail = "antonio.salazar@fabricsoft.com.mx";

$subject = "Mesa Técnica FABRIC - Acceso a Google Meet ($fecha)";

// Cuerpo del mensaje con el diseño Premium de FABRIC (Dark & Gold)
$body = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mesa Técnica FABRIC</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #050505;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            width: 100% !important;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #0A0A0A;
            border: 1px solid rgba(201, 169, 110, 0.18);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
        }
        .header {
            border-bottom: 1px solid rgba(201, 169, 110, 0.15);
            padding: 25px 20px;
            text-align: center;
            background-color: #070707;
        }
        .header h1 {
            color: #ffffff;
            font-family: Georgia, serif;
            font-size: 24px;
            letter-spacing: 0.2em;
            font-weight: 300;
            margin: 0;
            text-transform: uppercase;
        }
        .header p {
            color: #C9A96E;
            font-family: "Courier New", Courier, monospace;
            font-size: 10px;
            letter-spacing: 0.15em;
            margin: 6px 0 0 0;
            text-transform: uppercase;
        }
        .content {
            padding: 30px 40px;
            color: #F4F4F5;
            line-height: 1.6;
            font-size: 13px;
        }
        .content p {
            margin-top: 0;
            margin-bottom: 15px;
            color: #A1A1AA;
        }
        .details-box {
            background-color: #141414;
            border: 1px solid rgba(201, 169, 110, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .details-table td {
            padding: 8px 0;
            border-bottom: 1px solid #1c1c1e;
            color: #FFFFFF;
            font-family: "Courier New", Courier, monospace;
            font-size: 12px;
        }
        .details-table tr:last-child td {
            border-bottom: none;
        }
        .details-table td.label {
            color: #C9A96E;
            font-weight: bold;
            width: 35%;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.05em;
        }
        .btn-container {
            text-align: center;
            margin: 30px 0 10px 0;
        }
        .btn-meet {
            display: inline-block;
            background-color: #C9A96E;
            color: #0A0A0A !important;
            font-family: "Courier New", Courier, monospace;
            font-weight: bold;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.1em;
            padding: 14px 28px;
            border-radius: 9999px;
        }
        .footer {
            background-color: #070708;
            color: #52525B;
            padding: 20px;
            text-align: center;
            font-size: 9px;
            font-family: "Courier New", Courier, monospace;
            border-top: 1px solid rgba(201, 169, 110, 0.08);
            line-height: 1.5;
        }
        .footer a {
            color: #C9A96E;
            text-decoration: underline;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0;
                border-radius: 0;
                border: none;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>FABRIC</h1>
            <p>Oracle Critical Engineering</p>
        </div>
        <div class="content">
            <p>Estimado(a) <strong>' . $nombre . '</strong>,</p>
            <p>Se ha generado el canal de acceso virtual para la <strong>Mesa Técnica 1-on-1</strong> reservada para tu corporación.</p>
            
            <div class="details-box">
                <table class="details-table">
                    <tr>
                        <td class="label">Mesa Técnica:</td>
                        <td>Consulta de Ingeniería de Sistemas ERP</td>
                    </tr>
                    <tr>
                        <td class="label">Empresa:</td>
                        <td>' . ($empresa ? $empresa : 'No especificada') . '</td>
                    </tr>
                    <tr>
                        <td class="label">Fecha Programada:</td>
                        <td>' . $fecha . '</td>
                    </tr>
                    <tr>
                        <td class="label">Horario:</td>
                        <td>' . $horario . '</td>
                    </tr>
                    <tr>
                        <td class="label">Enlace de Meet:</td>
                        <td><a href="' . $enlace . '" style="color: #C9A96E; text-decoration: underline;">' . $enlace . '</a></td>
                    </tr>
                </table>
            </div>

            <p>Haz clic en el botón inferior para unirte directamente a la sala el día de la cita:</p>
            
            <div class="btn-container">
                <a href="' . $enlace . '" class="btn-meet">Ingresar a la Sesión</a>
            </div>
            
            <p style="font-size: 11px; margin-top: 20px;">Nota: Si tienes alguna duda previa, puedes responder a este correo para comunicarte directamente con la mesa de ingeniería.</p>
        </div>
        <div class="footer">
            <p>&copy; ' . date("Y") . ' FABRIC. Todos los derechos reservados.</p>
            <p>Este correo ha sido generado y enviado de manera segura a: ' . $email . '</p>
            <p>Copia de seguridad enviada a: <a href="mailto:' . $adminEmail . '">' . $adminEmail . '</a></p>
        </div>
    </div>
</body>
</html>
';

// Encabezados para correo HTML
$headers = "From: FABRIC <contacto@fabriconsulting.com.mx>\r\n";
$headers .= "Reply-To: $adminEmail\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Intentar enviar el correo por separado a ambos destinatarios para garantizar la entrega
$success_client = mail($email, $subject, $body, $headers);
$success_admin = mail($adminEmail, $subject, $body, $headers);

if ($success_client && $success_admin) {
    echo json_encode(array("success" => true, "message" => "Enlace de Meet enviado con éxito a $email y $adminEmail."));
} else if ($success_client || $success_admin) {
    $msg = "Envío parcial: ";
    if (!$success_client) $msg .= "Fallo al enviar al cliente ($email). ";
    if (!$success_admin) $msg .= "Fallo al enviar al administrador ($adminEmail).";
    echo json_encode(array("success" => true, "message" => $msg, "warning" => $msg));
} else {
    $errorInfo = error_get_last();
    $errorMessage = $errorInfo ? $errorInfo['message'] : 'Error desconocido al enviar los correos mediante mail().';
    http_response_code(500);
    echo json_encode(array("success" => false, "error" => "Error al enviar el correo a ambos destinatarios: " . $errorMessage));
}
?>
