import express from "express"
import Transaction from "../models/Transaction.js"
import auth from "../middleware/authMiddleware.js"

const router=express.Router()

router.get("/",auth,async(req,res)=>{
  const transactions=await Transaction.find({userId:req.userId})
  res.json(transactions)
})

router.post("/",auth,async(req,res)=>{
  const {type,category,amount}=req.body

  const transaction=await Transaction.create({
    userId:req.userId,
    type,
    category,
    amount
  })

  res.json(transaction)
})

router.delete("/:id",auth,async(req,res)=>{
  await Transaction.findByIdAndDelete(req.params.id)
  res.json({message:"Deleted"})
})

export default router