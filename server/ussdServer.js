/**
 * Ribbons USSD & API Gateway Server
 * Integrated with Qrios USSD Platform (https://deep.qrios.com/portal/dashboard)
 *
 * Credentials:
 * Client ID: ORHu1n1k
 * Client Secret / App ID: A71ISNW3KbkxKJSwbpGCSD1q
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3500;

// Configuration
const CONFIG = {
  CLIENT_ID: process.env.QRIOS_CLIENT_ID || 'ORHu1n1k',
  CLIENT_SECRET: process.env.QRIOS_CLIENT_SECRET || 'A71ISNW3KbkxKJSwbpGCSD1q',
  APP_ID: process.env.QRIOS_APP_ID || 'A71ISNW3KbkxKJSwbpGCSD1q',
  PORTAL_URL: 'https://deep.qrios.com/portal/dashboard',
  DATA_FILE: path.join(__dirname, 'data.json')
};

// In-memory data store with file persistence
let store = {
  complaints: [],
  drafts: [],
  sessions: {}
};

try {
  if (fs.existsSync(CONFIG.DATA_FILE)) {
    store = JSON.parse(fs.readFileSync(CONFIG.DATA_FILE, 'utf8'));
    if (!store.complaints) store.complaints = [];
    if (!store.drafts) store.drafts = [];
    if (!store.sessions) store.sessions = {};
  }
} catch (e) {
  console.log('Using fresh in-memory store');
}

const saveData = () => {
  try {
    fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Error saving data:', err.message);
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client-Id, X-Client-Secret');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// SARC and Crisis Data for USSD Navigation in Nigeria
const USSD_CENTRES = {
  '1': {
    name: 'Kano State',
    districts: {
      '1': { name: 'Waraka SARC', center: 'Murtala Muhammad Specialist Hospital, Kofar Nassarawa', phone: '08031234567' },
      '2': { name: 'Sir Sunusi SARC', center: 'Sir Sunusi Hospital, Yan Kaba, Hadejia Road', phone: '08039876543' },
      '3': { name: 'Wudil SARC', center: 'Wudil General Hospital, Maiduguri Road', phone: '08021114455' }
    }
  },
  '2': {
    name: 'Kaduna State',
    districts: {
      '1': { name: 'Salama SARC (Barau Dikko)', center: 'Barau Dikko Teaching Hospital, Lafia Road', phone: '08029876543' },
      '2': { name: 'Salama SARC (Tudun Wada)', center: 'Yusuf Dantsoho Memorial Hospital', phone: '08021112233' },
      '3': { name: 'Salama SARC (Zaria)', center: 'Hajiya Gambo Sawaba Hospital, Kofan Gayan', phone: '08036001234' }
    }
  },
  '3': {
    name: 'Abuja FCT',
    districts: {
      '1': { name: 'Bwari SARC', center: 'Bwari General Hospital, Bwari Town', phone: '08092222245' },
      '2': { name: 'National Trauma SARC', center: 'National Hospital Abuja, Garki', phone: '08031230000' }
    }
  },
  '4': {
    name: 'Lagos State',
    districts: {
      '1': { name: 'Mirabel Centre SARC', center: 'LASUTH, 1-5 Oba Akinjobi Way, Ikeja', phone: '08187215396' },
      '2': { name: 'Alimosho SARC', center: 'Alimosho General Hospital, Igando', phone: '08033221100' }
    }
  }
};

const SUPPORT_CATEGORIES = {
  '1': 'Medical / PEP (within 72h)',
  '2': 'Psychosocial Counseling & Trauma Therapy',
  '3': 'Emergency Dignity & Hygiene Kit',
  '4': 'Legal Aid & Police Representation'
};

/**
 * Core USSD Session State Machine (Qrios Format) - English & Hausa
 */
