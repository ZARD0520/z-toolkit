import { Schema, Document } from 'mongoose';
import { EventData } from '../monitor.type';

export const MonitorEventsSchema = new Schema({
  sessionId: {
    type: String,
    ref: 'MonitorSession',
    required: true,
  }, // 引用 MonitorSession
  userId: { type: String, ref: 'MonitorUser', required: true }, // 引用 MonitorUser
  projectId: { type: String, required: true },
  eventType: { type: String, required: true },
  eventName: { type: String, required: true },
  eventLevel: { type: String, required: true },
  pageUrl: { type: String },
  pageTitle: { type: String },
  createTime: { type: Number, required: true },
  eventData: { type: Object }, // JSON 数据
});

export interface MonitorEvents extends Document {
  sessionId: string;
  userId: string;
  projectId: string;
  eventType: string;
  eventName: string;
  eventLevel: string;
  pageUrl?: string;
  pageTitle?: string;
  createTime: number;
  eventData: EventData; // JSON 数据
}
