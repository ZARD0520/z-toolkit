import { EventData } from '../monitor.type';

export interface LogDTO {
  type: string;
  level: string;
  data: EventData;
  info: any;
  userId?: string;
  userName?: string;
  time?: number;
}