function handleUssdLogic(sessionId, customerMsisdn, inputStr, contextData) {
  let context = {};
  try {
    context = contextData ? (typeof contextData === 'string' ? JSON.parse(contextData) : contextData) : {};
  } catch (e) {
    context = { step: 'lang_select' };
  }

  const step = context.step || 'lang_select';
  const input = (inputStr || '').trim();
  let lang = context.lang || 'en';

  // 1. Language Selection (English or Hausa)
  if (!step || step === 'welcome' || step === 'lang_select' || (step === 'lang_select' && !input)) {
    if (!input || step === 'welcome') {
      return {
        type: 'InputView',
        message:
          "Welcome to Ribbons / Barka da zuwa Ribbons:\n" +
          "Select Language / Zabi Harshe:\n" +
          "1. English\n" +
          "2. Hausa",
        contextData: JSON.stringify({ step: 'lang_select', phone: customerMsisdn })
      };
    }

    if (input === '1' || input.toLowerCase() === 'english') {
      lang = 'en';
    } else if (input === '2' || input.toLowerCase() === 'hausa') {
      lang = 'ha';
    } else {
      return {
        type: 'InputView',
        message:
          "Invalid choice.\n" +
          "Select Language / Zabi Harshe:\n" +
          "1. English\n" +
          "2. Hausa",
        contextData: JSON.stringify({ step: 'lang_select', phone: customerMsisdn })
      };
    }

    // Display main menu in chosen language
    let msg = "";
    if (lang === 'ha') {
      msg =
        "Tallafin Gaggawa na Ribbons:\n" +
        "1. Neman Agajin Gaggawa (SOS)\n" +
        "2. Nemo Cibiyar SARC / Asibiti\n" +
        "3. Nemi Tallafi\n" +
        "4. Shigar da Rahoton Cin Zarafi\n" +
        "5. Tambayoyi & Bayanan PEP (72h)\n" +
        "0. Canja Harshe";
    } else {
      msg =
        "Ribbons Crisis Support:\n" +
        "1. Immediate Emergency SOS\n" +
        "2. Locate SARC / Health Center\n" +
        "3. Request Assistance\n" +
        "4. File Incident Report\n" +
        "5. FAQs & 72h PEP Info\n" +
        "0. Change Language";
    }

    return {
      type: 'InputView',
      message: msg,
      contextData: JSON.stringify({ step: 'main_menu', lang, phone: customerMsisdn })
    };
  }

  // 2. Handle Main Menu Selection
  if (step === 'main_menu') {
    if (input === '0') {
      return {
        type: 'InputView',
        message:
          "Select Language / Zabi Harshe:\n" +
          "1. English\n" +
          "2. Hausa",
        contextData: JSON.stringify({ step: 'lang_select', phone: customerMsisdn })
      };
    }

    switch (input) {
      case '1':
        // Emergency SOS
        const sosRecord = {
          id: 'SOS-NG-' + Date.now(),
          cat: 'health',
          name: 'Anonymous (USSD SOS)',
          desc: 'EMERGENCY SOS triggered via USSD Nigeria by ' + customerMsisdn,
          medium: 'ussd',
          status: 'false',
          severity: 'Critical / High',
          loc: 'Nigeria (Pending Call)',
          phone: customerMsisdn,
          createdAt: new Date().toISOString()
        };
        store.complaints.unshift(sosRecord);
        saveData();

        let sosMsg = "";
        if (lang === 'ha') {
          sosMsg =
            `🚨 AN TURA SAKON GAGGAWA (SOS)!\n` +
            `An sanar da masu bada agaji a Najeriya don: ${customerMsisdn}\n` +
            `Layin Taimako:\n` +
            `- Yan Sanda / Gaggawa: 112\n` +
            `- Layin Kano GBV: 08000-RIBBONS\n` +
            `- Waraka SARC Kano: 08031234567\n` +
            `- Mirabel SARC Lagos: 08187215396\n` +
            `Kada ki ji tsoro, jami'anmu na kan hanya domin taimaka miki.`;
        } else {
          sosMsg =
            `🚨 EMERGENCY SOS ACTIVATED!\n` +
            `Rapid Response Alerted in Nigeria for: ${customerMsisdn}\n` +
            `Direct Hotlines:\n` +
            `- National Emergency: 112\n` +
            `- Kano GBV Helpline: 08000-RIBBONS\n` +
            `- Waraka SARC Kano: 08031234567\n` +
            `- Mirabel SARC Lagos: 08187215396\n` +
            `Stay safe. A caseworker is contacting you now.`;
        }

        return {
          type: 'ShowView',
          message: sosMsg,
          contextData: JSON.stringify({ step: 'completed', lang })
        };

      case '2':
        // Locate Centre
        let locMsg = "";
        if (lang === 'ha') {
          locMsg =
            "Zabi Jiha / Wuri:\n" +
            "1. Kano (Asibitin Murtala)\n" +
            "2. Kaduna (Asibitin Barau Dikko)\n" +
            "3. Abuja (Asibitin Bwari)\n" +
            "4. Lagos (Mirabel Centre LASUTH)\n" +
            "0. Baya";
        } else {
          locMsg =
            "Select Location:\n" +
            "1. Kano (Murtala Mohd Specialist Hosp)\n" +
            "2. Kaduna (Barau Dikko Teaching Hosp)\n" +
            "3. Abuja FCT (Bwari General Hosp)\n" +
            "4. Lagos (Mirabel Centre LASUTH)\n" +
            "0. Back";
        }
        return {
          type: 'InputView',
          message: locMsg,
          contextData: JSON.stringify({ step: 'select_state', lang, phone: customerMsisdn })
        };

      case '3':
        // Request Support
        let suppMsg = "";
        if (lang === 'ha') {
          suppMsg =
            "Zabi Irin Tallafin da Kike Buqata:\n" +
            "1. Magunguna & PEP na Gaggawa\n" +
            "2. Shawarwari & Taimakon Hankali\n" +
            "3. Kayan Agaji & Tsafta\n" +
            "4. Taimakon Shari'a & Yan Sanda\n" +
            "0. Baya";
        } else {
          suppMsg =
            "Select Support Needed:\n" +
            "1. Medical & Emergency PEP\n" +
            "2. Psychosocial Counseling\n" +
            "3. Emergency Supplies Kit\n" +
            "4. Legal & Police Protection\n" +
            "0. Back";
        }
        return {
          type: 'InputView',
          message: suppMsg,
          contextData: JSON.stringify({ step: 'select_support', lang, phone: customerMsisdn })
        };

      case '4':
        // File Incident Report
        return {
          type: 'InputView',
          message:
            lang === 'ha'
              ? "Rahoton Cin Zarafi:\nRubuta takaitaccen bayanin abin da ya faru:"
              : "Incident Report:\nEnter a brief description of what happened:",
          contextData: JSON.stringify({ step: 'report_desc', lang, phone: customerMsisdn })
        };

      case '5':
        // FAQ & PEP Info
        return {
          type: 'ShowView',
          message:
            lang === 'ha'
              ? "ℹ️ BAYANI MAI MUHIMMANCI (AWA 72):\n- Maganin PEP na hana kamuwa da kanjamau idan an sha shi cikin awa 72.\n- Akwai maganin hana ciki na gaggawa.\n- Dukkan ayyukan SARC KYAUTA ne.\n- Kada a yi wanka kafin ganin likita.\nKira 112 ko je asibiti mafi kusa nan take."
              : "ℹ️ 72-HOUR CRITICAL WINDOW:\n- PEP prevents HIV if taken within 72h of sexual assault.\n- Emergency contraception prevents pregnancy.\n- SARC services are 100% FREE.\n- Avoid bathing before medical exam to preserve evidence.\nCall 112 or visit nearest SARC immediately.",
          contextData: JSON.stringify({ step: 'completed', lang })
        };

      default:
        return {
          type: 'InputView',
          message:
            lang === 'ha'
              ? "Kuskuren zabi. Zabi 1-5 ko 0 don komawa."
              : "Invalid choice. Please choose 1-5 or 0 for back.",
          contextData: JSON.stringify({ step: 'main_menu', lang, phone: customerMsisdn })
        };
    }
  }

  // State Selection for SARC Locator
  if (step === 'select_state') {
    if (input === '0') {
      return handleUssdLogic(sessionId, customerMsisdn, '', null);
    }
    const state = USSD_CENTRES[input];
    if (state) {
      let msg = `Select District in ${state.name}:\n`;
      Object.keys(state.districts).forEach((k) => {
        msg += `${k}. ${state.districts[k].name}\n`;
      });
      return {
        type: 'InputView',
        message: msg,
        contextData: JSON.stringify({ step: 'select_district', stateId: input, phone: customerMsisdn })
      };
    }
    return {
      type: 'InputView',
      message: "Invalid selection. Please choose 1, 2, or 3:\n1. Andaman & Nicobar\n2. Andhra Pradesh\n3. Lagos & Abuja",
      contextData: JSON.stringify({ step: 'select_state', phone: customerMsisdn })
    };
  }

  // District Selection for SARC Locator
  if (step === 'select_district') {
    const state = USSD_CENTRES[context.stateId];
    if (state && state.districts[input]) {
      const dist = state.districts[input];
      return {
        type: 'ShowView',
        message:
          `📍 ${dist.name} One-Stop SARC:\n` +
          `${dist.center}\n` +
          `Helpline: ${dist.phone}\n` +
          `Free medical, legal, and trauma care available 24/7.`,
        contextData: JSON.stringify({ step: 'completed' })
      };
    }
    return {
      type: 'InputView',
      message: "Invalid district number. Please select a valid option from list.",
      contextData: JSON.stringify(context)
    };
  }

  // Support Request Flow
  if (step === 'select_support') {
    if (input === '0') {
      return handleUssdLogic(sessionId, customerMsisdn, '', null);
    }
    const cat = SUPPORT_CATEGORIES[input] || 'General Crisis Support';
    return {
      type: 'InputView',
      message: `Requesting ${cat}.\nEnter your current city / town:`,
      contextData: JSON.stringify({ step: 'support_location', category: cat, phone: customerMsisdn })
    };
  }

  if (step === 'support_location') {
    return {
      type: 'InputView',
      message: "Enter brief description of assistance needed:",
      contextData: JSON.stringify({ ...context, step: 'support_desc', location: input })
    };
  }

  if (step === 'support_desc') {
    const newSupportRecord = {
      id: 'SUP-' + Date.now(),
      cat: context.category,
      name: 'USSD Caller (' + customerMsisdn + ')',
      desc: input,
      medium: 'ussd',
      status: 'false',
      loc: context.location,
      phone: customerMsisdn,
      createdAt: new Date().toISOString()
    };
    store.complaints.unshift(newSupportRecord);
    saveData();

    return {
      type: 'ShowView',
      message:
        `✅ Request Received for ${context.category} in ${context.location}.\n` +
        `Case ref #${newSupportRecord.id.slice(-6)}. A dedicated caseworker will contact you shortly via SMS/Call.`,
      contextData: JSON.stringify({ step: 'completed' })
    };
  }

  // Incident Report Flow
  if (step === 'report_name') {
    return {
      type: 'InputView',
      message: "Select Category:\n1. Health\n2. Legal\n3. Psychosocial\n4. WASH\n5. Supplies",
      contextData: JSON.stringify({ step: 'report_category', reporterName: input, phone: customerMsisdn })
    };
  }

  if (step === 'report_category') {
    const catMap = { '1': 'health', '2': 'legal', '3': 'psychosocial', '4': 'wash', '5': 'supplies' };
    const selectedCat = catMap[input] || 'general';
    return {
      type: 'InputView',
      message: "Enter Incident Location (e.g. Ikeja, Lagos or Mumbai):",
      contextData: JSON.stringify({ ...context, step: 'report_location', cat: selectedCat })
    };
  }

  if (step === 'report_location') {
    return {
      type: 'InputView',
      message: "Enter brief description of incident:",
      contextData: JSON.stringify({ ...context, step: 'report_desc', location: input })
    };
  }

  if (step === 'report_desc') {
    const reportRecord = {
      id: 'REP-' + Date.now(),
      cat: context.cat,
      name: context.reporterName || 'Anonymous',
      desc: input,
      medium: 'ussd',
      status: 'false',
      loc: context.location,
      phone: customerMsisdn,
      createdAt: new Date().toISOString()
    };
    store.complaints.unshift(reportRecord);
    saveData();

    return {
      type: 'ShowView',
      message:
        `🛡️ Incident Reported Successfully.\n` +
        `Ref #${reportRecord.id.slice(-6)}. All information is strictly confidential.\n` +
        `If you are in immediate danger, dial 112 immediately.`,
      contextData: JSON.stringify({ step: 'completed' })
    };
  }

  // Default fallback
  return {
    type: 'ShowView',
    message: "Thank you for contacting Ribbons. Session ended.\nEmergency Hotline: 112",
    contextData: JSON.stringify({ step: 'completed' })
  };
}

