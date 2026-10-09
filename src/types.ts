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
