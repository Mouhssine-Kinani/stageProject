import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductHistorySchema = new Schema(
  {
      product_history_reference: {
        type: Number,
        unique: true
      },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    provider: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    ],
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

const ProductHistory = mongoose.model('ProductHistory', ProductHistorySchema);

export default ProductHistory;