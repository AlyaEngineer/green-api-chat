import { useState } from 'react';

import { addMessageToChats, createChat, markChatAsRead } from '@/chats';
import { ChatsPanel } from '@/components/ChatsPanel';
import { ChatWindow } from '@/components/ChatWindow';
import { LoginForm } from '@/components/LoginForm';
import { useIncomingMessages } from '@/hooks/useIncomingMessages';
import type { Chat, Credentials, Message } from '@/types';

const NO_ACTIVE_CHAT_TEXT = 'Выберите чат или создайте новый';

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useIncomingMessages(credentials, (message) => {
    const isActive = message.chatId === activeChatId;
    setChats((previousChats) => addMessageToChats(previousChats, message, isActive));
  });

  if (!credentials) {
    return <LoginForm onLogin={setCredentials} />;
  }

  const activeChat = chats.find((chat) => chat.chatId === activeChatId);

  function handleSelect(chatId: string) {
    setActiveChatId(chatId);
    setChats((previousChats) => markChatAsRead(previousChats, chatId));
  }

  function handleCreateChat(chatId: string) {
    setChats((previousChats) => createChat(previousChats, chatId));
    handleSelect(chatId);
  }

  function handleSend(message: Message) {
    setChats((previousChats) => addMessageToChats(previousChats, message, true));
  }

  function handleLogout() {
    setCredentials(null);
    setChats([]);
    setActiveChatId(null);
  }

  return (
    <main className="flex h-dvh overflow-hidden">
      <ChatsPanel
        chats={chats}
        activeChatId={activeChatId}
        onSelect={handleSelect}
        onCreate={handleCreateChat}
        onLogout={handleLogout}
        idInstance={credentials.idInstance}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        {activeChat && (
          <ChatWindow
            key={activeChat.chatId}
            credentials={credentials}
            chat={activeChat}
            onSend={handleSend}
          />
        )}

        {!activeChat && (
          <div className="flex flex-1 items-center justify-center">
            <p className="rounded-field bg-notice px-4 py-2 text-sm text-secondary shadow-sm">
              {NO_ACTIVE_CHAT_TEXT}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
