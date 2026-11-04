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

  // Safe Exit feature (Crucial for Gender-Based Violence / domestic abuse platforms)
  const handleQuickEscape = () => {
    // Overwrite history and immediately redirect to neutral site
    window.location.replace('https://www.google.com');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: 'fa-house' },
    { to: '/sarc', label: 'One-Stop Centres', icon: 'fa-circle-check' },
    { to: '/locate-hospital', label: 'Find Hospital', icon: 'fa-hospital' },
    { to: '/evidence', label: 'Evidence Vault', icon: 'fa-camera' },
    { to: '/faqs', label: 'Help & Rights', icon: 'fa-circle-question' }
  ];

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-purple-100 shadow-sm">
        {/* Top Emergency Strip */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white text-xs px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <span className="font-semibold text-purple-200">24/7 GBV Helpline:</span>
            <a href="tel:112" className="underline font-bold text-amber-300 hover:text-white transition-colors">
              Call 112
            </a>
            <span className="hidden sm:inline text-purple-300">| Toll-Free: 08000-RIBBONS</span>
          </div>

          <div className="flex items-center gap-2">
            {/* USSD Simulator Pill */}
            <button
              onClick={() => setShowUssdModal(true)}
              className="bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-all"
              title="Feature phone offline USSD service powered by Qrios"
            >
              <i className="fa-solid fa-mobile-screen-button"></i>
              <span>Dial *425# USSD</span>
            </button>

            {/* Quick Safe Exit Button */}
            <button
              onClick={handleQuickEscape}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 shadow-sm transition-all"
              title="Instantly leave this site for safety"
            >
              <i className="fa-solid fa-person-running"></i>
              <span>Quick Exit</span>
            </button>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="Ribbons Logo" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-purple-950 leading-none">
                Ribbons
              </span>
              <span className="text-[10px] text-purple-700 font-medium tracking-wide">
                Crisis & Survivor Care
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
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-purple-100 text-purple-900 font-semibold'
                      : 'hover:bg-purple-50 text-gray-700 hover:text-purple-900'
                  }`}
                >
                  <i className={`fa-solid ${link.icon} text-xs text-purple-700`}></i>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUssdModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <i className="fa-solid fa-phone"></i>
              <span>Test USSD (*425#)</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleShowOptions}
              className="p-2 rounded-lg text-gray-700 hover:text-purple-900 hover:bg-purple-50 md:hidden focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <i className={`fa-solid ${showOptions ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {showOptions && (
          <div className="md:hidden border-t border-purple-100 bg-white px-4 py-3 shadow-lg animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowOptions(false)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium ${
                    location.pathname === link.to
                      ? 'bg-purple-100 text-purple-950 font-semibold'
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
                  className="w-full text-left px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium text-sm flex items-center gap-3"
                >
                  <i className="fa-solid fa-mobile-screen-button w-5 text-emerald-600"></i>
                  <span>Dial *425# USSD (Qrios)</span>
                </button>

                <div className="flex items-center justify-between text-xs text-gray-500 px-3 pt-1">
                  <Link to="/admin" onClick={() => setShowOptions(false)} className="hover:text-purple-900">
                    Admin Portal
                  </Link>
                  <span>•</span>
                  <Link to="/agent" onClick={() => setShowOptions(false)} className="hover:text-purple-900">
                    Agent Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* USSD Modal */}
      <UssdSimulatorModal isOpen={showUssdModal} onClose={() => setShowUssdModal(false)} />
    </>
  );
};

export default Navbar;
