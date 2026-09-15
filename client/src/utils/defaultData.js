// Default initial data for Village Samiti Register (Ganesh Utsav 2026)

export const INITIAL_PIN = "000000";

export const INITIAL_MEMBERS = [
  { id: "m1", name: "मोहित गुर्जर", phone: "" },
  { id: "m2", name: "समर गुर्जर", phone: "" },
  { id: "m3", name: "आशीष गुर्जर", phone: "" },
  { id: "m4", name: "दीपक गुर्जर", phone: "" },
  { id: "m5", name: "सालक गुर्जर", phone: "" },
  { id: "m6", name: "अरुण गुर्जर", phone: "" },
  { id: "m7", name: "अजय पटेल", phone: "" },
  { id: "m8", name: "सुनील गुर्जर", phone: "" },
  { id: "m9", name: "अभिषेक गुर्जर", phone: "" },
  { id: "m10", name: "संजय गुर्जर", phone: "" },
  { id: "m11", name: "अंकित गुर्जर", phone: "" },
  { id: "m12", name: "राहुल गुर्जर", phone: "" },
  { id: "m13", name: "सदाशिव गुर्जर", phone: "" },
  { id: "m14", name: "लोकेश गुर्जर", phone: "" },
  { id: "m15", name: "सुनील पुवार", phone: "" },
  { id: "m16", name: "दीपक पुवार", phone: "" },
  { id: "m17", name: "आशाब कीर", phone: "" },
  { id: "m18", name: "गंगाप्रसाद बान्याजी", phone: "" },
  { id: "m19", name: "राजेश गुर्जर", phone: "" },
  { id: "m20", name: "ललित गुर्जर", phone: "" },
  { id: "m21", name: "भूपेंद्र गुर्जर", phone: "" },
  { id: "m22", name: "कन्हैया गुर्जर", phone: "" },
  { id: "m23", name: "रामविलास पटेल", phone: "" },
  { id: "m24", name: "कपिल गुर्जर", phone: "" },
  { id: "m25", name: "जयप्रकाश गुर्जर", phone: "" },
  { id: "m26", name: "नितिन गुर्जर", phone: "" },
  { id: "m27", name: "केशव कीर", phone: "" },
  { id: "m28", name: "सोहम पुवार", phone: "" }
];

export const INITIAL_EVENTS = [
  {
    id: "evt-ganesh-2026",
    name: "गणेशोत्सव 2026",
    startDate: "2026-09-11",
    endDate: "2026-09-21",
    description: "श्री गणेश उत्सव 2026 (सक्रिय कार्यक्रम)",
    status: "active"
  }
];

