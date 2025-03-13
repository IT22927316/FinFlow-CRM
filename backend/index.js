const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Route setup
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
