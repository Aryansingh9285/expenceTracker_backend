import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import { authLimiter } from "../middleware/rateLimit.js"
import { registerValidator, loginValidator } from "../middleware/validators.js"
import { validationResult } from 'express-validator';

const router = express.Router()

// REGISTER
router.post("/register", authLimiter, registerValidator, async (req, res) => {
  // Validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    }

    const hashed = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      password: hashed
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})


// LOGIN
router.post("/login", authLimiter, loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      })
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      token
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router