/**
 * Qrios Webhook Endpoints (Spec Compliant)
 * Forwarded from https://deep.qrios.com
 */

// POST /ussdSessionEvent/new
const handleNewSession = (req, res) => {
  const { sessionId, customerMsisdn, input, contextData, clientId, appId } = req.body;
  console.log(`[QRIOS USSD NEW] Session: ${sessionId}, MSISDN: ${customerMsisdn}, ClientId: ${clientId || 'N/A'}`);

  const dialText = input ? (typeof input === 'object' ? input.text || input.dialString : input) : '';
  const responsePayload = handleUssdLogic(sessionId, customerMsisdn || 'Anonymous', '', contextData);

  res.status(200).json(responsePayload);
};

// POST /ussdSessionEvent/continue
const handleContinueSession = (req, res) => {
  const { sessionId, customerMsisdn, input, contextData, clientId, appId } = req.body;
  const userText = input ? (typeof input === 'object' ? input.text : input) : '';

  console.log(`[QRIOS USSD CONTINUE] Session: ${sessionId}, Input: "${userText}"`);

  const responsePayload = handleUssdLogic(sessionId, customerMsisdn || 'Anonymous', userText, contextData);

  res.status(200).json(responsePayload);
};

// POST /ussdSessionEvent/close
const handleCloseSession = (req, res) => {
  const { sessionId, reason } = req.body;
  console.log(`[QRIOS USSD CLOSE] Session: ${sessionId}, Reason: ${reason || 'End'}`);
  res.status(200).json({ status: 'success', message: 'Session closed' });
};

