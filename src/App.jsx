import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import QuickStats from './components/QuickStats';
import EventHeader from './components/EventLedger/EventHeader';
import LedgerTable from './components/EventLedger/LedgerTable';
import SoundSystemMain from './components/SoundSystem/SoundSystemMain';
import MemberList from './components/Members/MemberList';
import './index.css';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <main className="main-content-container">
      <QuickStats />

      {activeTab === 'ledger' && (
        <>
          <EventHeader />
          <LedgerTable />
        </>
      )}

      {activeTab === 'sound' && <SoundSystemMain />}

      {activeTab === 'members' && <MemberList />}
    </main>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <Navbar />
        <MainContent />
        <footer className="app-footer">
          <p>
            🚩 नव गणेश एवं दुर्गा उत्सव समिति, गौला • पारदर्शी डिजिटल रजिस्टर एवं किराया प्रबंधक © 2026
          </p>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
