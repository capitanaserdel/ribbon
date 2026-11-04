import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Chatbot from '../../components/Chatbot';
import SARCData from './data/sarcData';

const SARC = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleShowChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  // Instant filter across all states and centers
  const filteredResults = useMemo(() => {
    if (!selectedState && !searchTerm.trim()) {
      // Default to showing first state or all
      return SARCData.slice(0, 5);
    }

    return SARCData.filter(item => {
      const matchesState = selectedState ? item.state.toLowerCase() === selectedState.toLowerCase() : true;
      const matchesSearch = searchTerm.trim()
        ? item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sarcCenters.some(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.address.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;
      return matchesState && matchesSearch;
    });
  }, [selectedState, searchTerm]);

  const totalCentersFound = filteredResults.reduce(
    (acc, curr) => acc + (curr.sarcCenters ? curr.sarcCenters.length : 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold">
            <Link to="/" className="hover:underline flex items-center gap-1">
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span className="text-gray-500">One-Stop Centres (SARC)</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-purple-950 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-purple-700"></i>
                <span>One-Stop Crisis Centres (SARC)</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Verified Sexual Assault Referral Centres providing 24/7 free medical care, forensic examination, crisis counseling, and legal assistance.
              </p>
            </div>

            <button
              onClick={toggleShowChatbot}
              className="self-start sm:self-auto bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <i className="fa-solid fa-headset text-purple-700"></i>
              <span>Need Help Finding?</span>
            </button>
          </div>
        </div>

        {/* Emergency Info Banner */}
        <div className="bg-purple-900 text-white rounded-2xl p-4 shadow-md flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
            <i className="fa-solid fa-circle-info text-lg"></i>
          </div>
          <div className="text-xs leading-relaxed">
            <strong className="text-amber-200 block text-sm mb-0.5">What is a One-Stop Centre / SARC?</strong>
            A SARC provides complete trauma care in a single confidential location: immediate medical treatment & PEP (HIV prevention within 72 hours), evidence collection, psychological counseling, police reporting support, and safe shelter.
          </div>
        </div>

        {/* Fast Search & State Filter Controls */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="flex-1 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city, center name, or district..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* State Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all capitalize"
            >
              <option value="">All States / Territories</option>
              {SARCData.map((d) => (
                <option key={d.state} value={d.state}>
                  {d.state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>
            Showing <strong>{totalCentersFound}</strong> centres in {filteredResults.length} regions
          </span>
          {(selectedState || searchTerm) && (
            <button
              onClick={() => {
                setSelectedState('');
                setSearchTerm('');
              }}
              className="text-purple-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-6">
          {filteredResults.length > 0 ? (
            filteredResults.map((stateGroup) => (
              <div key={stateGroup.state} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-purple-100 pb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span>
                  <h2 className="font-bold text-gray-900 text-sm md:text-base capitalize">
                    {stateGroup.state}
                  </h2>
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                    {stateGroup.sarcCenters.length} {stateGroup.sarcCenters.length === 1 ? 'centre' : 'centres'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stateGroup.sarcCenters.map((centre, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 hover:border-purple-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-gray-900 text-sm text-purple-950">
                            {centre.name}
                          </h3>
                          <span className="shrink-0 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                            24/7 SARC
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 mt-2 flex items-start gap-2">
                          <i className="fa-solid fa-location-dot text-gray-400 mt-0.5 shrink-0"></i>
                          <span>{centre.address}</span>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        {centre.phone && (
                          <a
                            href={`tel:${centre.phone.split(',')[0].trim()}`}
                            className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <i className="fa-solid fa-phone text-[10px]"></i>
                            <span>Call {centre.phone.split(',')[0].trim()}</span>
                          </a>
                        )}

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            centre.name + ' ' + centre.address
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-700 hover:text-purple-900 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                        >
                          <span>Directions</span>
                          <i className="fa-solid fa-diamond-turn-right text-[11px]"></i>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <h3 className="font-bold text-gray-900 text-base">No Centres Found in this Search</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Try searching for another state or city, or contact our 24/7 emergency line immediately.
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setSelectedState('');
                    setSearchTerm('');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Clear Search
                </button>
                <a
                  href="tel:112"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-phone"></i>
                  <span>Call 112</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Floating Chatbot */}
      {showChatbot && <Chatbot toggleShowChatbot={toggleShowChatbot} />}
    </div>
  );
};

export default SARC;
