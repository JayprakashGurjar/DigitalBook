import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, X, PlusCircle } from 'lucide-react';

const SoundInventoryModal = ({ onClose, initialData = null }) => {
  const { addEquipment, updateEquipment } = useApp();

  const [name, setName] = useState(initialData?.name || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [unit, setUnit] = useState(initialData?.unit || 'नग');
  const [condition, setCondition] = useState(initialData?.condition || 'उत्कृष्ट');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialData) {
      updateEquipment(initialData.id, {
        name,
        quantity: Number(quantity),
        unit,
        condition,
      });
    } else {
      addEquipment({
        name,
        quantity: Number(quantity),
        unit,
        condition,
      });
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Volume2 size={22} className="icon-gold" />
            <h2>{initialData ? 'सामग्री बदलें' : 'नई साउंड सामग्री दर्ज करें'}</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>सामग्री का नाम *</label>
            <input
              type="text"
              placeholder="उदा. 15 Inch JBL Speaker, 4000W Amplifier, Cordless Mike"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>कुल संख्या (मात्रा) *</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>इकाई (Unit)</label>
              <input
                type="text"
                placeholder="नग / सेट / बॉक्स"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>सामग्री स्थिति (Condition)</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="dropdown-select"
            >
              <option value="उत्कृष्ट">🌟 उत्कृष्ट (Excellent)</option>
              <option value="सामान्य">👍 सामान्य (Good)</option>
              <option value="मरम्मत योग्य">🔧 मरम्मत योग्य (Needs Repair)</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करें
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? 'अपडेट करें' : 'सेव करें'} 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoundInventoryModal;
