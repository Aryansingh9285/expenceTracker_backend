import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// REGISTER
router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    email = email.trim().toLowerCase()

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
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
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      })
    }

    email = email.trim().toLowerCase()

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
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
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// UPDATE PROFILE
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update name if provided
    if (name !== undefined) {
      if (!name || typeof name !== "string") {
        return res.status(400).json({
          success: false,
          message: "Valid name is required"
        });
      }
      user.name = name.trim();
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      if (typeof newPassword !== "string" || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters"
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    } else if (currentPassword || newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both currentPassword and newPassword are required to update password"
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
})

export default router
