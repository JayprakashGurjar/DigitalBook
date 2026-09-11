import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatDate,
  EXPENSE_CATEGORIES,
} from '../../utils/formatters';
import {
  Search,
  PlusCircle,
  MinusCircle,
  Wallet,
  Share2,
  Trash2,
  Edit2,
  UserCheck,
  Users,
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react';
import ChandaFormModal from './ChandaFormModal';
import ExpenseFormModal from './ExpenseFormModal';
import CustodyModal from './CustodyModal';
import AdminPinModal from '../AdminPinModal';

const LedgerTable = () => {
  const {
    currentEvent,
    chandaList,
    expenseList,
    custodyList,
    deleteChanda,
    deleteExpense,
    deleteCustody,
    toggleChandaStatus,
    isAdminUnlocked,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('all'); // all | paid | pledged | member | village | expenses | custody
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showChandaModal, setShowChandaModal] = useState(false);
  const [editChandaData, setEditChandaData] = useState(null);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState(null);

  const [showCustodyModal, setShowCustodyModal] = useState(false);
  const [editCustodyData, setEditCustodyData] = useState(null);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  if (!currentEvent) {
    return (
      <div className="empty-card">
        <p>कृपया कोई कार्यक्रम चुनें अथवा नया कार्यक्रम बनाएं।</p>
      </div>
    );
  }

  // Filter Chanda for current event
  const currentChanda = chandaList.filter((c) => c.eventId === currentEvent.id);
  const currentExpenses = expenseList.filter((e) => e.eventId === currentEvent.id);
  const currentCustody = custodyList.filter((cu) => cu.eventId === currentEvent.id);

  // Search & Subtab filter
  const filteredChanda = currentChanda.filter((c) => {
    if (activeSubTab === 'paid' && c.paymentStatus === 'pledged') return false;
    if (activeSubTab === 'pledged' && c.paymentStatus !== 'pledged') return false;
    if (activeSubTab === 'member' && c.type !== 'member') return false;
    if (activeSubTab === 'village' && c.type !== 'village') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.donorName.toLowerCase().includes(q) ||
      c.receiptNo.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });

  const filteredExpenses = currentExpenses.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.paidTo && e.paidTo.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q))
    );
  });

  const filteredCustody = currentCustody.filter((cu) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      cu.holderName.toLowerCase().includes(q) ||
      (cu.note && cu.note.toLowerCase().includes(q))
    );
  });

  // PIN guard wrapper
  const handleProtectedAction = (actionFn, actionType) => {
    if (!isAdminUnlocked) {
      setPendingAction({ fn: actionFn, type: actionType });
      setShowPinModal(true);
    } else {
      actionFn();
    }
  };

  // WhatsApp Single Receipt Generator
  const shareSingleReceiptWhatsApp = (chanda) => {
    const isPledged = chanda.paymentStatus === 'pledged';
    let text = `🚩 *नव गणेश एवं दुर्गा उत्सव समिति, गौला* 🚩\n`;
    text += `📜 *चंदा रसीद सं:* ${chanda.receiptNo}\n`;
    text += `------------------------------------\n`;
    text += `👤 *दानदाता:* ${chanda.donorName}\n`;
    text += `📋 *श्रेणी:* ${chanda.type === 'member' ? 'समिति पूर्ण सदस्य' : 'ग्रामीण जन'}\n`;
    text += `💰 *राशि:* ${formatCurrency(chanda.amount)}\n`;
    text += `📌 *भुगतान स्थिति:* ${isPledged ? '⏳ लिखवाया (बकाया)' : '✅ जमा प्राप्त (Paid)'}\n`;
    text += `💵 *माध्यम:* ${chanda.paymentMode}\n`;
    text += `🗓️ *दिनांक:* ${formatDate(chanda.date)}\n`;
    text += `🎉 *कार्यक्रम:* ${currentEvent.name}\n`;
    if (chanda.note) text += `📌 *विवरण:* ${chanda.note}\n`;
    text += `------------------------------------\n`;
    text += `दानदाता का हार्दिक आभार एवं धन्यवाद! 🙏`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="ledger-container">
      {/* Top Filter Tabs & Action Buttons */}
      <div className="ledger-toolbar">
        <div className="ledger-subtabs">
          <button
            className={`subtab-btn ${activeSubTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('all')}
          >
            📜 कुल चंदा ({currentChanda.length})
          </button>
          <button
            className={`subtab-btn ${activeSubTab === 'paid' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('paid')}
          >
            ✅ जमा प्राप्त ({currentChanda.filter((c) => c.paymentStatus !== 'pledged').length})
          </button>
          <button
            className={`subtab-btn ${activeSubTab === 'pledged' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pledged')}
          >
            ⏳ केवल लिखवाया ({currentChanda.filter((c) => c.paymentStatus === 'pledged').length})
          </button>
          <button
            className={`subtab-btn ${activeSubTab === 'member' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('member')}
          >
            👤 समिति सदस्य (
            {currentChanda.filter((c) => c.type === 'member').length})
          </button>
          <button
            className={`subtab-btn ${activeSubTab === 'village' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('village')}
          >
            🏡 ग्रामीण जन (
            {currentChanda.filter((c) => c.type === 'village').length})
          </button>
          <button
            className={`subtab-btn ${activeSubTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('expenses')}
          >
            💸 खर्च सूची ({currentExpenses.length})
          </button>
          <button
            className={`subtab-btn ${activeSubTab === 'custody' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('custody')}
          >
            💼 बची राशि सुपुर्दगी ({currentCustody.length})
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="action-buttons-wrap">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="नाम, रसीद सं. खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="btn-primary"
            onClick={() =>
              handleProtectedAction(() => {
                setEditChandaData(null);
                setShowChandaModal(true);
              }, 'add_chanda')
            }
          >
            <PlusCircle size={16} />
            <span>+ चंदा रसीद</span>
          </button>

          <button
            className="btn-secondary text-red"
            onClick={() =>
              handleProtectedAction(() => {
                setEditExpenseData(null);
                setShowExpenseModal(true);
              }, 'add_expense')
            }
          >
            <MinusCircle size={16} />
            <span>+ खर्च दर्ज</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() =>
              handleProtectedAction(() => {
                setEditCustodyData(null);
                setShowCustodyModal(true);
              }, 'add_custody')
            }
          >
            <Wallet size={16} />
            <span>+ बची राशि सुपुर्दगी</span>
          </button>
        </div>
      </div>

      {/* Main Ledger Content Views */}
      {['all', 'paid', 'pledged', 'member', 'village'].includes(activeSubTab) && (
        <div className="ledger-list-section">
          {filteredChanda.length === 0 ? (
            <div className="empty-card">
              <p>कोई चंदा रिकॉर्ड नहीं मिला।</p>
            </div>
          ) : (
            <div className="card-table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>रसीद सं.</th>
                    <th>दानदाता का नाम</th>
                    <th>श्रेणी</th>
                    <th>राशि (₹)</th>
                    <th>भुगतान स्थिति</th>
                    <th>माध्यम</th>
                    <th>दिनांक</th>
                    <th>टिप / विवरण</th>
                    <th>कार्रवाई</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChanda.map((c) => {
                    const isPledged = c.paymentStatus === 'pledged';
                    return (
                      <tr key={c.id}>
                        <td className="font-bold text-saffron">{c.receiptNo}</td>
                        <td>
                          <div className="donor-name-cell">
                            <span className="font-semibold">{c.donorName}</span>
                            {c.phone && <span className="phone-sub">{c.phone}</span>}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              c.type === 'member' ? 'badge-member' : 'badge-village'
                            }`}
                          >
                            {c.type === 'member' ? 'समिति सदस्य' : 'ग्रामीण जन'}
                          </span>
                        </td>
                        <td
                          className={`amount-cell ${
                            isPledged ? 'text-gold' : 'text-green'
                          }`}
                        >
                          {formatCurrency(c.amount)}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              isPledged ? 'badge-gold' : 'badge-green'
                            }`}
                          >
                            {isPledged ? '⏳ केवल लिखवाया (बकाया)' : '✅ जमा (Paid)'}
                          </span>
                        </td>
                        <td>
                          <span className="pay-mode-pill">{c.paymentMode}</span>
                        </td>
                        <td>{formatDate(c.date)}</td>
                        <td className="text-sub">{c.note || '-'}</td>
                        <td>
                          <div className="cell-actions">
                            <button
                              className="btn-action-icon text-green"
                              onClick={() => shareSingleReceiptWhatsApp(c)}
                              title="व्हाट्सएप रसीद भेजें"
                            >
                              <Share2 size={16} />
                            </button>

                            <button
                              className={`btn-status-toggle ${
                                isPledged ? 'btn-active-toggle' : ''
                              }`}
                              onClick={() =>
                                handleProtectedAction(
                                  () => toggleChandaStatus(c.id),
                                  'toggle_chanda'
                                )
                              }
                              title="जमा / लिखवाया स्थिति बदलें"
                            >
                              {isPledged ? 'जमा दर्ज करें' : 'लिखवाया दर्ज करें'}
                            </button>

                            {isAdminUnlocked && (
                              <>
                                <button
                                  className="btn-action-icon"
                                  onClick={() => {
                                    setEditChandaData(c);
                                    setShowChandaModal(true);
                                  }}
                                  title="बदलें"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  className="btn-action-icon text-red"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `क्या आप ${c.donorName} की चंदा रसीद हटाना चाहते हैं?`
                                      )
                                    ) {
                                      deleteChanda(c.id);
                                    }
                                  }}
                                  title="हटाएं"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Expense List Tab */}
      {activeSubTab === 'expenses' && (
        <div className="ledger-list-section">
          {filteredExpenses.length === 0 ? (
            <div className="empty-card">
              <p>कोई खर्च दर्ज नहीं है।</p>
            </div>
          ) : (
            <div className="card-table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>खर्च श्रेणी</th>
                    <th>विवरण (Title)</th>
                    <th>राशि (₹)</th>
                    <th>प्राप्तकर्ता (Paid To)</th>
                    <th>दिनांक</th>
                    <th>रिमार्क</th>
                    <th>कार्रवाई</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((ex) => (
                    <tr key={ex.id}>
                      <td>
                        <span className="badge badge-expense">
                          {EXPENSE_CATEGORIES[ex.category] || ex.category}
                        </span>
                      </td>
                      <td className="font-semibold">{ex.title}</td>
                      <td className="amount-cell text-red">
                        {formatCurrency(ex.amount)}
                      </td>
                      <td>{ex.paidTo || '-'}</td>
                      <td>{formatDate(ex.date)}</td>
                      <td className="text-sub">{ex.note || '-'}</td>
                      <td>
                        {isAdminUnlocked && (
                          <div className="cell-actions">
                            <button
                              className="btn-action-icon"
                              onClick={() => {
                                setEditExpenseData(ex);
                                setShowExpenseModal(true);
                              }}
                              title="बदलें"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-action-icon text-red"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `क्या आप खर्च '${ex.title}' रिकॉर्ड हटाना चाहते हैं?`
                                  )
                                ) {
                                  deleteExpense(ex.id);
                                }
                              }}
                              title="हटाएं"
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
          )}
        </div>
      )}

      {/* Custody List Tab */}
      {activeSubTab === 'custody' && (
        <div className="ledger-list-section">
          {filteredCustody.length === 0 ? (
            <div className="empty-card">
              <p>कोई सुपुर्दगी रिकॉर्ड नहीं है।</p>
            </div>
          ) : (
            <div className="custody-grid">
              {filteredCustody.map((cu) => (
                <div key={cu.id} className="custody-card">
                  <div className="custody-card-header">
                    <span
                      className={`badge ${cu.type === 'surplus_custody'
                          ? 'badge-surplus'
                          : 'badge-deficit'
                        }`}
                    >
                      {cu.type === 'surplus_custody'
                        ? '🔒 बचे पैसे जमा (Custody)'
                        : '⚠️ अतिरिक्त खर्च वापसी देय (Deficit)'}
                    </span>
                    <span className="custody-amount">
                      {formatCurrency(cu.amount)}
                    </span>
                  </div>

                  <div className="custody-body">
                    <h3 className="holder-name">{cu.holderName}</h3>
                    <p className="custody-note">{cu.note}</p>
                    <div className="custody-meta">
                      <span>दिनांक: {formatDate(cu.date)}</span>
                      <span className="status-pill">
                        {cu.status === 'held' && '🔒 सुरक्षित जमा'}
                        {cu.status === 'carried_forward' && '🔄 हस्तांतरित'}
                        {cu.status === 'returned' && '✅ चुकता'}
                      </span>
                    </div>
                  </div>

                  {isAdminUnlocked && (
                    <div className="custody-card-footer">
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setEditCustodyData(cu);
                          setShowCustodyModal(true);
                        }}
                      >
                        <Edit2 size={14} /> बदलें
                      </button>
                      <button
                        className="btn-danger-outline"
                        onClick={() => {
                          if (window.confirm('क्या आप यह सुपुर्दगी रिकॉर्ड हटाना चाहते हैं?')) {
                            deleteCustody(cu.id);
                          }
                        }}
                      >
                        <Trash2 size={14} /> हटाएं
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showChandaModal && (
        <ChandaFormModal
          initialData={editChandaData}
          onClose={() => {
            setShowChandaModal(false);
            setEditChandaData(null);
          }}
        />
      )}

      {showExpenseModal && (
        <ExpenseFormModal
          initialData={editExpenseData}
          onClose={() => {
            setShowExpenseModal(false);
            setEditExpenseData(null);
          }}
        />
      )}

      {showCustodyModal && (
        <CustodyModal
          initialData={editCustodyData}
          onClose={() => {
            setShowCustodyModal(false);
            setEditCustodyData(null);
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

export default LedgerTable;
