import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database', 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB setup
const MONGO_URI = process.env.MONGO_URI;

const DataSchema = new mongoose.Schema({
  key: { type: String, default: 'samiti_store', unique: true },
  adminPin: String,
  members: Array,
  events: Array,
  chandaList: Array,
  expenseList: Array,
  custodyList: Array,
  soundInventory: Array,
  soundRentals: Array,
  soundFundTxns: Array,
}, { timestamps: true });

const AppDataModel = mongoose.model('AppData', DataSchema);

const isConnected = () => mongoose.connection.readyState === 1;

// Helper function to read database (Async)
const readDB = async () => {
  if (isConnected()) {
    try {
      let doc = await AppDataModel.findOne({ key: 'samiti_store' }).lean();
      if (!doc) {
        // Seed initial data from local db.json if database is empty
        const initial = fs.existsSync(DB_FILE) ? fs.readJsonSync(DB_FILE) : {};
        doc = await AppDataModel.create({ key: 'samiti_store', ...initial });
        doc = doc.toObject();
      }
      delete doc._id;
      delete doc.__v;
      return doc;
    } catch (err) {
      console.error('❌ Error reading MongoDB:', err.message);
    }
  }

  // Fallback to local JSON file
  try {
    if (fs.existsSync(DB_FILE)) {
      return fs.readJsonSync(DB_FILE);
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  return {};
};

// Helper function to write database (Async)
const writeDB = async (data) => {
  if (isConnected()) {
    try {
      // Clean payload: strip out Mongo immutable fields (_id, __v)
      const payload = { ...data };
      delete payload._id;
      delete payload.__v;
      delete payload.createdAt;
      delete payload.updatedAt;

      await AppDataModel.findOneAndUpdate(
        { key: 'samiti_store' },
        { $set: payload },
        { upsert: true, new: true }
      );
      return true;
    } catch (err) {
      console.error('❌ Error writing to MongoDB:', err.message);
      return false;
    }
  }

  // Fallback to local JSON file
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
  res.json({
    status: 'ok',
    message: 'Gram Samiti API Server is running 🚀',
    storageMode: isConnected() ? 'MongoDB Cloud' : 'Local File (db.json)'
  });
});

// Get Full State Data
app.get('/api/data', async (req, res) => {
  const dbData = await readDB();
  res.json(dbData);
});

// Full Sync endpoint
app.post('/api/sync', async (req, res) => {
  const fullData = req.body;
  if (!fullData) {
    return res.status(400).json({ error: 'No data provided' });
  }
  const success = await writeDB(fullData);
  if (success) {
    res.json({ success: true, message: 'डेटा सफलतापूर्वक बैकएंड सर्वर पर सेव हो गया!' });
  } else {
    res.status(500).json({ success: false, message: 'सर्वर पर सेव करने में त्रुटि' });
  }
});

// Admin Verify PIN
app.post('/api/admin/verify-pin', async (req, res) => {
  const { pin } = req.body;
  const db = await readDB();
  if (pin === db.adminPin) {
    res.json({ success: true, message: 'PIN सही है' });
  } else {
    res.status(401).json({ success: false, message: 'गलत पासवर्ड (Incorrect PIN)' });
  }
});

// Admin Change PIN
app.post('/api/admin/change-pin', async (req, res) => {
  const { oldPin, newPin } = req.body;
  const db = await readDB();
  if (oldPin !== db.adminPin) {
    return res.status(400).json({ success: false, message: 'पुराना पासवर्ड गलत है!' });
  }
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ success: false, message: 'नया पासवर्ड कम से कम 4 अंकों का होना चाहिए!' });
  }
  db.adminPin = newPin;
  await writeDB(db);
  res.json({ success: true, message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' });
});

// Generic Module Handlers
app.get('/api/events', async (req, res) => res.json((await readDB()).events || []));
app.get('/api/chanda', async (req, res) => res.json((await readDB()).chandaList || []));
app.get('/api/expenses', async (req, res) => res.json((await readDB()).expenseList || []));
app.get('/api/custody', async (req, res) => res.json((await readDB()).custodyList || []));
app.get('/api/sound-equipment', async (req, res) => res.json((await readDB()).soundInventory || []));
app.get('/api/sound-rentals', async (req, res) => res.json((await readDB()).soundRentals || []));
app.get('/api/sound-fund', async (req, res) => res.json((await readDB()).soundFundTxns || []));
app.get('/api/members', async (req, res) => res.json((await readDB()).members || []));

// Connect DB & Start Express
const start = async () => {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('🍃 Connected to MongoDB Atlas successfully!');
    } catch (err) {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('⚠️ Falling back to local file storage (db.json)');
    }
  }

  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚩 Gram Samiti Backend Server running on port ${PORT}`);
    console.log(`🌐 Storage Mode: ${isConnected() ? 'MongoDB Cloud' : 'Local File (db.json)'}`);
    console.log(`===================================================`);
  });
};

start();


