import React, { useState } from 'react';

// Comprehensive USSD State Engine (Strictly English & Hausa with Nigerian Context)
const processUssdState = (step, inputRaw, context = {}) => {
  const input = (inputRaw || '').trim();
  const phone = context.phone || '+2348012345678';
  let lang = context.lang || 'en';

  // 1. Initial State: Language Selection (English or Hausa)
  if (!step || step === 'welcome' || step === 'lang_select') {
    if (!input || step === 'welcome') {
      return {
        type: 'InputView',
        message:
          "Welcome to Ribbons / Barka da zuwa Ribbons:\n" +
          "Select Language / Zabi Harshe:\n" +
          "1. English\n" +
          "2. Hausa",
        context: { step: 'lang_select', phone }
      };
    }

    // Process language selection
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
        context: { step: 'lang_select', phone }
      };
    }

    // Show Main Menu in selected language
    if (lang === 'ha') {
      return {
        type: 'InputView',
        message:
          "Tallafin Gaggawa na Ribbons:\n" +
          "1. Neman Agajin Gaggawa (SOS)\n" +
          "2. Nemo Cibiyar SARC / Asibiti\n" +
          "3. Nemi Tallafi\n" +
          "4. Shigar da Rahoton Cin Zarafi\n" +
          "5. Tambayoyi & Bayanan PEP (72h)\n" +
          "0. Canja Harshe",
        context: { step: 'main_menu', lang, phone }
      };
    } else {
      return {
        type: 'InputView',
        message:
          "Ribbons Crisis Support:\n" +
          "1. Immediate Emergency SOS\n" +
          "2. Locate SARC / Health Center\n" +
          "3. Request Assistance\n" +
          "4. File Incident Report\n" +
          "5. FAQs & 72h PEP Info\n" +
          "0. Change Language",
        context: { step: 'main_menu', lang, phone }
      };
    }
  }

  // 2. Main Menu Actions
  if (step === 'main_menu') {
    if (input === '0') {
      // Go back to language selection
      return {
        type: 'InputView',
        message:
          "Select Language / Zabi Harshe:\n" +
          "1. English\n" +
          "2. Hausa",
        context: { step: 'lang_select', phone }
      };
    }

    if (input === '1') {
      // Immediate SOS
      let msg = "";
      if (lang === 'ha') {
        msg =
          `🚨 AN TURA SAKON GAGGAWA (SOS)!\n` +
          `An sanar da masu bada agaji a Najeriya don: ${phone}\n` +
          `Layin Taimako:\n` +
          `- Yan Sanda / Gaggawa: 112\n` +
          `- Layin Kano GBV: 08000-RIBBONS\n` +
          `- Waraka SARC Kano: 08031234567\n` +
          `- Mirabel SARC Lagos: 08187215396\n` +
          `Kada ki ji tsoro, jami'anmu na kan hanya domin taimaka miki.`;
      } else {
        msg =
          `🚨 EMERGENCY SOS ACTIVATED!\n` +
          `Rapid Response Alerted in Nigeria for: ${phone}\n` +
          `Hotlines:\n` +
          `- National Helpline: 112\n` +
          `- Kano GBV Helpline: 08000-RIBBONS\n` +
          `- Waraka SARC Kano: 08031234567\n` +
          `- Mirabel SARC Lagos: 08187215396\n` +
          `Stay safe. A caseworker is reaching out to you immediately.`;
      }
      return { type: 'ShowView', message: msg, context: { step: 'completed', lang } };
    }

    if (input === '2') {
      // Locate Center across Nigeria
      let msg = "";
      if (lang === 'ha') {
        msg =
          "Zabi Jiha / Wuri a Najeriya:\n" +
          "1. Kano (Asibitin Murtala / Waraka SARC)\n" +
          "2. Kaduna (Barau Dikko / Salama SARC)\n" +
          "3. Abuja FCT (Bwari Hospital SARC)\n" +
          "4. Lagos (Mirabel Centre LASUTH)\n" +
          "5. Sauran Jihohi (Jigawa, Katsina, da sauransu)\n" +
          "0. Baya";
      } else {
        msg =
          "Select State in Nigeria:\n" +
          "1. Kano (Murtala Hosp / Waraka SARC)\n" +
          "2. Kaduna (Barau Dikko / Salama SARC)\n" +
          "3. Abuja FCT (Bwari General Hosp)\n" +
          "4. Lagos (Mirabel Centre LASUTH)\n" +
          "5. Other States (Jigawa, Katsina, etc.)\n" +
          "0. Back";
      }
      return { type: 'InputView', message: msg, context: { step: 'locate_state', lang, phone } };
    }

    if (input === '3') {
      // Request Assistance
      let msg = "";
      if (lang === 'ha') {
        msg =
          "Zabi Irin Tallafin da Kike Buqata:\n" +
          "1. Magunguna & PEP na Gaggawa (cikin awa 72)\n" +
          "2. Shawarwari & Taimakon Hankali\n" +
          "3. Kayan Agaji & Tsafta (Dignity Kit)\n" +
          "4. Taimakon Shari'a & Kariya ta Yan Sanda\n" +
          "0. Baya";
      } else {
        msg =
          "Select Support Needed:\n" +
          "1. Medical & Emergency PEP (within 72h)\n" +
          "2. Psychosocial Counseling\n" +
          "3. Emergency Dignity & Hygiene Kit\n" +
          "4. Legal Aid & Police Protection\n" +
          "0. Back";
      }
      return { type: 'InputView', message: msg, context: { step: 'support_category', lang, phone } };
    }

    if (input === '4') {
      // Incident Report
      const msg =
        lang === 'ha'
          ? "Rahoton Cin Zarafi:\nRubuta takaitaccen bayanin abin da ya faru:"
          : "Incident Report:\nEnter a brief description of what happened:";
      return { type: 'InputView', message: msg, context: { step: 'report_desc', lang, phone } };
    }

    if (input === '5') {
      // FAQs & 72h PEP info
      let msg = "";
      if (lang === 'ha') {
        msg =
          "ℹ️ BAYANI MAI MUHIMMANCI (AWA 72):\n" +
          "- Maganin PEP na hana kamuwa da kanjamau idan an sha shi cikin awa 72.\n" +
          "- Akwai maganin hana ciki na gaggawa.\n" +
          "- Dukkan ayyukan SARC a Najeriya KYAUTA ne 100%.\n" +
          "- Kada a yi wanka kafin ganin likita domin kiyaye shaidar bincike.\n" +
          "Kira 112 ko je asibitin SARC mafi kusa nan take.";
      } else {
        msg =
          "ℹ️ 72-HOUR CRITICAL WINDOW:\n" +
          "- PEP prevents HIV if taken within 72h of sexual assault.\n" +
          "- Emergency contraception prevents pregnancy.\n" +
          "- All SARC services across Nigeria are 100% FREE.\n" +
          "- Avoid bathing before medical exam to preserve forensic evidence.\n" +
          "Call 112 or visit nearest SARC immediately.";
      }
      return { type: 'ShowView', message: msg, context: { step: 'completed', lang } };
    }

    // Invalid selection
    return {
      type: 'InputView',
      message:
        (lang === 'ha' ? "Kuskuren zabi. Zabi 1-5 ko 0:" : "Invalid option. Please choose 1-5 or 0:") +
        (lang === 'ha'
          ? "\n1. SOS\n2. Nemo SARC\n3. Nemi Tallafi\n4. Rahoto\n5. FAQs\n0. Canja Harshe"
          : "\n1. SOS\n2. Locate SARC\n3. Request Aid\n4. Report\n5. FAQs\n0. Change Language"),
      context: { step: 'main_menu', lang, phone }
    };
  }

  // 3. Locate State Center in Nigeria
  if (step === 'locate_state') {
    if (input === '0') {
      return processUssdState('lang_select', lang === 'ha' ? '2' : '1', { phone });
    }
    let msg = "";
    if (input === '1') {
      msg =
        lang === 'ha'
          ? "📍 Waraka SARC, Asibitin Murtala Muhammad, Kofar Nassarawa, Kano.\nWaya: 08031234567 / 08000-RIBBONS\nKulawar likita, maganin PEP da shawarwari kyauta 24/7."
          : "📍 Waraka SARC, Murtala Muhammad Specialist Hosp, Kofar Nassarawa, Kano.\nTel: 08031234567 / 08000-RIBBONS\nFree 24/7 medical exam, PEP & trauma support.";
    } else if (input === '2') {
      msg =
        lang === 'ha'
          ? "📍 Salama SARC, Asibitin Barau Dikko, Lafia Road, Kaduna.\nWaya: 08029876543\nMagani, PEP da kariya ga mata kyauta 24/7."
          : "📍 Salama SARC, Barau Dikko Hospital, Lafia Road, Kaduna.\nTel: 08029876543\nFree 24/7 medical care, PEP & safe refuge referral.";
    } else if (input === '3') {
      msg =
        lang === 'ha'
          ? "📍 Bwari SARC, Babban Asibitin Bwari, Abuja FCT.\nWaya: 08092222245 / 08031122334\nKulawar gaggawa ta likita da shawarwari kyauta."
          : "📍 Bwari SARC, Bwari General Hospital, Abuja FCT.\nTel: 08092222245 / 08031122334\n24/7 Free medical & counseling services.";
    } else if (input === '4') {
      msg =
        lang === 'ha'
          ? "📍 Mirabel Centre SARC, Asibitin Koyarwa na LASUTH, Ikeja, Lagos.\nWaya: 08187215396\nCikakken tallafin binciken lafiya da shari'a kyauta."
          : "📍 Mirabel Centre SARC, LASUTH, Ikeja, Lagos.\nTel: 08187215396 / 08155770000\nComprehensive free forensic, medical & legal care.";
    } else {
      msg =
        lang === 'ha'
          ? "📍 Cibiyoyin SARC a Sauran Jihohi:\n- Jigawa: Dutse General Hospital (08065554433)\n- Katsina: Katsina General Hospital (08034445566)\n- Adamawa: Hope Center Yola (08137926904)\nLayin Taimako na Kasa: Kira 112 (Kyauta)."
          : "📍 SARCs in Other States:\n- Jigawa: Dutse General Hospital (08065554433)\n- Katsina: Katsina General Hospital (08034445566)\n- Adamawa: Hope Center Yola (08137926904)\nNational Toll-Free Helpline: Call 112.";
    }
    return { type: 'ShowView', message: msg, context: { step: 'completed', lang } };
  }

  // 4. Request Support Category
  if (step === 'support_category') {
    if (input === '0') {
      return processUssdState('lang_select', lang === 'ha' ? '2' : '1', { phone });
    }
    const catMapEn = { '1': 'Medical & PEP', '2': 'Psychosocial Counseling', '3': 'Emergency Dignity Kit', '4': 'Legal & Police Protection' };
    const catMapHa = { '1': 'Magunguna & PEP', '2': 'Shawarwari', '3': 'Kayan Agaji & Tsafta', '4': 'Taimakon Shari\'a & Yan Sanda' };
    const chosenCat = lang === 'ha' ? (catMapHa[input] || 'Tallafi') : (catMapEn[input] || 'Support');

    const msg =
      lang === 'ha'
        ? `Bukatarki: ${chosenCat}.\nShigar da garinki ko unguwarki (misali Kano Municipal, Nassarawa, Tarauni):`
        : `Requested: ${chosenCat}.\nEnter your location in Nigeria (e.g. Kano Municipal, Kaduna, Abuja):`;

    return {
      type: 'InputView',
      message: msg,
      context: { step: 'support_loc', cat: chosenCat, lang, phone }
    };
  }

  // 5. Support Location
  if (step === 'support_loc') {
    const cat = context.cat || 'Support';
    const msg =
      lang === 'ha'
        ? `✅ An karbi bukatarki ta ${cat} a ${input}.\nJami'inmu a Najeriya zai tuntube ki a ${phone} cikin cikakken sirri.\nLayin Gaggawa: 112 ko 08000-RIBBONS.`
        : `✅ Request received for ${cat} in ${input}.\nA Nigerian crisis caseworker will call ${phone} confidentially.\n24/7 Hotline: 112 or 08000-RIBBONS.`;
    return { type: 'ShowView', message: msg, context: { step: 'completed', lang } };
  }

  // 6. Incident Report Description
  if (step === 'report_desc') {
    const msg =
      lang === 'ha'
        ? "Shigar da sunanki (ko rubuta ANON domin boye suna):"
        : "Enter your name (or type ANON to remain anonymous):";
    return {
      type: 'InputView',
      message: msg,
      context: { step: 'report_name', desc: input, lang, phone }
    };
  }

  // 7. Incident Report Name
  if (step === 'report_name') {
    const ref = 'RB-NG-' + Math.floor(1000 + Math.random() * 9000);
    const msg =
      lang === 'ha'
        ? `🛡️ An karbi rahotonki cikin cikakken sirri.\nLambar Shaida: ${ref}.\nAna kiyaye sirrinki. Idan kina cikin hatsari a Najeriya, kira 112 nan take.`
        : `🛡️ Incident report filed securely.\nReference Code: ${ref}.\nYour confidentiality is strictly protected. If in immediate danger, call 112.`;
    return { type: 'ShowView', message: msg, context: { step: 'completed', lang } };
  }

  // Default Fallback
  return {
    type: 'ShowView',
    message:
      lang === 'ha'
        ? "Mun gode da tuntubar Ribbons Najeriya.\nLayin Gaggawa: 112."
        : "Thank you for contacting Ribbons Nigeria.\n24/7 Helpline: 112.",
    context: { step: 'completed', lang }
  };
};

