import { ChatListItem } from '@/components/ChatListItem';
import type { Chat } from '@/types';

type ChatListProps = {
  chats: Chat[];
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
};

export function ChatList({ chats, activeChatId, onSelect }: ChatListProps) {
  if (chats.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col">
      {chats.map((chat) => (
        <li key={chat.chatId}>
          <ChatListItem chat={chat} isActive={chat.chatId === activeChatId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
