import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ProviderSchema = new Schema(
  {
    name: {
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
    website: { type: String, minLength: 5, maxLength: 100, trim: true },
    logo: { type: String, trim: true },
  },
  { timestamps: true }
);

export default ProviderSchema;