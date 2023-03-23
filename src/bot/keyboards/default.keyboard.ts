export enum DefaultKeyboard {
  ENTER = 'Войти',
}
export const defaultKeyboard = () => ({
  reply_markup: {
    keyboard: [[{ text: DefaultKeyboard.ENTER }]],
  },
});
