import { PRIVATE_CHAT_SUFFIX } from '@/constants';
import type { Message } from '@/types';

const TEXT_MESSAGE_TYPES = ['textMessage', 'extendedTextMessage', 'quotedMessage'];
const IGNORED_MESSAGE_TYPES = [
  'reactionMessage',
  'pollUpdateMessage',
  'editedMessage',
  'deletedMessage',
];

const SWE_ERROR_PREFIX = '{{SWE';
const UNSUPPORTED_MESSAGE_TEXT = 'Сообщение этого типа не поддерживается';
const BROKEN_MESSAGE_TEXT =
  'Не удалось получить сообщение. Попросите собеседника отправить его ещё раз';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getMessageText(messageData: Record<string, unknown>, typeMessage: string): string | null {
  if (!TEXT_MESSAGE_TYPES.includes(typeMessage)) {
    return UNSUPPORTED_MESSAGE_TEXT;
  }

  const data =
    typeMessage === 'textMessage'
      ? messageData.textMessageData
      : messageData.extendedTextMessageData;

  if (!isObject(data)) {
    return null;
  }

  const text = data.textMessage ?? data.text;

  if (typeof text !== 'string') {
    return null;
  }

  return text.startsWith(SWE_ERROR_PREFIX) ? BROKEN_MESSAGE_TEXT : text;
}

export function parseIncomingMessage(body: unknown): Message | null {
  if (!isObject(body) || body.typeWebhook !== 'incomingMessageReceived') {
    return null;
  }

  const { idMessage, timestamp, senderData, messageData } = body;

  if (
    typeof idMessage !== 'string' ||
    typeof timestamp !== 'number' ||
    !isObject(senderData) ||
    typeof senderData.chatId !== 'string' ||
    !isObject(messageData) ||
    typeof messageData.typeMessage !== 'string'
  ) {
    return null;
  }

  if (!senderData.chatId.endsWith(PRIVATE_CHAT_SUFFIX)) {
    return null;
  }

  if (IGNORED_MESSAGE_TYPES.includes(messageData.typeMessage)) {
    return null;
  }

  const text = getMessageText(messageData, messageData.typeMessage);

  if (text === null) {
    return null;
  }

  return {
    id: idMessage,
    chatId: senderData.chatId,
    text,
    timestamp: timestamp * 1000,
    direction: 'incoming',
    senderName: typeof senderData.senderName === 'string' ? senderData.senderName : undefined,
  };
}
