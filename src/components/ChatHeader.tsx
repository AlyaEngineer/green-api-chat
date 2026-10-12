import { getChatTitle, getPhoneNumber } from '@/chats';
import { Avatar } from '@/components/Avatar';
import type { Chat } from '@/types';

type ChatHeaderProps = {
  chat: Chat;
};

export function ChatHeader({ chat }: ChatHeaderProps) {
  const chatTitle = getChatTitle(chat);
  const phoneNumber = getPhoneNumber(chat.chatId);
  const hasContactName = Boolean(chat.name);

  return (
    <header className="relative z-10 flex items-center gap-3 bg-panel px-4 py-3 shadow-header backdrop-blur-xl">
      <Avatar chatId={chat.chatId} title={chatTitle} />

      <div className="min-w-0">
        <h2 className="truncate font-semibold">{chatTitle}</h2>
        {hasContactName && <p className="text-sm text-tertiary">{phoneNumber}</p>}
      </div>
    </header>
  );
}
