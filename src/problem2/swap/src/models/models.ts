export type Token = {
  currency: string;
  date: string;
  price: number;
};
export type FormValues = {
  sendAmount: number;
  receiveAmount: number;
  send: Token;
  receive: Token;
};
export type InputType = 'send' | 'receive';
export type InputAmountType = 'sendAmount' | 'receiveAmount';