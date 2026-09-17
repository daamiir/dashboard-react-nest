export type Role = "BUYER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}
