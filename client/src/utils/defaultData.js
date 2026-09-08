// Default initial data for Village Samiti Register

export const INITIAL_PIN = "1234";

export const INITIAL_MEMBERS = [
  { id: "m1", name: "रमेश चंद्र शर्मा", phone: "9876543210" },
  { id: "m2", name: "दिनेश कुमार वर्मा", phone: "9876543211" },
  { id: "m3", name: "रामप्रसाद पटेल", phone: "9876543212" },
  { id: "m4", name: "सुरेश चंद यादव", phone: "9876543213" },
  { id: "m5", name: "अनिल सिंह राजपूत", phone: "9876543214" },
  { id: "m6", name: "विक्रम गुर्जर", phone: "9876543215" },
];

export const INITIAL_EVENTS = [
  {
    id: "evt-2026-ganesh",
    name: "गणेशोत्सव 2026",
    startDate: "2026-09-01",
    endDate: "2026-09-11",
    status: "active", // active | completed
    description: "10 दिवसीय भव्य गणेशोत्सव एवं महाभंडारा",
  },
  {
    id: "evt-2026-ramnavami",
    name: "श्री रामनवमी उत्सव 2026",
    startDate: "2026-04-15",
    endDate: "2026-04-17",
    status: "completed",
    description: "शोभायात्रा एवं भव्य प्रसादम वितरण",
  },
];

export const INITIAL_CHANDA = [
  // Ganesh Utsav 2026
  {
    id: "c1",
    eventId: "evt-2026-ganesh",
    donorName: "रमेश चंद्र शर्मा",
    type: "member", // member | village
    amount: 1100,
    paymentMode: "UPI",
    phone: "9876543210",
    date: "2026-09-01",
    receiptNo: "REC-101",
    note: "वार्षिक समिति अंशदान",
  },
  {
    id: "c2",
    eventId: "evt-2026-ganesh",
    donorName: "दिनेश कुमार वर्मा",
    type: "member",
    amount: 1100,
    paymentMode: "Cash",
    phone: "9876543211",
    date: "2026-09-01",
    receiptNo: "REC-102",
    note: "वार्षिक समिति अंशदान",
  },
  {
    id: "c3",
    eventId: "evt-2026-ganesh",
    donorName: "रामप्रसाद पटेल",
    type: "member",
    amount: 1100,
    paymentMode: "UPI",
    phone: "9876543212",
    date: "2026-09-01",
    receiptNo: "REC-103",
    note: "वार्षिक समिति अंशदान",
  },
  {
    id: "c4",
    eventId: "evt-2026-ganesh",
    donorName: "श्री मदनलाल जी सोनी",
    type: "village",
    amount: 2100,
    paymentMode: "Cash",
    phone: "9425001122",
    date: "2026-09-02",
    receiptNo: "REC-104",
    note: "महाआरती एवं प्रसादम हेतु स्वेच्छा दान",
  },
  {
    id: "c5",
    eventId: "evt-2026-ganesh",
    donorName: "पंडित हरिओम शास्त्री",
    type: "village",
    amount: 501,
    paymentMode: "Cash",
    phone: "9988776655",
    date: "2026-09-02",
    receiptNo: "REC-105",
    note: "स्वेच्छा दान",
  },
  {
    id: "c6",
    eventId: "evt-2026-ganesh",
    donorName: "भागीरथ चौधरी",
    type: "village",
    amount: 1001,
    paymentMode: "UPI",
    phone: "9123456789",
    date: "2026-09-03",
    receiptNo: "REC-106",
    note: "सजावट हेतु चंदा",
  },

  // Previous Event: Ram Navami 2026
  {
    id: "c10",
    eventId: "evt-2026-ramnavami",
    donorName: "रामप्रसाद पटेल",
    type: "member",
    amount: 1000,
    paymentMode: "Cash",
    phone: "9876543212",
    date: "2026-04-15",
    receiptNo: "RN-01",
    note: "",
  },
  {
    id: "c11",
    eventId: "evt-2026-ramnavami",
    donorName: "कैलाश यादव",
    type: "village",
    amount: 5000,
    paymentMode: "UPI",
    phone: "9770001122",
    date: "2026-04-15",
    receiptNo: "RN-02",
    note: "मुख्य प्रायोजक - शोभायात्रा प्रसादम",
  },
];

export const INITIAL_EXPENSES = [
  // Ganesh Utsav 2026
  {
    id: "e1",
    eventId: "evt-2026-ganesh",
    category: "Pooja/Samagri",
    title: "गणेश जी प्रतिमा एवं पूजन सामग्री",
    amount: 3500,
    paidTo: "मूर्तिकार श्यामलाल जी",
    date: "2026-09-01",
    note: "प्रतिमा 5 फीट मिट्टी की",
  },
  {
    id: "e2",
    eventId: "evt-2026-ganesh",
    category: "Tent/Decor",
    title: "पंडाल एवं टेंट व्यवस्था",
    amount: 2200,
    paidTo: "जय माता दी टेंट हाउस",
    date: "2026-09-02",
    note: "10 दिन का किराया",
  },
  {
    id: "e3",
    eventId: "evt-2026-ganesh",
    category: "Food/Bhandara",
    title: "दैनिक महाप्रसाद सामग्री (मोदक/फल)",
    amount: 1200,
    paidTo: "किराना स्टोर मदन जी",
    date: "2026-09-03",
    note: "",
  },

  // Ramnavami Previous Event Expenses
  {
    id: "e10",
    eventId: "evt-2026-ramnavami",
    category: "Food/Bhandara",
    title: "महाभंडारा एवं पूड़ी-सब्जी सामग्री",
    amount: 4200,
    paidTo: "गुप्ता किराना भण्डार",
    date: "2026-04-16",
    note: "",
  },
];

