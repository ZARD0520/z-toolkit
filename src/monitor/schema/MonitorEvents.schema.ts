import { Schema, Document } from 'mongoose';
import { EventData } from '../monitor.type';

export const MonitorEventsSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'MonitorSession' }, // 引用 MonitorSession
  userId: { type: Schema.Types.ObjectId, ref: 'MonitorUser' }, // 引用 MonitorUser
  projectId: { type: String, required: true },
  eventType: { type: String, required: true },
  eventName: { type: String, required: true },
  eventLevel: { type: String, required: true },
  pageUrl: { type: String },
  pageTitle: { type: String },
  referrerUrl: { type: String },
  createTime: { type: Date, default: Date.now },
  eventData: { type: Object }, // JSON 数据
  errorMessage: { type: String },
  errorStack: { type: String },
  errorCode: { type: String },
  loadTime: { type: Date },
  resourceSize: { type: Number },
});

export interface MonitorEvents extends Document {
  sessionId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  eventType: string;
  eventName: string;
  pageUrl?: string;
  referrerUrl?: string;
  version?: string;
  createTime: Date;
  eventData: EventData; // JSON 数据
  errorMessage?: string;
  errorStack?: string;
  errorCode?: string;
  loadTime?: Date;
  resourceSize?: number;
}
