import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  PlusCircle,
} from 'lucide-react';
import AdminPinModal from '../AdminPinModal';

const EventHeader = () => {
  const {
    events,
    selectedEventId,
    setSelectedEventId,
    currentEvent,
    addEvent,
    deleteEvent,
    isAdminUnlocked,
  } = useApp();

  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // New Event Form State
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateEventClick = () => {
    if (!isAdminUnlocked) {
      setPendingAction('create_event');
      setShowPinModal(true);
      return;
    }
    setShowNewEventModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    addEvent({
      name: eventName,
      startDate,
      endDate: endDate || startDate,
      description,
      status: 'active',
    });

    setEventName('');
    setDescription('');
    setShowNewEventModal(false);
  };

  const handleDeleteEventClick = () => {
    if (!currentEvent) return;
    if (!isAdminUnlocked) {
      setPendingAction('delete_event');
      setShowPinModal(true);
      return;
    }
    if (
      window.confirm(
        `क्या आप निश्चित रूप से '${currentEvent.name}' कार्यक्रम और इसके सभी चंदा/खर्च रिकॉर्ड्स हटाना चाहते हैं?`
      )
    ) {
      deleteEvent(currentEvent.id);
    }
  };

  return (
    <div className="event-header-container">
      {/* Selector & Actions */}
      <div className="event-selector-row">
        <div className="event-picker-wrap">
          <label htmlFor="event-select">
            <Calendar size={18} className="icon-gold" />
            <span>वर्तमान कार्यक्रम:</span>
          </label>
          <select
            id="event-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="event-select-dropdown"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name} ({evt.status === 'active' ? 'सक्रिय 🟢' : 'संपन्न ⚪'})
              </option>
            ))}
          </select>
        </div>

        <div className="event-btn-group">
          <button className="btn-primary" onClick={handleCreateEventClick}>
            <PlusCircle size={16} />
            <span>नया कार्यक्रम जोड़ें</span>
          </button>

          {currentEvent && isAdminUnlocked && (
            <button
              className="btn-icon text-red"
              onClick={handleDeleteEventClick}
              title="कार्यक्रम हटाएं"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Description Banner */}
      {currentEvent && (
        <div className="event-info-bar">
          <span className="event-status-badge active">
            {currentEvent.status === 'active' ? '🟢 वर्तमान में चालू' : '⚪ सम्पन्न'}
          </span>
          {currentEvent.description && (
            <span className="event-desc-text">{currentEvent.description}</span>
          )}
        </div>
      )}

      {/* Modal for Creating New Event */}
      {showNewEventModal && (
        <div className="modal-backdrop" onClick={() => setShowNewEventModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Calendar size={20} className="icon-gold" />
                <h2>नया धार्मिक कार्यक्रम जोड़ें</h2>
              </div>
              <button
                className="btn-close"
                onClick={() => setShowNewEventModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              <div className="form-group">
                <label>कार्यक्रम का नाम *</label>
                <input
                  type="text"
                  placeholder="उदा. गणेशोत्सव 2026, नवरात्रि 2026, श्रीमद भागवत कथा"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>प्रारंभ तिथि *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>समापन तिथि</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>विवरण (Description)</label>
                <input
                  type="text"
                  placeholder="कार्यक्रम का संक्षिप्त विवरण (जैसे 10 दिवसीय आयोजन)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowNewEventModal(false)}
                >
                  रद्द करें
                </button>
                <button type="submit" className="btn-primary">
                  कार्यक्रम दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN Check Prompt */}
      {showPinModal && (
        <AdminPinModal
          onClose={() => setShowPinModal(false)}
          onSuccess={() => {
            if (pendingAction === 'create_event') setShowNewEventModal(true);
            if (pendingAction === 'delete_event') handleDeleteEventClick();
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
};

export default EventHeader;
