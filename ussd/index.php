<?php 
/**
 * Ribbons USSD Gateway Entrypoint
 * Handles both Qrios Webhooks (JSON) and Africa's Talking / Form-Data
 */

$raw = file_get_contents('php://input');
$json = json_decode($raw, true);

if ($json !== null || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false)) {
    // Forward directly to Qrios handler
    include_once 'qrios.php';
    exit();
}

// Legacy form-data / Africa's Talking handler
include_once 'menu.php';

$sessionId   = $_POST["sessionId"] ?? '';
$serviceCode = $_POST["serviceCode"] ?? '';
$phoneNumber = $_POST["phoneNumber"] ?? '';
$text        = $_POST["text"] ?? '';

$menu = new Menu();
if ($text == "") {
    $textArray = explode("*", $text);
    echo "CON " . $menu->mainMenuRegistered($phoneNumber);
} else {
    $textArray = explode("*", $text);
    switch ($textArray[0]) {
        case 1: 
            $menu->Hindi($textArray, $phoneNumber);
            break;
        case 2: 
            $menu->English($textArray, $phoneNumber);
            break;
        default:
            $menu->English($textArray, $phoneNumber);
            break;
    }
}
?>
