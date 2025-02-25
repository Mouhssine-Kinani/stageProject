import mongoose from "mongoose";
const Schema = mongoose.Schema;
const RapportSchema = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      trim: true,
    },
    body: { type: String, minLength: 5, maxLength: 1000, trim: true },
    date_creation: { type: Date, default: Date.now },
    date_programme: { type: Date },
    date_envoi: { type: Date },
  },
  { timestamps: true }
);

export default RapportSchema;