import { Schema, Document, Types } from 'mongoose';
import { AttributesInfo } from '../monitor.type';

export const MonitorUserSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String },
  projectId: { type: String, required: true },
  lastActiveTime: { type: Number, required: true },
  attributes: { type: Object }, // JSON 数据
  sessions: [{ type: Schema.Types.ObjectId, ref: 'MonitorSession' }], // 引用 MonitorSession
});

MonitorUserSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export interface MonitorUser extends Document {
  userId: string;
  userName?: string;
  projectId: string;
  lastActiveTime: number;
  attributes?: AttributesInfo; // JSON 数据
  sessions: Types.ObjectId[];
}
