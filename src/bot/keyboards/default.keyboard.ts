import { Markup } from 'telegraf';

export enum DefaultKeyboard {
  ENTER = 'Войти',
}
export const defaultKeyboard = () =>
  Markup.keyboard([[{ text: DefaultKeyboard.ENTER }]])
    .oneTime()
    .resize();
// ({
//   reply_markup: {
//     keyboard: [[{ text: DefaultKeyboard.ENTER }]],
//   },
// });
