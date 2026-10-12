import { useEffect, useRef } from 'react';

import { ChatHeader } from '@/components/ChatHeader';
import { MessageBubble } from '@/components/MessageBubble';
import { MessageForm } from '@/components/MessageForm';
import type { Chat, Credentials, Message } from '@/types';

const MESSAGES_ARIA_LABEL = 'Сообщения';
const EMPTY_CHAT_TEXT = 'Сообщений пока нет. Напишите первым';

type ChatWindowProps = {
  credentials: Credentials;
  chat: Chat;
  onSend: (message: Message) => void;
  onBack: () => void;
};

export function ChatWindow({ credentials, chat, onSend, onBack }: ChatWindowProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasMessages = chat.messages.length > 0;

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;

    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [chat.messages.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader chat={chat} onBack={onBack} />

      <div
        ref={messagesContainerRef}
        role="log"
        aria-label={MESSAGES_ARIA_LABEL}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-10 pt-4 pb-16"
      >
        {!hasMessages && (
          <p className="mx-auto mt-auto max-w-md rounded-field bg-notice px-4 py-2 text-center text-sm text-secondary shadow-sm">
            {EMPTY_CHAT_TEXT}
          </p>
        )}

        {hasMessages && (
          <ul className="mt-auto flex flex-col gap-2">
            {chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </ul>
        )}
      </div>

      <MessageForm credentials={credentials} chatId={chat.chatId} onSend={onSend} />
    </div>
  );
}
