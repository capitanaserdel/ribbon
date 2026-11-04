# Ribbons USSD Integration with Qrios

This directory and the Node.js server (`server/ussdServer.js`) provide the full USSD integration for Ribbons using **Qrios Networks** (`https://deep.qrios.com/portal/dashboard`).

## Credentials Configured
* **Client ID:** `ORHu1n1k`
* **Client Secret / App ID:** `A71ISNW3KbkxKJSwbpGCSD1q`
* **Portal URL:** `https://deep.qrios.com/portal/dashboard`

## Webhook Endpoints
When configuring your USSD Application on the Qrios Developer Portal, set your application callback URL to point to these endpoints (e.g. using your deployed domain or ngrok tunnel for local testing):

* **New Session:** `POST /ussdSessionEvent/new`
* **Continue Session:** `POST /ussdSessionEvent/continue`
* **Close Session:** `POST /ussdSessionEvent/close`
* **Abort Session:** `POST /ussdSessionEvent/abort`

## Running the USSD Server (Node.js)
```bash
node server/ussdServer.js
```
The server runs on port `3500`. It provides:
1. Native Qrios USSD webhook endpoints
2. Automatic crisis incident and SOS logging
3. In-app USSD simulator endpoint at `/api/ussd/simulate`
4. Outbound USSD Push at `/api/ussd/push`

## Running the USSD Server (PHP)
If using a PHP web server (Apache, Nginx, or PHP CLI):
```bash
php -S localhost:8080 -t ussd/
```
Endpoints:
* `POST /qrios.php`
* `POST /index.php`

