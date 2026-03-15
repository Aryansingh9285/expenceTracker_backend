import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: [true, 'Type required'],
    enum: {
      values: ['income', 'expense'],
      message: 'Type must be income or expense'
    },
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category required'],
    trim: true,
    maxlength: [50, 'Category too long']
  },
  amount: {
    type: Number,
    required: [true, 'Amount required'],
    min: [0, 'Amount cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

export default mongoose.model("Transaction",transactionSchema)