export const INITIAL_CUSTODY = [
  {
    id: "cust-1",
    eventId: "evt-2026-ramnavami",
    holderName: "रामप्रसाद पटेल",
    type: "surplus_custody", // surplus_custody (बची राशि जमा) | deficit_reimbursement (अतिरिक्त खर्च वापसी)
    amount: 1800,
    status: "held", // held (पास में सुरक्षित जमा) | carried_forward (अगले कार्यक्रम में उपयोग) | returned
    date: "2026-04-18",
    note: "रामनावमी उत्सव के बचे हुए ₹1,800 रामप्रसाद जी के पास सुरक्षित जमा हैं जो गणेशोत्सव में इस्तेमाल होंगे।",
  },
  {
    id: "cust-2",
    eventId: "evt-2026-ganesh",
    holderName: "सुरेश चंद यादव",
    type: "deficit_reimbursement",
    amount: 500,
    status: "held",
    date: "2026-09-03",
    note: "पंडाल लाइट के लिए अपनी जेब से दिए थे, अगले चंदे से वापस करने हैं।",
  },
];

export const INITIAL_SOUND_EQUIPMENT = [
  { id: "eq1", name: "टॉप स्पीकर (JBL Type 15 Inch)", quantity: 4, unit: "नग", condition: "उत्कृष्ट" },
  { id: "eq2", name: "डबल बेस वूफर (18 Inch)", quantity: 2, unit: "नग", condition: "उत्कृष्ट" },
  { id: "eq3", name: "पावर एम्पलीफायर (4000 Watt)", quantity: 2, unit: "नग", condition: "उत्कृष्ट" },
  { id: "eq4", name: "डिजिटल/एनालॉग मिक्सर (12 Channel)", quantity: 1, unit: "नग", condition: "उत्कृष्ट" },
  { id: "eq5", name: "कॉर्डलेस एवं वायर्स माइक", quantity: 4, unit: "नग", condition: "उत्कृष्ट" },
  { id: "eq6", name: "केबल एवं हैवी वायर बॉक्स", quantity: 1, unit: "सेट", condition: "उत्कृष्ट" },
  { id: "eq7", name: "LED पार लाइट्स (कलरफुल)", quantity: 6, unit: "नग", condition: "उत्कृष्ट" },
];

export const INITIAL_SOUND_RENTALS = [
  {
    id: "rent-101",
    renterName: "विक्रम सिंह पंवार",
    phone: "9826112233",
    villageAddress: "ग्राम पिपल्या (शादी कार्यक्रम)",
    itemsRented: "2 टॉप स्पीकर, 1 एम्पलीफायर, 2 माइक, केबल सेट",
    issueDate: "2026-09-05",
    returnDate: "2026-09-07",
    totalRent: 3500,
    advancePaid: 1500,
    status: "active", // active (किराए पर है) | returned (वापस आ गया)
    note: "अग्रिम ₹1500 प्राप्त हुए। बकाया ₹2000 वापसी पर देय।",
  },
  {
    id: "rent-100",
    renterName: "महेश कुमार धाकड़",
    phone: "9977334455",
    villageAddress: "वार्ड 3, निज निवास (सुंदरकांड)",
    itemsRented: "2 टॉप स्पीकर, 1 मिक्सर, 2 माइक",
    issueDate: "2026-08-28",
    returnDate: "2026-08-29",
    totalRent: 1500,
    advancePaid: 1500,
    status: "returned",
    note: "पूरा किराया प्राप्त हो चुका है एवं सामान सुरक्षित वापस आ गया।",
  },
];

export const INITIAL_SOUND_FUND_TXNS = [
  {
    id: "sft-1",
    type: "event_transfer", // event_transfer | member_custody | custody_returned | maintenance_expense
    title: "गणेशोत्सव 2026 में योगदान",
    targetName: "गणेशोत्सव 2026",
    amount: 1500,
    date: "2026-09-02",
    status: "completed",
    note: "साउंड किराए की कमाई से ₹1,500 गणेशोत्सव पंडाल व्यवस्था हेतु दिए गए।",
  },
  {
    id: "sft-2",
    type: "member_custody",
    title: "रामप्रसाद जी के पास अमानत जमा",
    targetName: "रामप्रसाद पटेल",
    amount: 1000,
    date: "2026-09-04",
    status: "held", // held (पास में जमा) | returned (वापस प्राप्त)
    note: "इमरजेंसी जरूरत हेतु साउंड फंड से ₹1,000 रामप्रसाद जी को अमानत दिए गए।",
  },
  {
    id: "sft-3",
    type: "maintenance_expense",
    title: "स्पीकर हैवी केबल एवं जैक मरम्मत",
    targetName: "इलेक्ट्रॉनिक रिपेयर शॉप",
    amount: 350,
    date: "2026-09-01",
    status: "completed",
    note: "2 नए स्पीकर केबल व पिन खरीदें।",
  },
];
