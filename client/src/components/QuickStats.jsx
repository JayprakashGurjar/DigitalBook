import React from 'react';
import { useApp } from '../context/AppContext';
import {
  formatCurrency,
  formatDate,
} from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Volume2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const QuickStats = () => {
  const {
    currentEvent,
    chandaList,
    expenseList,
    custodyList,
    soundRentals,
    activeTab,
  } = useApp();

  if (!currentEvent && activeTab === 'ledger') return null;

  // Filter Event Chanda & Expenses
  const eventChanda = currentEvent
    ? chandaList.filter((c) => c.eventId === currentEvent.id)
    : [];
  const eventExpenses = currentEvent
    ? expenseList.filter((e) => e.eventId === currentEvent.id)
    : [];

  const memberTotal = eventChanda
    .filter((c) => c.type === 'member')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const villageTotal = eventChanda
    .filter((c) => c.type === 'village')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const grandChanda = memberTotal + villageTotal;

  const grandExpense = eventExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const surplusDeficit = grandChanda - grandExpense;

  // Active Sound Rentals Summary
  const activeRentals = soundRentals.filter((r) => r.status === 'active');
  const soundTotalDues = activeRentals.reduce(
    (sum, r) => sum + (Number(r.totalRent) - Number(r.advancePaid)),
    0
  );

  return (
    <div className="quick-stats-container">
      {activeTab === 'ledger' && currentEvent && (
        <div className="stats-grid">
          {/* Total Chanda Card */}
          <div className="stat-card green-glow">
            <div className="stat-header">
              <span className="stat-title">कुल जमा चंदा</span>
              <div className="stat-icon-wrap green">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="stat-value text-green">{formatCurrency(grandChanda)}</div>
            <div className="stat-sub">
              <span>सदस्य: {formatCurrency(memberTotal)}</span>
              <span> | </span>
              <span>ग्रामीण: {formatCurrency(villageTotal)}</span>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="stat-card red-glow">
            <div className="stat-header">
              <span className="stat-title">कुल कार्यक्रम खर्च</span>
              <div className="stat-icon-wrap red">
                <TrendingDown size={20} />
              </div>
            </div>
            <div className="stat-value text-red">{formatCurrency(grandExpense)}</div>
            <div className="stat-sub">
              <span>कुल {eventExpenses.length} मदों में खर्च</span>
            </div>
          </div>

          {/* Surplus / Deficit Balance Card */}
          <div
            className={`stat-card ${
              surplusDeficit >= 0 ? 'saffron-glow' : 'warning-glow'
            }`}
          >
            <div className="stat-header">
              <span className="stat-title">
                {surplusDeficit >= 0 ? 'बची हुई शेष राशि (Surplus)' : 'अतिरिक्त खर्च घाटा'}
              </span>
              <div
                className={`stat-icon-wrap ${
                  surplusDeficit >= 0 ? 'saffron' : 'warning'
                }`}
              >
                <Wallet size={20} />
              </div>
            </div>
            <div
              className={`stat-value ${
                surplusDeficit >= 0 ? 'text-saffron' : 'text-danger'
              }`}
            >
              {formatCurrency(Math.abs(surplusDeficit))}
            </div>
            <div className="stat-sub">
              {surplusDeficit >= 0 ? (
                <span className="flex-align">
                  <ArrowUpRight size={14} /> अगले कार्य हेतु सुरक्षित
                </span>
              ) : (
                <span className="flex-align text-danger">
                  <ArrowDownRight size={14} /> अतिरिक्त भुगतान देय
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sound' && (
        <div className="stats-grid">
          <div className="stat-card saffron-glow">
            <div className="stat-header">
              <span className="stat-title">सक्रिय बुकिंग (किराए पर जारी)</span>
              <div className="stat-icon-wrap saffron">
                <Volume2 size={20} />
              </div>
            </div>
            <div className="stat-value text-saffron">{activeRentals.length} बुक बुकिंग्स</div>
            <div className="stat-sub">वर्तमान में किराए पर चल रहे सामान</div>
          </div>

          <div className="stat-card red-glow">
            <div className="stat-header">
              <span className="stat-title">कुल बकाया किराया वसूली</span>
              <div className="stat-icon-wrap red">
                <Wallet size={20} />
              </div>
            </div>
            <div className="stat-value text-red">{formatCurrency(soundTotalDues)}</div>
            <div className="stat-sub">सभी सक्रिय ग्राहकों से कुल वसूली बकाया</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickStats;
