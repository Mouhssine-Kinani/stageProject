import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import bcrypt from "bcryptjs";

const AutoIncrement = AutoIncrementFactory(mongoose);
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    // ex: #US01 reference
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
    phone: {
      type: String,
      match: [/^\d{10,15}$/, "Phone number must be between 10-15 digits"],
      minLength: 10,
      maxLength: 15,
    },
    password: { type: String, required: true, minLength: 6 },
    lastLogin_date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    logo: { type: String, trim: true },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      required: true,
    },
    role: {
      roleName: {
        type: String,
        enum: ["User", "Admin", "Super Admin"],
        required: true,
      },
      description: { type: String, maxLength: 200, trim: true },
      privileges: [{ type: String, minLength: 3, maxLength: 50, trim: true }],
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// Ajouter la méthode matchPassword pour vérifier le mot de passe
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.plugin(AutoIncrement, { inc_field: "user_reference" });
const User = mongoose.model("User", UserSchema);
export default User;
