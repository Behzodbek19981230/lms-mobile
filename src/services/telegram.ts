import { http } from './http';

export type TelegramUserStatus = {
  isConnected?: boolean;
  telegramUserId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
};

export async function getTelegramUserStatus(): Promise<TelegramUserStatus> {
  const res = await http.get<TelegramUserStatus>('/telegram/user-status');
  return res.data;
}

export async function createTelegramConnectLink(): Promise<{ link?: string; url?: string; [k: string]: any }> {
  const res = await http.post('/telegram/connect-link');
  return res.data as any;
}

export async function getTelegramAdminChannels(): Promise<any[]> {
  const res = await http.get<any[]>('/telegram/admin-channels');
  return Array.isArray(res.data) ? res.data : [];
}
