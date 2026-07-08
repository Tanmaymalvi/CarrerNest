import mongoose from "mongoose";

const serviceOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["upi", "other"],
      default: "upi",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    transactionId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceOrder", serviceOrderSchema);
