import { useState, type SubmitEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PRIVATE_CHAT_SUFFIX } from '@/constants';

const MIN_PHONE_DIGITS = 9;
const MAX_PHONE_DIGITS = 15;

const NOT_DIGIT_PATTERN = /\D/g;

const PHONE_LABEL = 'Номер телефона';
const PHONE_PLACEHOLDER = '79001234567';
const WRONG_PHONE_LENGTH_TEXT = `Номер должен содержать ${MIN_PHONE_DIGITS}–${MAX_PHONE_DIGITS} цифр`;
const CREATE_BUTTON_TEXT = 'Создать';

type NewChatFormProps = {
  onCreate: (chatId: string) => void;
};

export function NewChatForm({ onCreate }: NewChatFormProps) {
  const [phone, setPhone] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>();

  const isPhoneEmpty = phone.trim() === '';

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const phoneDigits = phone.replace(NOT_DIGIT_PATTERN, '');
    const isLengthCorrect =
      phoneDigits.length >= MIN_PHONE_DIGITS && phoneDigits.length <= MAX_PHONE_DIGITS;

    if (!isLengthCorrect) {
      setErrorText(WRONG_PHONE_LENGTH_TEXT);
      return;
    }

    setErrorText(undefined);
    setPhone('');
    onCreate(`${phoneDigits}${PRIVATE_CHAT_SUFFIX}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off" className="flex items-start gap-2">
      <div className="flex-1">
        <Input
          id="phone"
          name="phone"
          label={PHONE_LABEL}
          placeholder={PHONE_PLACEHOLDER}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          inputMode="tel"
          autoComplete="off"
          error={errorText}
        />
      </div>

      <Button type="submit" disabled={isPhoneEmpty}>
        {CREATE_BUTTON_TEXT}
      </Button>
    </form>
  );
}
