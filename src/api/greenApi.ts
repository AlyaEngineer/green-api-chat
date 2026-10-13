import { GreenApiError } from '@/api/errors';
import { API_URL, NETWORK_ERROR } from '@/constants';
import type {
  Credentials,
  DeleteNotificationResponse,
  GetChatsResponse,
  ReceiveNotificationResponse,
  SendMessageResponse,
  StateInstance,
} from '@/types';

type ApiMethod =
  'getStateInstance' | 'sendMessage' | 'receiveNotification' | 'deleteNotification' | 'getChats';

const RECENT_CHATS_COUNT = 20;

function buildUrl(credentials: Credentials, method: ApiMethod): string {
  const { idInstance, apiToken } = credentials;
  return `${API_URL}/waInstance${idInstance}/${method}/${apiToken}`;
}

async function greenApiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new GreenApiError(NETWORK_ERROR);
  }

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new GreenApiError(response.status, details.slice(0, 200));
  }

  return response.json();
}

export async function getStateInstance(credentials: Credentials): Promise<StateInstance> {
  const data = await greenApiRequest<{ stateInstance: StateInstance }>(
    buildUrl(credentials, 'getStateInstance'),
  );
  return data.stateInstance;
}

export function getChats(credentials: Credentials): Promise<GetChatsResponse> {
  return greenApiRequest<GetChatsResponse>(
    `${buildUrl(credentials, 'getChats')}?count=${RECENT_CHATS_COUNT}`,
  );
}

export function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  return greenApiRequest<SendMessageResponse>(buildUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });
}

export function receiveNotification(
  credentials: Credentials,
): Promise<ReceiveNotificationResponse> {
  return greenApiRequest<ReceiveNotificationResponse>(buildUrl(credentials, 'receiveNotification'));
}

export function deleteNotification(
  credentials: Credentials,
  receiptId: number,
): Promise<DeleteNotificationResponse> {
  return greenApiRequest<DeleteNotificationResponse>(
    `${buildUrl(credentials, 'deleteNotification')}/${receiptId}`,
    { method: 'DELETE' },
  );
}
