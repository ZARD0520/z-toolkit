import { Schema, Document } from 'mongoose';
import { DeviceInfo, LocationInfo } from '../monitor.type';

export const MonitorSessionSchema = new Schema({
  _id: { type: String, required: true },
  platform: { type: String },
  startTime: { type: Number, required: true },
  endTime: { type: Number },
  timezone: { type: String },
  language: { type: String },
  deviceInfo: { type: Object }, // JSON 数据
  locationInfo: { type: Object }, // JSON 数据
  userId: { type: String, ref: 'MonitorUser', required: true }, // 引用 MonitorUser
  events: [{ type: String, ref: 'MonitorEvents' }], // 引用 MonitorEvents
});

export interface MonitorSession extends Document {
  platform?: string;
  startTime: number;
  endTime?: number;
  timezone?: string;
  language?: string;
  deviceInfo: DeviceInfo; // JSON 数据
  locationInfo: LocationInfo; // JSON 数据
  userId: string;
  events: string[];
}