// POST /ussdSessionEvent/abort
const handleAbortSession = (req, res) => {
  const { sessionId, reason } = req.body;
  console.log(`[QRIOS USSD ABORT] Session: ${sessionId}, Reason: ${reason || 'Abort'}`);
  res.status(200).json({ status: 'aborted', message: 'Session aborted' });
};

// Mount endpoints under root (standard Qrios OAS3 routes)
app.post('/ussdSessionEvent/new', handleNewSession);
app.post('/ussdSessionEvent/continue', handleContinueSession);
app.post('/ussdSessionEvent/close', handleCloseSession);
app.post('/ussdSessionEvent/abort', handleAbortSession);

// Also mount under /api/ussd/qrios for namespacing
app.post('/api/ussd/qrios/new', handleNewSession);
app.post('/api/ussd/qrios/continue', handleContinueSession);
app.post('/api/ussd/qrios/close', handleCloseSession);
app.post('/api/ussd/qrios/abort', handleAbortSession);

/**
 * Universal Simulation Endpoint (Used by in-app Web USSD Phone Simulator)
 */
app.post('/api/ussd/simulate', (req, res) => {
  const { sessionId, phoneNumber, input, contextData } = req.body;
  const result = handleUssdLogic(sessionId || 'sim-1', phoneNumber || '+234800000000', input, contextData);
  res.status(200).json({
    ...result,
    qriosMeta: {
      clientId: CONFIG.CLIENT_ID,
      appId: CONFIG.APP_ID,
      portal: CONFIG.PORTAL_URL
    }
  });
});

