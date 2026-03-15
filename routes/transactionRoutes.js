import express from "express"
import Transaction from "../models/Transaction.js"
import auth from "../middleware/authMiddleware.js"
import { transactionValidator } from "../middleware/validators.js"

const router = express.Router()

router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    res.json({ count: transactions.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.post("/", auth, async (req, res) => {
  try {
    const { type, category, amount } = req.body;
    if (!type || !category || amount == null) {
      return res.status(400).json({ message: "type, category, and amount required" });
    }
    const newTransaction = await Transaction.create({
      userId: req.userId,
      type,
      category,
      amount: Number(amount)
    });
    res.json({ message: "Transaction created successfully", id: newTransaction._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

router.put("/:id", auth, transactionValidator, async (req, res) => {
  try {
    const { type, category, amount } = req.body;
    const updates = { ...(type && { type }), ...(category && { category }), ...(amount && { amount }) };

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('userId', 'name');

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found or not authorized" });
    }

    res.json({ message: "Transaction updated", id: transaction._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found or unauthorized" });
    }
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

export default router
