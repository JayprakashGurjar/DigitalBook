import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Volume2,
  X,
  IndianRupee,
  Calendar,
  Phone,
  MapPin,
  Plus,
  Minus,
  CheckCircle2,
  Package,
  Layers,
} from 'lucide-react';

const SoundRentalModal = ({ onClose, initialData = null }) => {
  const { addRental, updateRental, soundInventory } = useApp();

  const [renterName, setRenterName] = useState(initialData?.renterName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [villageAddress, setVillageAddress] = useState(initialData?.villageAddress || '');
  const [itemsRented, setItemsRented] = useState(initialData?.itemsRented || '');
  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [returnDate, setReturnDate] = useState(initialData?.returnDate || '');
  const [totalRent, setTotalRent] = useState(initialData?.totalRent || '');
  const [advancePaid, setAdvancePaid] = useState(initialData?.advancePaid || '');
  const [status, setStatus] = useState(initialData?.status || 'active'); // active | returned
  const [note, setNote] = useState(initialData?.note || '');

  // Track quantities per equipment name
  const [itemQuantities, setItemQuantities] = useState({});

  // Get icon based on equipment name
  const getEquipmentIcon = (name) => {
    if (name.includes('स्पीकर') || name.includes('Speaker')) return '🔊';
    if (name.includes('वूफर') || name.includes('Bass')) return '🔊';
    if (name.includes('एम्पलीफायर') || name.includes('Amplifier')) return '⚡';
    if (name.includes('मिक्सर') || name.includes('Mixer')) return '🎛️';
    if (name.includes('माइक') || name.includes('Mike')) return '🎙️';
    if (name.includes('केबल') || name.includes('Wire')) return '🔌';
    if (name.includes('लाइट') || name.includes('Light')) return '💡';
    return '📦';
  };

  // Increment/Decrement item quantity
  const handleQtyChange = (eqName, delta) => {
    setItemQuantities((prev) => {
      const currentQty = prev[eqName] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const updated = { ...prev, [eqName]: newQty };

      // Format summary string
      const summaryParts = [];
      Object.entries(updated).forEach(([name, qty]) => {
        if (qty > 0) {
          summaryParts.push(`${qty} ${name}`);
        }
      });
      setItemsRented(summaryParts.join(', '));

      return updated;
    });
  };

  const totalSelectedCount = Object.values(itemQuantities).reduce(
    (sum, q) => sum + q,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!renterName.trim() || !totalRent) return;

    if (initialData) {
      updateRental(initialData.id, {
        renterName,
        phone,
        villageAddress,
        itemsRented,
        issueDate,
        returnDate: returnDate || issueDate,
        totalRent: Number(totalRent),
        advancePaid: Number(advancePaid || 0),
        status,
        note,
      });
    } else {
      addRental({
        renterName,
        phone,
        villageAddress,
        itemsRented,
        issueDate,
        returnDate: returnDate || issueDate,
        totalRent: Number(totalRent),
        advancePaid: Number(advancePaid || 0),
        status,
        note,
      });
    }

    onClose();
  };

  const due = (Number(totalRent) || 0) - (Number(advancePaid) || 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Volume2 size={22} className="icon-gold" />
            <h2>{initialData ? 'साउंड बुकिंग बदलें' : 'नया साउंड सिस्टम किराया बुकिंग'}</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row-2">
            <div className="form-group">
              <label>ग्राहक का नाम *</label>
              <input
                type="text"
                placeholder="उदा. विक्रम सिंह पंवार"
                value={renterName}
                onChange={(e) => setRenterName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>मोबाइल नंबर *</label>
              <input
                type="tel"
                placeholder="9826112233"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>स्थान / पता (गाँव या कार्यक्रम स्थल) *</label>
            <input
              type="text"
              placeholder="उदा. ग्राम पिपल्या (शादी कार्यक्रम), वार्ड 3"
              value={villageAddress}
              onChange={(e) => setVillageAddress(e.target.value)}
              required
            />
          </div>

          {/* Upgraded Premium Equipment & Quantity Selector UI */}
          <div className="form-group highlight-bg-selector">
            <div className="selector-header">
              <div className="selector-title">
                <Volume2 size={18} className="text-saffron" />
                <span>साउंड सामग्री एवं मात्रा चुनाव (Equipment & Quantity Picker)</span>
              </div>
              <span className="selected-count-badge">
                {totalSelectedCount > 0
                  ? `✅ ${totalSelectedCount} नग चुने गए`
                  : '0 चुने गए'}
              </span>
            </div>

            <div className="equipment-qty-grid">
              {soundInventory.map((eq) => {
                const qty = itemQuantities[eq.name] || 0;
                const icon = getEquipmentIcon(eq.name);

                return (
                  <div
                    key={eq.id}
                    className={`qty-item-card-premium ${qty > 0 ? 'selected-active' : ''}`}
                  >
                    <div className="qty-card-top">
                      <span className="eq-icon-badge">{icon}</span>
                      <div className="eq-details">
                        <h4 className="eq-name-title">{eq.name}</h4>
                        <span className="eq-stock-tag">
                          उपलब्ध: {eq.quantity} {eq.unit}
                        </span>
                      </div>
                      {qty > 0 && (
                        <CheckCircle2 size={18} className="text-green check-icon" />
                      )}
                    </div>

                    <div className="qty-counter-row">
                      <button
                        type="button"
                        className="btn-counter btn-minus"
                        onClick={() => handleQtyChange(eq.name, -1)}
                        disabled={qty <= 0}
                      >
                        <Minus size={14} />
                      </button>
                      <div className="qty-value-wrap">
                        <span className="qty-value-text">{qty}</span>
                        <span className="qty-unit-sub">{eq.unit}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-counter btn-plus"
                        onClick={() => handleQtyChange(eq.name, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Selected Tags Preview */}
            {itemsRented && (
              <div className="selected-tags-preview">
                <span className="tags-label">चुने गए सामान का विवरण:</span>
                <div className="tags-list">
                  {itemsRented.split(', ').map((tag, idx) => (
                    <span key={idx} className="selected-tag-item">
                      📦 {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>सामान का कुल विवरण (ज़रूरत होने पर बदलें) *</label>
            <textarea
              rows={2}
              placeholder="उदा. 2 टॉप स्पीकर, 1 एम्पलीफायर, 2 माइक, केबल बॉक्स"
              value={itemsRented}
              onChange={(e) => setItemsRented(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>ले जाने की तिथि *</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>वापसी की अनुमानित तिथि</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>कुल तय किराया (₹) *</label>
              <div className="input-icon-wrap">
                <IndianRupee size={16} className="input-icon" />
                <input
                  type="number"
                  placeholder="3500"
                  value={totalRent}
                  onChange={(e) => setTotalRent(e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>अग्रिम प्राप्त राशि (Advance ₹)</label>
              <div className="input-icon-wrap">
                <IndianRupee size={16} className="input-icon" />
                <input
                  type="number"
                  placeholder="1500"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>शेष बकाया राशि (Calculated Due)</label>
              <div className={`due-preview-box ${due > 0 ? 'text-red' : 'text-green'}`}>
                ₹{due > 0 ? due : 0} {due > 0 ? '(बकाया)' : '(चुकता)'}
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>बुकिंग / सामान स्थिति</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="dropdown-select"
              >
                <option value="active">⏳ किराए पर जारी (Active)</option>
                <option value="returned">✅ सामान वापस प्राप्त हुआ (Returned)</option>
              </select>
            </div>

            <div className="form-group">
              <label>विशेष टिप / रिमार्क</label>
              <input
                type="text"
                placeholder="उदा. अग्रिम ₹1500 मिले, बाकी वापसी पर"
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
              {initialData ? 'अपडेट करें' : 'बुकिंग सेव करें'} 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoundRentalModal;
