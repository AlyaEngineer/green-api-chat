import { getChatTitle, isUnavailableMessage } from '@/chats';
import { Avatar } from '@/components/Avatar';
import { formatChatTime } from '@/formatTime';
import type { Chat } from '@/types';

const EMPTY_CHAT_PREVIEW_TEXT = 'Нет сообщений';
const OUTGOING_MESSAGE_PREFIX = 'Вы:';
const UNREAD_COUNT_SCREEN_READER_TEXT = 'Непрочитанных сообщений:';
const MAX_VISIBLE_UNREAD_COUNT = 99;

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

  const isLastMessageUnavailable = lastMessage !== undefined && isUnavailableMessage(lastMessage);
  const previewStyleClass = isLastMessageUnavailable ? 'italic' : '';

  const unreadCountBadgeText =
    chat.unreadCount > MAX_VISIBLE_UNREAD_COUNT
      ? `${MAX_VISIBLE_UNREAD_COUNT}+`
      : String(chat.unreadCount);

  let lastMessagePreview = EMPTY_CHAT_PREVIEW_TEXT;
  let lastMessageTime = '';

  if (lastMessage) {
    lastMessagePreview = lastMessage.text;
    lastMessageTime = formatChatTime(lastMessage.timestamp);

    if (lastMessage.direction === 'outgoing') {
      lastMessagePreview = `${OUTGOING_MESSAGE_PREFIX} ${lastMessage.text}`;
    }
  }

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
          <span className={`line-clamp-2 text-sm text-secondary ${previewStyleClass}`}>
            {lastMessagePreview}
          </span>

          {hasUnread && (
            <span className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-themed px-1.5 text-xs leading-none font-medium text-contrast tabular-nums">
              <span className="sr-only">{UNREAD_COUNT_SCREEN_READER_TEXT} </span>
              {unreadCountBadgeText}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
