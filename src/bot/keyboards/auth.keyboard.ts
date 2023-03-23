import { Markup } from 'telegraf';

export const authKeyboard = (href: string) =>
  Markup.inlineKeyboard([Markup.button.url('Войти', href)]);
