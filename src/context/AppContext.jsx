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
} from '../utils/defaultData';

const AppContext = createContext();

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

  // Members
  const [members, setMembers] = useLocalStorage('samiti_members', INITIAL_MEMBERS);

  // Active View Tab: 'ledger' | 'sound' | 'members'
  const [activeTab, setActiveTab] = useState('ledger');

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
    return { success: true, message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' };
  };

  // Event Handlers
  const addEvent = (newEvent) => {
    const eventObj = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      status: newEvent.status || 'active',
    };
    setEvents((prev) => [eventObj, ...prev]);
    setSelectedEventId(eventObj.id);
  };

  const updateEvent = (id, updatedFields) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)));
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setChandaList((prev) => prev.filter((c) => c.eventId !== id));
    setExpenseList((prev) => prev.filter((ex) => ex.eventId !== id));
    setCustodyList((prev) => prev.filter((cu) => cu.eventId !== id));
    if (selectedEventId === id) {
      const remaining = events.filter((e) => e.id !== id);
      setSelectedEventId(remaining[0]?.id || '');
    }
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
    setChandaList((prev) => [chandaObj, ...prev]);
  };

  const updateChanda = (id, updatedFields) => {
    setChandaList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields, amount: Number(updatedFields.amount || c.amount) } : c))
    );
  };

  const deleteChanda = (id) => {
    setChandaList((prev) => prev.filter((c) => c.id !== id));
  };

  // Expense Handlers
  const addExpense = (newExpense) => {
    const expObj = {
      ...newExpense,
      id: `e-${Date.now()}`,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      amount: Number(newExpense.amount) || 0,
    };
    setExpenseList((prev) => [expObj, ...prev]);
  };

  const updateExpense = (id, updatedFields) => {
    setExpenseList((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, ...updatedFields, amount: Number(updatedFields.amount || ex.amount) } : ex))
    );
  };

  const deleteExpense = (id) => {
    setExpenseList((prev) => prev.filter((ex) => ex.id !== id));
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
    setCustodyList((prev) => [custObj, ...prev]);
  };

  const updateCustody = (id, updatedFields) => {
    setCustodyList((prev) => prev.map((cu) => (cu.id === id ? { ...cu, ...updatedFields } : cu)));
  };

  const deleteCustody = (id) => {
    setCustodyList((prev) => prev.filter((cu) => cu.id !== id));
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
    setSoundRentals((prev) => [rentalObj, ...prev]);
  };

  const updateRental = (id, updatedFields) => {
    setSoundRentals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
    );
  };

  const deleteRental = (id) => {
    setSoundRentals((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleRentalStatus = (id) => {
    setSoundRentals((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'active' ? 'returned' : 'active' }
          : r
      )
    );
  };

  // Sound Equipment Inventory Handlers
  const addEquipment = (newItem) => {
    const eqObj = { ...newItem, id: `eq-${Date.now()}` };
    setSoundInventory((prev) => [...prev, eqObj]);
  };

  const updateEquipment = (id, updatedFields) => {
    setSoundInventory((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, ...updatedFields } : eq))
    );
  };

  const deleteEquipment = (id) => {
    setSoundInventory((prev) => prev.filter((eq) => eq.id !== id));
  };

  // Members Handlers
  const addMember = (newMember) => {
    const memObj = { ...newMember, id: `m-${Date.now()}` };
    setMembers((prev) => [...prev, memObj]);
  };

  const updateMember = (id, updatedFields) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m)));
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
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
      if (importedObj.members) setMembers(importedObj.members);
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
    setMembers(INITIAL_MEMBERS);
    setAdminPin(INITIAL_PIN);
    setIsAdminUnlocked(false);
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
