import { LoaderCircle, SendHorizontal } from 'lucide-react';
import { useRef, useState, type SubmitEvent } from 'react';

import { getErrorMessage } from '@/api/errors';
import { sendMessage } from '@/api/greenApi';
import type { Credentials, Message } from '@/types';

const MESSAGE_INPUT_ARIA_LABEL = 'Сообщение';
const MESSAGE_INPUT_PLACEHOLDER = 'Введите сообщение';
const SEND_BUTTON_ARIA_LABEL = 'Отправить';
const SENDING_BUTTON_ARIA_LABEL = 'Сообщение отправляется';

type MessageFormProps = {
  credentials: Credentials;
  chatId: string;
  onSend: (message: Message) => void;
};

export function MessageForm({ credentials, chatId, onSend }: MessageFormProps) {
  const [messageText, setMessageText] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const trimmedMessageText = messageText.trim();
  const isSubmitDisabled = trimmedMessageText === '' || isSending;
  const SendButtonIcon = isSending ? LoaderCircle : SendHorizontal;
  const sendIconAnimationClass = isSending ? 'motion-safe:animate-spin' : '';
  const sendButtonAriaLabel = isSending ? SENDING_BUTTON_ARIA_LABEL : SEND_BUTTON_ARIA_LABEL;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setErrorText(null);
    setIsSending(true);

    let sentMessageId: string | null = null;

    try {
      const sendResponse = await sendMessage(credentials, chatId, trimmedMessageText);
      sentMessageId = sendResponse.idMessage;
    } catch (requestError) {
      setErrorText(getErrorMessage(requestError));
    } finally {
      setIsSending(false);
      messageInputRef.current?.focus();
    }

    if (sentMessageId === null) {
      return;
    }

    onSend({
      id: sentMessageId,
      chatId,
      text: trimmedMessageText,
      timestamp: Date.now(),
      direction: 'outgoing',
      kind: 'text',
    });

    setMessageText((currentText) => (currentText.trim() === trimmedMessageText ? '' : currentText));
  }

  return (
    <form onSubmit={handleSubmit} className="relative z-10 -mt-12 px-4">
      <div className="flex h-12 items-center gap-2 rounded-full bg-message-input pr-1.5 pl-5 shadow-message-input">
        <input
          ref={messageInputRef}
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          aria-label={MESSAGE_INPUT_ARIA_LABEL}
          placeholder={MESSAGE_INPUT_PLACEHOLDER}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-tertiary"
        />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          aria-label={sendButtonAriaLabel}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-themed transition-colors outline-none focus-visible:ring-2 focus-visible:ring-themed enabled:hover:bg-item-hover disabled:text-tertiary"
        >
          <SendButtonIcon className={`size-5 ${sendIconAnimationClass}`} aria-hidden="true" />
        </button>
      </div>

      <p role="alert" className="min-h-5 px-5 text-sm text-negative">
        {errorText}
      </p>
    </form>
  );
}
