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
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Wrench,
  UserCheck,
  ShieldAlert,
  Landmark,
} from 'lucide-react';
import SoundRentalModal from './SoundRentalModal';
import SoundInventoryModal from './SoundInventoryModal';
import SoundFundModal from './SoundFundModal';
import AdminPinModal from '../AdminPinModal';

const SoundSystemMain = () => {
  const {
    soundInventory,
    soundRentals,
    soundFundTxns,
    soundFundTotals,
    toggleRentalStatus,
    deleteRental,
    deleteEquipment,
    toggleSoundFundStatus,
    deleteSoundFundTxn,
    isAdminUnlocked,
  } = useApp();

  const [activeViewMode, setActiveViewMode] = useState('rentals'); // rentals | inventory | fund

  // Rentals Filters
  const [activeRentalFilter, setActiveRentalFilter] = useState('all'); // all | active | returned
  const [searchQuery, setSearchQuery] = useState('');

  // Fund Filters
  const [activeFundFilter, setActiveFundFilter] = useState('all'); // all | custody | event | maintenance | income

  // Modals
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [editRentalData, setEditRentalData] = useState(null);

  const [showEqModal, setShowEqModal] = useState(false);
  const [editEqData, setEditEqData] = useState(null);

  const [showFundModal, setShowFundModal] = useState(false);
  const [editFundData, setEditFundData] = useState(null);

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

  // Filter Sound Fund Txns
  const filteredFundTxns = soundFundTxns.filter((t) => {
    if (activeFundFilter === 'custody' && t.type !== 'custody_given' && t.type !== 'custody_returned') return false;
    if (activeFundFilter === 'event' && t.type !== 'transfer_to_event') return false;
    if (activeFundFilter === 'maintenance' && t.type !== 'maintenance_expense') return false;
    if (activeFundFilter === 'income' && t.type !== 'rental_income') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.holderName && t.holderName.toLowerCase().includes(q)) ||
      (t.eventName && t.eventName.toLowerCase().includes(q)) ||
      (t.note && t.note.toLowerCase().includes(q))
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

  const getFundTypeBadge = (type) => {
    switch (type) {
      case 'rental_income':
        return { label: '💰 किराया आय', color: 'badge-green', icon: ArrowDownLeft };
      case 'transfer_to_event':
        return { label: '🚩 धार्मिक कार्य में प्रयोग', color: 'badge-saffron', icon: ArrowUpRight };
      case 'custody_given':
        return { label: '👤 अमानत / सुपुर्दगी', color: 'badge-gold', icon: UserCheck };
      case 'custody_returned':
        return { label: '🔄 अमानत वापस कोष में', color: 'badge-green', icon: RefreshCw };
      case 'maintenance_expense':
        return { label: '🛠️ साउंड मरम्मत వ్యय', color: 'badge-red', icon: Wrench };
      default:
        return { label: 'लेन-देन', color: 'badge-member', icon: Wallet };
    }
  };

  return (
    <div className="sound-system-container">
      {/* View Switcher Header: Rentals vs Equipment Stock vs Fund Ledger */}
      <div className="sound-toolbar">
        <div className="sound-view-toggle">
          <button
            className={`toggle-tab ${activeViewMode === 'rentals' ? 'active' : ''}`}
            onClick={() => setActiveViewMode('rentals')}
          >
            <Volume2 size={18} />
            <span>साउंड किराया रजिस्टर</span>
          </button>
          <button
            className={`toggle-tab ${activeViewMode === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveViewMode('inventory')}
          >
            <Boxes size={18} />
            <span>सामग्री स्टॉक ({soundInventory.length})</span>
          </button>
          <button
            className={`toggle-tab ${activeViewMode === 'fund' ? 'active' : ''}`}
            onClick={() => setActiveViewMode('fund')}
          >
            <Wallet size={18} />
            <span>साउंड आय-व्यय व कोष</span>
          </button>
        </div>

        <div className="sound-actions">
          {activeViewMode === 'rentals' && (
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
          )}

          {activeViewMode === 'inventory' && (
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

          {activeViewMode === 'fund' && (
            <button
              className="btn-primary"
              onClick={() =>
                handleProtectedAction(() => {
                  setEditFundData(null);
                  setShowFundModal(true);
                })
              }
            >
              <PlusCircle size={16} />
              <span>+ नया कोष लेन-देन (अमानत/ट्रांसफर)</span>
            </button>
          )}
        </div>
      </div>

      {/* Rentals View Mode */}
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
                        <button
                          className={`btn-status-toggle ${
                            rental.status === 'active' ? 'btn-active-toggle' : ''
                          }`}
                          onClick={() =>
                            handleProtectedAction(() => toggleRentalStatus(rental.id))
                          }
                          title="सामान वापसी स्टेटस बदलें"
                        >
                          {rental.status === 'active'
                            ? 'सामान जमा दर्ज करें'
                            : 'वापस एक्टिव करें'}
                        </button>
                      </div>

                      <div className="right-btns">
                        <button
                          className="btn-action-icon"
                          onClick={() =>
                            handleProtectedAction(() => {
                              setEditRentalData(rental);
                              setShowRentalModal(true);
                            })
                          }
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-action-icon text-red"
                          onClick={() =>
                            handleProtectedAction(() => {
                              if (
                                window.confirm(
                                  `क्या आप ${rental.renterName} की बुकिंग हटाना चाहते हैं?`
                                )
                              ) {
                                deleteRental(rental.id);
                              }
                            })
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Inventory View Mode */}
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
                      <div className="cell-actions">
                        <button
                          className="btn-action-icon"
                          onClick={() =>
                            handleProtectedAction(() => {
                              setEditEqData(eq);
                              setShowEqModal(true);
                            })
                          }
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-action-icon text-red"
                          onClick={() =>
                            handleProtectedAction(() => {
                              if (
                                window.confirm(
                                  `क्या आप सामग्री '${eq.name}' को सूची से हटाना चाहते हैं?`
                                )
                              ) {
                                deleteEquipment(eq.id);
                              }
                            })
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sound Fund & Custody Ledger View Mode */}
      {activeViewMode === 'fund' && (
        <div className="fund-section">
          {/* Top Summary Cards Grid */}
          <div className="fund-stats-grid">
            <div className="fund-stat-card border-green">
              <div className="stat-icon bg-green-light text-green">
                <ArrowDownLeft size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">कुल किराया आय</span>
                <h3 className="stat-val text-green">
                  {formatCurrency(soundFundTotals.totalRentEarned)}
                </h3>
              </div>
            </div>

            <div className="fund-stat-card border-saffron">
              <div className="stat-icon bg-saffron-light text-saffron">
                <Landmark size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">धार्मिक कार्य में प्रयोग</span>
                <h3 className="stat-val text-saffron">
                  {formatCurrency(soundFundTotals.transferredToEvents)}
                </h3>
              </div>
            </div>

            <div className="fund-stat-card border-gold">
              <div className="stat-icon bg-gold-light text-gold">
                <ShieldAlert size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">सदस्य/व्यक्ति के पास अमानत</span>
                <h3 className="stat-val text-gold">
                  {formatCurrency(soundFundTotals.inCustody)}
                </h3>
              </div>
            </div>

            <div className="fund-stat-card border-red">
              <div className="stat-icon bg-red-light text-red">
                <Wrench size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">साउंड मरम्मत व व्यय</span>
                <h3 className="stat-val text-red">
                  {formatCurrency(soundFundTotals.maintenanceExp)}
                </h3>
              </div>
            </div>

            <div className="fund-stat-card border-primary highlight-card">
              <div className="stat-icon bg-saffron text-dark font-bold">
                ₹
              </div>
              <div className="stat-info">
                <span className="stat-label">उपलब्ध नकद साउंड कोष</span>
                <h3 className="stat-val text-saffron font-bold">
                  {formatCurrency(soundFundTotals.netAvailableFund)}
                </h3>
              </div>
            </div>
          </div>

          {/* Subfilter Row */}
          <div className="filter-bar-row">
            <div className="ledger-subtabs">
              <button
                className={`subtab-btn ${activeFundFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFundFilter('all')}
              >
                सभी लेन-देन ({soundFundTxns.length})
              </button>
              <button
                className={`subtab-btn ${activeFundFilter === 'custody' ? 'active' : ''}`}
                onClick={() => setActiveFundFilter('custody')}
              >
                🔒 अमानत/सुपुर्दगी
              </button>
              <button
                className={`subtab-btn ${activeFundFilter === 'event' ? 'active' : ''}`}
                onClick={() => setActiveFundFilter('event')}
              >
                🚩 कार्यक्रम में दिया
              </button>
              <button
                className={`subtab-btn ${activeFundFilter === 'maintenance' ? 'active' : ''}`}
                onClick={() => setActiveFundFilter('maintenance')}
              >
                🛠️ मरम्मत व्यय
              </button>
              <button
                className={`subtab-btn ${activeFundFilter === 'income' ? 'active' : ''}`}
                onClick={() => setActiveFundFilter('income')}
              >
                💰 किराया आय
              </button>
            </div>

            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="नाम, विवरण या आयोजन खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Fund Transactions Grid */}
          {filteredFundTxns.length === 0 ? (
            <div className="empty-card">
              <p>कोई कोष लेन-देन रिकॉर्ड नहीं मिला।</p>
            </div>
          ) : (
            <div className="fund-txns-list">
              {filteredFundTxns.map((txn) => {
                const badge = getFundTypeBadge(txn.type);
                const BadgeIcon = badge.icon;
                const isCustody = txn.type === 'custody_given';
                const isReturned = txn.status === 'returned';

                return (
                  <div key={txn.id} className="fund-txn-card">
                    <div className="fund-txn-main">
                      <div className="fund-txn-header">
                        <span className={`badge ${badge.color} flex-align`}>
                          <BadgeIcon size={13} /> {badge.label}
                        </span>
                        <span className="fund-date">{formatDate(txn.date)}</span>
                      </div>

                      <h4 className="fund-txn-title">{txn.title}</h4>

                      {txn.holderName && (
                        <p className="fund-txn-sub">
                          👤 किसके पास अमानत: <strong>{txn.holderName}</strong>
                        </p>
                      )}
                      {txn.eventName && (
                        <p className="fund-txn-sub">
                          🚩 कार्यक्रम: <strong>{txn.eventName}</strong>
                        </p>
                      )}
                      {txn.note && <p className="fund-txn-note">📌 {txn.note}</p>}

                      {isCustody && (
                        <div className="custody-status-wrap">
                          <span
                            className={`status-pill ${
                              isReturned ? 'returned' : 'active'
                            }`}
                          >
                            {isReturned ? (
                              <>
                                <CheckCircle size={14} /> कोष में वापस प्राप्त
                              </>
                            ) : (
                              <>
                                <ShieldAlert size={14} /> अमानत में जमा (व्यक्ति के पास)
                              </>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="fund-txn-right">
                      <div className="fund-amount-wrap">
                        <span className="label">राशि</span>
                        <span
                          className={`fund-amount-val ${
                            txn.type === 'rental_income' || txn.type === 'custody_returned'
                              ? 'text-green'
                              : 'text-saffron'
                          }`}
                        >
                          {txn.type === 'rental_income' || txn.type === 'custody_returned'
                            ? '+'
                            : '-'}
                          {formatCurrency(txn.amount)}
                        </span>
                      </div>

                      <div className="fund-actions">
                        {isCustody && (
                          <button
                            className={`btn-status-toggle ${
                              !isReturned ? 'btn-active-toggle' : ''
                            }`}
                            onClick={() =>
                              handleProtectedAction(() => toggleSoundFundStatus(txn.id))
                            }
                            title="अमानत वापसी दर्ज करें"
                          >
                            {!isReturned ? 'अमानत वापसी दर्ज करें' : 'पुनः अमानत मार्क करें'}
                          </button>
                        )}

                        <button
                          className="btn-action-icon"
                          onClick={() =>
                            handleProtectedAction(() => {
                              setEditFundData(txn);
                              setShowFundModal(true);
                            })
                          }
                          title="संशोधित करें"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-action-icon text-red"
                          onClick={() =>
                            handleProtectedAction(() => {
                              if (
                                window.confirm(
                                  `क्या आप लेन-देन '${txn.title}' को हटाना चाहते हैं?`
                                )
                              ) {
                                deleteSoundFundTxn(txn.id);
                              }
                            })
                          }
                          title="हटाएं"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

      {showFundModal && (
        <SoundFundModal
          initialData={editFundData}
          onClose={() => {
            setShowFundModal(false);
            setEditFundData(null);
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

