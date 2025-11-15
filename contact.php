<?php
// Kontaktformular E-Mail-Versand Script
// Für Apache 2 Server

// Fehlerberichterstattung für Entwicklung (in Produktion auskommentieren)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Header setzen
header('Content-Type: text/html; charset=UTF-8');

// reCAPTCHA Secret Key (ersetzen Sie dies mit Ihrem Secret Key)
define('RECAPTCHA_SECRET_KEY', 'YOUR_SECRET_KEY_HERE');

// E-Mail Konfiguration
define('TO_EMAIL', 'info@planb-caravaning.de'); // Ihre E-Mail-Adresse
define('FROM_EMAIL', 'noreply@planb-caravaning.de'); // Absender E-Mail
define('FROM_NAME', 'PlanB Caravaning Kontaktformular');

// Funktion zur reCAPTCHA Validierung
function validateRecaptcha($response) {
    if (empty($response)) {
        return false;
    }
    
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = array(
        'secret' => RECAPTCHA_SECRET_KEY,
        'response' => $response,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    );
    
    $options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        )
    );
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        return false;
    }
    
    $json = json_decode($result, true);
    return isset($json['success']) && $json['success'] === true;
}

// Funktion zur Input-Bereinigung
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Funktion zur E-Mail-Validierung
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Antwort-Array
$response = array(
    'success' => false,
    'message' => ''
);

// Prüfen ob POST-Request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // reCAPTCHA Response erhalten
    $recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
    
    // reCAPTCHA validieren
    if (!validateRecaptcha($recaptchaResponse)) {
        $response['message'] = 'Bitte bestätigen Sie, dass Sie kein Roboter sind (reCAPTCHA).';
        echo json_encode($response);
        exit;
    }
    
    // Formular-Daten erhalten und bereinigen
    $name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $nachricht = isset($_POST['nachricht']) ? sanitizeInput($_POST['nachricht']) : '';
    $datenschutz = isset($_POST['datenschutz']) ? true : false;
    
    // Validierung
    if (empty($name)) {
        $response['message'] = 'Bitte geben Sie Ihren Namen ein.';
        echo json_encode($response);
        exit;
    }
    
    if (empty($email) || !validateEmail($email)) {
        $response['message'] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        echo json_encode($response);
        exit;
    }
    
    if (empty($nachricht)) {
        $response['message'] = 'Bitte geben Sie eine Nachricht ein.';
        echo json_encode($response);
        exit;
    }
    
    if (!$datenschutz) {
        $response['message'] = 'Bitte stimmen Sie der Datenschutzerklärung zu.';
        echo json_encode($response);
        exit;
    }
    
    // E-Mail zusammenstellen
    $subject = 'Neue Kontaktanfrage von ' . $name;
    
    $message = "Neue Kontaktanfrage über das Kontaktformular\n\n";
    $message .= "Name: " . $name . "\n";
    $message .= "E-Mail: " . $email . "\n";
    $message .= "Nachricht:\n" . $nachricht . "\n\n";
    $message .= "---\n";
    $message .= "Diese E-Mail wurde automatisch über das Kontaktformular auf " . $_SERVER['HTTP_HOST'] . " gesendet.\n";
    $message .= "IP-Adresse: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $message .= "Datum: " . date('d.m.Y H:i:s') . "\n";
    
    // E-Mail Header
    $headers = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // E-Mail versenden
    if (mail(TO_EMAIL, $subject, $message, $headers)) {
        $response['success'] = true;
        $response['message'] = 'Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.';
    } else {
        $response['message'] = 'Es ist ein Fehler beim Versenden der E-Mail aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.';
    }
    
} else {
    $response['message'] = 'Ungültige Anfrage.';
}

// JSON Response senden
echo json_encode($response);
exit;
?>

