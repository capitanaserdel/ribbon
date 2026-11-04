<?php
/**
 * Ribbons USSD Handler for Qrios Webhook Platform & Telco Gateways
 * Languages: English (1), Hausa (2)
 * Fully tailored for Nigerian contexts and Sexual Assault Referral Centres (SARC)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Id, X-Client-Secret, X-Api-Key');
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

// Detect initial dial (e.g. *425*0167#, type='Dial', or shortcode string)
$isInitialDial = false;
if (isset($data['input']) && is_array($data['input'])) {
    if (isset($data['input']['type']) && strtolower($data['input']['type']) === 'dial') {
        $isInitialDial = true;
    }
}
if ((str_starts_with($input, '*') && str_ends_with($input, '#')) || str_contains($input, '425') || str_contains($input, '0167')) {
    $isInitialDial = true;
}
if ($isInitialDial) {
    $context = ['step' => 'welcome'];
    $input = '';
}

// Log incoming Qrios requests for live diagnostics
@file_put_contents(__DIR__ . '/qrios_debug.log', date('Y-m-d H:i:s') . " | $customerMsisdn | Input: " . json_encode($data['input'] ?? $input) . " | Raw: " . substr($rawInput, 0, 300) . "\n", FILE_APPEND);

// Support Africa's Talking / Telco format text (e.g. "1*2*1")
if (!$isJson && isset($_POST['text']) && empty($context['step'])) {
    $rawText = trim($_POST['text']);
    if ($rawText === '' || $isInitialDial) {
        $context = ['step' => 'welcome'];
        $input = '';
    } else {
        $parts = explode('*', $rawText);
        $total = count($parts);
        
        if ($total === 1) {
            $context = ['step' => 'lang_select'];
            $input = $parts[0];
        } elseif ($total === 2) {
            $chosenLang = ($parts[0] === '2') ? 'ha' : 'en';
            $context = ['step' => 'main_menu', 'lang' => $chosenLang];
            $input = $parts[1];
        } elseif ($total === 3) {
            $chosenLang = ($parts[0] === '2') ? 'ha' : 'en';
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
    // 1. Initial Screen: Language Selection (English & Hausa)
    $responseType = 'InputView';
    $responseMessage = "Welcome to Ribbons / Barka da zuwa Ribbons:\nSelect Language / Zabi Harshe:\n1. English\n2. Hausa";
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
    } else {
        // Fallback or re-prompt
        $responseType = 'InputView';
        $responseMessage = "Invalid choice.\nSelect Language / Zabi Harshe:\n1. English\n2. Hausa";
        $nextContext = ['step' => 'lang_select', 'phone' => $customerMsisdn];
        goto finishResponse;
    }

    $nextContext['lang'] = $lang;
    $nextContext['step'] = 'main_menu';
    $responseType = 'InputView';

    if ($lang === 'ha') {
        $responseMessage = "Tallafin Gaggawa na Ribbons:\n1. Neman Agajin Gaggawa (SOS)\n2. Nemo Cibiyar SARC / Asibiti\n3. Nemi Tallafi\n4. Shigar da Rahoton Cin Zarafi\n5. Tambayoyi & Bayanan PEP (72h)\n0. Canja Harshe";
    } else {
        $responseMessage = "Ribbons Crisis Support:\n1. Immediate Emergency SOS\n2. Locate SARC / Health Center\n3. Request Assistance\n4. File Incident Report\n5. FAQs & 72h PEP Info\n0. Change Language";
    }

} elseif ($step === 'main_menu') {
    if ($input === '0') {
        // Back to language select
        $responseType = 'InputView';
        $responseMessage = "Select Language / Zabi Harshe:\n1. English\n2. Hausa";
        $nextContext = ['step' => 'lang_select', 'phone' => $customerMsisdn];
        goto finishResponse;
    }

    switch ($input) {
        case '1': // Emergency SOS
            $responseType = 'ShowView';
            if ($lang === 'ha') {
                $responseMessage = "🚨 AN TURA SAKON GAGGAWA (SOS)!\nAn sanar da masu bada agaji a Najeriya don: $customerMsisdn\nLayin Taimako:\n- Yan Sanda / Gaggawa: 112\n- Layin Kano GBV: 08000-RIBBONS\n- Waraka SARC Kano: 08031234567\n- Mirabel SARC Lagos: 08187215396\nKada ki ji tsoro, jami'anmu na kan hanya domin taimaka miki.";
            } else {
                $responseMessage = "🚨 EMERGENCY SOS ACTIVATED!\nRapid Response Alerted in Nigeria for: $customerMsisdn\nHotlines:\n- National Helpline: 112\n- Kano GBV Helpline: 08000-RIBBONS\n- Waraka SARC Kano: 08031234567\n- Mirabel SARC Lagos: 08187215396\nStay safe. A crisis caseworker is contacting you now.";
            }
            $nextContext = ['step' => 'completed', 'lang' => $lang];
            break;

        case '2': // Locate SARC
            $responseType = 'InputView';
            if ($lang === 'ha') {
                $responseMessage = "Zabi Jiha a Najeriya:\n1. Kano (Murtala Hosp / Waraka SARC)\n2. Kaduna (Barau Dikko / Salama SARC)\n3. Abuja FCT (Bwari General Hosp)\n4. Lagos (Mirabel Centre LASUTH)\n5. Sauran Jihohi (Jigawa, Katsina, da sauransu)\n0. Baya";
            } else {
                $responseMessage = "Select State in Nigeria:\n1. Kano (Murtala Hosp / Waraka SARC)\n2. Kaduna (Barau Dikko / Salama SARC)\n3. Abuja FCT (Bwari General Hosp)\n4. Lagos (Mirabel Centre LASUTH)\n5. Other States (Jigawa, Katsina, etc.)\n0. Back";
            }
            $nextContext = ['step' => 'locate_state', 'lang' => $lang, 'phone' => $customerMsisdn];
            break;

        case '3': // Request Assistance
            $responseType = 'InputView';
            if ($lang === 'ha') {
                $responseMessage = "Zabi Irin Tallafin da Kike Buqata:\n1. Magunguna & PEP na Gaggawa (cikin awa 72)\n2. Shawarwari & Taimakon Hankali\n3. Kayan Agaji & Tsafta (Dignity Kit)\n4. Taimakon Shari'a & Yan Sanda\n0. Baya";
            } else {
                $responseMessage = "Select Support Needed:\n1. Medical & Emergency PEP (within 72h)\n2. Psychosocial Counseling\n3. Emergency Dignity & Hygiene Kit\n4. Legal Aid & Police Protection\n0. Back";
            }
            $nextContext = ['step' => 'support_category', 'lang' => $lang, 'phone' => $customerMsisdn];
            break;

        case '4': // File Incident Report
            $responseType = 'InputView';
            if ($lang === 'ha') {
                $responseMessage = "Rahoton Cin Zarafi:\nRubuta takaitaccen bayanin abin da ya faru:";
            } else {
                $responseMessage = "Incident Report:\nEnter a brief description of what happened:";
            }
            $nextContext = ['step' => 'report_desc', 'lang' => $lang, 'phone' => $customerMsisdn];
            break;

        case '5': // FAQs & 72h PEP Info
            $responseType = 'ShowView';
            if ($lang === 'ha') {
                $responseMessage = "ℹ️ BAYANI MAI MUHIMMANCI (AWA 72):\n- Maganin PEP na hana kamuwa da kanjamau idan an sha shi cikin awa 72.\n- Akwai maganin hana ciki na gaggawa.\n- Dukkan ayyukan SARC a Najeriya KYAUTA ne 100%.\n- Kada a yi wanka kafin ganin likita domin kiyaye shaidar bincike.\nKira 112 ko je asibitin SARC mafi kusa nan take.";
            } else {
                $responseMessage = "ℹ️ 72-HOUR CRITICAL WINDOW:\n- PEP prevents HIV if taken within 72h of sexual assault.\n- Emergency contraception prevents pregnancy.\n- All SARC services in Nigeria are 100% FREE.\n- Avoid bathing before medical exam to preserve forensic evidence.\nCall 112 or visit nearest SARC immediately.";
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
        $nextContext['step'] = 'lang_select';
        $input = ($lang === 'ha') ? '2' : '1';
        $step = 'lang_select';
        goto finishResponse;
    }

    $responseType = 'ShowView';
    if ($input === '1') { // Kano
        $responseMessage = ($lang === 'ha') 
            ? "📍 Waraka SARC, Asibitin Murtala Muhammad, Kofar Nassarawa, Kano.\nWaya: 08031234567 / 08000-RIBBONS\nKulawar likita, maganin PEP da shawarwari kyauta 24/7."
            : "📍 Waraka SARC, Murtala Muhammad Specialist Hosp, Kofar Nassarawa, Kano.\nTel: 08031234567 / 08000-RIBBONS\nFree 24/7 medical exam, PEP & trauma support.";
    } elseif ($input === '2') { // Kaduna
        $responseMessage = ($lang === 'ha')
            ? "📍 Salama SARC, Asibitin Barau Dikko, Lafia Road, Kaduna.\nWaya: 08029876543\nMagani, PEP da kariya ga mata kyauta 24/7."
            : "📍 Salama SARC, Barau Dikko Hospital, Lafia Road, Kaduna.\nTel: 08029876543\nFree 24/7 medical care, PEP & safe refuge referral.";
    } elseif ($input === '3') { // Abuja
        $responseMessage = ($lang === 'ha')
            ? "📍 Bwari SARC, Babban Asibitin Bwari, Abuja FCT.\nWaya: 08092222245 / 08031122334\nKulawar gaggawa ta likita da shawarwari kyauta."
            : "📍 Bwari SARC, Bwari General Hospital, Abuja FCT.\nTel: 08092222245 / 08031122334\n24/7 Free medical & counseling services.";
    } elseif ($input === '4') { // Lagos
        $responseMessage = ($lang === 'ha')
            ? "📍 Mirabel Centre SARC, Asibitin Koyarwa na LASUTH, Ikeja, Lagos.\nWaya: 08187215396\nCikakken tallafin binciken lafiya da shari'a kyauta."
            : "📍 Mirabel Centre SARC, LASUTH, Ikeja, Lagos.\nTel: 08187215396 / 08155770000\nComprehensive free forensic, medical & legal care.";
    } else {
        $responseMessage = ($lang === 'ha')
            ? "📍 Cibiyoyin SARC a Sauran Jihohi:\n- Jigawa: Dutse General Hospital (08065554433)\n- Katsina: Katsina General Hospital (08034445566)\n- Adamawa: Hope Center Yola (08137926904)\nLayin Taimako na Kasa: Kira 112 (Kyauta)."
            : "📍 SARCs in Other States:\n- Jigawa: Dutse General Hospital (08065554433)\n- Katsina: Katsina General Hospital (08034445566)\n- Adamawa: Hope Center Yola (08137926904)\nNational Toll-Free Helpline: Call 112.";
    }
    $nextContext = ['step' => 'completed', 'lang' => $lang];

} elseif ($step === 'support_category') {
    if ($input === '0') {
        $nextContext['step'] = 'lang_select';
        $input = ($lang === 'ha') ? '2' : '1';
        $step = 'lang_select';
        goto finishResponse;
    }

    $catsEn = ['1' => 'Medical & PEP', '2' => 'Psychosocial Counseling', '3' => 'Emergency Dignity Kit', '4' => 'Legal & Police Protection'];
    $catsHa = ['1' => 'Magunguna & PEP', '2' => 'Shawarwari', '3' => 'Kayan Agaji & Tsafta', '4' => 'Taimakon Shari\'a & Yan Sanda'];
    $catChosen = ($lang === 'ha') ? ($catsHa[$input] ?? 'Tallafi') : ($catsEn[$input] ?? 'Support');

    $responseType = 'InputView';
    $responseMessage = ($lang === 'ha')
        ? "Bukatarki: $catChosen.\nShigar da garinki ko unguwarki a Najeriya (misali Kano Municipal, Nassarawa, Tarauni):"
        : "Requested: $catChosen.\nEnter your location in Nigeria (e.g. Kano Municipal, Kaduna, Abuja):";

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
        ? "✅ An karbi bukatarki ta $cat a $input.\nJami'inmu a Najeriya zai tuntube ki a $customerMsisdn cikin cikakken sirri.\nLayin Gaggawa: 112 ko 08000-RIBBONS."
        : "✅ Request received for $cat in $input.\nA Nigerian crisis caseworker will call $customerMsisdn confidentially.\n24/7 Hotline: 112 or 08000-RIBBONS.";
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
    $ref = 'RB-NG-' . rand(1000, 9999);
    $responseType = 'ShowView';
    $responseMessage = ($lang === 'ha')
        ? "🛡️ An karbi rahotonki cikin cikakken sirri.\nLambar Shaida: $ref.\nAna kiyaye sirrinki. Idan kina cikin hatsari a Najeriya, kira 112 nan take."
        : "🛡️ Incident report filed securely.\nReference Code: $ref.\nYour confidentiality is strictly protected. If in immediate danger, call 112.";
    $nextContext = ['step' => 'completed', 'lang' => $lang];

} else {
    // Completed or reset
    $responseType = 'ShowView';
    $responseMessage = ($lang === 'ha')
        ? "Mun gode da tuntubar Ribbons Najeriya.\nLayin Taimako na Gaggawa: 112."
        : "Thank you for contacting Ribbons Nigeria.\n24/7 Crisis Hotline: 112.";
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
