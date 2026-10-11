const LOCALE = 'ru-RU';
const YESTERDAY_LABEL = 'вчера';

export function formatChatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return YESTERDAY_LABEL;
  }

  return date.toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
}
