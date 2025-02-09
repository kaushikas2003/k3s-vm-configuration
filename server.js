const express = require('express');
const bodyParser = require('body-parser');
const saveConfig = require('C:\Users\kaush\Downloads\WorkingProject\k3s-vm-configuration\k3s-vm-configuration\src\api\routes\saveConfig'); // Path to your saveConfig file
const cors = require('cors');

const app = express();
const port = 3001; // Or any port you prefer

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.post('/api/saveConfig', saveConfig);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});