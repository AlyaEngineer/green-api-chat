import { getChatTitle } from '@/chats';
import { Avatar } from '@/components/Avatar';
import { formatChatTime } from '@/formatChatTime';
import type { Chat } from '@/types';

const NO_MESSAGES_TEXT = 'Нет сообщений';
const OUTGOING_MESSAGE_PREFIX = 'Вы:';
const UNREAD_COUNT_LABEL = 'Непрочитанных сообщений:';
const MAX_UNREAD_TO_SHOW = 99;

type ChatListItemProps = {
  chat: Chat;
  isActive: boolean;
  onSelect: (chatId: string) => void;
};

export function ChatListItem({ chat, isActive, onSelect }: ChatListItemProps) {
  const chatTitle = getChatTitle(chat);
  const lastMessage = chat.messages.at(-1);
  const hasUnread = chat.unreadCount > 0;
  const backgroundClass = isActive ? 'bg-item-active' : 'hover:bg-item-hover';

  let lastMessagePreview = NO_MESSAGES_TEXT;
  let lastMessageTime = '';

  if (lastMessage) {
    lastMessagePreview = lastMessage.text;
    lastMessageTime = formatChatTime(lastMessage.timestamp);

    if (lastMessage.direction === 'outgoing') {
      lastMessagePreview = `${OUTGOING_MESSAGE_PREFIX} ${lastMessage.text}`;
    }
  }

  const unreadCountText =
    chat.unreadCount > MAX_UNREAD_TO_SHOW ? `${MAX_UNREAD_TO_SHOW}+` : String(chat.unreadCount);

  return (
    <button
      type="button"
      onClick={() => onSelect(chat.chatId)}
      aria-current={isActive}
      className={`flex w-full gap-3 px-4 py-2 text-left transition-colors ${backgroundClass}`}
    >
      <Avatar chatId={chat.chatId} title={chatTitle} />

      <span className="block min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-medium">{chatTitle}</span>
          <span className="shrink-0 text-xs text-tertiary tabular-nums">{lastMessageTime}</span>
        </span>

        <span className="flex items-start justify-between gap-2">
          <span className="line-clamp-2 text-sm text-secondary">{lastMessagePreview}</span>

          {hasUnread && (
            <span className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-themed px-1.5 text-xs leading-none font-medium text-white tabular-nums">
              <span className="sr-only">{UNREAD_COUNT_LABEL} </span>
              {unreadCountText}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
