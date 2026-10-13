import { PRIVATE_CHAT_SUFFIX } from '@/constants';
import type { Message, MessageKind } from '@/types';

type MessageContent = {
  text: string;
  kind: MessageKind;
};

const TEXT_MESSAGE_TYPES = ['textMessage', 'extendedTextMessage', 'quotedMessage'];
const IGNORED_MESSAGE_TYPES = [
  'reactionMessage',
  'pollUpdateMessage',
  'editedMessage',
  'deletedMessage',
];

const DECRYPTION_ERROR_PREFIX = '{{SWE';
const UNSUPPORTED_MESSAGE_TEXT = 'Сообщение этого типа не поддерживается';
const BROKEN_MESSAGE_TEXT =
  'Не удалось получить сообщение. Попросите собеседника отправить его ещё раз';
const MILLISECONDS_IN_SECOND = 1000;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getMessageContent(
  messageData: Record<string, unknown>,
  typeMessage: string,
): MessageContent | null {
  if (!TEXT_MESSAGE_TYPES.includes(typeMessage)) {
    return { text: UNSUPPORTED_MESSAGE_TEXT, kind: 'unsupported' };
  }

  const textData =
    typeMessage === 'textMessage'
      ? messageData.textMessageData
      : messageData.extendedTextMessageData;

  if (!isObject(textData)) {
    return null;
  }

  const text = textData.textMessage ?? textData.text;

  if (typeof text !== 'string') {
    return null;
  }

  if (text.startsWith(DECRYPTION_ERROR_PREFIX)) {
    return { text: BROKEN_MESSAGE_TEXT, kind: 'broken' };
  }

  return { text, kind: 'text' };
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

  const messageContent = getMessageContent(messageData, messageData.typeMessage);

  if (messageContent === null) {
    return null;
  }

  const senderName = typeof senderData.senderName === 'string' ? senderData.senderName : undefined;

  return {
    id: idMessage,
    chatId: senderData.chatId,
    text: messageContent.text,
    timestamp: timestamp * MILLISECONDS_IN_SECOND,
    direction: 'incoming',
    kind: messageContent.kind,
    senderName,
  };
}
