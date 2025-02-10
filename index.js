import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
//import authRouter from './routes/authRouter.js';

// Configure environment variables
dotenv.config();

// Rest object
const app = express();

//databasae config
connectDB();

//Middlewares
app.use(express.json());
app.use(morgan('dev')); 

//routes
app.use('/api/v1/auth', authRoutes);

// REST API
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('<h1>Welcome to the Tech-hub app</h1>');
});

const PORT = process.env.PORT || 8080;

// Run server
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.DEV_MODE} mode on PORT ${process.env.PORT}`.bgCyan.white);
});