const UssdSimulatorModal = ({ isOpen, onClose }) => {
  const [dialCode, setDialCode] = useState('*425*0167#');
  const [inSession, setInSession] = useState(false);
  const [screenText, setScreenText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [contextData, setContextData] = useState(null);
  const [isTerminal, setIsTerminal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Execute Network or Local Step
  const runStep = async (step, input, currentContext) => {
    // Attempt real backend call to deployed ussd endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('/ussd/qrios.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': 'ORHu1n1k',
          'X-Client-Secret': 'A71ISNW3KbkxKJSwbpGCSD1q'
        },
        body: JSON.stringify({
          sessionId: 'sim-' + Date.now(),
          customerMsisdn: '+2348012345678',
          input: { type: 'Input', text: input, dialString: dialCode },
          contextData: currentContext,
          clientId: 'ORHu1n1k',
          appId: 'A71ISNW3KbkxKJSwbpGCSD1q'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.message) {
          setInSession(true);
          setScreenText(data.message);
          setContextData(data.contextData);
          setIsTerminal(data.type === 'ShowView');
          return;
        }
      }
    } catch (e) {
      // Handled via local fallback engine below
    }

    // Local deterministic fallback
    let parsedCtx = {};
    if (typeof currentContext === 'string') {
      try { parsedCtx = JSON.parse(currentContext); } catch (err) {}
    } else if (currentContext) {
      parsedCtx = currentContext;
    }

    const currentStep = step || parsedCtx.step || 'welcome';
    const result = processUssdState(currentStep, input, parsedCtx);

    setInSession(true);
    setScreenText(result.message);
    setContextData(JSON.stringify(result.context));
    setIsTerminal(result.type === 'ShowView');
  };

  const handleDial = async () => {
    setIsLoading(true);
    try {
      await runStep('welcome', '', { step: 'welcome', phone: '+2348012345678' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInput = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isTerminal || isLoading) return;

    setIsLoading(true);
    const textToSend = userInput.trim();
    setUserInput('');

    try {
      let parsedCtx = {};
      if (typeof contextData === 'string') {
        try { parsedCtx = JSON.parse(contextData); } catch (err) {}
      } else if (contextData) {
        parsedCtx = contextData;
      }
      const currentStep = parsedCtx.step || 'lang_select';
      await runStep(currentStep, textToSend, contextData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInSession(false);
    setScreenText('');
    setUserInput('');
    setContextData(null);
    setIsTerminal(false);
  };

  const addKey = (char) => {
    if (!inSession) {
      setDialCode(prev => prev + char);
    } else if (!isTerminal) {
      setUserInput(prev => prev + char);
    }
  };

  const backspace = () => {
    if (!inSession) {
      setDialCode(prev => prev.slice(0, -1));
    } else if (!isTerminal) {
      setUserInput(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col text-white">
        
        {/* Header bar */}
        <div className="bg-gray-800 px-5 py-3 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wide text-gray-200">
              Qrios USSD Feature Phone Simulator
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Integration Credentials Info */}
        <div className="bg-purple-950/70 border-b border-purple-800/40 px-4 py-2 text-xs flex justify-between items-center text-purple-200">
          <span>Shortcode: <strong className="text-emerald-400 font-mono">*425*0167#</strong></span>
          <span>Languages: <strong className="text-teal-300 font-mono">English / Hausa</strong></span>
        </div>

        {/* Feature Phone Body */}
        <div className="p-5 flex flex-col items-center">
          
          {/* LCD Screen */}
          <div className="w-full bg-[#1e293b] border-2 border-slate-600 rounded-xl p-3 shadow-inner flex flex-col min-h-[220px] max-h-[260px] overflow-hidden">
            {/* Screen Top Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-emerald-400 font-mono border-b border-slate-700 pb-1 mb-2">
              <span>📶 MTN/AIRTEL/GLO NIGERIA</span>
              <span>🔋 98%</span>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto font-mono text-xs text-emerald-300 whitespace-pre-line leading-relaxed pr-1">
              {!inSession ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                  <i className="fa-solid fa-phone text-2xl mb-2 text-emerald-400/80"></i>
                  <p className="text-slate-300 font-medium">Ready to dial USSD</p>
                  <p className="text-[11px] text-slate-500 mt-1">Dial *425*0167# to launch Ribbons crisis helpline</p>
                </div>
              ) : (
                <div>{screenText}</div>
              )}
            </div>

            {/* Input Line inside Screen when In Session */}
            {inSession && !isTerminal && (
              <form onSubmit={handleSendInput} className="mt-2 pt-2 border-t border-slate-700 flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type option (1 or 2) & press Send..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-1 rounded text-xs font-semibold"
                >
                  {isLoading ? '...' : 'Send'}
                </button>
              </form>
            )}

            {/* Terminal Session Footer */}
            {inSession && isTerminal && (
              <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                <span className="text-[11px] text-amber-400">Session Ended</span>
                <button
                  onClick={handleReset}
                  className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-2.5 py-1 rounded"
                >
                  Dial Again
                </button>
              </div>
            )}
          </div>

          {/* Dial String Display (Before session starts) */}
          {!inSession && (
            <div className="w-full flex items-center gap-2 mt-3 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
              <span className="text-emerald-400 font-mono font-bold text-sm">USSD:</span>
              <input
                type="text"
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                className="flex-1 bg-transparent text-white font-mono text-base font-semibold focus:outline-none"
              />
              <button
                onClick={backspace}
                className="text-gray-400 hover:text-red-400 px-2"
                title="Backspace"
              >
                <i className="fa-solid fa-delete-left"></i>
              </button>
            </div>
          )}

          {/* Phone Keypad */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px] mt-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
              <button
                key={k}
                onClick={() => addKey(k)}
                className="h-11 rounded-xl bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 text-base font-semibold font-mono shadow transition-all active:scale-95 flex items-center justify-center text-gray-200"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex gap-3 w-full max-w-[280px] mt-4">
            {!inSession ? (
              <button
                onClick={handleDial}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-phone"></i>
                <span>{isLoading ? 'Dialing...' : 'Dial USSD'}</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-semibold text-sm shadow flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-phone-slash"></i>
                <span>End Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info & Qrios portal link */}
        <div className="bg-gray-800/90 px-5 py-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
          <span>Shortcode: <code className="text-emerald-400">*425*0167#</code></span>
          <span className="text-slate-400">Nigeria Toll-Free: <strong className="text-amber-300">112</strong></span>
        </div>

      </div>
    </div>
  );
};

export default UssdSimulatorModal;
