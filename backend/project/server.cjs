const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const cors = require('cors');
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
app.use(express.json());
app.use(cors({
  origin: '*', // For demo. In production, use: ["https://your-vercel-app.vercel.app"]
  credentials: true
}));

const COMPLAINTS_FILE = path.join(__dirname, 'data', 'complaints.json');
if (!fs.existsSync(COMPLAINTS_FILE)) fs.writeFileSync(COMPLAINTS_FILE, '[]');
console.log('Using complaints file at:', COMPLAINTS_FILE);

// Get all complaints
app.get('/api/complaints', (req, res) => {
  try {
    const complaints = JSON.parse(fs.readFileSync(COMPLAINTS_FILE, 'utf-8'));
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read complaints file.' });
  }
});

// Submit a new complaint
app.post('/api/complaints', (req, res) => {
  try {
    console.log('Received complaint:', req.body); // Log the posted complaint
    const complaints = JSON.parse(fs.readFileSync(COMPLAINTS_FILE, 'utf-8'));
    const complaint = { ...req.body, id: Date.now(), status: 'pending' };
    complaints.push(complaint);
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to write complaint.' });
  }
});

// Accept or reject a complaint
app.patch('/api/complaints/:id', (req, res) => {
  try {
    const complaints = JSON.parse(fs.readFileSync(COMPLAINTS_FILE, 'utf-8'));
    const complaintId = parseInt(req.params.id, 10);
    const { status, policeMessage } = req.body; // status should be 'accepted' or 'rejected', policeMessage is optional
    const idx = complaints.findIndex(c => c.id === complaintId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }
    complaints[idx].status = status;
    if (policeMessage) {
      complaints[idx].policeMessage = policeMessage;
    }
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
    res.json(complaints[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update complaint.' });
  }
});

// Delete a complaint
app.delete('/api/complaints/:id', (req, res) => {
  try {
    const complaints = JSON.parse(fs.readFileSync(COMPLAINTS_FILE, 'utf-8'));
    const complaintId = parseInt(req.params.id, 10);
    const idx = complaints.findIndex(c => c.id === complaintId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }
    const removed = complaints.splice(idx, 1);
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
    res.json(removed[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete complaint.' });
  }
});

// Clear all complaints
app.delete('/api/complaints', (req, res) => {
  try {
    fs.writeFileSync(COMPLAINTS_FILE, '[]');
    res.json({ message: 'All complaints deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear complaints.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 