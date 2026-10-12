const LOCALE = 'ru-RU';
const YESTERDAY_LABEL = 'вчера';

const timeFormatter = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' });
const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatMessageTime(timestamp: number): string {
  return timeFormatter.format(timestamp);
}

export function formatChatTime(timestamp: number): string {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return formatMessageTime(timestamp);
  }

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return YESTERDAY_LABEL;
  }

  return dateFormatter.format(messageDate);
}
