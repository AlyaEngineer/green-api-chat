import { NETWORK_ERROR } from '@/constants';

export class GreenApiError extends Error {
  status: number;

  constructor(status: number, details = '') {
    super(`GREEN-API request failed with status ${status}${details ? `: ${details}` : ''}`);
    this.status = status;
  }
}

export function getErrorMessage(error: unknown): string {
  if (!(error instanceof GreenApiError)) {
    return 'Что-то пошло не так. Попробуйте ещё раз';
  }

  switch (error.status) {
    case NETWORK_ERROR:
      return 'Нет соединения с сервером. Проверьте интернет';
    case 400:
      return 'Запрос не выполнен. Проверьте, что инстанс авторизован, и попробуйте ещё раз';
    case 401:
    case 403:
      return 'Неверный idInstance или apiTokenInstance';
    case 429:
      return 'Слишком много запросов. Подождите немного и попробуйте снова';
    case 466:
      return 'Достигнут лимит тарифа GREEN-API';
    default:
      return 'Ошибка сервера. Попробуйте позже';
  }
}
