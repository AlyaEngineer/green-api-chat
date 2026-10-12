import { PRIVATE_CHAT_SUFFIX } from '@/constants';
import type { Chat, Message } from '@/types';

export function getPhoneNumber(chatId: string): string {
  return `+${chatId.replace(PRIVATE_CHAT_SUFFIX, '')}`;
}

export function getChatTitle(chat: Chat): string {
  if (chat.name) {
    return chat.name;
  }

  return getPhoneNumber(chat.chatId);
}

export function addMessageToChats(chats: Chat[], message: Message, isActive: boolean): Chat[] {
  const chat = chats.find((item) => item.chatId === message.chatId);

  const isUnread = message.direction === 'incoming' && !isActive;

  if (!chat) {
    const unreadCount = isUnread ? 1 : 0;

    const newChat: Chat = {
      chatId: message.chatId,
      name: message.senderName,
      messages: [message],
      unreadCount,
    };

    return [newChat, ...chats];
  }

  const isDuplicate = chat.messages.some((item) => item.id === message.id);

  if (isDuplicate) {
    return chats;
  }

  const unreadCount = isUnread ? chat.unreadCount + 1 : chat.unreadCount;

  const updatedChat: Chat = {
    ...chat,
    name: message.senderName || chat.name,
    messages: [...chat.messages, message],
    unreadCount,
  };

  const otherChats = chats.filter((item) => item.chatId !== chat.chatId);

  return [updatedChat, ...otherChats];
}

export function markChatAsRead(chats: Chat[], chatId: string): Chat[] {
  return chats.map((item) => {
    if (item.chatId !== chatId) {
      return item;
    }

    return { ...item, unreadCount: 0 };
  });
}

export function createChat(chats: Chat[], chatId: string): Chat[] {
  const isChatExisting = chats.some((item) => item.chatId === chatId);

  if (isChatExisting) {
    return chats;
  }

  const newChat: Chat = {
    chatId,
    messages: [],
    unreadCount: 0,
  };

  return [newChat, ...chats];
}

export function isUnavailableMessage(message: Message): boolean {
  return message.kind === 'unsupported' || message.kind === 'broken';
}
