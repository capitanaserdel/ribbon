import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';
import UssdSimulatorModal from './UssdSimulatorModal';

const Navbar = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showUssdModal, setShowUssdModal] = useState(false);
  const location = useLocation();

  const toggleShowOptions = () => {
    setShowOptions(prev => !prev);
  };

  // Safe Exit feature (Crucial for survivors of violence)
  const handleQuickEscape = () => {
    window.location.replace('https://www.google.com');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: 'fa-house' },
    { to: '/sarc', label: 'SARC Centres', icon: 'fa-shield-heart' },
    { to: '/locate-hospital', label: 'Hospitals', icon: 'fa-hospital' },
    { to: '/evidence', label: 'Evidence', icon: 'fa-camera-retro' },
    { to: '/faqs', label: 'Rights & FAQs', icon: 'fa-circle-question' }
  ];

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-purple-100/80 shadow-xs">
        {/* Top Emergency Strip */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 text-white text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-semibold text-purple-200">24/7 Helpline:</span>
            <a href="tel:112" className="underline font-bold text-amber-300 hover:text-white transition-colors">
              Call 112
            </a>
            <span className="hidden sm:inline text-purple-300">| Kano Helpline: 08000-RIBBONS</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Exit Safety Shield */}
            <button
              onClick={handleQuickEscape}
              className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] flex items-center gap-1 shadow-xs transition-all"
              title="Immediately leaves this website for your safety"
            >
              <i className="fa-solid fa-person-running"></i>
              <span>Quick Exit</span>
            </button>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="Ribbons Logo" className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-purple-950 leading-none">
                Ribbons
              </span>
              <span className="text-[10px] sm:text-[11px] text-purple-700 font-semibold tracking-wide">
                Crisis & SARC Support (Nigeria)
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-purple-100 text-purple-950 font-bold shadow-xs'
                      : 'hover:bg-purple-50 text-gray-700 hover:text-purple-900'
                  }`}
                >
                  <i className={`fa-solid ${link.icon} text-xs ${isActive ? 'text-purple-900' : 'text-purple-600'}`}></i>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* USSD Trigger Button */}
            <button
              onClick={() => setShowUssdModal(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <i className="fa-solid fa-mobile-screen-button"></i>
              <span>USSD *425*0167#</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleShowOptions}
              className="p-2 rounded-xl text-gray-700 hover:text-purple-950 hover:bg-purple-50 md:hidden focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <i className={`fa-solid ${showOptions ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {showOptions && (
          <div className="md:hidden border-t border-purple-100 bg-white/95 backdrop-blur-md px-4 py-3 shadow-xl animate-fade-in">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowOptions(false)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all ${
                    location.pathname === link.to
                      ? 'bg-purple-100 text-purple-950'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-900'
                  }`}
                >
                  <i className={`fa-solid ${link.icon} w-5 text-purple-700`}></i>
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowOptions(false);
                    setShowUssdModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-xs flex items-center gap-3 border border-emerald-200"
                >
                  <i className="fa-solid fa-mobile-screen-button w-5 text-emerald-700 text-sm"></i>
                  <span>Launch USSD Feature Phone (*425*0167#)</span>
                </button>

                <div className="flex items-center justify-between text-xs text-gray-500 px-3 pt-1">
                  <Link to="/admin" onClick={() => setShowOptions(false)} className="hover:text-purple-900 font-medium">
                    Admin Portal
                  </Link>
                  <span>•</span>
                  <Link to="/agent" onClick={() => setShowOptions(false)} className="hover:text-purple-900 font-medium">
                    Caseworker Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Thumb Navigation Bar (App Experience on Phones) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] px-2 py-1.5 flex items-center justify-around text-center">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            location.pathname === '/' ? 'text-purple-950 font-bold' : 'text-gray-500 hover:text-purple-900'
          }`}
        >
          <i className="fa-solid fa-house text-base"></i>
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        <Link
          to="/sarc"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            location.pathname === '/sarc' ? 'text-purple-950 font-bold' : 'text-gray-500 hover:text-purple-900'
          }`}
        >
          <i className="fa-solid fa-shield-heart text-base"></i>
          <span className="text-[10px] mt-0.5">SARCs</span>
        </Link>

        {/* Center Accent Button for USSD */}
        <button
          onClick={() => setShowUssdModal(true)}
          className="flex flex-col items-center -mt-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white w-12 h-12 rounded-full shadow-lg items-center justify-center border-2 border-white active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-mobile-screen-button text-lg"></i>
        </button>

        <Link
          to="/locate-hospital"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            location.pathname === '/locate-hospital' ? 'text-purple-950 font-bold' : 'text-gray-500 hover:text-purple-900'
          }`}
        >
          <i className="fa-solid fa-hospital text-base"></i>
          <span className="text-[10px] mt-0.5">Hospitals</span>
        </Link>

        <Link
          to="/evidence"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            location.pathname === '/evidence' ? 'text-purple-950 font-bold' : 'text-gray-500 hover:text-purple-900'
          }`}
        >
          <i className="fa-solid fa-camera-retro text-base"></i>
          <span className="text-[10px] mt-0.5">Evidence</span>
        </Link>
      </nav>

      {/* USSD Modal */}
      <UssdSimulatorModal isOpen={showUssdModal} onClose={() => setShowUssdModal(false)} />
    </>
  );
};

export default Navbar;
