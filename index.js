import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// Rest object
const app = express();

// REST API
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the ecommerce app</h1>');
});

const PORT = process.env.PORT || 8000;

// Run server
app.listen(PORT, () => {
  console.log(`Server running on mode ${process.env.DEV_MODE} on PORT ${process.env.PORT}`.bgCyan.white);
});
