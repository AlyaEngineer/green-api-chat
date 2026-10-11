import { PRIVATE_CHAT_SUFFIX } from '@/constants';
import type { Chat, Message } from '@/types';

export function getChatTitle(chat: Chat): string {
  if (chat.name) {
    return chat.name;
  }

  const phone = chat.chatId.replace(PRIVATE_CHAT_SUFFIX, '');
  return `+${phone}`;
}

export function addMessageToChats(chats: Chat[], message: Message, isActive: boolean): Chat[] {
  const chat = chats.find((item) => item.chatId === message.chatId);

  const isUnread = message.direction === 'incoming' && !isActive;

  if (!chat) {
    let unreadCount = 0;

    if (isUnread) {
      unreadCount = 1;
    }

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

  let unreadCount = chat.unreadCount;

  if (isUnread) {
    unreadCount = unreadCount + 1;
  }

  const updatedChat: Chat = {
    chatId: chat.chatId,
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

    return { chatId: item.chatId, name: item.name, messages: item.messages, unreadCount: 0 };
  });
}

export function createChat(chats: Chat[], chatId: string): Chat[] {
  const exists = chats.some((item) => item.chatId === chatId);

  if (exists) {
    return chats;
  }

  const newChat: Chat = {
    chatId,
    messages: [],
    unreadCount: 0,
  };

  return [newChat, ...chats];
}
