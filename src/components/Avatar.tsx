import { UserIcon } from 'lucide-react';

const AVATAR_COLORS = ['bg-avatar-1', 'bg-avatar-2', 'bg-avatar-3', 'bg-avatar-4', 'bg-avatar-5'];

const ANY_LETTER_PATTERN = /\p{L}/u;

type AvatarProps = {
  chatId: string;
  title: string;
};

function getAvatarColor(chatId: string): string {
  let sumOfCharacterCodes = 0;

  for (const character of chatId) {
    sumOfCharacterCodes = sumOfCharacterCodes + character.charCodeAt(0);
  }

  const colorNumber = sumOfCharacterCodes % AVATAR_COLORS.length;

  return AVATAR_COLORS[colorNumber];
}

function getFirstLetter(title: string): string {
  const foundLetters = title.match(ANY_LETTER_PATTERN);

  if (!foundLetters) {
    return '';
  }

  return foundLetters[0].toUpperCase();
}

export function Avatar({ chatId, title }: AvatarProps) {
  const firstLetter = getFirstLetter(title);
  const colorClassName = getAvatarColor(chatId);

  return (
    <span
      aria-hidden="true"
      className={`flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-medium text-white ${colorClassName}`}
    >
      {firstLetter || <UserIcon className="size-6" />}
    </span>
  );
}
