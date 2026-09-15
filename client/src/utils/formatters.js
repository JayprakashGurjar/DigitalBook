// Format currency in INR (₹)
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// Format date into Indian readable string
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

// Category label mappings in Hindi
export const EXPENSE_CATEGORIES = {
  'Pooja/Samagri': '🚩 पूजा एवं सामग्री',
  'Tent/Decor': '⛺ टेंट एवं पंडाल सजावट',
  'Food/Bhandara': '🍲 महाप्रसाद एवं भंडारा',
  'Sound/Mic': '🔊 साउंड सिस्टम / माइक',
  'Light/Power': '💡 लाइट एवं बिजली',
  'Misc': '📦 अन्य विविध खर्च',
};

// Generate WhatsApp summary text for an Event
export const generateEventWhatsAppSummary = (event, chandaList, expenseList, custodyList) => {
  const eventChanda = chandaList.filter((c) => c.eventId === event.id);
  const eventExpenses = expenseList.filter((e) => e.eventId === event.id);
  const eventCustody = custodyList.filter((cu) => cu.eventId === event.id);

  const memberTotal = eventChanda
    .filter((c) => c.type === 'member')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const villageTotal = eventChanda
    .filter((c) => c.type === 'village')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const grandTotalChanda = memberTotal + villageTotal;

  const totalExpense = eventExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const netBalance = grandTotalChanda - totalExpense;

  let text = `🚩 *नव गणेश एवं दुर्गा उत्सव समिति, गौला* 🚩\n`;
  text += `📋 *आय-व्यय विवरण: ${event.name}*\n`;
  text += `🗓️ तिथि: ${formatDate(event.startDate)} से ${formatDate(event.endDate)}\n`;
  text += `------------------------------------\n`;
  text += `💰 *कुल प्राप्त चंदा:* ${formatCurrency(grandTotalChanda)}\n`;
  text += `   • समिति सदस्य चंदा: ${formatCurrency(memberTotal)}\n`;
  text += `   • ग्रामीण जन चंदा: ${formatCurrency(villageTotal)}\n\n`;
  text += `💸 *कुल खर्च:* ${formatCurrency(totalExpense)}\n`;
  text += `------------------------------------\n`;

  if (netBalance >= 0) {
    text += `✅ *बची हुई शेष राशि (Surplus):* ${formatCurrency(netBalance)}\n`;
  } else {
    text += `⚠️ *अतिरिक्त खर्च (Deficit):* ${formatCurrency(Math.abs(netBalance))}\n`;
  }

  // Compute Member Cash Custody Breakdown
  const memberCashMap = {};

  eventCustody.forEach((cu) => {
    if (!cu.holderName) return;
    const name = cu.holderName.trim();
    if (!memberCashMap[name]) memberCashMap[name] = { assigned: 0, spent: 0 };
    if (cu.type === 'surplus_custody') memberCashMap[name].assigned += Number(cu.amount || 0);
    else memberCashMap[name].assigned -= Number(cu.amount || 0);
  });

  eventChanda.forEach((c) => {
    if (c.collectedByMemberName && c.paymentStatus !== 'pledged') {
      const name = c.collectedByMemberName.trim();
      if (!memberCashMap[name]) memberCashMap[name] = { assigned: 0, spent: 0 };
      memberCashMap[name].assigned += Number(c.amount || 0);
    }
  });

  eventExpenses.forEach((e) => {
    if (e.paidByMemberName) {
      const name = e.paidByMemberName.trim();
      if (!memberCashMap[name]) memberCashMap[name] = { assigned: 0, spent: 0 };
      memberCashMap[name].spent += Number(e.amount || 0);
    }
  });

  const memberCashEntries = Object.entries(memberCashMap).map(([name, val]) => ({
    name,
    assigned: val.assigned,
    spent: val.spent,
    remaining: val.assigned - val.spent,
  }));

  if (memberCashEntries.length > 0) {
    text += `\n💼 *सदस्यों के पास जमा एवं शेष कैश:*\n`;
    memberCashEntries.forEach((m) => {
      text += `• *${m.name}:* शेष ${formatCurrency(m.remaining)} (जमा: ${formatCurrency(m.assigned)}, खर्च: ${formatCurrency(m.spent)})\n`;
    });
  }

  text += `\nपारदर्शी डिजिटल रजिस्टर देखने हेतु धन्यवाद! 🙏`;
  return text;
};

// Generate WhatsApp summary text for Sound System Rentals
export const generateSoundRentalWhatsAppSummary = (rental) => {
  const due = Number(rental.totalRent) - Number(rental.advancePaid);
  let text = `🔊 *ग्राम समिति साउंड सिस्टम किराया रसीद* 🔊\n`;
  text += `------------------------------------\n`;
  text += `👤 *ग्राहक नाम:* ${rental.renterName}\n`;
  text += `📞 *मोबाइल:* ${rental.phone}\n`;
  text += `📍 *स्थान/पता:* ${rental.villageAddress}\n`;
  text += `📦 *सामान का विवरण:* ${rental.itemsRented}\n`;
  text += `🗓️ *दिनांक:* ${formatDate(rental.issueDate)} से ${formatDate(rental.returnDate)}\n`;
  text += `------------------------------------\n`;
  text += `💵 *कुल किराया:* ${formatCurrency(rental.totalRent)}\n`;
  text += `✅ *अग्रिम जमा (Advance):* ${formatCurrency(rental.advancePaid)}\n`;
  text += `🔴 *बकाया राशि (Pending Due):* ${formatCurrency(due)}\n`;
  text += `📌 *स्थिति:* ${rental.status === 'returned' ? '✅ सामान प्राप्त हुआ (Returned)' : '⏳ किराए पर जारी (Active)'}\n`;
  text += `------------------------------------\n`;
  text += `सम्पर्क हेतु समिति सदस्यों से मिले। धन्यवाद! 🙏`;
  return text;
};
