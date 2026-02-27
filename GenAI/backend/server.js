const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/xyzuniversity';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, password });
    await user.save();
    console.log('User created:', { email, username, password });
    res.json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating account' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
