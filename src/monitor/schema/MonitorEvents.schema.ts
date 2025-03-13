import { Schema, Document, Types } from 'mongoose';
import { EventData } from '../monitor.type';

export const MonitorEventsSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'MonitorSession',
    required: true,
  }, // 引用 MonitorSession
  userId: { type: Schema.Types.ObjectId, ref: 'MonitorUser', required: true }, // 引用 MonitorUser
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
  sessionId: Types.ObjectId;
  userId: Types.ObjectId;
  projectId: string;
  eventType: string;
  eventName: string;
  eventLevel: string;
  pageUrl?: string;
  pageTitle?: string;
  createTime: number;
  eventData: EventData; // JSON 数据
}
