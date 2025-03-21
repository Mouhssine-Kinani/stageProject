import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    product_reference: {
      type: Number,
      unique: true
    },
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
      enum: ['monthly', 'yearly', 'biennial'],
      trim: true,
    },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["Type A", "Type B", "Type C"], required: true },
    productAddedDate: { type: Date, default: Date.now },
    productDeployed: { type: Date },
    date_fin: { type: Date },
    website: { type: String, minLength: 5, maxLength: 100, trim: true },
    provider: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    ],
  },
  { timestamps: true }
);

ProductSchema.plugin(AutoIncrement, { inc_field: 'product_reference' });

const Product = mongoose.model('Product', ProductSchema);

export default Product;
