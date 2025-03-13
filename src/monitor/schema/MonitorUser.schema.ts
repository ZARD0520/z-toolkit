import { Schema, Document } from 'mongoose';
import { AttributesInfo } from '../monitor.type';

export const MonitorUserSchema = new Schema({
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  lastActiveTime: { type: Date },
  attributes: { type: Object }, // JSON 数据
  sessions: [{ type: Schema.Types.ObjectId, ref: 'MonitorSession' }], // 引用 MonitorSession
});

MonitorUserSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export interface MonitorUser extends Document {
  userId: string;
  projectId: string;
  lastActiveTime?: Date;
  attributes?: AttributesInfo; // JSON 数据
  sessions: Schema.Types.ObjectId[];
}
