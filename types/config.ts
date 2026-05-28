export interface WeddingConfig {
  groomName: string;
  brideName: string;
  groomEventDate: string;
  brideEventDate: string;
  eventTime: string;
  eventDay: string;
  eventMonthYear: string;
  eventWeekday: string;
  lunarDate: string;
  venue: string;
  venueAddress: string;
  photos: Record<string, string>; // templatePath → url
}
