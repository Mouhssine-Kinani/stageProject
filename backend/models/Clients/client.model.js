import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);
const Schema = mongoose.Schema;

const ClientSchema = new Schema(
  {
     // ex: #CL001
    logo: { type: String, trim: true },
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    city: { type: String, minLength: 3, maxLength: 50, trim: true },
    address: { type: String, minLength: 5, maxLength: 100, trim: true }, // dynamic for maps
    country: { type: String, minLength: 3, maxLength: 50, trim: true },
    region: { type: String, minLength: 3, maxLength: 50, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      minLength: 5,
      maxLength: 100,
    },
    renewal_status: {
      type: String,
      enum: ["ok", "Overdue", "Expiring"],
      // required: true,
    },
    phone: {
      type: String,
      match: [/^\d{10,15}$/, "Phone number must be between 10-15 digits"],
      minLength: 10,
      maxLength: 15,
    },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ProductHistory", required: true },
    ],
  },
  { timestamps: true }
);

ClientSchema.plugin(AutoIncrement, { inc_field: 'client_reference' });

const Client = mongoose.model('Client', ClientSchema);

export default Client;