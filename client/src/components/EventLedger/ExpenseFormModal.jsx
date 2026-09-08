import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../utils/formatters';
import { MinusCircle, X, IndianRupee } from 'lucide-react';

const ExpenseFormModal = ({ onClose, initialData = null }) => {
  const { addExpense, updateExpense, currentEvent } = useApp();

  const [category, setCategory] = useState(initialData?.category || 'Pooja/Samagri');
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [paidTo, setPaidTo] = useState(initialData?.paidTo || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    if (initialData) {
      updateExpense(initialData.id, {
        category,
        title,
        amount: Number(amount),
        paidTo,
        date,
        note,
      });
    } else {
      addExpense({
        eventId: currentEvent.id,
        category,
        title,
        amount: Number(amount),
        paidTo,
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
            <MinusCircle size={22} className="text-red" />
            <h2>{initialData ? 'खर्च प्रविष्टि बदलें' : 'नया कार्यक्रम खर्च दर्ज करें'}</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>खर्च श्रेणी (Expense Category) *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="dropdown-select"
            >
              {Object.entries(EXPENSE_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>खर्च का शीर्षक/विवरण *</label>
            <input
              type="text"
              placeholder="उदा. गणेश जी प्रतिमा, टेंट एवं पंडाल किराया, प्रसादम"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>कुल खर्च राशि (₹) *</label>
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
              <label>भुगतान प्राप्तकर्ता (Paid To)</label>
              <input
                type="text"
                placeholder="उदा. श्यामलाल मूर्तिकार, गुप्ता स्टोर"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
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
              <label>अतिरिक्त टिप / बिल संदर्भ</label>
              <input
                type="text"
                placeholder="उदा. बिल नं. 45"
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
              {initialData ? 'अपडेट करें' : 'खर्च दर्ज करें'} 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseFormModal;