export const INITIAL_CHANDA = [
  { id: "c-m1", eventId: "evt-ganesh-2026", receiptNo: "REC-101", donorName: "मोहित गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-m2", eventId: "evt-ganesh-2026", receiptNo: "REC-102", donorName: "समर गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m3", eventId: "evt-ganesh-2026", receiptNo: "REC-103", donorName: "आशीष गुर्जर", type: "member", amount: 1500, paymentMode: "UPI", paymentStatus: "paid", collectedByMemberName: "कपिल गुर्जर", date: "2026-09-11", note: "कपिल फोन UPI जमा" },
  { id: "c-m4", eventId: "evt-ganesh-2026", receiptNo: "REC-104", donorName: "दीपक गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "400 बाकी (1100 जमा)" },
  { id: "c-m5", eventId: "evt-ganesh-2026", receiptNo: "REC-105", donorName: "सालक गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-m6", eventId: "evt-ganesh-2026", receiptNo: "REC-106", donorName: "अरुण गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-m7", eventId: "evt-ganesh-2026", receiptNo: "REC-107", donorName: "अजय पटेल", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "1000 बाकी (500 जमा)" },
  { id: "c-m8", eventId: "evt-ganesh-2026", receiptNo: "REC-108", donorName: "सुनील गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "300 जमा" },
  { id: "c-m9", eventId: "evt-ganesh-2026", receiptNo: "REC-109", donorName: "अभिषेक गुर्जर", type: "member", amount: 1500, paymentMode: "UPI", paymentStatus: "paid", collectedByMemberName: "कपिल गुर्जर", date: "2026-09-11", note: "कपिल UPI जमा" },
  { id: "c-m10", eventId: "evt-ganesh-2026", receiptNo: "REC-110", donorName: "संजय गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m11", eventId: "evt-ganesh-2026", receiptNo: "REC-111", donorName: "अंकित गुर्जर", type: "member", amount: 1500, paymentMode: "UPI", paymentStatus: "paid", collectedByMemberName: "कपिल गुर्जर", date: "2026-09-11", note: "कपिल UPI जमा" },
  { id: "c-m12", eventId: "evt-ganesh-2026", receiptNo: "REC-112", donorName: "राहुल गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m13", eventId: "evt-ganesh-2026", receiptNo: "REC-113", donorName: "सदाशिव गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m14", eventId: "evt-ganesh-2026", receiptNo: "REC-114", donorName: "लोकेश गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m15", eventId: "evt-ganesh-2026", receiptNo: "REC-115", donorName: "सुनील पुवार", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-m16", eventId: "evt-ganesh-2026", receiptNo: "REC-116", donorName: "दीपक पुवार", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m17", eventId: "evt-ganesh-2026", receiptNo: "REC-117", donorName: "आशाब कीर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m18", eventId: "evt-ganesh-2026", receiptNo: "REC-118", donorName: "गंगाप्रसाद बान्याजी", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m19", eventId: "evt-ganesh-2026", receiptNo: "REC-119", donorName: "राजेश गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m20", eventId: "evt-ganesh-2026", receiptNo: "REC-120", donorName: "ललित गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m21", eventId: "evt-ganesh-2026", receiptNo: "REC-121", donorName: "भूपेंद्र गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m22", eventId: "evt-ganesh-2026", receiptNo: "REC-122", donorName: "कन्हैया गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m23", eventId: "evt-ganesh-2026", receiptNo: "REC-123", donorName: "रामविलास पटेल", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-m24", eventId: "evt-ganesh-2026", receiptNo: "REC-124", donorName: "कपिल गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m25", eventId: "evt-ganesh-2026", receiptNo: "REC-125", donorName: "जयप्रकाश गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m26", eventId: "evt-ganesh-2026", receiptNo: "REC-126", donorName: "नितिन गुर्जर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m27", eventId: "evt-ganesh-2026", receiptNo: "REC-127", donorName: "केशव कीर", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-m28", eventId: "evt-ganesh-2026", receiptNo: "REC-128", donorName: "सोहम पुवार", type: "member", amount: 1500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },

  { id: "c-v1", eventId: "evt-ganesh-2026", receiptNo: "REC-201", donorName: "भुजराम ठाकुर", type: "village", amount: 200, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v2", eventId: "evt-ganesh-2026", receiptNo: "REC-202", donorName: "सुखराम ठाकुर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v3", eventId: "evt-ganesh-2026", receiptNo: "REC-203", donorName: "रोहित ठाकुर", type: "village", amount: 101, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v4", eventId: "evt-ganesh-2026", receiptNo: "REC-204", donorName: "जसमत ठाकुर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v5", eventId: "evt-ganesh-2026", receiptNo: "REC-205", donorName: "शैतान ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v6", eventId: "evt-ganesh-2026", receiptNo: "REC-206", donorName: "राजकुमार ठाकुर", type: "village", amount: 200, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v7", eventId: "evt-ganesh-2026", receiptNo: "REC-207", donorName: "विनेश ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v8", eventId: "evt-ganesh-2026", receiptNo: "REC-208", donorName: "आनंद चावड़ा", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v9", eventId: "evt-ganesh-2026", receiptNo: "REC-209", donorName: "प्रकाश ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v10", eventId: "evt-ganesh-2026", receiptNo: "REC-210", donorName: "शेदालाल गुर्जर", type: "village", amount: 200, paymentMode: "UPI", paymentStatus: "paid", collectedByMemberName: "कपिल गुर्जर", date: "2026-09-11", note: "कपिल phone pay जमा" },
  { id: "c-v11", eventId: "evt-ganesh-2026", receiptNo: "REC-211", donorName: "गोलू कीर", type: "village", amount: 200, paymentMode: "UPI", paymentStatus: "paid", collectedByMemberName: "कपिल गुर्जर", date: "2026-09-11", note: "कपिल phone pay जमा" },
  { id: "c-v12", eventId: "evt-ganesh-2026", receiptNo: "REC-212", donorName: "भागीरथ ठाकुर", type: "village", amount: 200, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v13", eventId: "evt-ganesh-2026", receiptNo: "REC-213", donorName: "सुरेश ठाकुर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v14", eventId: "evt-ganesh-2026", receiptNo: "REC-214", donorName: "आनंद ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v15", eventId: "evt-ganesh-2026", receiptNo: "REC-215", donorName: "घनश्याम कीर", type: "village", amount: 500, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v16", eventId: "evt-ganesh-2026", receiptNo: "REC-216", donorName: "अमरसिंह कीर", type: "village", amount: 251, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v17", eventId: "evt-ganesh-2026", receiptNo: "REC-217", donorName: "गंगाप्रसाद ठाकुर", type: "village", amount: 150, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v18", eventId: "evt-ganesh-2026", receiptNo: "REC-218", donorName: "जितेन्द्र ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v19", eventId: "evt-ganesh-2026", receiptNo: "REC-219", donorName: "रामसुख गुर्जर", type: "village", amount: 500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v20", eventId: "evt-ganesh-2026", receiptNo: "REC-220", donorName: "नर्मदाप्रसाद ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v21", eventId: "evt-ganesh-2026", receiptNo: "REC-221", donorName: "अमरसिंह गुर्जर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v22", eventId: "evt-ganesh-2026", receiptNo: "REC-222", donorName: "भागवत सिंह गुर्जर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v23", eventId: "evt-ganesh-2026", receiptNo: "REC-223", donorName: "शेरसिंह ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v24", eventId: "evt-ganesh-2026", receiptNo: "REC-224", donorName: "मंगल ठाकुर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v25", eventId: "evt-ganesh-2026", receiptNo: "REC-225", donorName: "कैलाश कीर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v26", eventId: "evt-ganesh-2026", receiptNo: "REC-226", donorName: "गणेश कीर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v27", eventId: "evt-ganesh-2026", receiptNo: "REC-227", donorName: "राजू ठाकुर", type: "village", amount: 30, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v28", eventId: "evt-ganesh-2026", receiptNo: "REC-228", donorName: "छोरे ठाकुर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v29", eventId: "evt-ganesh-2026", receiptNo: "REC-229", donorName: "किंशू ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v30", eventId: "evt-ganesh-2026", receiptNo: "REC-230", donorName: "रामविलास ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v31", eventId: "evt-ganesh-2026", receiptNo: "REC-231", donorName: "चन्दरसिंह जीबा", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v32", eventId: "evt-ganesh-2026", receiptNo: "REC-232", donorName: "संतोश ठाकुर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v33", eventId: "evt-ganesh-2026", receiptNo: "REC-233", donorName: "हरिश भाभा", type: "village", amount: 101, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v34", eventId: "evt-ganesh-2026", receiptNo: "REC-234", donorName: "पप्पू जी", type: "village", amount: 101, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v35", eventId: "evt-ganesh-2026", receiptNo: "REC-235", donorName: "दिनेश जीजा", type: "village", amount: 101, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v36", eventId: "evt-ganesh-2026", receiptNo: "REC-236", donorName: "जयनारायण ठाकुर", type: "village", amount: 30, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v37", eventId: "evt-ganesh-2026", receiptNo: "REC-237", donorName: "महेश ठाकुर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v38", eventId: "evt-ganesh-2026", receiptNo: "REC-238", donorName: "सिद्धू ठाकुर", type: "village", amount: 151, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v39", eventId: "evt-ganesh-2026", receiptNo: "REC-239", donorName: "हरिओम गुर्जर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v40", eventId: "evt-ganesh-2026", receiptNo: "REC-240", donorName: "रामविलास ठाकुर", type: "village", amount: 50, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v41", eventId: "evt-ganesh-2026", receiptNo: "REC-241", donorName: "गरीबदास ठाकुर", type: "village", amount: 101, paymentMode: "Cash", paymentStatus: "pledged", date: "2026-09-11", note: "लिखवाया" },
  { id: "c-v42", eventId: "evt-ganesh-2026", receiptNo: "REC-242", donorName: "नवरसिंह ठाकुर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v43", eventId: "evt-ganesh-2026", receiptNo: "REC-243", donorName: "किशन ठाकुर", type: "village", amount: 60, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v44", eventId: "evt-ganesh-2026", receiptNo: "REC-244", donorName: "मिठालाल ठाकुर", type: "village", amount: 500, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v45", eventId: "evt-ganesh-2026", receiptNo: "REC-245", donorName: "रेवाराम दादाजी", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" },
  { id: "c-v46", eventId: "evt-ganesh-2026", receiptNo: "REC-246", donorName: "हार्दिक गुर्जर", type: "village", amount: 100, paymentMode: "Cash", paymentStatus: "paid", date: "2026-09-11", note: "जमा" }
];

export const INITIAL_EXPENSES = [
  { id: "e1", eventId: "evt-ganesh-2026", category: "Pooja/Samagri", title: "शृंगार", amount: 450, paidByMemberName: "कपिल गुर्जर", paidTo: "शृंगार सामग्री", date: "2026-09-12", note: "12/09/26" },
  { id: "e2", eventId: "evt-ganesh-2026", category: "Pooja/Samagri", title: "गणेश जी मुर्ति", amount: 3500, paidByMemberName: "कपिल गुर्जर", paidTo: "मूर्तिकार", date: "2026-09-12", note: "12/09/26" },
  { id: "e3", eventId: "evt-ganesh-2026", category: "Misc", title: "किराया (वाहन)", amount: 600, paidByMemberName: "कपिल गुर्जर", paidTo: "ड्राइवर", date: "2026-09-12", note: "12/09/26" },
  { id: "e4", eventId: "evt-ganesh-2026", category: "Pooja/Samagri", title: "पंडित कपड़ा", amount: 900, paidByMemberName: "कपिल गुर्जर", paidTo: "कपड़ा दुकान", date: "2026-09-12", note: "12/09/26" },
  { id: "e5", eventId: "evt-ganesh-2026", category: "Food/Bhandara", title: "किराना सामग्री", amount: 3700, paidByMemberName: "कपिल गुर्जर", paidTo: "किराना स्टोर", date: "2026-09-12", note: "12/09/26" },
  { id: "e6", eventId: "evt-ganesh-2026", category: "Food/Bhandara", title: "दोना पत्तल", amount: 1550, paidByMemberName: "कपिल गुर्जर", paidTo: "दुकानदार", date: "2026-09-12", note: "12/09/26" },
  { id: "e7", eventId: "evt-ganesh-2026", category: "Misc", title: "नट पाना", amount: 250, paidByMemberName: "कपिल गुर्जर", paidTo: "हार्डवेयर", date: "2026-09-12", note: "12/09/26" },
  { id: "e8", "eventId": "evt-ganesh-2026", category: "Misc", title: "सिरप / प्रसादम", amount: 950, paidByMemberName: "कपिल गुर्जर", paidTo: "दुकान", date: "2026-09-12", note: "12/09/26" },
  { id: "e9", eventId: "evt-ganesh-2026", category: "Light/Power", title: "लाईट सजावट", amount: 700, paidByMemberName: "कपिल गुर्जर", paidTo: "लाइट वाला", date: "2026-09-13", note: "13/09/26" },
  { id: "e10", eventId: "evt-ganesh-2026", category: "Misc", title: "पोछा वायफर", amount: 350, paidByMemberName: "कपिल गुर्जर", paidTo: "दुकान", date: "2026-09-13", note: "13/09/26" },
  { id: "e11", eventId: "evt-ganesh-2026", category: "Misc", title: "टेप", amount: 30, paidByMemberName: "कपिल गुर्जर", paidTo: "दुकान", date: "2026-09-13", note: "13/09/26" }
];

export const INITIAL_CUSTODY = [
  {
    id: "cust-kapil-1",
    eventId: "evt-ganesh-2026",
    holderName: "कपिल गुर्जर",
    type: "surplus_custody",
    amount: 17000,
    status: "held",
    date: "2026-09-12",
    note: "12/09/26 तक के 5000 बच्चे हैं कपिल के पास (कुल प्राप्त 17,000)"
  }
];

export const INITIAL_SOUND_EQUIPMENT = [];
export const INITIAL_SOUND_RENTALS = [];
export const INITIAL_SOUND_FUND_TXNS = [];
