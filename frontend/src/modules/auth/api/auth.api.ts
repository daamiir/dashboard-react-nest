import { handleResponse } from "@/lib/api-client";
import type { User } from "../types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface ResponseUser {
  accessToken: string;
  user: User;
}

export const authApi = {
  me: async (token: string): Promise<User> => {
    const res = await fetch(`${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const envelope = await handleResponse<User>(res);
    return envelope.data;
  },

  register: async (payload: RegisterUserPayload): Promise<ResponseUser> => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<ResponseUser>(res);
    return envelope.data;
  },

  login: async (payload: LoginUserPayload): Promise<ResponseUser> => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<ResponseUser>(res);
    return envelope.data;
  },
};
