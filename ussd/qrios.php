<?php
/**
 * Ribbons USSD Handler for Qrios Webhook Platform & Telco Gateways
 * Languages: English (1), Hausa (2), Hindi (3)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Id, X-Client-Secret');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

$isJson = ($data !== null) || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false);

// Fallback to POST variables if not JSON
if (!$data) {
    $data = [
        'sessionId' => $_POST['sessionId'] ?? uniqid('sess_', true),
        'customerMsisdn' => $_POST['phoneNumber'] ?? '+2348000000000',
        'input' => [
            'text' => $_POST['text'] ?? ''
        ],
        'contextData' => $_POST['contextData'] ?? null
    ];
}

$sessionId = $data['sessionId'] ?? uniqid('sess_', true);
$customerMsisdn = $data['customerMsisdn'] ?? ($data['phoneNumber'] ?? '+2348000000000');

$inputText = '';
if (isset($data['input'])) {
    if (is_array($data['input'])) {
        $inputText = $data['input']['text'] ?? ($data['input']['dialString'] ?? '');
    } else {
        $inputText = (string)$data['input'];
    }
}
$input = trim($inputText);

// Parse context data
$context = [];
if (!empty($data['contextData'])) {
    if (is_string($data['contextData'])) {
        $context = json_decode($data['contextData'], true) ?: [];
    } elseif (is_array($data['contextData'])) {
        $context = $data['contextData'];
    }
}

// Support Africa's Talking / Telco format text (e.g. "1*2*1")
if (!$isJson && isset($_POST['text']) && empty($context['step'])) {
    $rawText = trim($_POST['text']);
    if ($rawText === '') {
        $context = ['step' => 'welcome'];
        $input = '';
    } else {
        $parts = explode('*', $rawText);
        $total = count($parts);
        $lastInput = end($parts);
        
        if ($total === 1) {
            $context = ['step' => 'lang_select'];
            $input = $parts[0];
        } elseif ($total === 2) {
            $chosenLang = ($parts[0] === '2') ? 'ha' : (($parts[0] === '3') ? 'hi' : 'en');
            $context = ['step' => 'main_menu', 'lang' => $chosenLang];
            $input = $parts[1];
        } elseif ($total === 3) {
            $chosenLang = ($parts[0] === '2') ? 'ha' : (($parts[0] === '3') ? 'hi' : 'en');
            $action = $parts[1];
            if ($action === '2') {
                $context = ['step' => 'locate_state', 'lang' => $chosenLang];
            } elseif ($action === '3') {
                $context = ['step' => 'support_category', 'lang' => $chosenLang];
            } elseif ($action === '4') {
                $context = ['step' => 'report_desc', 'lang' => $chosenLang];
            }
            $input = $parts[2];
        }
    }
}

$step = $context['step'] ?? 'welcome';
$lang = $context['lang'] ?? 'en';

$responseType = 'InputView';
$responseMessage = '';
$nextContext = $context;
$nextContext['phone'] = $customerMsisdn;

// STATE MACHINE
if ($step === 'welcome' || (empty($input) && $step !== 'report_desc' && $step !== 'support_loc' && $step !== 'report_name')) {
    // 1. Initial Screen: Language Selection
    $responseType = 'InputView';
    $responseMessage = "Welcome to Ribbons / Barka da zuwa Ribbons:\nSelect Language / Zabi Harshe:\n1. English\n2. Hausa\n3. Hindi";
    $nextContext = [
        'step' => 'lang_select',
        'phone' => $customerMsisdn
    ];

} elseif ($step === 'lang_select') {
    // Determine language from selection
    if ($input === '1' || strtolower($input) === 'english') {
        $lang = 'en';
    } elseif ($input === '2' || strtolower($input) === 'hausa') {
        $lang = 'ha';
    } elseif ($input === '3' || strtolower($input) === 'hindi') {
        $lang = 'hi';
    } else {
        // Fallback or re-prompt
        $responseType = 'InputView';
        $responseMessage = "Invalid choice. Select Language / Zabi Harshe:\n1. English\n2. Hausa\n3. Hindi";
        $nextContext = ['step' => 'lang_select', 'phone' => $customerMsisdn];
        goto finishResponse;
    }

    $nextContext['lang'] = $lang;
    $nextContext['step'] = 'main_menu';
    $responseType = 'InputView';

    if ($lang === 'ha') {
        $responseMessage = "Tallafin Gaggawa na Ribbons:\n1. Neman Agajin Gaggawa (SOS)\n2. Nemo Cibiyar SARC / Asibiti\n3. Nemi Tallafi\n4. Shigar da Rahoton Cin Zarafi\n5. Tambayoyi & Bayanan PEP (72h)\n0. Canja Harshe";
    } elseif ($lang === 'hi') {
        $responseMessage = "Ribbons सहायता केंद्र:\n1. आपातकालीन एसओएस (SOS)\n2. सहायता केंद्र (SARC) खोजें\n3. सहायता का अनुरोध करें\n4. शिकायत दर्ज करें\n5. पूछे जाने वाले प्रश्न & 72h PEP\n0. भाषा बदलें";
    } else {
        $responseMessage = "Ribbons Crisis Support:\n1. Immediate Emergency SOS\n2. Locate SARC / Health Center\n3. Request Assistance\n4. File Incident Report\n5. FAQs & 72h PEP Info\n0. Change Language";
    }

} elseif ($step === 'main_menu') {
    if ($input === '0') {
        // Back to language select
        $responseType = 'InputView';
        $responseMessage = "Select Language / Zabi Harshe:\n1. English\n2. Hausa\n3. Hindi";
        $nextContext = ['step' => 'lang_select', 'phone' => $customerMsisdn];
        goto finishResponse;
    }

    switch ($input) {
        case '1': // Emergency SOS
            $responseType = 'ShowView';
            if ($lang === 'ha') {
                $responseMessage = "🚨 AN TURA SAKON GAGGAWA (SOS)!\nAn sanar da masu bada agaji don: $customerMsisdn\nLayin Taimako:\n- Yan Sanda / Gaggawa: 112\n- Layin Kano: 08000-RIBBONS\n- Mirabel SARC: 08187215396\nKada ki ji tsoro, jami'anmu na kan hanya domin taimaka miki.";
            } elseif ($lang === 'hi') {
                $responseMessage = "🚨 आपातकालीन एसओएस सक्रिय!\nसहायता दल को सूचित कर दिया गया है: $customerMsisdn\nहेल्पलाइन: 112 / 1091\nसुरक्षित स्थान पर रहें, एजेंट संपर्क कर रहा है।";
            } else {
                $responseMessage = "🚨 EMERGENCY SOS ACTIVATED!\nRapid Response Alerted for: $customerMsisdn\nHotlines:\n- National Helpline: 112\n- Kano Helpline: 08000-RIBBONS\n- Mirabel SARC: 08187215396\nStay in a safe place. An agent is contacting you now.";
            }
            $nextContext = ['step' => 'completed', 'lang' => $lang];
            break;

        case '2': // Locate SARC
            $responseType = 'InputView';
            if ($lang === 'ha') {
                $responseMessage = "Zabi Jiha / Wuri:\n1. Kano (Asibitin Murtala)\n2. Kaduna (Asibitin Barau Dikko)\n3. Abuja (Asibitin Bwari)\n4. Lagos (Mirabel Centre LASUTH)\n0. Baya";
            } elseif ($lang === 'hi') {
                $responseMessage = "स्थान चुनें:\n1. Kano\n2. Kaduna\n3. Abuja\n4. Lagos\n0. वापस";
            } else {
                $responseMessage = "Select Location:\n1. Kano (Murtala Mohd Specialist Hosp)\n2. Kaduna (Barau Dikko Teaching Hosp)\n3. Abuja FCT (Bwari General Hosp)\n4. Lagos (Mirabel Centre LASUTH)\n0. Back";
            }
            $nextContext = ['step' => 'locate_state', 'lang' => $lang, 'phone' => $customerMsisdn];
            break;

        case '3': // Request Assistance
            $responseType = 'InputView';
            if ($lang === 'ha') {
                $responseMessage = "Zabi Irin Tallafin da Kike Buqata:\n1. Magunguna & PEP na Gaggawa\n2. Shawarwari & Taimakon Hankali\n3. Kayan Agaji & Tsafta\n4. Taimakon Shari'a & Yan Sanda\n0. Baya";
            } elseif ($lang === 'hi') {
                $responseMessage = "सहायता का प्रकार चुनें:\n1. चिकित्सा और PEP\n2. परामर्श\n3. आपातकालीन आपूर्ति\n4. कानूनी सहायता\n0. वापस";
            } else {
                $responseMessage = "Select Support Needed:\n1. Medical & Emergency PEP\n2. Psychosocial Counseling\n3. Emergency Supplies Kit\n4. Legal & Police Protection\n0. Back";
            }
            $nextContext = ['step' => 'support_category', 'lang' => $lang, 'phone' => $customerMsisdn];
            break;

        case '4': // File Incident Report
            $responseType = 'InputView';
            if ($lang === 'ha') {
                $responseMessage = "Rahoton Cin Zarafi:\nRubuta takaitaccen bayanin abin da ya faru:";
            } elseif ($lang === 'hi') {
                $responseMessage = "घटना का संक्षिप्त विवरण दर्ज करें:";
            } else {
                $responseMessage = "Incident Report:\nEnter a brief description of what happened:";
            }
            $nextContext = ['step' => 'report_desc', 'lang' => $lang, 'phone' => $customerMsisdn];
            break;

        case '5': // FAQs & 72h PEP Info
            $responseType = 'ShowView';
            if ($lang === 'ha') {
                $responseMessage = "ℹ️ BAYANI MAI MUHIMMANCI (AWA 72):\n- Maganin PEP na hana kamuwa da kanjamau idan an sha shi cikin awa 72.\n- Akwai maganin hana ciki na gaggawa.\n- Dukkan ayyukan SARC KYAUTA ne.\n- Kada a yi wanka kafin ganin likita.\nKira 112 ko je asibiti mafi kusa nan take.";
            } elseif ($lang === 'hi') {
                $responseMessage = "ℹ️ 72-घंटे की महत्वपूर्ण जानकारी:\n- PEP 72 घंटे के भीतर लेने पर एचआईवी से बचाता है।\n- आपातकालीन गर्भनिरोधक उपलब्ध है।\n- SARC सेवाएं 100% निःशुल्क हैं।\n- जांच से पहले स्नान न करें।\nहेल्पलाइन: 112";
            } else {
                $responseMessage = "ℹ️ 72-HOUR CRITICAL WINDOW:\n- PEP prevents HIV if taken within 72h of assault.\n- Emergency contraception prevents pregnancy.\n- SARC services are 100% FREE.\n- Avoid bathing before examination.\nCall 112 or visit nearest hospital immediately.";
            }
            $nextContext = ['step' => 'completed', 'lang' => $lang];
            break;

        default:
            $responseType = 'InputView';
            $msg = ($lang === 'ha') ? "Kuskuren zabi. Zabi 1-5 ko 0 don komawa." : "Invalid choice. Please select 1-5 or 0 for back.";
            $responseMessage = $msg;
            $nextContext = ['step' => 'main_menu', 'lang' => $lang, 'phone' => $customerMsisdn];
            break;
    }

} elseif ($step === 'locate_state') {
    if ($input === '0') {
        // Back to main menu
        $nextContext['step'] = 'lang_select';
        $input = ($lang === 'ha') ? '2' : (($lang === 'hi') ? '3' : '1');
        // Redisplay main menu
        $step = 'lang_select';
        goto finishResponse;
    }

    $responseType = 'ShowView';
    if ($input === '1') { // Kano
        $responseMessage = ($lang === 'ha') 
            ? "📍 Murtala Muhammad SARC, Kano.\nWaya: 08031234567\nKulawar likita, PEP & shawarwari kyauta 24/7."
            : "📍 Murtala Muhammad SARC, Kano.\nTel: 08031234567\nFree 24/7 medical examination, PEP & counseling.";
    } elseif ($input === '2') { // Kaduna
        $responseMessage = ($lang === 'ha')
            ? "📍 Salama SARC, Asibitin Barau Dikko, Kaduna.\nWaya: 08029876543\nMagani, PEP da taimakon gaggawa kyauta."
            : "📍 Salama SARC, Barau Dikko Hospital, Kaduna.\nTel: 08029876543\nFree medical care, PEP & safe refuge referral.";
    } elseif ($input === '3') { // Abuja
        $responseMessage = ($lang === 'ha')
            ? "📍 Bwari SARC, Babban Asibitin Bwari, Abuja.\nWaya: 08092222245\nKulawar likita da shawarwari kyauta."
            : "📍 Bwari SARC, Bwari Hospital, Abuja FCT.\nTel: 08092222245\n24/7 Free medical & counseling services.";
    } elseif ($input === '4') { // Lagos
        $responseMessage = ($lang === 'ha')
            ? "📍 Mirabel Centre, LASUTH, Ikeja, Lagos.\nWaya: 08187215396\nCikakken tallafin asibiti da na shari'a kyauta."
            : "📍 Mirabel Centre, LASUTH, Ikeja, Lagos.\nTel: 08187215396\nComprehensive free forensic, medical & legal care.";
    } else {
        $responseMessage = ($lang === 'ha')
            ? "📍 Layin Taimako na Kasa: Kira 112 (Kyauta ne a dukkan layukan waya)."
            : "📍 National Crisis Response: Call 112 (Toll-free 24/7).";
    }
    $nextContext = ['step' => 'completed', 'lang' => $lang];

} elseif ($step === 'support_category') {
    if ($input === '0') {
        $nextContext['step'] = 'lang_select';
        $input = ($lang === 'ha') ? '2' : (($lang === 'hi') ? '3' : '1');
        $step = 'lang_select';
        goto finishResponse;
    }

    $catsEn = ['1' => 'Medical & PEP', '2' => 'Counseling', '3' => 'Emergency Kit', '4' => 'Legal Protection'];
    $catsHa = ['1' => 'Magunguna & PEP', '2' => 'Shawarwari', '3' => 'Kayan Agaji', '4' => 'Taimakon Shari\'a'];
    $catChosen = ($lang === 'ha') ? ($catsHa[$input] ?? 'Tallafi') : ($catsEn[$input] ?? 'Support');

    $responseType = 'InputView';
    $responseMessage = ($lang === 'ha')
        ? "Bukatarki: $catChosen.\nShigar da unguwarki ko garinki (misali Kano Municipal):"
        : "Requested: $catChosen.\nEnter your location (City / Area):";

    $nextContext = [
        'step' => 'support_loc',
        'cat' => $catChosen,
        'lang' => $lang,
        'phone' => $customerMsisdn
    ];

} elseif ($step === 'support_loc') {
    $cat = $context['cat'] ?? 'Support';
    $responseType = 'ShowView';
    $responseMessage = ($lang === 'ha')
        ? "✅ An karbi bukatarki ta $cat a $input.\nJami'inmu zai tuntube ki a $customerMsisdn cikin cikakken sirri.\nLayin Gaggawa: 112."
        : "✅ Request received for $cat in $input.\nA caseworker will call $customerMsisdn confidentially.\n24/7 Hotline: 112.";
    $nextContext = ['step' => 'completed', 'lang' => $lang];

} elseif ($step === 'report_desc') {
    $responseType = 'InputView';
    $responseMessage = ($lang === 'ha')
        ? "Shigar da sunanki (ko rubuta ANON domin boye suna):"
        : "Enter your name (or type ANON to remain anonymous):";

    $nextContext = [
        'step' => 'report_name',
        'desc' => $input,
        'lang' => $lang,
        'phone' => $customerMsisdn
    ];

} elseif ($step === 'report_name') {
    $ref = 'RB-' . rand(1000, 9999);
    $responseType = 'ShowView';
    $responseMessage = ($lang === 'ha')
        ? "🛡️ An karbi rahotonki cikin cikakken sirri.\nLambar Shaida: $ref.\nAna kiyaye sirrinki. Idan kina cikin hatsari, kira 112 nan take."
        : "🛡️ Incident report filed securely.\nRef Code: $ref.\nYour confidentiality is strictly protected. If in immediate danger, call 112.";
    $nextContext = ['step' => 'completed', 'lang' => $lang];

} else {
    // Completed or reset
    $responseType = 'ShowView';
    $responseMessage = ($lang === 'ha')
        ? "Mun gode da tuntubar Ribbons.\nLayin Taimako na Gaggawa: 112."
        : "Thank you for contacting Ribbons.\n24/7 Crisis Hotline: 112.";
    $nextContext = ['step' => 'completed', 'lang' => $lang];
}

finishResponse:
if ($isJson) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'type' => $responseType,
        'message' => $responseMessage,
        'contextData' => json_encode($nextContext)
    ]);
} else {
    header('Content-Type: text/plain; charset=UTF-8');
    $prefix = ($responseType === 'InputView') ? 'CON ' : 'END ';
    echo $prefix . $responseMessage;
}
?>
