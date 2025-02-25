import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductHistorySchema = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    reference: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 10,
      trim: true,
    }, // ex: #PR01
    productName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    billing_cycle: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["Type A", "Type B"], required: true },
    productAddedDate: { type: Date, default: Date.now },
    productDeployed: { type: Date },
    date_fin: { type: Date },
    website: { type: String, minLength: 5, maxLength: 100, trim: true },
  },
  { timestamps: true }
);


export default ProductHistorySchema;