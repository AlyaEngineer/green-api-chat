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
    setChats((prev) => addMessageToChats(prev, message, isActive));
  });

  if (!credentials) {
    return <LoginForm onLogin={setCredentials} />;
  }

  const activeChat = chats.find((chat) => chat.chatId === activeChatId);

  function handleSelect(chatId: string) {
    setActiveChatId(chatId);
    setChats((prev) => markChatAsRead(prev, chatId));
  }

  function handleCreateChat(chatId: string) {
    setChats((prev) => createChat(prev, chatId));
    setActiveChatId(chatId);
  }

  function handleSend(message: Message) {
    setChats((prev) => addMessageToChats(prev, message, true));
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

      <section className="flex-1 p-4">
        {activeChat && (
          <ChatWindow
            key={activeChat.chatId}
            credentials={credentials}
            chat={activeChat}
            onSend={handleSend}
          />
        )}
        {!activeChat && <p>{NO_ACTIVE_CHAT_TEXT}</p>}
      </section>
    </main>
  );
}

export default App;
