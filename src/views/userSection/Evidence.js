import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import Navbar from '../../components/Navbar';
import Chatbot from '../../components/Chatbot';

const cameraModes = ['user', 'environment'];

const Evidence = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState(cameraModes[1]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const webcamRef = useRef(null);

  const toggleShowChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  // Load existing evidence from localStorage
  const loadStoredEvidence = () => {
    try {
      const stored = localStorage.getItem('gbv-images');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Normalize: if stored as strings or objects
        const normalized = parsed.map((item, idx) => {
          if (typeof item === 'string') {
            return {
              id: 'ev-' + idx,
              image: item,
              timestamp: new Date().toLocaleString(),
              note: 'Photographic evidence'
            };
          }
          return item;
        });
        setEvidenceList(normalized);
      } else {
        setEvidenceList([]);
      }
    } catch (e) {
      console.error('Error loading evidence:', e);
      setEvidenceList([]);
    }
  };

  useEffect(() => {
    loadStoredEvidence();
  }, []);

  const saveToStorage = (newList) => {
    setEvidenceList(newList);
    localStorage.setItem('gbv-images', JSON.stringify(newList));
  };

  // Add captured or uploaded photo to vault
  const addEvidenceItem = (imageDataUrl, noteText = '') => {
    const newItem = {
      id: 'ev-' + Date.now(),
      image: imageDataUrl,
      timestamp: new Date().toLocaleString(),
      note: noteText || 'Recorded Evidence'
    };
    const updated = [newItem, ...evidenceList];
    saveToStorage(updated);
  };

  // Live Webcam Capture
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        addEvidenceItem(imageSrc, noteInput || 'Captured via camera');
        setIsCapturing(false);
        setNoteInput('');
      }
    }
  }, [noteInput, evidenceList]);

  // File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addEvidenceItem(reader.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete single item
  const handleDeleteItem = (id) => {
    if (window.confirm('Delete this piece of evidence from your device?')) {
      const updated = evidenceList.filter(item => item.id !== id);
      saveToStorage(updated);
      if (selectedImage && selectedImage.id === id) {
        setSelectedImage(null);
      }
    }
  };

  // Emergency Clear All (Safety protocol)
  const handleClearAll = () => {
    if (window.confirm('EMERGENCY CLEAR: Are you sure you want to permanently delete all stored evidence on this browser?')) {
      localStorage.removeItem('gbv-images');
      setEvidenceList([]);
      setSelectedImage(null);
    }
  };

  const videoConstraints = {
    facingMode: cameraFacingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">

        {/* Header Breadcrumb */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold">
            <Link to="/" className="hover:underline flex items-center gap-1">
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span className="text-gray-500">Forensic Evidence Vault</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-purple-950 flex items-center gap-2">
                <i className="fa-solid fa-camera-retro text-blue-600"></i>
                <span>Document Forensic Evidence</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Securely photograph and timestamp physical injuries, scene evidence, torn clothing, or threatening messages for legal prosecution.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCapturing(true)}
                className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-camera"></i>
                <span>Take Photo</span>
              </button>

              <label className="cursor-pointer bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2">
                <i className="fa-solid fa-upload"></i>
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {evidenceList.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all"
                  title="Permanently erase all evidence if someone inspects your device"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chain of Custody & Legal Best Practices Notice */}
        <div className="bg-blue-950 text-white rounded-2xl p-4 shadow-md flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-blue-300">
            <i className="fa-solid fa-shield-halved text-lg"></i>
          </div>
          <div className="text-xs leading-relaxed">
            <strong className="text-blue-200 block text-sm mb-0.5">How to Take Admissible Forensic Photos:</strong>
            • Take a <strong>wide-angle shot</strong> showing full context, then <strong>close-ups</strong> of specific bruises/injuries.<br />
            • Place a known object (like a coin, pen, or ruler) next to injuries for scale.<br />
            • Take photos across multiple consecutive days, as bruises often darken 24–48 hours later.<br />
            • Never use beauty filters or editing tools. All photos are stored locally on your device for confidentiality.
          </div>
        </div>

        {/* Live Camera Modal */}
        {isCapturing && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
              
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between text-white border-b border-gray-700">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-camera text-blue-400"></i>
                  <span>Live Evidence Camera</span>
                </span>
                <button
                  onClick={() => setIsCapturing(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              {/* Viewfinder */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Controls */}
              <div className="p-4 bg-gray-900 flex flex-col gap-3">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add note (e.g. Left arm bruise, torn shirt)..."
                  className="bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400"
                />

                <div className="flex items-center justify-around">
                  <button
                    onClick={() =>
                      setCameraFacingMode(prev =>
                        prev === cameraModes[0] ? cameraModes[1] : cameraModes[0]
                      )
                    }
                    className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center text-lg transition-all"
                    title="Flip camera"
                  >
                    <i className="fa-solid fa-camera-rotate"></i>
                  </button>

                  <button
                    onClick={capturePhoto}
                    className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 border-4 border-white text-white flex items-center justify-center text-2xl shadow-lg transition-all active:scale-95"
                    title="Capture photo"
                  >
                    <i className="fa-solid fa-camera"></i>
                  </button>

                  <button
                    onClick={() => setIsCapturing(false)}
                    className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-red-400 flex items-center justify-center text-lg transition-all"
                    title="Cancel"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Evidence Gallery */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Secure Vault Records</span>
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                {evidenceList.length} {evidenceList.length === 1 ? 'item' : 'items'}
              </span>
            </h2>

            {evidenceList.length > 0 && (
              <span className="text-[11px] text-gray-500">
                🔒 Stored locally in encrypted browser sandbox
              </span>
            )}
          </div>

          {evidenceList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {evidenceList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div
                    onClick={() => setSelectedImage(item)}
                    className="relative aspect-video w-full bg-gray-100 cursor-pointer overflow-hidden group"
                  >
                    <img
                      src={item.image}
                      alt={item.note || 'Evidence'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-semibold gap-1">
                      <i className="fa-solid fa-expand"></i>
                      <span>Inspect</span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                        {item.note || 'Photographic Record'}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <i className="fa-regular fa-clock"></i>
                        <span>{item.timestamp}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <a
                        href={item.image}
                        download={`ribbons-evidence-${item.id}.jpg`}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <i className="fa-solid fa-download"></i>
                        <span>Export</span>
                      </a>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                        title="Delete photo"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                <i className="fa-regular fa-images"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">No Evidence Recorded Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Use your device camera or upload files to safely timestamp photos of injuries, damaged possessions, or proof.
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setIsCapturing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <i className="fa-solid fa-camera"></i>
                  <span>Launch Camera</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Single Image Lightbox / Inspector Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700 text-white flex flex-col">
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="text-xs">
                  <span className="font-bold block text-white">{selectedImage.note}</span>
                  <span className="text-gray-400">{selectedImage.timestamp}</span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <div className="p-2 bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.note}
                  className="max-h-[55vh] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="p-4 bg-gray-900 flex justify-between items-center text-xs">
                <a
                  href={selectedImage.image}
                  download={`evidence-${selectedImage.id}.jpg`}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-download"></i>
                  <span>Download Full Resolution</span>
                </a>

                <button
                  onClick={() => handleDeleteItem(selectedImage.id)}
                  className="bg-red-600/80 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {showChatbot && <Chatbot toggleShowChatbot={toggleShowChatbot} />}
    </div>
  );
};

export default Evidence;
