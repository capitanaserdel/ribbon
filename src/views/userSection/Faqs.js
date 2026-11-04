import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Chatbot from '../../components/Chatbot';

const FAQ_DATA = [
  {
    id: 1,
    category: 'Medical',
    question: 'What is PEP and why is the 72-hour window so critical?',
    answer:
      'PEP stands for Post-Exposure Prophylaxis. It is a 28-day course of antiretroviral medication that can stop HIV from multiplying if taken within 72 hours (3 days) of potential exposure during a sexual assault. The sooner you start PEP, the more effective it is. Emergency contraception (morning-after pill) is also most effective within this same timeframe.'
  },
  {
    id: 2,
    category: 'Forensics',
    question: 'What should I do (and avoid doing) before a forensic medical examination?',
    answer:
      'To ensure DNA and physical evidence are preserved for court: 1. Try not to shower, bathe, brush your teeth, or wash your hands. 2. Avoid changing clothes if possible. If you must change, place each article of clothing in separate clean paper bags (not plastic bags, which trap moisture and destroy DNA). 3. Do not clean up the location where the incident occurred.'
  },
  {
    id: 3,
    category: 'Legal',
    question: 'Can I receive medical treatment at a SARC without filing a police report?',
    answer:
      'Yes. At Sexual Assault Referral Centres (SARCs) and One-Stop Centres, medical treatment, trauma care, and forensic evidence collection are completely available regardless of whether you choose to report to the police immediately. The forensic evidence can be safely preserved until you are ready to make a formal legal decision.'
  },
  {
    id: 4,
    category: 'USSD',
    question: 'How does the offline USSD (*425#) service work?',
    answer:
      'Ribbons operates an offline USSD service powered by Qrios Networks on shortcode *425#. Anyone with a standard 2G/3G feature phone (or without mobile data) can dial *425# to locate nearby SARCs, request emergency health/legal support, or submit an incident report. Case alerts are forwarded instantly to caseworkers.'
  },
  {
    id: 5,
    category: 'Services',
    question: 'What free services are provided by One-Stop Centres (SARCs)?',
    answer:
      'One-Stop Centres provide integrated multi-sectoral assistance at zero cost: Emergency Clinical Care, Forensic Medical Examination, Psychosocial & Trauma Therapy, Emergency Safe Shelter, and Free Legal Aid & Police Escort.'
  },
  {
    id: 6,
    category: 'Legal',
    question: 'What is an emergency protection order / restraining order?',
    answer:
      'An emergency protection order is a court directive that legally forbids an abuser from contacting, approaching, or coming within a specified distance of the survivor and their children. Our legal caseworkers can assist you in filing for an immediate interim protection order.'
  },
  {
    id: 7,
    category: 'Privacy',
    question: 'Is my chat on Ribbons confidential?',
    answer:
      'Yes. Our Anonymous Crisis Chat allows you to communicate without providing your real name or personal information. Furthermore, clicking the "Quick Exit" button in the navigation immediately redirects your browser to Google to safeguard your privacy if someone enters the room.'
  }
];

const Faqs = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [openId, setOpenId] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleShowChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  const categories = ['All', 'Medical', 'Forensics', 'Legal', 'USSD', 'Services', 'Privacy'];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = searchQuery.trim()
        ? item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between pb-24 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col gap-5 sm:gap-6">

        {/* Header Breadcrumb */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold">
            <Link to="/" className="hover:underline flex items-center gap-1">
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span className="text-gray-500">FAQs & Survivor Rights</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-950 flex items-center gap-2.5">
                <i className="fa-solid fa-circle-question text-amber-500"></i>
                <span>Frequently Asked Questions & Rights</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                Clear answers regarding urgent medical steps, PEP within 72h, evidence preservation, legal rights, and offline USSD access.
              </p>
            </div>

            <button
              onClick={toggleShowChatbot}
              className="self-start sm:self-auto bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-xs"
            >
              <i className="fa-solid fa-comments text-amber-700"></i>
              <span>Ask a Caseworker</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Category Chips */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. PEP, police report, evidence, USSD)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 text-[11px] sm:text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-950 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="flex flex-col gap-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-sm ${
                    isOpen ? 'border-purple-300 ring-1 ring-purple-100' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? 0 : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md font-semibold shrink-0">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm md:text-base">
                        {faq.question}
                      </h3>
                    </div>
                    <span className="text-gray-400 shrink-0 text-sm">
                      <i className={`fa-solid ${isOpen ? 'fa-chevron-up text-purple-700' : 'fa-chevron-down'}`}></i>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
              No matching questions found. Try searching with different keywords.
            </div>
          )}
        </div>

        {/* Still Need Help Box */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div>
            <h3 className="text-base font-bold">Have an immediate, unlisted question?</h3>
            <p className="text-xs text-purple-200 mt-1">
              Our caseworkers and crisis helpline operators are available 24/7.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleShowChatbot}
              className="bg-white hover:bg-purple-50 text-purple-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
            >
              Start Anonymous Chat
            </button>
            <a
              href="tel:112"
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-phone"></i>
              <span>Call 112</span>
            </a>
          </div>
        </div>

      </main>

      {showChatbot && <Chatbot toggleShowChatbot={toggleShowChatbot} />}
    </div>
  );
};

export default Faqs;
