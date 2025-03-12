import { Schema, Document } from 'mongoose';
import { AttributesInfo } from '../monitor.type';

export const MonitorUserSchema = new Schema({
  lastActiveTime: { type: Date },
  attributes: { type: Object }, // JSON 数据
  sessions: [{ type: Schema.Types.ObjectId, ref: 'MonitorSession' }], // 引用 MonitorSession
});

export interface MonitorUser extends Document {
  name: string;
  lastActiveTime?: Date;
  attributes?: AttributesInfo; // JSON 数据
  sessions: Schema.Types.ObjectId[];
}
