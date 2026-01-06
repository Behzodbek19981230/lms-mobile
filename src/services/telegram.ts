import { http } from './http';

export type TelegramChannel = {
  id: number;
  chatId: string;
  title?: string;
  username?: string;
  inviteLink?: string;
  type?: string;
  groupName?: string;
  subjectName?: string;
  centerName?: string | null;
  [key: string]: any;
};

export type TelegramUserStatus = {
  // backend (preferred)
  isLinked?: boolean;
  telegramUsername?: string;
  telegramUserId?: string;
  firstName?: string;
  lastName?: string;
  availableChannels?: TelegramChannel[];

  // backward compatibility
  isConnected?: boolean;
  username?: string;
  [key: string]: any;
};

export function isTelegramLinked(status: TelegramUserStatus | null | undefined): boolean {
  return Boolean(status?.isLinked ?? status?.isConnected);
}

export function getTelegramUsername(status: TelegramUserStatus | null | undefined): string {
  const name = String(status?.telegramUsername ?? status?.username ?? '').trim();
  return name;
}

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
