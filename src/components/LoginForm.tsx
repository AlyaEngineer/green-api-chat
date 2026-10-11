import { useState, type SubmitEvent } from 'react';

import { getErrorMessage } from '@/api/errors';
import { getStateInstance } from '@/api/greenApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GREEN_API_CONSOLE_URL } from '@/constants';
import type { Credentials } from '@/types';

const ONLY_DIGITS_PATTERN = /^\d+$/;

const INSTANCE_STATE_AUTHORIZED = 'authorized';
const INSTANCE_STATE_NOT_AUTHORIZED = 'notAuthorized';

const ID_INSTANCE_NOT_DIGITS_TEXT = 'idInstance должен состоять только из цифр';
const NOT_AUTHORIZED_TEXT =
  'Инстанс не авторизован. Отсканируйте QR-код в личном кабинете GREEN-API';
const UNAVAILABLE_TEXT = 'Инстанс недоступен, статус:';

const SUBMIT_BUTTON_TEXT = 'Продолжить';
const CHECKING_BUTTON_TEXT = 'Проверяем...';

type LoginFormProps = {
  onLogin: (credentials: Credentials) => void;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [idInstance, setIdInstance] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const areBothFieldsFilled = idInstance.trim() !== '' && apiToken.trim() !== '';

  let submitButtonText = SUBMIT_BUTTON_TEXT;

  if (isChecking) {
    submitButtonText = CHECKING_BUTTON_TEXT;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const credentials = { idInstance: idInstance.trim(), apiToken: apiToken.trim() };

    if (!ONLY_DIGITS_PATTERN.test(credentials.idInstance)) {
      setErrorText(ID_INSTANCE_NOT_DIGITS_TEXT);
      return;
    }

    setErrorText(null);
    setIsChecking(true);

    try {
      const instanceState = await getStateInstance(credentials);

      if (instanceState === INSTANCE_STATE_AUTHORIZED) {
        onLogin(credentials);
        return;
      }

      if (instanceState === INSTANCE_STATE_NOT_AUTHORIZED) {
        setErrorText(NOT_AUTHORIZED_TEXT);
      } else {
        setErrorText(`${UNAVAILABLE_TEXT} ${instanceState}`);
      }
    } catch (requestError) {
      setErrorText(getErrorMessage(requestError));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className="flex w-full max-w-145 flex-col items-center rounded-card bg-linear-to-b from-card-from to-card-to px-6 py-12 text-center shadow-card backdrop-blur-xl sm:min-h-150 sm:justify-center"
      >
        <div className="relative size-14">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-full bg-conic from-themed via-mint to-themed opacity-60 blur-xl"
          />
          <img src="/favicon.svg" alt="" className="relative size-14" />
        </div>

        <h1 className="my-8 text-xl leading-6 font-semibold">Вход</h1>

        <p className="mb-8 text-base leading-5 text-secondary">
          Введите данные инстанса из{' '}
          <a
            href={GREEN_API_CONSOLE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-themed hover:underline"
          >
            личного кабинета GREEN-API
          </a>
        </p>

        <div className="flex w-full max-w-85 flex-col gap-2">
          <Input
            id="idInstance"
            name="instance-id"
            label="idInstance"
            placeholder="idInstance"
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
          />

          <Input
            id="apiToken"
            name="instance-token"
            label="apiTokenInstance"
            placeholder="apiTokenInstance"
            type="password"
            value={apiToken}
            onChange={(event) => setApiToken(event.target.value)}
            autoComplete="new-password"
          />

          <p role="alert" className="min-h-10 text-sm leading-5 text-negative">
            {errorText}
          </p>

          <Button
            type="submit"
            size="large"
            disabled={!areBothFieldsFilled || isChecking}
            className="w-full"
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </main>
  );
}
