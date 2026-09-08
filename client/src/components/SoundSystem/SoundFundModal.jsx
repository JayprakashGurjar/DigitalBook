import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, X, IndianRupee, ArrowRightLeft, ShieldCheck, Wrench, Flame } from 'lucide-react';

const SoundFundModal = ({ onClose, initialData = null }) => {
  const { addSoundFundTxn, updateSoundFundTxn, events, members } = useApp();

  const [type, setType] = useState(initialData?.type || 'event_transfer');
  const [title, setTitle] = useState(initialData?.title || '');
  const [targetName, setTargetName] = useState(initialData?.targetName || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState(initialData?.status || 'completed');
  const [note, setNote] = useState(initialData?.note || '');

  // Quick preset selector for Events or Members
  const handleSelectEvent = (e) => {
    const evt = events.find((ev) => ev.id === e.target.value);
    if (evt) {
      setTargetName(evt.name);
      setTitle(`${evt.name} में साउंड फंड सहयोग`);
    }
  };

  const handleSelectMember = (e) => {
    const mem = members.find((m) => m.id === e.target.value);
    if (mem) {
      setTargetName(mem.name);
      setTitle(`${mem.name} के पास अमानत जमा`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    if (initialData) {
      updateSoundFundTxn(initialData.id, {
        type,
        title,
        targetName,
        amount: Number(amount),
        date,
        status: type === 'member_custody' ? status : 'completed',
        note,
      });
    } else {
      addSoundFundTxn({
        type,
        title,
        targetName,
        amount: Number(amount),
        date,
        status: type === 'member_custody' ? 'held' : 'completed',
        note,
      });
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Wallet size={22} className="icon-gold" />
            <h2>
              {initialData
                ? 'साउंड फंड लेन-देन बदलें'
                : 'साउंड किराए की कमाई का उपयोग / सुपुर्दगी दर्ज करें'}
            </h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Transaction Type Radio Selector */}
          <div className="form-group">
            <label>उपयोग का प्रकार (Usage Type) *</label>
            <div className="radio-group-2">
              <label
                className={`radio-card ${
                  type === 'event_transfer' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="fundType"
                  value="event_transfer"
                  checked={type === 'event_transfer'}
                  onChange={() => {
                    setType('event_transfer');
                    setStatus('completed');
                  }}
                />
                <Flame size={18} className="text-saffron" />
                <span>🚩 कार्यक्रम में उपयोग</span>
              </label>

              <label
                className={`radio-card ${
                  type === 'member_custody' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="fundType"
                  value="member_custody"
                  checked={type === 'member_custody'}
                  onChange={() => {
                    setType('member_custody');
                    setStatus('held');
                  }}
                />
                <ShieldCheck size={18} className="text-gold" />
                <span>🔒 सदस्य के पास सुपुर्दगी</span>
              </label>

              <label
                className={`radio-card ${
                  type === 'custody_returned' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="fundType"
                  value="custody_returned"
                  checked={type === 'custody_returned'}
                  onChange={() => {
                    setType('custody_returned');
                    setStatus('completed');
                  }}
                />
                <ArrowRightLeft size={18} className="text-green" />
                <span>📥 अमानत राशि वापस प्राप्त</span>
              </label>

              <label
                className={`radio-card ${
                  type === 'maintenance_expense' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="fundType"
                  value="maintenance_expense"
                  checked={type === 'maintenance_expense'}
                  onChange={() => {
                    setType('maintenance_expense');
                    setStatus('completed');
                  }}
                />
                <Wrench size={18} className="text-red" />
                <span>🔧 मरम्मत / रख-रखाव खर्च</span>
              </label>
            </div>
          </div>

          {/* Quick Select Presets */}
          {type === 'event_transfer' && events.length > 0 && (
            <div className="form-group highlight-bg">
              <label>कार्यक्रम चुनें (Select Event)</label>
              <select onChange={handleSelectEvent} className="dropdown-select">
                <option value="">-- चुनें (या नीचे लिखें) --</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(type === 'member_custody' || type === 'custody_returned') &&
            members.length > 0 && (
              <div className="form-group highlight-bg">
                <label>समिति सदस्य चुनें (Select Member)</label>
                <select
                  onChange={handleSelectMember}
                  className="dropdown-select"
                >
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
            <label>शीर्षक / विवरण *</label>
            <input
              type="text"
              placeholder="उदा. गणेशोत्सव 2026 में ट्रांसफर, रामप्रसाद जी के पास अमानत जमा"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>संबंधित व्यक्ति / कार्यक्रम / दुकान नाम</label>
              <input
                type="text"
                placeholder="उदा. रामप्रसाद पटेल, गणेशोत्सव 2026"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>राशि (₹) *</label>
              <div className="input-icon-wrap">
                <IndianRupee size={16} className="input-icon" />
                <input
                  type="number"
                  placeholder="1500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>दिनांक *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {type === 'member_custody' ? (
              <div className="form-group">
                <label>अमानत स्थिति (Status)</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="held">🔒 सदस्य के पास जमा (Held)</option>
                  <option value="returned">✅ वापस प्राप्त हो गया (Returned)</option>
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label>विशेष टिप / रिमार्क</label>
                <input
                  type="text"
                  placeholder="उदा. अगले कार्यक्रम में उपयोग होगा"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करें
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'अपडेट करें' : 'लेन-देन दर्ज करें'} 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoundFundModal;
