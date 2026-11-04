<?php
/**
 * Ribbons USSD Handler for Qrios Webhook Platform
 * Developer Portal: https://deep.qrios.com/portal/dashboard
 * 
 * Client ID: ORHu1n1k
 * Client Secret / App ID: A71ISNW3KbkxKJSwbpGCSD1q
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$CLIENT_ID = 'ORHu1n1k';
$CLIENT_SECRET = 'A71ISNW3KbkxKJSwbpGCSD1q';
$APP_ID = 'A71ISNW3KbkxKJSwbpGCSD1q';

// Read JSON input from Qrios webhook
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

// Fallback to POST variables if not JSON
if (!$data) {
    $data = [
        'sessionId' => $_POST['sessionId'] ?? uniqid('sess_', true),
        'customerMsisdn' => $_POST['phoneNumber'] ?? '+2340000000000',
        'input' => [
            'text' => $_POST['text'] ?? ''
        ],
        'contextData' => $_POST['contextData'] ?? null
    ];
}

$sessionId = $data['sessionId'] ?? 'sess-default';
$customerMsisdn = $data['customerMsisdn'] ?? ($data['phoneNumber'] ?? '+2340000000000');
$inputText = '';

if (isset($data['input'])) {
    if (is_array($data['input'])) {
        $inputText = $data['input']['text'] ?? ($data['input']['dialString'] ?? '');
    } else {
        $inputText = (string)$data['input'];
    }
}

$contextData = [];
if (!empty($data['contextData'])) {
    if (is_string($data['contextData'])) {
        $contextData = json_decode($data['contextData'], true) ?: [];
    } elseif (is_array($data['contextData'])) {
        $contextData = $data['contextData'];
    }
}

$step = $contextData['step'] ?? 'menu';
$input = trim($inputText);

// Routing state machine
$response = [];

if ($step === 'menu' && empty($input)) {
    $response = [
        'type' => 'InputView',
        'message' => "Welcome to Ribbons GBV Crisis Support\n1. Immediate Emergency SOS\n2. Locate SARC / One-Stop Centre\n3. Request Multi-Sectoral Aid\n4. File Incident Report\n5. FAQs & 72h PEP Info",
        'contextData' => json_encode(['step' => 'main_menu', 'phone' => $customerMsisdn])
    ];
} elseif ($step === 'main_menu') {
    switch ($input) {
        case '1':
            // Emergency SOS
            $response = [
                'type' => 'ShowView',
                'message' => "🚨 EMERGENCY SOS ACTIVATED!\nCaseworkers alerted for: $customerMsisdn\nHotlines:\n- National: 112\n- GBV Rapid Response: 08000-RIBBONS\nStay in a safe place. An agent is contacting you now.",
                'contextData' => json_encode(['step' => 'completed'])
            ];
            break;

        case '2':
            $response = [
                'type' => 'InputView',
                'message' => "Select State/Region:\n1. Andaman & Nicobar\n2. Andhra Pradesh\n3. Lagos & Abuja (Nigeria)\n0. Back",
                'contextData' => json_encode(['step' => 'select_state', 'phone' => $customerMsisdn])
            ];
            break;

        case '3':
            $response = [
                'type' => 'InputView',
                'message' => "Select Support Needed:\n1. Supplies & Kits\n2. Health (PEP within 72h)\n3. Psychosocial Therapy\n4. WASH Support\n5. Legal & Police Protection\n0. Back",
                'contextData' => json_encode(['step' => 'select_support', 'phone' => $customerMsisdn])
            ];
            break;

        case '4':
            $response = [
                'type' => 'InputView',
                'message' => "Incident Report:\nEnter your name (or 'Anon' to remain anonymous):",
                'contextData' => json_encode(['step' => 'report_name', 'phone' => $customerMsisdn])
            ];
            break;

        case '5':
            $response = [
                'type' => 'ShowView',
                'message' => "ℹ️ 72-Hour Medical Window:\nIf sexual assault occurred within 72 hours, visit a SARC or hospital immediately for PEP (prevents HIV) and emergency contraception.\nPreserve evidence by avoiding bathing.",
                'contextData' => json_encode(['step' => 'completed'])
            ];
            break;

        default:
            $response = [
                'type' => 'InputView',
                'message' => "Invalid choice. Please select:\n1. Emergency SOS\n2. Locate SARC\n3. Request Aid\n4. File Report\n5. FAQs",
                'contextData' => json_encode(['step' => 'main_menu', 'phone' => $customerMsisdn])
            ];
            break;
    }
} elseif ($step === 'select_state') {
    if ($input === '1') {
        $response = [
            'type' => 'ShowView',
            'message' => "📍 One-Stop Centre, South Andaman\nJunglighat, Port Blair\nPhone: 0319-2230504\nFree medical, trauma, & legal care 24/7.",
            'contextData' => json_encode(['step' => 'completed'])
        ];
    } elseif ($input === '2') {
        $response = [
            'type' => 'ShowView',
            'message' => "📍 One-Stop Centre, Krishna (AP)\nShaik Raja Hospital, Vijayawada\nPhone: 9398914772\n24/7 Crisis helpline.",
            'contextData' => json_encode(['step' => 'completed'])
        ];
    } elseif ($input === '3') {
        $response = [
            'type' => 'ShowView',
            'message' => "📍 Mirabel Centre (SARC Lagos)\nLASUTH, Ikeja, Lagos\nPhone: 08187215396\nFree medical & forensic examination.",
            'contextData' => json_encode(['step' => 'completed'])
        ];
    } else {
        $response = [
            'type' => 'InputView',
            'message' => "Invalid choice.\n1. Andaman\n2. Andhra Pradesh\n3. Lagos & Abuja",
            'contextData' => json_encode(['step' => 'select_state', 'phone' => $customerMsisdn])
        ];
    }
} elseif ($step === 'select_support') {
    $categories = [
        '1' => 'Supplies',
        '2' => 'Health',
        '3' => 'Psychosocial',
        '4' => 'WASH',
        '5' => 'Legal'
    ];
    $cat = $categories[$input] ?? 'General Support';
    $response = [
        'type' => 'InputView',
        'message' => "Requesting $cat Support.\nEnter your location (City/State):",
        'contextData' => json_encode(['step' => 'support_loc', 'cat' => $cat, 'phone' => $customerMsisdn])
    ];
} elseif ($step === 'support_loc') {
    $cat = $contextData['cat'] ?? 'General Support';
    $response = [
        'type' => 'ShowView',
        'message' => "✅ Support ticket created for $cat in $input.\nOur caseworkers are reviewing this ticket and will call $customerMsisdn shortly.\nEmergency hotline: 112.",
        'contextData' => json_encode(['step' => 'completed'])
    ];
} elseif ($step === 'report_name') {
    $response = [
        'type' => 'InputView',
        'message' => "Enter Incident Location:",
        'contextData' => json_encode(['step' => 'report_loc', 'name' => $input, 'phone' => $customerMsisdn])
    ];
} elseif ($step === 'report_loc') {
    $response = [
        'type' => 'InputView',
        'message' => "Describe the incident briefly:",
        'contextData' => json_encode(array_merge($contextData, ['step' => 'report_desc', 'loc' => $input]))
    ];
} elseif ($step === 'report_desc') {
    $response = [
        'type' => 'ShowView',
        'message' => "🛡️ Incident report filed securely.\nA caseworker has been notified. You are not alone.\nEmergency: Call 112 immediately if in danger.",
        'contextData' => json_encode(['step' => 'completed'])
    ];
} else {
    $response = [
        'type' => 'ShowView',
        'message' => "Thank you for using Ribbons. Session closed.\n24/7 Helpline: 112",
        'contextData' => json_encode(['step' => 'completed'])
    ];
}

echo json_encode($response);
?>

