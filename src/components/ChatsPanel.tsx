import { LogOut, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { getChatTitle } from '@/chats';
import { ChatList } from '@/components/ChatList';
import { NewChatForm } from '@/components/NewChatForm';
import { Button } from '@/components/ui/Button';
import { PRIVATE_CHAT_SUFFIX } from '@/constants';
import type { Chat } from '@/types';

const NEW_CHAT_FORM_ID = 'new-chat-form';

const PANEL_TITLE = 'Чаты';
const NEW_CHAT_BUTTON_LABEL = 'Новый чат';
const SEARCH_LABEL = 'Поиск по чатам';
const SEARCH_PLACEHOLDER = 'Поиск';
const CHAT_LIST_LABEL = 'Список чатов';
const NO_CHATS_TEXT = 'Чатов пока нет';
const NOTHING_FOUND_TEXT = 'Ничего не найдено';
const INSTANCE_LABEL = 'Инстанс';
const LOGOUT_LABEL = 'Выйти';

type ChatsPanelProps = {
  chats: Chat[];
  activeChatId: string | null;
  idInstance: string;
  onSelect: (chatId: string) => void;
  onCreate: (chatId: string) => void;
  onLogout: () => void;
};

export function ChatsPanel({
  chats,
  activeChatId,
  idInstance,
  onSelect,
  onCreate,
  onLogout,
}: ChatsPanelProps) {
  const [searchText, setSearchText] = useState('');
  const [isNewChatFormOpen, setIsNewChatFormOpen] = useState(false);

  const searchTextLowercase = searchText.trim().toLowerCase();

  const foundChats = chats.filter((chat) => {
    const title = getChatTitle(chat).toLowerCase();
    const phoneDigits = chat.chatId.replace(PRIVATE_CHAT_SUFFIX, '');

    return title.includes(searchTextLowercase) || phoneDigits.includes(searchTextLowercase);
  });

  function handleCreateChat(chatId: string) {
    onCreate(chatId);
    setIsNewChatFormOpen(false);
    setSearchText('');
  }

  let emptyListText = '';

  if (chats.length === 0) {
    emptyListText = NO_CHATS_TEXT;
  } else if (foundChats.length === 0) {
    emptyListText = NOTHING_FOUND_TEXT;
  }

  return (
    <aside className="flex h-full w-full max-w-90 flex-col border-r border-card-stroke bg-white/70 backdrop-blur-xl">
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-xl leading-6 font-semibold">{PANEL_TITLE}</h1>

        <Button
          size="icon"
          onClick={() => setIsNewChatFormOpen(!isNewChatFormOpen)}
          aria-label={NEW_CHAT_BUTTON_LABEL}
          aria-expanded={isNewChatFormOpen}
          aria-controls={NEW_CHAT_FORM_ID}
        >
          <Plus className="size-5" />
        </Button>
      </header>

      {isNewChatFormOpen && (
        <div id={NEW_CHAT_FORM_ID} className="px-4 pb-1">
          <NewChatForm onCreate={handleCreateChat} />
        </div>
      )}

      <div role="search" className="px-4 pb-3">
        <label className="relative block">
          <span className="sr-only">{SEARCH_LABEL}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-tertiary" />
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder={SEARCH_PLACEHOLDER}
            className="h-10 w-full rounded-field bg-field pr-3 pl-10 outline-none placeholder:text-tertiary focus:ring-2 focus:ring-themed"
          />
        </label>
      </div>

      <nav aria-label={CHAT_LIST_LABEL} className="min-h-0 flex-1 overflow-y-auto">
        {emptyListText && (
          <p className="px-4 py-8 text-center text-sm text-tertiary">{emptyListText}</p>
        )}
        <ChatList chats={foundChats} activeChatId={activeChatId} onSelect={onSelect} />
      </nav>

      <footer className="flex items-center gap-3 border-t border-card-stroke px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-tertiary">{INSTANCE_LABEL}</p>
          <p className="truncate text-sm font-medium">{idInstance}</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          aria-label={LOGOUT_LABEL}
          title={LOGOUT_LABEL}
        >
          <LogOut className="size-5" />
        </Button>
      </footer>
    </aside>
  );
}
