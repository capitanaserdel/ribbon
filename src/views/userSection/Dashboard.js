import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Chatbot from '../../components/Chatbot';
import UssdSimulatorModal from '../../components/UssdSimulatorModal';

const Dashboard = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showUssdModal, setShowUssdModal] = useState(false);

  const toggleShowChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navbar with safe exit & hotlines */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">

        {/* 72-Hour Medical Emergency Alert */}
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 border-l-4 border-rose-500 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600 mt-0.5">
              <i className="fa-solid fa-clock text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-rose-950 text-sm md:text-base">
                Critical 72-Hour Medical Window
              </h4>
              <p className="text-xs md:text-sm text-rose-900/80 leading-relaxed">
                If an assault occurred within 72 hours, immediate medical attention can provide 
                <strong> PEP (Post-Exposure Prophylaxis)</strong> to prevent HIV, emergency contraception, and wound care.
              </p>
            </div>
          </div>
          <Link
            to="/locate-hospital"
            className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow transition-all flex items-center gap-1.5"
          >
            <span>Find Emergency Hospital</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 md:p-10 shadow-xl">
          <div className="relative z-10 max-w-2xl flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 px-3 py-1 rounded-full text-xs font-semibold w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Confidential • Free • 24/7 Available</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              You are not alone. Safe, immediate support is here.
            </h1>

            <p className="text-purple-100 text-sm md:text-base leading-relaxed">
              Ribbons bridges survivors of sexual assault and gender-based violence with One-Stop Crisis Centres (SARCs), emergency medical care, forensic evidence documentation, and psychosocial guidance.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={toggleShowChatbot}
                className="bg-white hover:bg-purple-50 text-purple-950 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <i className="fa-solid fa-comment-dots text-purple-700"></i>
                <span>Chat Confidentially</span>
              </button>

              <a
                href="tel:112"
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <i className="fa-solid fa-phone"></i>
                <span>Emergency Call 112</span>
              </a>

              <button
                onClick={() => setShowUssdModal(true)}
                className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-mobile-screen-button"></i>
                <span>Offline USSD (*425#)</span>
              </button>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-10 top-10 text-white/5 text-9xl font-bold select-none pointer-events-none hidden md:block">
            <i className="fa-solid fa-ribbon"></i>
          </div>
        </div>

        {/* Core Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Essential Survivor Services
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                Choose the assistance you need right now
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Card 1: One-Stop SARC Centres */}
            <Link
              to="/sarc"
              className="group bg-white hover:bg-purple-50/50 border border-gray-200 hover:border-purple-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-shield-heart"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-purple-950 flex items-center gap-2">
                  <span>One-Stop Crisis Centres (SARC)</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Locate verified Sexual Assault Referral Centres offering comprehensive medical, counseling, and legal aid in one safe location.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-purple-700">
                <span>Find SARC by State</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </Link>

            {/* Card 2: Emergency Hospital Locator */}
            <Link
              to="/locate-hospital"
              className="group bg-white hover:bg-emerald-50/50 border border-gray-200 hover:border-emerald-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-hospital"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-950 flex items-center gap-2">
                  <span>Emergency Hospital Locator</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Locate the nearest emergency room for urgent clinical assessment, injury treatment, STI prevention, and PEP medications.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>View Hospital Directory</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </Link>

            {/* Card 3: Forensic Evidence Vault */}
            <Link
              to="/evidence"
              className="group bg-white hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-camera-retro"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-950 flex items-center gap-2">
                  <span>Document Forensic Evidence</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Securely take photos of physical injuries, torn clothing, or scene proof with tamper-resistant local timestamps for medical and legal proceedings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                <span>Open Secure Evidence Vault</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </Link>

            {/* Card 4: 24/7 Anonymous Crisis Chat */}
            <button
              onClick={toggleShowChatbot}
              className="text-left group bg-white hover:bg-indigo-50/50 border border-gray-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-user-secret"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-950 flex items-center gap-2">
                  <span>Confidential Crisis Chat</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Chat in complete confidence without revealing your name. Access trauma triage, legal options, and emergency referrals in a safe space.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-indigo-700">
                <span>Start Anonymous Chat</span>
                <i className="fa-solid fa-comments transition-transform group-hover:translate-x-1"></i>
              </div>
            </button>

            {/* Card 5: Offline USSD Feature Phone Access */}
            <button
              onClick={() => setShowUssdModal(true)}
              className="text-left group bg-white hover:bg-teal-50/50 border border-gray-200 hover:border-teal-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-signal"></i>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-teal-950">
                    Offline USSD Service (*425#)
                  </h3>
                  <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold">
                    Qrios Powered
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Works on basic feature phones without an internet or smartphone connection. Dial *425# to report incidents and request aid offline.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                <span>Test Interactive USSD Simulator</span>
                <i className="fa-solid fa-mobile-screen transition-transform group-hover:translate-x-1"></i>
              </div>
            </button>

            {/* Card 6: Rights, Laws & FAQs */}
            <Link
              to="/faqs"
              className="group bg-white hover:bg-amber-50/50 border border-gray-200 hover:border-amber-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-scale-balanced"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-amber-950 flex items-center gap-2">
                  <span>Rights & Safety Guide</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Learn about legal protections, restraining orders, medical rights, and forensic evidence dos & don'ts following an assault.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                <span>Browse FAQs & Rights</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </Link>

          </div>
        </div>

        {/* Immediate Survivor Action Steps (Trauma-Informed Guidance) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-purple-700"></i>
            <span>Immediate Steps If Assault Has Occurred</span>
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Follow these essential steps to protect your physical safety and legal options:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span className="w-6 h-6 rounded-full bg-purple-900 text-white font-bold text-xs flex items-center justify-center">1</span>
              <h4 className="font-semibold text-xs text-gray-900">Reach a Safe Place</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                Move away from danger. Contact a trusted friend, family member, or call 112 emergency services immediately.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span className="w-6 h-6 rounded-full bg-purple-900 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h4 className="font-semibold text-xs text-gray-900">Preserve Forensic Proof</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                Before medical examination: try not to shower, bathe, comb hair, or change clothes. Place worn clothing in clean paper bags.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span className="w-6 h-6 rounded-full bg-purple-900 text-white font-bold text-xs flex items-center justify-center">3</span>
              <h4 className="font-semibold text-xs text-gray-900">Get Medical Care (72h)</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                Visit a SARC or hospital immediately for confidential PEP medication (anti-HIV), STI tests, and physical treatment.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-1.5">
              <span className="w-6 h-6 rounded-full bg-purple-900 text-white font-bold text-xs flex items-center justify-center">4</span>
              <h4 className="font-semibold text-xs text-gray-900">Access Free Support</h4>
              <p className="text-[11px] text-gray-600 leading-snug">
                Connect with our caseworkers for trauma therapy, legal representation, police escort, and safe emergency shelter.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-200 mt-10 py-6 text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-950 text-sm">Ribbons</span>
            <span>— Standing against Gender-Based Violence</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-purple-900 transition-colors">
              Admin Portal
            </Link>
            <span>•</span>
            <Link to="/agent" className="hover:text-purple-900 transition-colors">
              Agent Portal
            </Link>
            <span>•</span>
            <button onClick={() => setShowUssdModal(true)} className="hover:text-emerald-700 font-medium">
              USSD (*425#)
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Anonymous Chatbot Widget */}
      {showChatbot && <Chatbot toggleShowChatbot={toggleShowChatbot} />}

      {/* USSD Modal */}
      <UssdSimulatorModal isOpen={showUssdModal} onClose={() => setShowUssdModal(false)} />
    </div>
  );
};

export default Dashboard;
