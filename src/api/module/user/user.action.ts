"use server";

import dbConnect from "@/api/db/connetDb";
import User from "./user.schema";

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
};

export async function createUser(
  data: UserType
): Promise<ApiResponse<UserType>> {
  try {
    await dbConnect();

    const { name, email, password } = data;

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        message: "Name, email and password are required",
      };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 409,
        message: "User already exists",
      };
    }

    const user = await User.create({ name, email, password });

    return {
      statusCode: 201,
      message: "User created successfully",
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        password: user.password,
      },
    };
  } catch (error) {
    console.error("Create User Error:", error);
    return {
      statusCode: 500,
      message: "Failed to create user",
    };
  }
}
