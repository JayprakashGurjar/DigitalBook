import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  Upload,
  RefreshCw,
  Key,
  X,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const BackupRestoreModal = ({ onClose }) => {
  const {
    exportDataJSON,
    importDataJSON,
    resetAllData,
    changeAdminPin,
    isAdminUnlocked,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('backup'); // backup | pin | reset
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // PIN Change Form State
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');

  // Handle File Upload Import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        const res = importDataJSON(json);
        if (res.success) {
          setStatusMsg({ type: 'success', text: res.message });
        } else {
          setStatusMsg({ type: 'error', text: res.message });
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'बैकअप फाइल पढ़ने में त्रुटि!' });
      }
    };
    reader.readAsText(file);
  };

  // Handle PIN Change
  const handlePinChangeSubmit = (e) => {
    e.preventDefault();
    const res = changeAdminPin(oldPin, newPin);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      setOldPin('');
      setNewPin('');
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  // Handle Reset All Data
  const handleReset = () => {
    if (
      window.confirm(
        'क्या आप निश्चित रूप से सारा डेटा रीसेट करके डिफ़ॉल्ट डेटा लोड करना चाहते हैं?'
      )
    ) {
      resetAllData();
      setStatusMsg({ type: 'success', text: 'डेटा सफलतापूर्वक रीसेट हो गया है!' });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Download size={22} className="icon-gold" />
            <h2>डेटा बैकअप एवं पासवर्ड सुरक्षा</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`sub-tab ${activeSubTab === 'backup' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('backup');
              setStatusMsg({ type: '', text: '' });
            }}
          >
            <Download size={16} /> बैकअप/रीस्टोर
          </button>

          <button
            className={`sub-tab ${activeSubTab === 'pin' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('pin');
              setStatusMsg({ type: '', text: '' });
            }}
          >
            <Key size={16} /> पासवर्ड बदलें
          </button>

          <button
            className={`sub-tab ${activeSubTab === 'reset' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubTab('reset');
              setStatusMsg({ type: '', text: '' });
            }}
          >
            <RefreshCw size={16} /> रीसेट डेटा
          </button>
        </div>

        <div className="modal-body">
          {statusMsg.text && (
            <div
              className={`status-box ${
                statusMsg.type === 'success' ? 'success' : 'error'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Backup SubTab */}
          {activeSubTab === 'backup' && (
            <div className="backup-section">
              <div className="action-card">
                <h3>📥 डेटा सुरक्षित सेव (Export JSON)</h3>
                <p>
                  समिति के सभी चंदा रिकॉर्ड, खर्च और साउंड सिस्टम किराये का बैकअप अपने मोबाइल/कंप्यूटर में सुरक्षित फाइल के रूप में सेव करें।
                </p>
                <button
                  className="btn-primary flex-center"
                  onClick={exportDataJSON}
                >
                  <Download size={18} /> बैकअप फाइल डाउनलोड करें
                </button>
              </div>

              <hr className="divider" />

              <div className="action-card">
                <h3>📤 बैकअप फाइल से रीस्टोर करें (Import JSON)</h3>
                <p>
                  पुराने सेव किए गए बैकअप JSON फाइल को चुनकर अपना पूरा रिकॉर्ड वापस लाएं।
                </p>
                <label className="btn-secondary flex-center file-upload-btn">
                  <Upload size={18} /> बैकअप फाइल अपलोड करें
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    hidden
                  />
                </label>
              </div>
            </div>
          )}

          {/* Change PIN SubTab */}
          {activeSubTab === 'pin' && (
            <form onSubmit={handlePinChangeSubmit} className="pin-change-form">
              <p className="modal-desc">
                एडमिन लॉक के लिए 4 अंकों का नया पास-कोड सेट करें:
              </p>

              <div className="form-group">
                <label>पुराना पास-कोड (Old PIN)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>नया पास-कोड (New PIN)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  required
                />
              </div>

              <button type="submit" className="btn-primary width-full">
                पासवर्ड सेव करें
              </button>
            </form>
          )}

          {/* Reset SubTab */}
          {activeSubTab === 'reset' && (
            <div className="reset-section">
              <div className="warning-box">
                <AlertTriangle size={24} className="text-red" />
                <div>
                  <h4>चेतावनी: डेटा रीसेट करें</h4>
                  <p>
                    यह क्रिया आपके सभी मौजूदा रिकॉर्ड्स को मिटाकर शुरुआती उदाहरण (Demo) डेटा को पुनः लोड कर देगी।
                  </p>
                </div>
              </div>

              <button className="btn-danger width-full" onClick={handleReset}>
                <RefreshCw size={18} /> सभी डेटा रीसेट करके डिफ़ॉल्ट डेटा लाएं
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupRestoreModal;
