export type Credentials = {
  idInstance: string;
  apiToken: string;
};

export type StateInstance =
  | 'authorized'
  | 'notAuthorized'
  | 'blocked'
  | 'sleepMode'
  | 'starting'
  | 'yellowCard'
  | 'suspended';

export type SendMessageResponse = {
  idMessage: string;
};

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: unknown;
} | null;

export type DeleteNotificationResponse = {
  result: boolean;
};

export type Message = {
  id: string;
  chatId: string;
  text: string;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
  senderName?: string;
};

export type Chat = {
  chatId: string;
  name?: string;
  messages: Message[];
  unreadCount: number;
};
