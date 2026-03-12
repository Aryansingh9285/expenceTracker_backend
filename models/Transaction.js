import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  type:String,
  category:String,
  amount:Number,
  date:{type:Date,default:Date.now}
})

export default mongoose.model("Transaction",transactionSchema)