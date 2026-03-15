import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"

dotenv.config()

// Security env checks
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("❌ Missing JWT_SECRET or MONGO_URI in .env");
  process.exit(1);
}

const app = express()

// Middleware
// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, slow down' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(generalLimiter);

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  credentials: true
}));
app.use(express.json({ 
  limit: "10mb",
  parameterLimit: 1000
}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})




// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message)
    process.exit(1)
  })

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/transactions", transactionRoutes)

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err);
  res.status(500).json({ 
    message: "Internal Server Error"
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

export default app
