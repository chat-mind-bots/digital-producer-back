import { Markup } from 'telegraf';
import * as process from 'process';

export const authKeyboard = (href: string) =>
  Markup.inlineKeyboard([
    ...(process.env.MODE !== 'LOCAL'
      ? [Markup.button.login('Авторизация на сайте', href)]
      : [Markup.button.url('Войти', href)]),
  ]);