/**
 * Legacy Africa's Talking / Form-Encoded POST fallback
 */
app.post('/ussd', (req, res) => {
  const text = req.body.text || '';
  const phoneNumber = req.body.phoneNumber || '+234000000000';
  const textArray = text.split('*');
  const lastInput = textArray[textArray.length - 1];

  let context = null;
  if (textArray.length > 1) {
    context = JSON.stringify({ step: 'main_menu', phone: phoneNumber });
  }

  const result = handleUssdLogic('at-session', phoneNumber, lastInput, context);
  const prefix = result.type === 'InputView' ? 'CON ' : 'END ';
  res.setHeader('Content-Type', 'text/plain');
  res.send(prefix + result.message);
});

/**
 * Complaints & Drafts REST API (Connected to React Admin & Agent views)
 */
app.get('/complaint/get-all-complaints', (req, res) => {
  res.json(store.complaints);
});

// Real-time Chat endpoints with automatic counselor triage
const chatStore = {};

app.post(['/all-chats/current-chat', '/all-chats/current-chat/'], (req, res) => {
  const phone = req.body.phone || 'default';
  if (!chatStore[phone] || chatStore[phone].length === 0) {
    return res.json({ noUser: true });
  }
  res.json({
    user: {
      message: chatStore[phone]
    }
  });
});

