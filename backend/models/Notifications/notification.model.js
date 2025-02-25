import mongoose from "mongoose";
const Schema = mongoose.Schema;
const NotificationSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    contenu: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 500,
      trim: true,
    },
    delai_notification: {
      type: String,
      minLength: 2,
      maxLength: 10,
      trim: true,
    }, // e.g., "-3jrs"
    date_envoi: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default NotificationSchema;