import express from "express"
import Transaction from "../models/Transaction.js"
import auth from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).populate('userId', 'name')
    res.status(200).json({ success: true, transactions })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// CREATE new transaction
router.post("/", auth, async (req, res) => {
  try {
    const { type, category, amount } = req.body
    if (!type || !category || typeof amount !== 'number') {
      return res.status(400).json({ success: false, message: "All fields are required and amount must be a number" })
    }

    const newTransaction = await Transaction.create({
      userId: req.userId,
      type,
      category,
      amount
    })

    const transaction = await Transaction.findById(newTransaction._id).populate('userId', 'name')

    res.status(201).json({ success: true, transaction })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// UPDATE transaction
router.put("/:id", auth, async (req, res) => {
  try {
    const { type, category, amount } = req.body

    // Basic validation
    if (!type || !category || typeof amount !== "number") {
      return res.status(400).json({
        success: false,
        message: "All fields are required and amount must be a number"
      })
    }

    // Find transaction
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      })
    }

    // Authorization check
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this transaction"
      })
    }

    // Update fields
    transaction.type = type
    transaction.category = category
    transaction.amount = amount

    await transaction.save()

    // Return updated transaction with populated user
    const updatedTransaction = await Transaction.findById(transaction._id).populate(
      "userId",
      "name"
    )

    res.status(200).json({
      success: true,
      transaction: updatedTransaction
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" })

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await transaction.remove()
    res.json({ success: true, message: "Deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
