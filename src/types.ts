export enum Sender {
  React,
  Content
}

export interface ChromeMessage {
  from: Sender,
  payload?: any,
  action: string
}