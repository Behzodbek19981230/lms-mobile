import type { AuthResponse, LoginPayload } from '../types/auth';
import { http } from './http';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await http.post<AuthResponse>('/auth/login', payload);
  return res.data;
}
