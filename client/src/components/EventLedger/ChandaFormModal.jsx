import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, X, CreditCard, UserCheck, Users, IndianRupee } from 'lucide-react';

const ChandaFormModal = ({ onClose, initialData = null }) => {
  const { addChanda, updateChanda, currentEvent, members } = useApp();

  const [donorName, setDonorName] = useState(initialData?.donorName || '');
  const [type, setType] = useState(initialData?.type || 'member'); // member | village
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [paymentMode, setPaymentMode] = useState(initialData?.paymentMode || 'Cash');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [receiptNo, setReceiptNo] = useState(initialData?.receiptNo || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');

  // Quick select from registered committee members list
  const handleSelectMember = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const mem = members.find((m) => m.id === selectedId);
    if (mem) {
      setDonorName(mem.name);
      setPhone(mem.phone || '');
      setType('member');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!donorName.trim() || !amount) return;

    if (initialData) {
      updateChanda(initialData.id, {
        donorName,
        type,
        amount: Number(amount),
        paymentMode,
        phone,
        receiptNo,
        date,
        note,
      });
    } else {
      addChanda({
        eventId: currentEvent.id,
        donorName,
        type,
        amount: Number(amount),
        paymentMode,
        phone,
        receiptNo,
        date,
        note,
      });
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <PlusCircle size={22} className="icon-gold" />
            <h2>{initialData ? 'चंदा प्रविष्टि बदलें' : 'नया चंदा रसीद दर्ज करें'}</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Chanda Type Selector */}
          <div className="form-group">
            <label>चंदा श्रेणी (Donor Type) *</label>
            <div className="radio-group-2">
              <label className={`radio-card ${type === 'member' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="chandaType"
                  value="member"
                  checked={type === 'member'}
                  onChange={() => setType('member')}
                />
                <UserCheck size={18} />
                <span>समिति के पूर्ण सदस्य</span>
              </label>

              <label className={`radio-card ${type === 'village' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="chandaType"
                  value="village"
                  checked={type === 'village'}
                  onChange={() => setType('village')}
                />
                <Users size={18} />
                <span>ग्रामीण जन (इच्छानुसार)</span>
              </label>
            </div>
          </div>

          {/* Member Auto Selector dropdown if Member category selected */}
          {type === 'member' && members.length > 0 && (
            <div className="form-group highlight-bg">
              <label>समिति सूची से नाम चुनें (Select Member)</label>
              <select onChange={handleSelectMember} className="dropdown-select">
                <option value="">-- चुनें (या नीचे नाम लिखें) --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>दानदाता का नाम *</label>
            <input
              type="text"
              placeholder="उदा. रामप्रसाद पटेल, मदनलाल जी सोनी"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>चंदा राशि (₹) *</label>
              <div className="input-icon-wrap">
                <IndianRupee size={16} className="input-icon" />
                <input
                  type="number"
                  placeholder="1100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>भुगतान का माध्यम</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="dropdown-select"
              >
                <option value="Cash">💵 नकद (Cash)</option>
                <option value="UPI">📱 UPI / PhonePe / Paytm</option>
                <option value="Bank">🏦 बैंक ट्रांसफर</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>मोबाइल नंबर (ऐच्छिक)</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>रसीद नंबर</label>
              <input
                type="text"
                placeholder="REC-101 (खाली पर ऑटो बनेगा)"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>दिनांक</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>विशेष टिप / प्रयोजन</label>
              <input
                type="text"
                placeholder="उदा. महाआरती हेतु, वार्षिक अंशदान"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करें
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'अपडेट करें' : 'चंदा रसीद सेव करें'} 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChandaFormModal;
