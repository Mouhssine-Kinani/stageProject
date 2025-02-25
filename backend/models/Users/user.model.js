import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    reference: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 10,
      trim: true,
    }, // ex: #US01
    fullName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      minLength: 5,
      maxLength: 100,
    },
    password: { type: String, required: true, minLength: 6 },
    lastLogin_date: { type: Date, default: Date.now },
    logo: { type: String, trim: true },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      required: true,
    },
    role: {
      roleName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true,
      },
      description: { type: String, maxLength: 200, trim: true },
      privileges: [{ type: String, minLength: 3, maxLength: 50, trim: true }],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
