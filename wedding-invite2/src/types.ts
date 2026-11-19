export type GiftItem = {
  owner?: string;
  bank?: string;
  accountNumber?: string;
  qrImage?: string;
};

export type TemplateEventData = {
  brideName: string;
  groomName: string;
  eventDate: string;
  eventDateDisplay: string;
  city: string;
  venue: string;
  hosts?: string;
  mapsUrl?: string;
  quote: string;
  gifts?: GiftItem[] | { type?: string; value?: GiftItem[] };
  locale?: string;
};