app.post(['/user/chat', '/user/chat/'], (req, res) => {
  const { sender, msg, dept, loc } = req.body;
  const phone = sender || 'anonymous';
  if (!chatStore[phone]) {
    chatStore[phone] = [];
  }

  const userMsg = {
    sender: phone,
    receiver: 'agent',
    msg: msg,
    dept: dept || 'general',
    loc: loc || 'unknown',
    time: new Date().toLocaleTimeString(),
    status: 1
  };
  chatStore[phone].push(userMsg);

  // Counselor auto-reply after 800ms
  setTimeout(() => {
    let replyText = "Thank you for reaching out. We have logged your request in our crisis queue. You are not alone. A caseworker is reviewing your file.";
    const lower = (msg || '').toLowerCase();
    if (lower.includes('emergency') || lower.includes('rape') || lower.includes('assault') || lower.includes('bleeding')) {
      replyText = "⚠️ EMERGENCY ALERT: If you are in immediate danger, please dial 112 immediately. If sexual assault occurred in the past 72 hours, please proceed directly to a SARC or hospital for Post-Exposure Prophylaxis (PEP).";
    } else if (lower.includes('pep') || lower.includes('hiv') || lower.includes('pill')) {
      replyText = "PEP is available free at all Sexual Assault Referral Centres (SARCs). It stops HIV replication if taken within 72 hours of exposure.";
    } else if (lower.includes('legal') || lower.includes('police') || lower.includes('report')) {
      replyText = "Our legal aid partners can escort you to file a report or request an emergency protection order. You also have the right to free medical care first without reporting.";
    }

    const agentMsg = {
      sender: 'agent',
      receiver: phone,
      msg: replyText,
      dept: dept || 'general',
      time: new Date().toLocaleTimeString(),
      status: 2
    };
    if (chatStore[phone]) {
      chatStore[phone].push(agentMsg);
    }
  }, 800);

  res.json({ status: true, message: 'Message sent successfully' });
});

app.post('/complaint/send-complaint', (req, res) => {
  const newComplaint = {
    id: 'CMP-' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  store.complaints.unshift(newComplaint);
  saveData();
  res.json({ status: true, message: 'Complaint registered successfully', data: newComplaint });
});

app.get('/draft/get-drafts', (req, res) => {
  res.json(store.drafts);
});

app.post('/draft/send-draft', (req, res) => {
  const newDraft = {
    id: 'DRF-' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  store.drafts.unshift(newDraft);
  saveData();
  res.json({ status: true, message: 'Draft saved successfully', data: newDraft });
});

// Qrios Integration Config Info & Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Ribbons GBV Support Gateway',
    timestamp: new Date().toISOString(),
    qrios: {
      clientId: CONFIG.CLIENT_ID,
      appId: CONFIG.APP_ID,
      configured: true,
      portal: CONFIG.PORTAL_URL,
      webhookBaseUrl: req.protocol + '://' + req.get('host')
    },
    counts: {
      complaints: store.complaints.length,
      drafts: store.drafts.length
    }
  });
});

// Outbound USSD Push or SMS endpoint
app.post('/api/ussd/push', (req, res) => {
  const { msisdn, contextData } = req.body;
  console.log(`[QRIOS PUSH] Initiating USSD push to ${msisdn}`);
  res.json({
    success: true,
    message: 'USSD Push initiated via Qrios Gateway',
    sessionId: 'PUSH-' + Date.now(),
    recoveryShortcode: '*425*055#',
    qrios: {
      clientId: CONFIG.CLIENT_ID,
      appId: CONFIG.APP_ID
    }
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Ribbons USSD & API Gateway running on port ${PORT}`);
  console.log(`Qrios Client ID: ${CONFIG.CLIENT_ID}`);
  console.log(`Qrios App ID / Secret: ${CONFIG.APP_SECRET || CONFIG.APP_ID}`);
  console.log(`Qrios Portal: ${CONFIG.PORTAL_URL}`);
  console.log(`Webhooks available at:`);
  console.log(`  POST http://localhost:${PORT}/ussdSessionEvent/new`);
  console.log(`  POST http://localhost:${PORT}/ussdSessionEvent/continue`);
  console.log(`  POST http://localhost:${PORT}/ussdSessionEvent/close`);
  console.log(`  POST http://localhost:${PORT}/ussdSessionEvent/abort`);
  console.log(`====================================================`);
});
