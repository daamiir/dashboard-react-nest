import type { Role, User } from "../types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

interface ApiEnvelope<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface ResponseUser {
  accessToken: string;
  user: User;
}

async function handleResponse<T>(res: Response): Promise<ApiEnvelope<T>> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.message ?? `Request failed with status ${res.status}`,
    );
  }

  return res.json();
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
