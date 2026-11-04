# Ribbons — Gender-Based Violence (GBV) Crisis Support Platform

> **A dual-channel crisis intervention and Sexual Assault Referral Centre (SARC) platform tailored for Nigeria, connecting survivors to free medical, psychosocial, and legal protection — both online and completely offline.**

[![Production Live](https://img.shields.io/badge/Production-Live-success?style=flat-square)](https://ribbon.mataafasaha.com.ng)
[![USSD Code](https://img.shields.io/badge/USSD-Dial%20*425*0167%23-blue?style=flat-square)](https://ribbon.mataafasaha.com.ng)
[![Languages](https://img.shields.io/badge/Languages-English%20%7C%20Hausa-purple?style=flat-square)](https://ribbon.mataafasaha.com.ng)
[![Repository](https://img.shields.io/badge/GitHub-capitanaserdel%2Fribbon-black?style=flat-square)](https://github.com/capitanaserdel/ribbon)

---

## 📌 Project Overview

Gender-Based Violence (GBV) and sexual assault require immediate, time-sensitive clinical and legal response — most critically within the **72-hour window** for Post-Exposure Prophylaxis (PEP) to prevent HIV transmission and emergency contraception. 

However, many survivors and vulnerable women across Northern Nigeria and remote communities lack smartphones, mobile data, or reliable internet access. 

**Ribbons** bridges this critical gap through a **hybrid dual-channel infrastructure**:
1. **Offline Channel (USSD)**: Zero-data, zero-internet telco protocol accessible on any basic 2G feature phone ("palasa" / button phone) via shortcode **`*425*0167#`**.
2. **Online Channel (Web Portal)**: A responsive crisis portal, case directory, administrator triage dashboard, and digital USSD phone simulator hosted at **[ribbon.mataafasaha.com.ng](https://ribbon.mataafasaha.com.ng)**.

Both channels operate with native bilingual support in **English** and **Hausa** (*"Mata a Fasaha"* context).

---

## 📶 Offline Channel: USSD Service (`*425*0167#`)

The offline channel leverages the cellular GSM network's **Unstructured Supplementary Service Data (USSD)** protocol via **Qrios Networks** and Nigerian telecom aggregators (MTN, Airtel, Glo, 9mobile). 

### How It Works:
- **Zero Internet Required**: Works with no mobile data, no airtime balance (toll-free where supported), and requires no app downloads.
- **Works on Any Phone**: Compatible with all basic GSM feature phones as well as smartphones.
- **Confidential & Discreet**: Leaves no browsing history or cached files on the phone.

### Shortcode:
```text
*425*0167#
```

### Menu Flow & Capabilities:

#### 1. Language Selection (First Screen)
```text
Welcome to Ribbons / Barka da zuwa Ribbons:
Select Language / Zabi Harshe:
1. English
2. Hausa
```

#### 2. Main Menu Options:
| Option | English | Hausa | Description |
| :---: | :--- | :--- | :--- |
| **`1`** | **Immediate Emergency SOS** | **Neman Agajin Gaggawa (SOS)** | Instantly alerts crisis caseworkers with caller's phone number and returns emergency dispatch hotlines (National `112`, Kano Helpline `08000-RIBBONS`). |
| **`2`** | **Locate SARC / Health Center** | **Nemo Cibiyar SARC / Asibiti** | Provides instant addresses and 24/7 hotline numbers for verified Nigerian SARCs (Kano, Kaduna, Abuja, Lagos, and national states). |
| **`3`** | **Request Assistance** | **Nemi Tallafi** | Multi-sectoral aid requests: Medical & PEP (within 72h), Psychosocial Counseling, Dignity & Hygiene Kits, or Legal & Police Protection. Captures city/LGA. |
| **`4`** | **File Incident Report** | **Shigar da Rahoton Cin Zarafi** | Secure, confidential reporting with option to remain anonymous. Automatically issues a tracking reference code (`RB-NG-XXXX`). |
| **`5`** | **FAQs & 72h PEP Info** | **Tambayoyi & Bayanan PEP (72h)** | Vital medical guidance explaining the 72-hour window for PEP and emergency contraception, highlighting that all SARC services in Nigeria are 100% free. |
| **`0`** | **Change Language** | **Canja Harshe** | Returns to the language selection menu at any point. |

---

## 🌐 Online Channel: Web Portal & Simulator

The online channel serves as the comprehensive web experience for survivors with smartphones, caseworkers, partner NGOs, and healthcare administrators.

**Live URL**: [https://ribbon.mataafasaha.com.ng](https://ribbon.mataafasaha.com.ng)

### Core Features:
- **Interactive SARC Directory**: Search and filter verified One-Stop Crisis Centres across Nigerian states (Kano, Kaduna, Abuja FCT, Lagos, Jigawa, Katsina, Borno, Adamawa, etc.).
- **Hospital Emergency Locator**: Search nearby healthcare facilities equipped for crisis clinical examination and PEP administration.
- **In-Browser Feature Phone Simulator**:
  - Embedded 2G/3G feature phone LCD interface allowing users and testers to dial `*425*0167#` directly from any web browser without a physical SIM card.
  - Features real-time state machine execution in both English and Hausa.
- **Quick-Exit Safety Shield**: A persistent emergency escape trigger that instantly redirects the browser to Google to protect user privacy from abusers.
- **Admin & Caseworker Portal**:
  - Administrative management of crisis logs, case statuses, and multi-agency referrals.
  - Role-based login and incident ticket routing.

---

## 🏛️ Nigerian SARC Referral Centers Supported

Ribbons connects directly to recognized **Sexual Assault Referral Centres (SARCs)** established by state governments, NAPTIP, RoLAC, and healthcare partners:

| State | Primary SARC Center | Location | 24/7 Hotline |
| :--- | :--- | :--- | :--- |
| **Kano** | **Waraka SARC** | Murtala Muhammad Specialist Hospital, Kofar Nassarawa | `08031234567` / `08000-RIBBONS` |
| **Kano** | **Sir Sunusi SARC** | Sir Muhammadu Sunusi Specialist Hospital, Yan Kaba | `08039876543` |
| **Kaduna** | **Salama SARC** | Barau Dikko Teaching Hospital, Lafia Road | `08029876543` |
| **Kaduna** | **Salama SARC** | Yusuf Dantsoho Memorial Hospital, Tudun Wada | `08021112233` |
| **FCT Abuja** | **Bwari SARC** | Bwari General Hospital, Bwari Town | `08092222245` |
| **FCT Abuja** | **National Trauma SARC** | National Hospital Abuja, Central District | `08031230000` / `112` |
| **Lagos** | **Mirabel Centre SARC** | LASUTH, 1-5 Oba Akinjobi Way, Ikeja | `08187215396` |
| **Jigawa** | **Dutse SARC** | Dutse General Hospital, Kiyawa Road | `08065554433` |
| **Katsina** | **Katsina SARC** | Katsina General Hospital, IBB Way | `08034445566` |
| **Adamawa** | **Hope Center SARC** | Specialist Hospital Yola, Jimeta | `08137926904` |
| **Borno** | **Ummu Kulthum SARC** | State Specialist Hospital, Maiduguri | `08023334455` |
| **National** | **Emergency Dispatch** | Federal Ministry of Women Affairs / Police | **`112`** |

---

## 🛠️ Technical Stack & Architecture

```
                      +-----------------------------------+
                      |      Survivor / User Channel      |
                      +-----------------+-----------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
        [ Offline (2G/3G) ]                           [ Online (Web/App) ]
      Basic Feature Phone                            Smartphone / Browser
        Dial: *425*0167#                         https://ribbon.mataafasaha.com.ng
                 |                                             |
        (GSM Mast / SS7)                               (HTTPS / React SPA)
                 |                                             |
      [ Telecom Aggregator ]                                   |
      Qrios Networks / MNOs                                    |
                 |                                             |
         (JSON / Form POST)                                    |
                 +----------------------+----------------------+
                                        |
                                        v
                 +---------------------------------------------+
                 |       Production Truehost Web Server        |
                 |   Subdomain: ribbon.mataafasaha.com.ng      |
                 +----------------------+----------------------+
                                        |
                     +------------------+------------------+
                     |                                     |
             [ PHP 8.3 Gateway ]                  [ React 18 SPA Engine ]
            ussd/qrios.php & index.php            Production optimized build
          Bilingual State Machine Engine          SPA routing via .htaccess
```

- **Frontend**: React 18, React Router v6, Tailwind CSS, Material UI, AOS, FontAwesome.
- **USSD Backend Gateway**: PHP 8.3 (`ussd/qrios.php`), Node.js Express fallback (`server/ussdServer.js`).
- **Web Server Configuration**: Apache on cPanel, Single-Page Application (SPA) rewrite rules in `.htaccess`.
- **Integrations**: Qrios Networks Developer API, Africa's Talking / Telco MNO Webhooks.

---

## 🚀 Local Development

### 1. Prerequisites
- Node.js (v18+) & npm
- PHP 8.1+ (for local USSD webhook simulation)

### 2. Installation
```bash
git clone https://github.com/capitanaserdel/ribbon.git
cd ribbon
npm install
```

### 3. Run Development Web Server
```bash
npm start
```
The React application will launch at `http://localhost:3000`.

### 4. Run USSD Node Gateway (Optional)
```bash
npm run server
```
Runs the USSD backend gateway locally on port `3500`.

---

## 📦 Production Deployment

The project includes automated deployment scripts located in the root repository `deploy/`:

```bash
# Deploy Ribbons directly to Truehost cPanel
./deploy/deploy_ribbon.sh

# Run multi-service health check
./deploy/check_status.sh
```

---

## 📄 License & Attribution

Initiated under **Mata A Fasaha** to support women, adolescent girls, and vulnerable communities across Nigeria through accessible digital and telecommunications technology.
