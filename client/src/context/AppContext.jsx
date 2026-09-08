import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PIN,
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_CHANDA,
  INITIAL_EXPENSES,
  INITIAL_CUSTODY,
  INITIAL_SOUND_EQUIPMENT,
  INITIAL_SOUND_RENTALS,
  INITIAL_SOUND_FUND_TXNS,
} from '../utils/defaultData';

const AppContext = createContext();
const API_BASE_URL = 'http://localhost:5000/api';

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Helper hook for LocalStorage with default fallback
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  }, [key, value]);

  return [value, setValue];
}

export const AppProvider = ({ children }) => {
  // Admin PIN & Lock State
  const [adminPin, setAdminPin] = useLocalStorage('samiti_admin_pin', INITIAL_PIN);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Core Samiti Data
  const [events, setEvents] = useLocalStorage('samiti_events', INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useLocalStorage(
    'samiti_selected_event',
    INITIAL_EVENTS[0]?.id || ''
  );
  const [chandaList, setChandaList] = useLocalStorage('samiti_chanda', INITIAL_CHANDA);
  const [expenseList, setExpenseList] = useLocalStorage('samiti_expenses', INITIAL_EXPENSES);
  const [custodyList, setCustodyList] = useLocalStorage('samiti_custody', INITIAL_CUSTODY);

  // Sound System Data
  const [soundInventory, setSoundInventory] = useLocalStorage('samiti_sound_inventory', INITIAL_SOUND_EQUIPMENT);
  const [soundRentals, setSoundRentals] = useLocalStorage('samiti_sound_rentals', INITIAL_SOUND_RENTALS);
  const [soundFundTxns, setSoundFundTxns] = useLocalStorage('samiti_sound_fund_txns', INITIAL_SOUND_FUND_TXNS);

  // Members
  const [members, setMembers] = useLocalStorage('samiti_members', INITIAL_MEMBERS);

  // Active View Tab: 'ledger' | 'sound' | 'members'
  const [activeTab, setActiveTab] = useState('ledger');

  // Fetch initial data from Backend Server if available
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/data`);
        if (res.ok) {
          const data = await res.json();
          if (data.events) setEvents(data.events);
          if (data.chandaList) setChandaList(data.chandaList);
          if (data.expenseList) setExpenseList(data.expenseList);
          if (data.custodyList) setCustodyList(data.custodyList);
          if (data.soundInventory) setSoundInventory(data.soundInventory);
          if (data.soundRentals) setSoundRentals(data.soundRentals);
          if (data.soundFundTxns) setSoundFundTxns(data.soundFundTxns);
          if (data.members) setMembers(data.members);
          if (data.adminPin) setAdminPin(data.adminPin);
        }
      } catch (err) {
        // Backend server offline, fallback to LocalStorage seamlessly
      }
    };
    fetchBackendData();
  }, []);

  // Sync to Backend Server whenever state updates
  const syncToBackend = async (overrideState = {}) => {
    try {
      const payload = {
        adminPin,
        events,
        chandaList,
        expenseList,
        custodyList,
        soundInventory,
        soundRentals,
        soundFundTxns,
        members,
        ...overrideState,
      };
      await fetch(`${API_BASE_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Ignore if offline
    }
  };

  // Verify PIN & Unlock
  const unlockAdmin = (inputPin) => {
    if (inputPin === adminPin) {
      setIsAdminUnlocked(true);
      return { success: true };
    }
    return { success: false, message: 'गलत पासवर्ड (Incorrect PIN)' };
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
  };

  const changeAdminPin = (oldPin, newPin) => {
    if (oldPin !== adminPin) {
      return { success: false, message: 'पुराना पासवर्ड गलत है!' };
    }
    if (!newPin || newPin.length < 4) {
      return { success: false, message: 'नया पासवर्ड कम से कम 4 अंकों का होना चाहिए!' };
    }
    setAdminPin(newPin);
    syncToBackend({ adminPin: newPin });
    return { success: true, message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' };
  };

  // Event Handlers
  const addEvent = (newEvent) => {
    const eventObj = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      status: newEvent.status || 'active',
    };
    const updated = [eventObj, ...events];
    setEvents(updated);
    setSelectedEventId(eventObj.id);
    syncToBackend({ events: updated });
  };

  const updateEvent = (id, updatedFields) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
    setEvents(updated);
    syncToBackend({ events: updated });
  };

  const deleteEvent = (id) => {
    const updatedEvts = events.filter((e) => e.id !== id);
    const updatedChanda = chandaList.filter((c) => c.eventId !== id);
    const updatedExpenses = expenseList.filter((ex) => ex.eventId !== id);
    const updatedCustody = custodyList.filter((cu) => cu.eventId !== id);
    setEvents(updatedEvts);
    setChandaList(updatedChanda);
    setExpenseList(updatedExpenses);
    setCustodyList(updatedCustody);
    if (selectedEventId === id) {
      setSelectedEventId(updatedEvts[0]?.id || '');
    }
    syncToBackend({
      events: updatedEvts,
      chandaList: updatedChanda,
      expenseList: updatedExpenses,
      custodyList: updatedCustody,
    });
  };

  // Chanda Handlers
  const addChanda = (newChanda) => {
    const receiptNo = `REC-${Math.floor(100 + Math.random() * 900)}`;
    const chandaObj = {
      ...newChanda,
      id: `c-${Date.now()}`,
      receiptNo: newChanda.receiptNo || receiptNo,
      date: newChanda.date || new Date().toISOString().split('T')[0],
      amount: Number(newChanda.amount) || 0,
    };
    const updated = [chandaObj, ...chandaList];
    setChandaList(updated);
    syncToBackend({ chandaList: updated });
  };

  const updateChanda = (id, updatedFields) => {
    const updated = chandaList.map((c) =>
      c.id === id ? { ...c, ...updatedFields, amount: Number(updatedFields.amount || c.amount) } : c
    );
    setChandaList(updated);
    syncToBackend({ chandaList: updated });
  };

  const deleteChanda = (id) => {
    const updated = chandaList.filter((c) => c.id !== id);
    setChandaList(updated);
    syncToBackend({ chandaList: updated });
  };

  // Expense Handlers
  const addExpense = (newExpense) => {
    const expObj = {
      ...newExpense,
      id: `e-${Date.now()}`,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      amount: Number(newExpense.amount) || 0,
    };
    const updated = [expObj, ...expenseList];
    setExpenseList(updated);
    syncToBackend({ expenseList: updated });
  };

  const updateExpense = (id, updatedFields) => {
    const updated = expenseList.map((ex) =>
      ex.id === id ? { ...ex, ...updatedFields, amount: Number(updatedFields.amount || ex.amount) } : ex
    );
    setExpenseList(updated);
    syncToBackend({ expenseList: updated });
  };

  const deleteExpense = (id) => {
    const updated = expenseList.filter((ex) => ex.id !== id);
    setExpenseList(updated);
    syncToBackend({ expenseList: updated });
  };

  // Custody Handlers
  const addCustody = (newCustody) => {
    const custObj = {
      ...newCustody,
      id: `cust-${Date.now()}`,
      date: newCustody.date || new Date().toISOString().split('T')[0],
      amount: Number(newCustody.amount) || 0,
      status: newCustody.status || 'held',
    };
    const updated = [custObj, ...custodyList];
    setCustodyList(updated);
    syncToBackend({ custodyList: updated });
  };

  const updateCustody = (id, updatedFields) => {
    const updated = custodyList.map((cu) => (cu.id === id ? { ...cu, ...updatedFields } : cu));
    setCustodyList(updated);
    syncToBackend({ custodyList: updated });
  };

  const deleteCustody = (id) => {
    const updated = custodyList.filter((cu) => cu.id !== id);
    setCustodyList(updated);
    syncToBackend({ custodyList: updated });
  };

  // Sound System Rental Handlers
  const addRental = (newRental) => {
    const rentalObj = {
      ...newRental,
      id: `rent-${Date.now()}`,
      issueDate: newRental.issueDate || new Date().toISOString().split('T')[0],
      totalRent: Number(newRental.totalRent) || 0,
      advancePaid: Number(newRental.advancePaid) || 0,
      status: newRental.status || 'active',
    };
    const updated = [rentalObj, ...soundRentals];
    setSoundRentals(updated);
    syncToBackend({ soundRentals: updated });
  };

  const updateRental = (id, updatedFields) => {
    const updated = soundRentals.map((r) => (r.id === id ? { ...r, ...updatedFields } : r));
    setSoundRentals(updated);
    syncToBackend({ soundRentals: updated });
  };

  const deleteRental = (id) => {
    const updated = soundRentals.filter((r) => r.id !== id);
    setSoundRentals(updated);
    syncToBackend({ soundRentals: updated });
  };

  const toggleRentalStatus = (id) => {
    const updated = soundRentals.map((r) =>
      r.id === id ? { ...r, status: r.status === 'active' ? 'returned' : 'active' } : r
    );
    setSoundRentals(updated);
    syncToBackend({ soundRentals: updated });
  };

  // Sound Equipment Inventory Handlers
  const addEquipment = (newItem) => {
    const eqObj = { ...newItem, id: `eq-${Date.now()}` };
    const updated = [...soundInventory, eqObj];
    setSoundInventory(updated);
    syncToBackend({ soundInventory: updated });
  };

  const updateEquipment = (id, updatedFields) => {
    const updated = soundInventory.map((eq) => (eq.id === id ? { ...eq, ...updatedFields } : eq));
    setSoundInventory(updated);
    syncToBackend({ soundInventory: updated });
  };

  const deleteEquipment = (id) => {
    const updated = soundInventory.filter((eq) => eq.id !== id);
    setSoundInventory(updated);
    syncToBackend({ soundInventory: updated });
  };

  // Sound Fund Transactions Handlers
  const addSoundFundTxn = (newTxn) => {
    const txnObj = {
      ...newTxn,
      id: `sft-${Date.now()}`,
      date: newTxn.date || new Date().toISOString().split('T')[0],
      amount: Number(newTxn.amount) || 0,
      status: newTxn.status || (newTxn.type === 'member_custody' ? 'held' : 'completed'),
    };
    const updated = [txnObj, ...soundFundTxns];
    setSoundFundTxns(updated);
    syncToBackend({ soundFundTxns: updated });
  };

  const updateSoundFundTxn = (id, updatedFields) => {
    const updated = soundFundTxns.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setSoundFundTxns(updated);
    syncToBackend({ soundFundTxns: updated });
  };

  const deleteSoundFundTxn = (id) => {
    const updated = soundFundTxns.filter((t) => t.id !== id);
    setSoundFundTxns(updated);
    syncToBackend({ soundFundTxns: updated });
  };

  const toggleSoundFundStatus = (id) => {
    const updated = soundFundTxns.map((t) =>
      t.id === id
        ? { ...t, status: t.status === 'held' ? 'returned' : 'held' }
        : t
    );
    setSoundFundTxns(updated);
    syncToBackend({ soundFundTxns: updated });
  };

  // Members Handlers
  const addMember = (newMember) => {
    const memObj = { ...newMember, id: `m-${Date.now()}` };
    const updated = [...members, memObj];
    setMembers(updated);
    syncToBackend({ members: updated });
  };

  const updateMember = (id, updatedFields) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...updatedFields } : m));
    setMembers(updated);
    syncToBackend({ members: updated });
  };

  const deleteMember = (id) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    syncToBackend({ members: updated });
  };

  // Backup & Restore
  const exportDataJSON = () => {
    const fullData = {
      events,
      chandaList,
      expenseList,
      custodyList,
      soundInventory,
      soundRentals,
      soundFundTxns,
      members,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `samiti_digital_register_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJSON = (importedObj) => {
    try {
      if (importedObj.events) setEvents(importedObj.events);
      if (importedObj.chandaList) setChandaList(importedObj.chandaList);
      if (importedObj.expenseList) setExpenseList(importedObj.expenseList);
      if (importedObj.custodyList) setCustodyList(importedObj.custodyList);
      if (importedObj.soundInventory) setSoundInventory(importedObj.soundInventory);
      if (importedObj.soundRentals) setSoundRentals(importedObj.soundRentals);
      if (importedObj.soundFundTxns) setSoundFundTxns(importedObj.soundFundTxns);
      if (importedObj.members) setMembers(importedObj.members);
      syncToBackend(importedObj);
      return { success: true, message: 'डेटा सफलतापूर्वक बैकअप से लोड हो गया है!' };
    } catch (e) {
      return { success: false, message: 'अमान्य बैकअप फाइल!' };
    }
  };

  const resetAllData = () => {
    setEvents(INITIAL_EVENTS);
    setSelectedEventId(INITIAL_EVENTS[0]?.id || '');
    setChandaList(INITIAL_CHANDA);
    setExpenseList(INITIAL_EXPENSES);
    setCustodyList(INITIAL_CUSTODY);
    setSoundInventory(INITIAL_SOUND_EQUIPMENT);
    setSoundRentals(INITIAL_SOUND_RENTALS);
    setSoundFundTxns(INITIAL_SOUND_FUND_TXNS);
    setMembers(INITIAL_MEMBERS);
    setAdminPin(INITIAL_PIN);
    setIsAdminUnlocked(false);
    syncToBackend({
      events: INITIAL_EVENTS,
      chandaList: INITIAL_CHANDA,
      expenseList: INITIAL_EXPENSES,
      custodyList: INITIAL_CUSTODY,
      soundInventory: INITIAL_SOUND_EQUIPMENT,
      soundRentals: INITIAL_SOUND_RENTALS,
      soundFundTxns: INITIAL_SOUND_FUND_TXNS,
      members: INITIAL_MEMBERS,
      adminPin: INITIAL_PIN,
    });
  };

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <AppContext.Provider
      value={{
        // Auth & Navigation
        isAdminUnlocked,
        unlockAdmin,
        lockAdmin,
        changeAdminPin,
        adminPin,
        activeTab,
        setActiveTab,

        // Events
        events,
        selectedEventId,
        setSelectedEventId,
        currentEvent,
        addEvent,
        updateEvent,
        deleteEvent,

        // Chanda
        chandaList,
        addChanda,
        updateChanda,
        deleteChanda,

        // Expenses
        expenseList,
        addExpense,
        updateExpense,
        deleteExpense,

        // Custody
        custodyList,
        addCustody,
        updateCustody,
        deleteCustody,

        // Sound System
        soundInventory,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        soundRentals,
        addRental,
        updateRental,
        deleteRental,
        toggleRentalStatus,

        // Sound Fund Txns
        soundFundTxns,
        addSoundFundTxn,
        updateSoundFundTxn,
        deleteSoundFundTxn,
        toggleSoundFundStatus,

        // Members
        members,
        addMember,
        updateMember,
        deleteMember,

        // Backup
        exportDataJSON,
        importDataJSON,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
