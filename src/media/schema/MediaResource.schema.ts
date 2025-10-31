import { Schema, Document } from 'mongoose';
import { MediaType } from '../mediaResource.type';

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
    enum: MediaType,
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
});

export interface MediaResourceType extends Document {
  id: number;
  name: string;
  url: string;
  type: 'image' | 'video' | 'music';
  album: number; // 关联专辑的 id
  duration: number | null;
  lyrics: string;
}
