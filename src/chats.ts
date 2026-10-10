import { PRIVATE_CHAT_SUFFIX } from '@/constants';
import type { Chat, Message } from '@/types';

export function getChatTitle(chat: Chat): string {
  if (chat.name) {
    return chat.name;
  }

  const phone = chat.chatId.replace(PRIVATE_CHAT_SUFFIX, '');
  return `+${phone}`;
}

export function addMessageToChats(chats: Chat[], message: Message): Chat[] {
  const chat = chats.find((item) => item.chatId === message.chatId);

  if (!chat) {
    const newChat: Chat = {
      chatId: message.chatId,
      name: message.senderName,
      messages: [message],
    };

    return [newChat, ...chats];
  }

  const isDuplicate = chat.messages.some((item) => item.id === message.id);

  if (isDuplicate) {
    return chats;
  }

  const updatedChat: Chat = {
    chatId: chat.chatId,
    name: message.senderName || chat.name,
    messages: [...chat.messages, message],
  };

  return chats.map((item) => {
    if (item.chatId === chat.chatId) {
      return updatedChat;
    }

    return item;
  });
}
