import type messages from "./messages/es.json";

export type Messages = typeof messages;

declare global {
  // Use type safe message keys with `auto-complete`
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
