import { handleResponse, jsonAuthHeaders } from "@/lib/api-client";
import type { User } from "@/modules/auth/types";
import type { PasswordValues, ProfileValues } from "../schema";

const BASE_URL = import.meta.env.VITE_API_URL + "/profile";

const patch = async <T>(url: string, body: unknown): Promise<T> => {
  const res = await fetch(url, {
    method: "PATCH",
    headers: jsonAuthHeaders(),
    body: JSON.stringify(body),
  });
  const envelope = await handleResponse<T>(res);
  return envelope.data;
};

export const profileApi = {
  update: (body: ProfileValues) => patch<User>(BASE_URL, body),
  changePassword: (body: PasswordValues) =>
    patch<{ message: string }>(BASE_URL + "/password", body),
};
