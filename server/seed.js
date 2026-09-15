import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database', 'db.json');

const DataSchema = new mongoose.Schema({
  key: { type: String, default: 'samiti_store', unique: true }
}, { timestamps: true, strict: false });

const AppDataModel = mongoose.model('AppData', DataSchema);

const runSeed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log('No MONGO_URI provided in server/.env');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🍃 Connected to MongoDB Atlas');

    const data = fs.readJsonSync(DB_FILE);
    delete data._id;
    delete data.__v;

    await AppDataModel.findOneAndUpdate(
      { key: 'samiti_store' },
      { $set: data },
      { upsert: true, new: true }
    );
    console.log('✅ Ganeshोत्सव 2026 data successfully seeded to MongoDB Cloud!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    await mongoose.disconnect();
  }
};

runSeed();
