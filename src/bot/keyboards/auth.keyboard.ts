import { Markup } from 'telegraf';
import * as process from 'process';

export const authKeyboard = (href: string) =>
  Markup.inlineKeyboard([
    Markup.button.url('Войти', href),
    ...(process.env.MODE !== 'LOCAL'
      ? [Markup.button.login('Авторизация на сайте', href)]
      : []),
  ]);
