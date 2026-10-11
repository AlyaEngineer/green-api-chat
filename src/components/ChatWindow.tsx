import { useState, type SubmitEvent } from 'react';

import { getErrorMessage } from '@/api/errors';
import { sendMessage } from '@/api/greenApi';
import { getChatTitle } from '@/chats';
import type { Chat, Credentials, Message } from '@/types';

const MESSAGE_INPUT_LABEL = 'Сообщение';
const MESSAGE_PLACEHOLDER = 'Напишите сообщение...';
const SEND_BUTTON_TEXT = 'Отправить';

type ChatWindowProps = {
  credentials: Credentials;
  chat: Chat;
  onSend: (message: Message) => void;
};

export function ChatWindow({ credentials, chat, onSend }: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const chatTitle = getChatTitle(chat);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessageText = messageText.trim();

    if (!trimmedMessageText) {
      return;
    }

    setErrorText(null);
    setIsSending(true);

    try {
      const { idMessage } = await sendMessage(credentials, chat.chatId, trimmedMessageText);

      onSend({
        id: idMessage,
        chatId: chat.chatId,
        text: trimmedMessageText,
        timestamp: Date.now(),
        direction: 'outgoing',
      });

      setMessageText('');
    } catch (requestError) {
      setErrorText(getErrorMessage(requestError));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-4 font-semibold">{chatTitle}</h2>

      <ul className="flex flex-1 flex-col gap-2">
        {chat.messages.map((message) => {
          const alignClass = message.direction === 'outgoing' ? 'text-right' : 'text-left';

          return (
            <li key={message.id} className={alignClass}>
              {message.text}
            </li>
          );
        })}
      </ul>

      {errorText && (
        <p role="alert" className="text-negative">
          {errorText}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          aria-label={MESSAGE_INPUT_LABEL}
          placeholder={MESSAGE_PLACEHOLDER}
          className="flex-1 border p-2"
        />
        <button type="submit" disabled={isSending} className="border p-2">
          {SEND_BUTTON_TEXT}
        </button>
      </form>
    </div>
  );
}
