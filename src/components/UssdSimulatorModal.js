import React, { useState } from 'react';

const UssdSimulatorModal = ({ isOpen, onClose }) => {
  const [dialCode, setDialCode] = useState('*425#');
  const [inSession, setInSession] = useState(false);
  const [screenText, setScreenText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [contextData, setContextData] = useState(null);
  const [isTerminal, setIsTerminal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDial = async () => {
    setIsLoading(true);
    try {
      // Send new session request to backend or fallback
      const response = await fetch('http://localhost:3500/ussdSessionEvent/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': 'ORHu1n1k',
          'X-Client-Secret': 'A71ISNW3KbkxKJSwbpGCSD1q'
        },
        body: JSON.stringify({
          sessionId: 'sim-' + Date.now(),
          customerMsisdn: '+2348012345678',
          input: { type: 'Dial', text: dialCode, dialString: dialCode },
          clientId: 'ORHu1n1k',
          appId: 'A71ISNW3KbkxKJSwbpGCSD1q'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setInSession(true);
        setScreenText(data.message);
        setContextData(data.contextData);
        setIsTerminal(data.type === 'ShowView');
      } else {
        throw new Error('Server returned ' + response.status);
      }
    } catch (err) {
      // Fallback local logic if server offline
      setInSession(true);
      const fallbackMsg =
        "Welcome to Ribbons GBV Crisis Support\n" +
        "1. Immediate Emergency SOS\n" +
        "2. Locate SARC / One-Stop Centre\n" +
        "3. Request Multi-Sectoral Aid\n" +
        "4. File Incident Report\n" +
        "5. FAQs & 72h PEP Info";
      setScreenText(fallbackMsg);
      setContextData(JSON.stringify({ step: 'main_menu', phone: '+2348012345678' }));
      setIsTerminal(false);
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
      const response = await fetch('http://localhost:3500/ussdSessionEvent/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': 'ORHu1n1k',
          'X-Client-Secret': 'A71ISNW3KbkxKJSwbpGCSD1q'
        },
        body: JSON.stringify({
          sessionId: 'sim-session',
          customerMsisdn: '+2348012345678',
          input: { type: 'Input', text: textToSend },
          contextData: contextData,
          clientId: 'ORHu1n1k',
          appId: 'A71ISNW3KbkxKJSwbpGCSD1q'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setScreenText(data.message);
        setContextData(data.contextData);
        setIsTerminal(data.type === 'ShowView');
      }
    } catch (err) {
      setScreenText("Operation completed.\nThank you for contacting Ribbons GBV helpline.");
      setIsTerminal(true);
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
          <span>Qrios Client ID: <strong className="text-amber-300 font-mono">ORHu1n1k</strong></span>
          <span>App ID: <strong className="text-teal-300 font-mono">A71ISNW...</strong></span>
        </div>

        {/* Feature Phone Body */}
        <div className="p-5 flex flex-col items-center">
          
          {/* LCD Screen */}
          <div className="w-full bg-[#1e293b] border-2 border-slate-600 rounded-xl p-3 shadow-inner flex flex-col min-h-[220px] max-h-[260px] overflow-hidden">
            {/* Screen Top Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-emerald-400 font-mono border-b border-slate-700 pb-1 mb-2">
              <span>📶 QRIOS NETWORK (2G/3G)</span>
              <span>🔋 98%</span>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto font-mono text-xs text-emerald-300 whitespace-pre-line leading-relaxed pr-1">
              {!inSession ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                  <i className="fa-solid fa-phone text-2xl mb-2 text-emerald-400/80"></i>
                  <p className="text-slate-300 font-medium">Ready to dial USSD</p>
                  <p className="text-[11px] text-slate-500 mt-1">Dial *425# to launch Ribbons offline service</p>
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
                  placeholder="Type option (1-5)..."
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
          <span>Target Code: <code className="text-emerald-400">*425#</code></span>
          <a
            href="https://deep.qrios.com/portal/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-purple-300 hover:text-purple-100 flex items-center gap-1 underline underline-offset-2"
          >
            <span>Qrios Portal</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>

      </div>
    </div>
  );
};

export default UssdSimulatorModal;
