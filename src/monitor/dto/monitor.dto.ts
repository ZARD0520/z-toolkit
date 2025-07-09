import { EventData } from '../monitor.type';

export interface LogDTO {
  type: {
    value: string;
    text: string;
  };
  level: {
    value: string;
    text: string;
  };
  data: EventData;
  info: any;
  projectId: string;
  userId?: string;
  userName?: string;
  time: number;
}
