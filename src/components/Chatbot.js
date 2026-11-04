import React, { useEffect, useState, useRef } from 'react';

const Chatbot = ({ toggleShowChatbot }) => {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'agent',
      text: "Hello. You've reached Ribbons 24/7 Crisis Support. You are completely safe and everything here is confidential.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'init-2',
      sender: 'agent',
      text: "How can we help you right now? You can choose a quick topic or type your message below.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedDept, setSelectedDept] = useState('Crisis Triage');
  const [phone, setPhone] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ribbonsUser'));
      return u?.phone || '';
    } catch (e) {
      return '';
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickOptions = [
    { label: '🏥 Medical Care & PEP', query: 'I need urgent medical care and PEP (within 72 hours).' },
    { label: '🛡️ Safe Shelter & Police', query: 'I need safe emergency shelter and legal/police protection.' },
    { label: '🧠 Trauma Counseling', query: 'I want to speak with a trauma & mental health counselor.' },
    { label: '📱 How to use USSD (*425#)', query: 'How does the offline *425# USSD service work?' }
  ];

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Try posting to local server or render
    try {
      await fetch('http://localhost:3500/user/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: phone || '+234000000000',
          msg: text,
          dept: selectedDept,
          loc: 'Web Chat Session'
        })
      });
    } catch (e) {
      console.log('Using local client response');
    }

    // Empathic response logic
    setTimeout(() => {
      setIsTyping(false);
      let reply = "Your message has been received by our crisis team. You are not alone, and help is available. We are here with you.";
      const lower = text.toLowerCase();

      if (lower.includes('pep') || lower.includes('hiv') || lower.includes('72') || lower.includes('medical') || lower.includes('bleed') || lower.includes('hospital')) {
        reply = "⚠️ URGENT MEDICAL CARE: If an assault occurred within 72 hours, please proceed directly to a Sexual Assault Referral Centre (SARC) or emergency hospital. Post-Exposure Prophylaxis (PEP) can prevent HIV, and emergency contraception can prevent pregnancy. Both are free at SARCs.";
      } else if (lower.includes('shelter') || lower.includes('police') || lower.includes('danger') || lower.includes('hit') || lower.includes('kill')) {
        reply = "🚨 IMMEDIATE SAFETY: If you are in physical danger right now, please dial 112 immediately. Our legal advocates can assist with an emergency restraining order and emergency shelter dispatch.";
      } else if (lower.includes('ussd') || lower.includes('*425#') || lower.includes('offline') || lower.includes('phone')) {
        reply = "📱 OFFLINE ACCESS: You can access Ribbons on any mobile phone without an internet connection by dialing *425# (powered by Qrios Networks). It lets you locate centers, request supplies, or report abuse directly from feature phones.";
      } else if (lower.includes('counsel') || lower.includes('depress') || lower.includes('talk') || lower.includes('scared') || lower.includes('alone')) {
        reply = "💙 You are safe here. Trauma can cause intense shock, anxiety, and grief. What happened is not your fault. Our licensed counselors provide free, confidential therapy whenever you are ready.";
      }

      const botReply = {
        id: 'bot-' + Date.now(),
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    }, 900);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear this chat for your privacy and security?')) {
      setMessages([
        {
          id: 'fresh-1',
          sender: 'agent',
          text: "Chat cleared for your safety. How can we support you today?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg h-[85vh] sm:h-[620px] bg-white sm:rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-purple-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                <i className="fa-solid fa-headset text-lg"></i>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-purple-950"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                <span>Ribbons Crisis Helpline</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-normal">
                  Confidential
                </span>
              </h3>
              <p className="text-[11px] text-purple-200">
                Anonymous 24/7 Responder Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 text-purple-200 hover:text-white rounded-lg hover:bg-white/10 text-xs transition-colors"
              title="Clear chat for safety"
            >
              <i className="fa-solid fa-eraser"></i>
            </button>
            <button
              onClick={toggleShowChatbot}
              className="p-2 text-purple-200 hover:text-white rounded-lg hover:bg-white/10 text-sm transition-colors"
              title="Close chat"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Safety Warning Strip */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-900">
          <span className="flex items-center gap-1.5 font-medium">
            <i className="fa-solid fa-phone text-rose-600"></i>
            <span>In immediate danger? Call <a href="tel:112" className="underline font-bold text-rose-700">112</a></span>
          </span>
          <button
            onClick={() => window.location.replace('https://www.google.com')}
            className="text-[10px] bg-rose-600 text-white font-semibold px-2 py-0.5 rounded shadow-xs"
          >
            Quick Escape
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-purple-900 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-2xl px-3 py-2 text-xs text-gray-500 w-fit">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] ml-1">Counselor is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSend(opt.query)}
              className="shrink-0 text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-900 font-medium px-2.5 py-1 rounded-full border border-purple-200/70 transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message confidentially..."
            className="flex-1 bg-slate-100 border border-transparent rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-purple-900 hover:bg-purple-800 disabled:opacity-40 text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-sm"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>

      </div>
    </div>
  );
};

export default Chatbot;
