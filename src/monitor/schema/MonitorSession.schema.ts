import { Schema, Document } from 'mongoose';
import { DeviceInfo, LocationInfo } from '../monitor.type';

export const MonitorSessionSchema = new Schema({
  platform: { type: String },
  startTime: { type: Number, required: true },
  endTime: { type: Number },
  timezone: { type: String },
  language: { type: String },
  deviceInfo: { type: Object }, // JSON 数据
  locationInfo: { type: Object }, // JSON 数据
  userId: { type: Schema.Types.ObjectId, ref: 'MonitorUser' }, // 引用 MonitorUser
  events: [{ type: Schema.Types.ObjectId, ref: 'MonitorEvents' }], // 引用 MonitorEvents
});

export interface MonitorSession extends Document {
  platform?: string;
  startTime: number;
  endTime?: number;
  timezone?: string;
  language?: string;
  deviceInfo: DeviceInfo; // JSON 数据
  locationInfo: LocationInfo; // JSON 数据
  userId: Schema.Types.ObjectId;
  events: Schema.Types.ObjectId[];
}
