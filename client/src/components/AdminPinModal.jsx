import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';

const AdminPinModal = ({ onClose, onSuccess }) => {
  const { unlockAdmin } = useApp();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg('कृपया PIN दर्ज करें');
      return;
    }

    const res = unlockAdmin(pin);
    if (res.success) {
      setErrorMsg('');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || 'गलत PIN दर्ज किया गया है!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Lock className="icon-gold" size={22} />
            <h2>व्यवस्थापक (Admin) लॉक खोलें</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <p className="modal-desc">
            केवल रिकॉर्ड देखने के लिए PIN की आवश्यकता नहीं है। नया हिसाब जोड़ने या बदलने के लिए समिति पास-कोड (PIN) दर्ज करें:
          </p>

          <div className="form-group">
            <label htmlFor="admin-pin-input">
              <KeyRound size={16} /> समिति सुरक्षा पासकोड (PIN)
            </label>
            <input
              id="admin-pin-input"
              type="password"
              maxLength={6}
              autoFocus
              placeholder="••••"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setErrorMsg('');
              }}
              className="pin-input"
            />
          </div>

          {errorMsg && (
            <div className="error-badge">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करें
            </button>
            <button type="submit" className="btn-primary">
              अनलॉक करें 🔓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPinModal;
