import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  //   role: "admin" | "user" | "editor";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },

    // role: {
    //   type: String,
    //   enum: ["admin", "user", "editor"],
    //   default: "user",
    // },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in Next.js
const User = models.User || model<IUser>("User", UserSchema);

export default User;
