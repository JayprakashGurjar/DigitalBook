import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database', 'db.json');

app.use(cors());
app.use(express.json());

// Helper function to read database
const readDB = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      return fs.readJsonSync(DB_FILE);
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  return {};
};

// Helper function to write database
const writeDB = (data) => {
  try {
    fs.writeJsonSync(DB_FILE, data, { spaces: 2 });
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gram Samiti API Server is running 🚀' });
});

// Get Full State Data
app.get('/api/data', (req, res) => {
  const dbData = readDB();
  res.json(dbData);
});

// Full Sync endpoint
app.post('/api/sync', (req, res) => {
  const fullData = req.body;
  if (!fullData) {
    return res.status(400).json({ error: 'No data provided' });
  }
  const success = writeDB(fullData);
  if (success) {
    res.json({ success: true, message: 'डेटा सफलतापूर्वक बैकएंड सर्वर पर सेव हो गया!' });
  } else {
    res.status(500).json({ success: false, message: 'सर्वर पर सेव करने में त्रुटि' });
  }
});

// Admin Verify PIN
app.post('/api/admin/verify-pin', (req, res) => {
  const { pin } = req.body;
  const db = readDB();
  if (pin === db.adminPin) {
    res.json({ success: true, message: 'PIN सही है' });
  } else {
    res.status(401).json({ success: false, message: 'गलत पासवर्ड (Incorrect PIN)' });
  }
});

// Admin Change PIN
app.post('/api/admin/change-pin', (req, res) => {
  const { oldPin, newPin } = req.body;
  const db = readDB();
  if (oldPin !== db.adminPin) {
    return res.status(400).json({ success: false, message: 'पुराना पासवर्ड गलत है!' });
  }
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ success: false, message: 'नया पासवर्ड कम से कम 4 अंकों का होना चाहिए!' });
  }
  db.adminPin = newPin;
  writeDB(db);
  res.json({ success: true, message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' });
});

// Generic Module Handlers
app.get('/api/events', (req, res) => res.json(readDB().events || []));
app.get('/api/chanda', (req, res) => res.json(readDB().chandaList || []));
app.get('/api/expenses', (req, res) => res.json(readDB().expenseList || []));
app.get('/api/custody', (req, res) => res.json(readDB().custodyList || []));
app.get('/api/sound-equipment', (req, res) => res.json(readDB().soundInventory || []));
app.get('/api/sound-rentals', (req, res) => res.json(readDB().soundRentals || []));
app.get('/api/sound-fund', (req, res) => res.json(readDB().soundFundTxns || []));
app.get('/api/members', (req, res) => res.json(readDB().members || []));

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚩 Gram Samiti Backend Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api/data`);
  console.log(`===================================================`);
});
