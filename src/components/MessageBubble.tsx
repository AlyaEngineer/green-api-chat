import Linkify from 'linkify-react';
import { Ban, Clock } from 'lucide-react';

import { isUnavailableMessage } from '@/chats';
import { formatMessageTime } from '@/formatTime';
import type { Message } from '@/types';

const LINK_OPTIONS = {
  target: '_blank',
  rel: 'noopener noreferrer',
  defaultProtocol: 'https',
  className: 'underline underline-offset-2 hover:no-underline',
};

const OUTGOING_MESSAGE_SCREEN_READER_TEXT = 'Вы написали сообщение:';

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.direction === 'outgoing';
  const isUnavailable = isUnavailableMessage(message);

  const displayTime = formatMessageTime(message.timestamp);
  const isoDateTime = new Date(message.timestamp).toISOString();

  const alignClass = isOutgoing ? 'justify-end' : 'justify-start';
  const bubbleColorClass = isOutgoing
    ? 'rounded-br-sm bg-themed text-contrast'
    : 'rounded-bl-sm bg-bubble-incoming text-primary';
  const timeColorClass = isOutgoing ? 'text-contrast/70' : 'text-tertiary';
  const textStyleClass = isUnavailable
    ? 'flex items-center gap-1.5 italic text-tertiary'
    : 'wrap-anywhere whitespace-pre-wrap';

  const UnavailableIcon = message.kind === 'broken' ? Clock : Ban;

  const messageContent = isUnavailable ? (
    message.text
  ) : (
    <Linkify options={LINK_OPTIONS}>{message.text}</Linkify>
  );

  return (
    <li className={`flex ${alignClass}`}>
      <div
        className={`flex max-w-3/4 items-end gap-2 rounded-bubble px-3 py-2 shadow-sm ${bubbleColorClass}`}
      >
        <p className={textStyleClass}>
          {isUnavailable && <UnavailableIcon aria-hidden="true" className="size-4 shrink-0" />}
          {isOutgoing && <span className="sr-only">{OUTGOING_MESSAGE_SCREEN_READER_TEXT} </span>}
          {messageContent}
        </p>
        <time dateTime={isoDateTime} className={`shrink-0 text-xs tabular-nums ${timeColorClass}`}>
          {displayTime}
        </time>
      </div>
    </li>
  );
}
