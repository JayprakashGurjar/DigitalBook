import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatDate,
  generateSoundRentalWhatsAppSummary,
} from '../../utils/formatters';
import {
  Volume2,
  PlusCircle,
  Search,
  Share2,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Package,
  Boxes,
} from 'lucide-react';
import SoundRentalModal from './SoundRentalModal';
import SoundInventoryModal from './SoundInventoryModal';
import AdminPinModal from '../AdminPinModal';

const SoundSystemMain = () => {
  const {
    soundInventory,
    soundRentals,
    toggleRentalStatus,
    deleteRental,
    deleteEquipment,
    isAdminUnlocked,
  } = useApp();

  const [activeRentalFilter, setActiveRentalFilter] = useState('all'); // all | active | returned
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewMode, setActiveViewMode] = useState('rentals'); // rentals | inventory

  // Modals
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [editRentalData, setEditRentalData] = useState(null);

  const [showEqModal, setShowEqModal] = useState(false);
  const [editEqData, setEditEqData] = useState(null);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Filter rentals
  const filteredRentals = soundRentals.filter((r) => {
    if (activeRentalFilter === 'active' && r.status !== 'active') return false;
    if (activeRentalFilter === 'returned' && r.status !== 'returned') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.renterName.toLowerCase().includes(q) ||
      (r.phone && r.phone.includes(q)) ||
      (r.villageAddress && r.villageAddress.toLowerCase().includes(q)) ||
      (r.itemsRented && r.itemsRented.toLowerCase().includes(q))
    );
  });

  const handleProtectedAction = (actionFn) => {
    if (!isAdminUnlocked) {
      setPendingAction({ fn: actionFn });
      setShowPinModal(true);
    } else {
      actionFn();
    }
  };

  const handleShareWhatsApp = (rental) => {
    const text = generateSoundRentalWhatsAppSummary(rental);
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="sound-system-container">
      {/* View Switcher Header: Rentals Register vs Equipment Stock */}
      <div className="sound-toolbar">
        <div className="sound-view-toggle">
          <button
            className={`toggle-tab ${activeViewMode === 'rentals' ? 'active' : ''}`}
            onClick={() => setActiveViewMode('rentals')}
          >
            <Volume2 size={18} />
            <span>साउंड किराया बुकिंग रजिस्टर</span>
          </button>
          <button
            className={`toggle-tab ${activeViewMode === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveViewMode('inventory')}
          >
            <Boxes size={18} />
            <span>सामग्री स्टॉक सूची ({soundInventory.length})</span>
          </button>
        </div>

        <div className="sound-actions">
          {activeViewMode === 'rentals' ? (
            <button
              className="btn-primary"
              onClick={() =>
                handleProtectedAction(() => {
                  setEditRentalData(null);
                  setShowRentalModal(true);
                })
              }
            >
              <PlusCircle size={16} />
              <span>+ नई साउंड बुकिंग</span>
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() =>
                handleProtectedAction(() => {
                  setEditEqData(null);
                  setShowEqModal(true);
                })
              }
            >
              <PlusCircle size={16} />
              <span>+ नई सामग्री जोड़ें</span>
            </button>
          )}
        </div>
      </div>

      {/* Rentals View */}
      {activeViewMode === 'rentals' && (
        <div className="rentals-section">
          {/* Subfilter & Search Bar */}
          <div className="filter-bar-row">
            <div className="ledger-subtabs">
              <button
                className={`subtab-btn ${
                  activeRentalFilter === 'all' ? 'active' : ''
                }`}
                onClick={() => setActiveRentalFilter('all')}
              >
                सभी बुकिंग्स ({soundRentals.length})
              </button>
              <button
                className={`subtab-btn ${
                  activeRentalFilter === 'active' ? 'active' : ''
                }`}
                onClick={() => setActiveRentalFilter('active')}
              >
                ⏳ किराए पर जारी (
                {soundRentals.filter((r) => r.status === 'active').length})
              </button>
              <button
                className={`subtab-btn ${
                  activeRentalFilter === 'returned' ? 'active' : ''
                }`}
                onClick={() => setActiveRentalFilter('returned')}
              >
                ✅ वापस प्राप्त (
                {soundRentals.filter((r) => r.status === 'returned').length})
              </button>
            </div>

            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="ग्राहक नाम, नंबर, गाँव खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Rental Cards Grid */}
          {filteredRentals.length === 0 ? (
            <div className="empty-card">
              <p>कोई बुकिंग रिकॉर्ड नहीं मिला।</p>
            </div>
          ) : (
            <div className="rentals-grid">
              {filteredRentals.map((rental) => {
                const total = Number(rental.totalRent) || 0;
                const adv = Number(rental.advancePaid) || 0;
                const due = total - adv;

                return (
                  <div
                    key={rental.id}
                    className={`rental-card ${
                      rental.status === 'returned' ? 'returned-border' : 'active-border'
                    }`}
                  >
                    <div className="rental-card-header">
                      <div>
                        <h3 className="renter-title">{rental.renterName}</h3>
                        <div className="renter-contact">
                          <span className="flex-align">
                            <Phone size={14} /> {rental.phone}
                          </span>
                          {rental.villageAddress && (
                            <span className="flex-align text-sub">
                              <MapPin size={14} /> {rental.villageAddress}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`status-pill ${
                          rental.status === 'returned' ? 'returned' : 'active'
                        }`}
                      >
                        {rental.status === 'returned' ? (
                          <>
                            <CheckCircle size={14} /> वापस प्राप्त
                          </>
                        ) : (
                          <>
                            <Clock size={14} /> किराए पर जारी
                          </>
                        )}
                      </span>
                    </div>

                    <div className="rental-items-box">
                      <Package size={16} className="icon-gold" />
                      <span>{rental.itemsRented}</span>
                    </div>

                    <div className="rental-dates-row">
                      <span>ले जाने की तारीख: <strong>{formatDate(rental.issueDate)}</strong></span>
                      <span>वापसी तारीख: <strong>{formatDate(rental.returnDate)}</strong></span>
                    </div>

                    <div className="rental-money-breakdown">
                      <div className="money-col">
                        <span className="label">कुल तय किराया</span>
                        <span className="val font-semibold">{formatCurrency(total)}</span>
                      </div>
                      <div className="money-col">
                        <span className="label">अग्रिम जमा</span>
                        <span className="val text-green">{formatCurrency(adv)}</span>
                      </div>
                      <div className="money-col">
                        <span className="label">शेष बकाया</span>
                        <span
                          className={`val font-bold ${
                            due > 0 ? 'text-red' : 'text-green'
                          }`}
                        >
                          {formatCurrency(due)}
                        </span>
                      </div>
                    </div>

                    {rental.note && (
                      <p className="rental-note">📌 टिप: {rental.note}</p>
                    )}

                    <div className="rental-card-footer">
                      <div className="left-btns">
                        <button
                          className="btn-action-icon text-green"
                          onClick={() => handleShareWhatsApp(rental)}
                          title="व्हाट्सएप पर बिल भेजें"
                        >
                          <Share2 size={16} /> WhatsApp
                        </button>
                        {isAdminUnlocked && (
                          <button
                            className={`btn-status-toggle ${
                              rental.status === 'active' ? 'btn-active-toggle' : ''
                            }`}
                            onClick={() => toggleRentalStatus(rental.id)}
                            title="सामान वापसी स्टेटस बदलें"
                          >
                            {rental.status === 'active'
                              ? 'सामान जमा दर्ज करें'
                              : 'वापस एक्टिव करें'}
                          </button>
                        )}
                      </div>

                      {isAdminUnlocked && (
                        <div className="right-btns">
                          <button
                            className="btn-action-icon"
                            onClick={() => {
                              setEditRentalData(rental);
                              setShowRentalModal(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-action-icon text-red"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `क्या आप ${rental.renterName} की बुकिंग हटाना चाहते हैं?`
                                )
                              ) {
                                deleteRental(rental.id);
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Equipment Inventory View */}
      {activeViewMode === 'inventory' && (
        <div className="inventory-section">
          <div className="card-table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>सामग्री का नाम</th>
                  <th>संख्या (मात्रा)</th>
                  <th>इकाई (Unit)</th>
                  <th>हालत / स्थिति</th>
                  <th>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {soundInventory.map((eq) => (
                  <tr key={eq.id}>
                    <td className="font-semibold text-saffron">{eq.name}</td>
                    <td className="font-bold">{eq.quantity}</td>
                    <td>{eq.unit}</td>
                    <td>
                      <span className="badge badge-member">{eq.condition}</span>
                    </td>
                    <td>
                      {isAdminUnlocked && (
                        <div className="cell-actions">
                          <button
                            className="btn-action-icon"
                            onClick={() => {
                              setEditEqData(eq);
                              setShowEqModal(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-action-icon text-red"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `क्या आप सामग्री '${eq.name}' को सूची से हटाना चाहते हैं?`
                                )
                              ) {
                                deleteEquipment(eq.id);
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showRentalModal && (
        <SoundRentalModal
          initialData={editRentalData}
          onClose={() => {
            setShowRentalModal(false);
            setEditRentalData(null);
          }}
        />
      )}

      {showEqModal && (
        <SoundInventoryModal
          initialData={editEqData}
          onClose={() => {
            setShowEqModal(false);
            setEditEqData(null);
          }}
        />
      )}

      {showPinModal && (
        <AdminPinModal
          onClose={() => setShowPinModal(false)}
          onSuccess={() => {
            if (pendingAction?.fn) pendingAction.fn();
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
};

export default SoundSystemMain;
