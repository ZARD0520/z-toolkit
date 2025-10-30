import { Schema, Document } from 'mongoose';

export const MediaResourceSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video', 'music'],
    required: true,
  },
  album: {
    type: Number, // 这里存储专辑的 id 字段，不是 ObjectId
    ref: 'Album',
    required: true,
  },
  duration: {
    type: Number,
    default: null,
  },
  lyrics: {
    type: String,
    default: '',
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  mimeType: {
    type: String,
    default: '',
  },
  resolution: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  playCount: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export interface MediaResourceType extends Document {
  id: number;
  name: string;
  url: string;
  type: 'image' | 'video' | 'music';
  album: number; // 关联专辑的 id
  duration: number | null;
  lyrics: string;
  fileSize: number;
  mimeType: string;
  resolution: string;
  order: number;
  isActive: boolean;
  playCount: number;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}
