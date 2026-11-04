import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Chatbot from '../../components/Chatbot';
import SARCData from './data/sarcData';

const Dashboard = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedState, setSelectedState] = useState('Kano');
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleShowChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  const handleCopyUssd = () => {
    navigator.clipboard.writeText('*425*0167#');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Filtered SARCs for the homepage quick locator
  const quickSarcs = React.useMemo(() => {
    const found = SARCData.find(s => s.state.toLowerCase() === selectedState.toLowerCase());
    if (found && found.sarcCenters) {
      return found.sarcCenters.slice(0, 3);
    }
    return SARCData[0]?.sarcCenters?.slice(0, 3) || [];
  }, [selectedState]);

  const featuredStates = ['Kano', 'Kaduna', 'Abuja FCT', 'Lagos', 'Jigawa', 'Katsina', 'Adamawa'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between pb-24 md:pb-0">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-8 md:gap-12">

        {/* 1. Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 text-white shadow-xl border border-purple-800/40 p-6 sm:p-8 md:p-12">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Confidential • 100% Free • Available 24/7 in Nigeria</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                You are not alone. Safe, immediate support is here.
              </h1>

              {/* Trauma-Informed Subheading */}
              <p className="text-purple-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
                Ribbons connects survivors of sexual assault and gender-based violence with accredited One-Stop Crisis Centres (SARCs), emergency medical care (PEP within 72h), safe shelter, and forensic documentation.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={toggleShowChatbot}
                  className="bg-white hover:bg-purple-50 text-purple-950 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2.5 active:scale-95"
                >
                  <i className="fa-solid fa-comment-dots text-purple-700 text-base"></i>
                  <span>Chat Confidentially</span>
                </button>

                <a
                  href="tel:112"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2.5 active:scale-95"
                >
                  <i className="fa-solid fa-phone text-sm"></i>
                  <span>Emergency 112</span>
                </a>

                <a
                  href="tel:*425*0167%23"
                  className="bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95"
                  title="Dial *425*0167# on your phone"
                >
                  <i className="fa-solid fa-phone text-sm"></i>
                  <span>Dial USSD (*425*0167#)</span>
                </a>
              </div>

              {/* Micro-Trust Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-800/60 text-purple-200 text-[11px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-emerald-400 text-sm"></i>
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-hand-holding-medical text-amber-300 text-sm"></i>
                  <span>Zero Medical Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-signal text-teal-300 text-sm"></i>
                  <span>Works with No Data</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Crisis Hub Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-200">
                    <i className="fa-solid fa-shield-heart text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Instant Crisis Response</h3>
                    <p className="text-[11px] text-purple-300">Nigeria Hotlines & USSD Gateway</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Active 24/7
                </span>
              </div>

              {/* Direct Hotlines */}
              <div className="flex flex-col gap-2.5">
                <a
                  href="tel:112"
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-3 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <span className="text-[11px] text-purple-300 block">National Emergency Helpline</span>
                      <strong className="text-sm font-bold text-white tracking-wide">Dial 112 (Toll-Free)</strong>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-xs text-purple-300 group-hover:translate-x-1 transition-transform"></i>
                </a>

                <a
                  href="tel:08000RIBBONS"
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-3 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-headset"></i>
                    </div>
                    <div>
                      <span className="text-[11px] text-purple-300 block">Kano State Crisis Support</span>
                      <strong className="text-sm font-bold text-white tracking-wide">08000-RIBBONS</strong>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-xs text-purple-300 group-hover:translate-x-1 transition-transform"></i>
                </a>

                {/* USSD Shortcode Copy Box */}
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm">
                      <i className="fa-solid fa-mobile-screen"></i>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-300 block font-medium">Feature Phone Shortcode (Qrios)</span>
                      <strong className="text-sm font-mono font-bold text-emerald-200">*425*0167#</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyUssd}
                      className="bg-emerald-600/80 hover:bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                      title="Copy shortcode to clipboard"
                    >
                      {copiedCode ? 'Copied!' : 'Copy'}
                    </button>
                    <a
                      href="tel:*425*0167%23"
                      className="bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold p-1.5 rounded-lg transition-all"
                      title="Direct dial on mobile"
                    >
                      <i className="fa-solid fa-phone"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Reassurance text */}
              <p className="text-[11px] text-purple-200/90 italic leading-relaxed text-center pt-1">
                "What happened is not your fault. You are safe here, and support is completely free."
              </p>
            </div>

          </div>
        </section>

        {/* 2. Critical 72-Hour Medical Window Alert Banner */}
        <section className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-l-4 border-rose-500 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 text-xl shadow-xs">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Time Critical
                </span>
                <h3 className="font-extrabold text-rose-950 text-base sm:text-lg">
                  The Critical 72-Hour Medical Window
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-rose-900/80 mt-1 leading-relaxed max-w-2xl">
                If an assault occurred within 72 hours (3 days), urgent medical care provides 
                <strong> Post-Exposure Prophylaxis (PEP)</strong> to prevent HIV replication, emergency contraception, and wound care. All services at SARCs are 100% confidential and free.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
            <Link
              to="/locate-hospital"
              className="flex-1 sm:flex-initial bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <span>Locate Emergency Hospital</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </section>

        {/* 3. Essential Survivor Services Grid (6 Cards) */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Comprehensive Care</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Essential Survivor Services
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md">
              Choose the assistance you need right now. All services are confidential and zero-cost.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Card 1: One-Stop SARC Centres */}
            <Link
              to="/sarc"
              className="group bg-white hover:bg-purple-50/40 border border-gray-200/90 hover:border-purple-300 rounded-3xl p-6 shadow-xs hover:shadow-md card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <i className="fa-solid fa-shield-heart"></i>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-purple-950">
                    One-Stop SARC Centres
                  </h3>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                    Medical & Legal
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Locate verified Sexual Assault Referral Centres providing 24/7 free medical care, trauma counseling, safe shelter, and legal representation in one place.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>Browse SARCs Across Nigeria</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </Link>

            {/* Card 2: Emergency Hospital Locator */}
            <Link
              to="/locate-hospital"
              className="group bg-white hover:bg-emerald-50/40 border border-gray-200/90 hover:border-emerald-300 rounded-3xl p-6 shadow-xs hover:shadow-md card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <i className="fa-solid fa-hospital"></i>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-emerald-950">
                    Emergency Hospitals
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    PEP Medications
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Find nearest hospitals equipped for urgent clinical examination, STI prevention, PEP anti-HIV regimens, and emergency physical trauma treatment.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>View Hospital Directory</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </Link>

            {/* Card 3: Forensic Evidence Vault */}
            <Link
              to="/evidence"
              className="group bg-white hover:bg-blue-50/40 border border-gray-200/90 hover:border-blue-300 rounded-3xl p-6 shadow-xs hover:shadow-md card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <i className="fa-solid fa-camera-retro"></i>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-blue-950">
                    Forensic Evidence Vault
                  </h3>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                    Local Sandbox
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Securely photograph physical injuries, torn clothing, or scene proof with tamper-resistant local timestamps. Stored in your device sandbox for court admissibility.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>Open Secure Evidence Vault</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </Link>

            {/* Card 4: 24/7 Anonymous Crisis Chat */}
            <button
              onClick={toggleShowChatbot}
              className="text-left group bg-white hover:bg-indigo-50/40 border border-gray-200/90 hover:border-indigo-300 rounded-3xl p-6 shadow-xs hover:shadow-md card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <i className="fa-solid fa-user-secret"></i>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-indigo-950">
                    Confidential Crisis Chat
                  </h3>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                    Zero Registration
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Chat confidentially with trauma triage caseworkers without disclosing your real name. Receive safe shelter navigation, psychological support, and legal guidance.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                <span>Start Anonymous Chat Session</span>
                <i className="fa-solid fa-comments transition-transform group-hover:translate-x-1"></i>
              </div>
            </button>

            {/* Card 5: Offline USSD Feature Phone Access */}
            <a
              href="tel:*425*0167%23"
              className="text-left group bg-white hover:bg-teal-50/40 border border-gray-200/90 hover:border-teal-300 rounded-3xl p-6 shadow-xs hover:shadow-md card-hover transition-all flex flex-col justify-between"
              title="Open phone dialer to call *425*0167#"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-teal-950">
                    Offline USSD Service
                  </h3>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                    *425*0167#
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Works on basic button feature phones without data or smartphones. Tap here to open your phone dialer to <strong>*425*0167#</strong> to request emergency aid and locate SARCs offline.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>Open Phone Dialer (*425*0167#)</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </a>

            {/* Card 6: Rights, Laws & FAQs */}
            <Link
              to="/faqs"
              className="group bg-white hover:bg-amber-50/40 border border-gray-200/90 hover:border-amber-300 rounded-3xl p-6 shadow-xs hover:shadow-md card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <i className="fa-solid fa-scale-balanced"></i>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-amber-950">
                    Rights & Legal Guide
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                    VAPP Act Protection
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Understand your legal rights, restraining order procedures, medical autonomy, and forensic dos & don'ts under Nigerian law following an assault.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Read Rights & FAQs</span>
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </div>
            </Link>

          </div>
        </section>

        {/* 4. Interactive Quick SARC Finder Section (Instant Locator right on Homepage) */}
        <section className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Fast Geographic Access</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Find One-Stop SARC Centres Near You
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Select your state to view immediate 24/7 crisis hotlines and facility directions:
              </p>
            </div>

            <Link
              to="/sarc"
              className="text-xs font-bold text-purple-900 hover:text-purple-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>View All 38+ Centres</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>

          {/* State Switcher Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 mb-4">
            {featuredStates.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  selectedState.toLowerCase() === st.toLowerCase()
                    ? 'bg-purple-950 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-gray-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Quick Centers Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickSarcs.map((centre, i) => (
              <div
                key={i}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-300 rounded-2xl p-4 transition-all flex flex-col justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-purple-950 text-sm">
                      {centre.name}
                    </h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold shrink-0">
                      24/7 Free
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 flex items-start gap-1.5">
                    <i className="fa-solid fa-location-dot text-gray-400 mt-0.5 shrink-0"></i>
                    <span>{centre.address}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  {centre.phone && (
                    <a
                      href={`tel:${centre.phone.split(',')[0].trim()}`}
                      className="bg-purple-950 hover:bg-purple-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      <i className="fa-solid fa-phone text-[9px]"></i>
                      <span>Call {centre.phone.split(',')[0].trim()}</span>
                    </a>
                  )}

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      centre.name + ' ' + centre.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-700 hover:text-purple-900 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
                  >
                    <span>Directions</span>
                    <i className="fa-solid fa-diamond-turn-right text-[10px]"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Online Web + Offline USSD Dual Channel Explainer */}
        <section className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Universal Accessibility</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Bridging the Digital Divide in Nigeria
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-2">
              Sexual violence does not discriminate by internet access. Ribbons guarantees crisis triage everywhere in Nigeria through two synchronized pathways:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Online Portal Channel */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/30 text-purple-200 flex items-center justify-center text-lg">
                    <i className="fa-solid fa-globe"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Online Web Portal</h3>
                    <span className="text-xs text-purple-300">Smartphones, Tablets & Computers</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-purple-100 mt-4">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0"></i>
                    <span>Interactive GPS directory for 38+ SARCs and emergency hospitals.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0"></i>
                    <span>Private Forensic Evidence Vault with encrypted camera timestamping.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0"></i>
                    <span>Anonymous real-time crisis chat with trauma caseworkers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0"></i>
                    <span>One-tap "Quick Exit" to instantly safeguard browser privacy.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300">Available at ribbon.mataafasaha.com.ng</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full font-bold">HTTPS Encrypted</span>
              </div>
            </div>

            {/* Offline USSD Channel */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/30 text-teal-200 flex items-center justify-center text-lg">
                    <i className="fa-solid fa-mobile-screen-button"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Offline USSD Gateway</h3>
                    <span className="text-xs text-teal-300">Basic 2G/3G Button Feature Phones</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-purple-100 mt-4">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0"></i>
                    <span>Dial <strong>*425*0167#</strong> from any phone in Nigeria without mobile data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0"></i>
                    <span>Bilingual support in both <strong>English</strong> and <strong>Hausa</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0"></i>
                    <span>One-touch Emergency SOS alert broadcast to Nigerian caseworkers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0"></i>
                    <span>Powered by Qrios Networks across MTN, Airtel, Glo & 9mobile.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <a
                  href="tel:*425*0167%23"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow flex items-center gap-1.5"
                  title="Open phone dialer for *425*0167#"
                >
                  <i className="fa-solid fa-phone"></i>
                  <span>Dial *425*0167# on Phone</span>
                </a>
                <span className="text-[10px] bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded-full font-bold">Zero Internet Needed</span>
              </div>
            </div>

          </div>
        </section>

        {/* 6. Immediate Survivor Action Steps (Trauma-Informed 4-Step Timeline) */}
        <section className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Survivor Protocol</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Immediate Steps If an Assault Has Occurred
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Follow these essential steps to protect your physical health, emotional wellbeing, and legal rights:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex flex-col gap-2 relative">
              <span className="w-7 h-7 rounded-full bg-purple-950 text-white font-extrabold text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-sm text-gray-950">Reach a Safe Place</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Move away from danger. Contact someone you trust or call <strong>112</strong> immediately. You do not have to go through this alone.
              </p>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex flex-col gap-2 relative">
              <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-sm text-gray-950">Preserve Forensic Proof</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Before your medical exam: try not to shower, bathe, or wash clothes. Place worn articles of clothing in clean paper bags (not plastic).
              </p>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex flex-col gap-2 relative">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-sm text-gray-950">Urgent Care (72h)</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Visit a SARC or hospital immediately for confidential <strong>PEP medication</strong> (stops HIV transmission) and emergency contraception.
              </p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-2 relative">
              <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">4</span>
              <h4 className="font-bold text-sm text-gray-950">Ongoing Support</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Access free trauma therapy, emergency safe housing, police escort, and pro-bono legal protection through our partner caseworkers.
              </p>
            </div>

          </div>
        </section>

        {/* 7. Institutional Endorsements & Partners */}
        <section className="border-t border-gray-200/80 pt-8 pb-4 text-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-4">
            Partnered with Leading Survivor Support Institutions in Nigeria
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-building-ngo text-purple-700 text-base"></i>
              <span>Mata A Fasaha Foundation</span>
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-hospital-user text-purple-700 text-base"></i>
              <span>Waraka SARC (Kano)</span>
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-hospital-user text-purple-700 text-base"></i>
              <span>Salama SARC (Kaduna)</span>
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-hospital-user text-purple-700 text-base"></i>
              <span>Mirabel Centre (Lagos)</span>
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-scale-balanced text-purple-700 text-base"></i>
              <span>National Human Rights Commission</span>
            </span>
          </div>
        </section>

      </main>

      {/* Modern Redesigned Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-purple-950 text-base">Ribbons</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700 font-medium">Standing against Gender-Based Violence in Nigeria</span>
            </div>
            <p className="text-[11px] text-gray-400 text-center md:text-left">
              An initiative supported by Mata A Fasaha. Emergency services operate 24 hours a day, 7 days a week.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <Link to="/sarc" className="hover:text-purple-900 transition-colors">
              SARC Centres
            </Link>
            <span>•</span>
            <Link to="/locate-hospital" className="hover:text-purple-900 transition-colors">
              Hospitals
            </Link>
            <span>•</span>
            <Link to="/evidence" className="hover:text-purple-900 transition-colors">
              Evidence Vault
            </Link>
            <span>•</span>
            <Link to="/faqs" className="hover:text-purple-900 transition-colors">
              Rights & FAQs
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-purple-900 transition-colors">
              Admin Portal
            </Link>
            <span>•</span>
            <Link to="/agent" className="hover:text-purple-900 transition-colors">
              Caseworker Portal
            </Link>
            <span>•</span>
            <a href="tel:*425*0167%23" className="text-emerald-700 hover:text-emerald-800 font-bold" title="Open phone dialer">
              Dial *425*0167#
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Anonymous Chatbot Widget */}
      {showChatbot && <Chatbot toggleShowChatbot={toggleShowChatbot} />}
    </div>
  );
};

export default Dashboard;