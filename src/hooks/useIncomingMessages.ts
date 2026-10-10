import { useEffect, useRef } from 'react';

import { deleteNotification, receiveNotification } from '@/api/greenApi';
import { parseIncomingMessage } from '@/api/parseIncomingMessage';
import type { Credentials, Message } from '@/types';

const RETRY_DELAY_MS = 5000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useIncomingMessages(
  credentials: Credentials | null,
  onMessage: (message: Message) => void,
) {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (!credentials) {
      return;
    }

    let isListening = true;

    async function listenForMessages(currentCredentials: Credentials) {
      while (isListening) {
        try {
          const notification = await receiveNotification(currentCredentials);

          if (notification) {
            const message = parseIncomingMessage(notification.body);

            await deleteNotification(currentCredentials, notification.receiptId);

            if (message) {
              onMessageRef.current(message);
            }
          }
        } catch (error) {
          console.error(error);
          await sleep(RETRY_DELAY_MS);
        }
      }
    }

    listenForMessages(credentials);

    return () => {
      isListening = false;
    };
  }, [credentials]);
}
