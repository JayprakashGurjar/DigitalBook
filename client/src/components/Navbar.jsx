import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Volume2,
  Users,
  Lock,
  Unlock,
  Download,
  Share2,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import AdminPinModal from './AdminPinModal';
import BackupRestoreModal from './BackupRestoreModal';
import { generateEventWhatsAppSummary } from '../utils/formatters';

const Navbar = () => {
  const {
    isAdminUnlocked,
    lockAdmin,
    activeTab,
    setActiveTab,
    currentEvent,
    chandaList,
    expenseList,
    custodyList,
  } = useApp();

  const [showPinModal, setShowPinModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Handle Share WhatsApp
  const handleShareWhatsApp = () => {
    if (!currentEvent) return;
    const summaryText = generateEventWhatsAppSummary(
      currentEvent,
      chandaList,
      expenseList,
      custodyList
    );
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          {/* Top Brand Banner */}
          <div className="brand-section">
            <div className="logo-badge">
              <span className="om-symbol">🚩</span>
            </div>
            <div className="brand-text">
              <h1 className="app-title">नव गणेश एवं दुर्गा उत्सव समिति, गौला</h1>
              <p className="app-subtitle">
                पारदर्शी डिजिटल हिसाब-किताब एवं साउंड सिस्टम रजिस्टर
              </p>
            </div>

            {/* Admin Security Badge */}
            <div className="admin-status-wrap">
              {isAdminUnlocked ? (
                <button
                  className="btn-status unlocked"
                  onClick={lockAdmin}
                  title="एडमिन मोड अनलॉक है - लॉक करने के लिए क्लिक करें"
                >
                  <Unlock size={16} />
                  <span>एडमिन एक्टिव</span>
                </button>
              ) : (
                <button
                  className="btn-status locked"
                  onClick={() => setShowPinModal(true)}
                  title="केवल देखने की अनुमति है - जोड़ने हेतु PIN दर्ज करें"
                >
                  <Lock size={16} />
                  <span>केवल देखें</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Module Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'ledger' ? 'active' : ''}`}
              onClick={() => setActiveTab('ledger')}
            >
              <BookOpen size={18} />
              <span>आय-व्यय रजिस्टर</span>
            </button>

            <button
              className={`nav-tab ${activeTab === 'sound' ? 'active' : ''}`}
              onClick={() => setActiveTab('sound')}
            >
              <Volume2 size={18} />
              <span>साउंड सिस्टम किराया</span>
            </button>

            <button
              className={`nav-tab ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <Users size={18} />
              <span>समिति सदस्य</span>
            </button>

            {/* Actions Menu */}
            <div className="header-actions">
              <button
                className="btn-icon"
                onClick={handleShareWhatsApp}
                title="व्हाट्सएप ग्रुप पर शेयर करें"
              >
                <Share2 size={18} className="text-green" />
                <span className="action-label">WhatsApp</span>
              </button>

              <button
                className="btn-icon"
                onClick={() => setShowBackupModal(true)}
                title="डेटा बैकअप एवं रीस्टोर"
              >
                <Download size={18} />
                <span className="action-label">बैकअप</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <AdminPinModal onClose={() => setShowPinModal(false)} />
      )}

      {/* Backup & Restore Modal */}
      {showBackupModal && (
        <BackupRestoreModal onClose={() => setShowBackupModal(false)} />
      )}
    </>
  );
};

export default Navbar;
