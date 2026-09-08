import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, X, IndianRupee, ShieldCheck } from 'lucide-react';

const CustodyModal = ({ onClose, initialData = null }) => {
  const { addCustody, updateCustody, currentEvent, members } = useApp();

  const [holderName, setHolderName] = useState(initialData?.holderName || '');
  const [type, setType] = useState(initialData?.type || 'surplus_custody'); // surplus_custody | deficit_reimbursement
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [status, setStatus] = useState(initialData?.status || 'held'); // held | carried_forward | returned
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');

  // Quick select member
  const handleSelectMember = (e) => {
    const mem = members.find((m) => m.id === e.target.value);
    if (mem) {
      setHolderName(mem.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!holderName.trim() || !amount) return;

    if (initialData) {
      updateCustody(initialData.id, {
        holderName,
        type,
        amount: Number(amount),
        status,
        date,
        note,
      });
    } else {
      addCustody({
        eventId: currentEvent.id,
        holderName,
        type,
        amount: Number(amount),
        status,
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
            <Wallet size={22} className="icon-gold" />
            <h2>
              {initialData
                ? 'सुपुर्दगी प्रविष्टि बदलें'
                : 'बची राशि / अतिरिक्त खर्च का सुपुर्दगी रिकॉर्ड दर्ज करें'}
            </h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Record Type */}
          <div className="form-group">
            <label>रिकॉर्ड का प्रकार (Record Type) *</label>
            <div className="radio-group-2">
              <label className={`radio-card ${type === 'surplus_custody' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="custodyType"
                  value="surplus_custody"
                  checked={type === 'surplus_custody'}
                  onChange={() => setType('surplus_custody')}
                />
                <ShieldCheck size={18} />
                <span>बचे पैसे व्यक्ति/सदस्य के पास जमा</span>
              </label>

              <label className={`radio-card ${type === 'deficit_reimbursement' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="custodyType"
                  value="deficit_reimbursement"
                  checked={type === 'deficit_reimbursement'}
                  onChange={() => setType('deficit_reimbursement')}
                />
                <Wallet size={18} />
                <span>अतिरिक्त खर्च की देनदारी (वापसी देय)</span>
              </label>
            </div>
          </div>

          {members.length > 0 && (
            <div className="form-group highlight-bg">
              <label>समिति सदस्य नाम चुनें</label>
              <select onChange={handleSelectMember} className="dropdown-select">
                <option value="">-- चुनें (या नीचे लिखें) --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>व्यक्ति / सदस्य का नाम (जिसके पास पैसे हैं/वापस करने हैं) *</label>
            <input
              type="text"
              placeholder="उदा. रामप्रसाद पटेल"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>राशि (₹) *</label>
              <div className="input-icon-wrap">
                <IndianRupee size={16} className="input-icon" />
                <input
                  type="number"
                  placeholder="2500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>वर्तमान स्थिति (Status)</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="dropdown-select"
              >
                <option value="held">🔒 पास में सुरक्षित जमा (Held)</option>
                <option value="carried_forward">🔄 अगले कार्यक्रम में स्थानांतरित (Carried)</option>
                <option value="returned">✅ हिसाब चुकता / वापस प्राप्त (Returned)</option>
              </select>
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
              <label>विवरण / रिमार्क</label>
              <input
                type="text"
                placeholder="उदा. रामनवमी के बचे ₹1800 अगले गणेशोत्सव हेतु सुरक्षित"
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
              {initialData ? 'अपडेट करें' : 'रिकॉर्ड दर्ज करें'} 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustodyModal;
