import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

const router = express.Router()

// REGISTER
router.post("/register", async (req, res) => {
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

    const hashed = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password: hashed
    })

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
router.post("/login", async (req, res) => {
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
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
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