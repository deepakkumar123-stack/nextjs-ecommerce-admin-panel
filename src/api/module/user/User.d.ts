declare global {
  type UserType = {
    _id?: string;
    name: string;
    email: string;
    avatar?: string;
    role?: "admin" | "user" | "editor";
    createdAt?: string;
    updatedAt?: string;
  };
}
export {};
