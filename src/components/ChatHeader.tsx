import { ArrowLeft } from 'lucide-react';

import { getChatTitle, getPhoneNumber } from '@/chats';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/Button';
import type { Chat } from '@/types';

type ChatHeaderProps = {
  chat: Chat;
  onBack: () => void;
};

const BACK_BUTTON_ARIA_LABEL = 'Назад к списку чатов';

export function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  const chatTitle = getChatTitle(chat);
  const phoneNumber = getPhoneNumber(chat.chatId);
  const hasContactName = Boolean(chat.name);

  return (
    <header className="relative z-10 flex items-center gap-3 bg-panel px-4 py-3 shadow-header">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        aria-label={BACK_BUTTON_ARIA_LABEL}
        className="-ml-2 md:hidden"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </Button>
      <Avatar chatId={chat.chatId} title={chatTitle} />

      <div className="min-w-0">
        <h2 className="truncate font-semibold">{chatTitle}</h2>
        {hasContactName && <p className="text-sm text-tertiary">{phoneNumber}</p>}
      </div>
    </header>
  );
}
