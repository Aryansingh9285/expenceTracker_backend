import express from "express"
import mongoose from "mongoose"
import Transaction from "../models/Transaction.js"
import auth from "../middleware/authMiddleware.js"

const router = express.Router()

// GET all transactions for logged in user
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction
      .find({ userId: req.userId })
      .populate("userId", "name")

    res.status(200).json(transactions)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})


// CREATE a transaction
router.post("/", auth, async (req, res) => {
  try {
    const { type, category, amount } = req.body

    if (!type || !category || !amount) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const newTransaction = await Transaction.create({
      userId: req.userId,
      type,
      category,
      amount
    })

    const transaction = await Transaction
      .findById(newTransaction._id)
      .populate("userId", "name")

    res.status(201).json(transaction)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})


// UPDATE a transaction
router.put("/:id", auth, async (req, res) => {
  try {
    const { type, category, amount } = req.body

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { type, category, amount },
      { new: true }
    ).populate("userId", "name")

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.status(200).json(updatedTransaction)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})


// DELETE a transaction
router.delete("/:id", auth, async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    })

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.status(200).json({ message: "Transaction deleted" })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router