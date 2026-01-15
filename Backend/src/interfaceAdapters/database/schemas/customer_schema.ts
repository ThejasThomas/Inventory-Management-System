import { Schema, model, Types } from "mongoose";
import { required } from "zod/v4/core/util.cjs";

const customerSchema = new Schema(
  {
    userId: {
      type:String,
      required:true
    },

    customerName: { type: String, required: true },
    address: { type: String, required: true },
    mobileNumber: { type: String, required: true },

    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    // totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CustomerModel = model("Customer", customerSchema);
