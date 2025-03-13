const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/ticket', ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
