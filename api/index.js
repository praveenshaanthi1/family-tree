const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large base64 photos

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = 'family_story';

let db;

async function getDb() {
  if (!db) {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
}

// ── GET all memories ──
app.get('/api/memories', async (req, res) => {
  try {
    const database = await getDb();
    const memories = await database.collection('memories')
      .find({})
      .sort({ sortKey: 1 })
      .toArray();
    // Map _id to id for frontend compatibility
    const result = memories.map(m => ({ ...m, id: m._id.toString(), _id: undefined }));
    res.json(result);
  } catch (err) {
    console.error('GET /memories error:', err);
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

// ── POST create memory ──
app.post('/api/memories', async (req, res) => {
  try {
    const database = await getDb();
    const { date, title, desc, doodle, photo, sortKey, isAuto } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'title and date are required' });
    }
    const doc = {
      date,
      title,
      desc: desc || '',
      doodle: doodle || 'photo',
      photo: photo || null,
      sortKey: sortKey || date,
      isAuto: isAuto || false,
      createdAt: new Date()
    };
    const result = await database.collection('memories').insertOne(doc);
    res.status(201).json({ id: result.insertedId.toString(), ...doc });
  } catch (err) {
    console.error('POST /memories error:', err);
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

// ── PUT update memory ──
app.put('/api/memories/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid memory ID' });
    }
    const { date, title, desc, doodle, photo, sortKey, isAuto } = req.body;
    const update = {
      $set: {
        date,
        title,
        desc: desc || '',
        doodle: doodle || 'photo',
        photo: photo !== undefined ? photo : null,
        sortKey: sortKey || date,
        isAuto: isAuto || false,
        updatedAt: new Date()
      }
    };
    const result = await database.collection('memories').findOneAndUpdate(
      { _id: new ObjectId(id) },
      update,
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    res.json({ id: result._id.toString(), ...result, _id: undefined });
  } catch (err) {
    console.error('PUT /memories/:id error:', err);
    res.status(500).json({ error: 'Failed to update memory' });
  }
});

// ── DELETE memory ──
app.delete('/api/memories/:id', async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid memory ID' });
    }
    const result = await database.collection('memories').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    res.json({ success: true, deleted: id });
  } catch (err) {
    console.error('DELETE /memories/:id error:', err);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

// ── GET setting ──
app.get('/api/settings/:key', async (req, res) => {
  try {
    const database = await getDb();
    const { key } = req.params;
    const doc = await database.collection('settings').findOne({ key });
    res.json({ key, value: doc ? doc.value : null });
  } catch (err) {
    console.error('GET /settings error:', err);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// ── POST/PUT setting ──
app.post('/api/settings/:key', async (req, res) => {
  try {
    const database = await getDb();
    const { key } = req.params;
    const { value } = req.body;
    await database.collection('settings').updateOne(
      { key },
      { $set: { key, value, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ key, value });
  } catch (err) {
    console.error('POST /settings error:', err);
    res.status(500).json({ error: 'Failed to save setting' });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
}

module.exports = app;
