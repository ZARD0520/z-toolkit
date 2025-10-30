import { Schema, Document } from 'mongoose';

export const MediaAlbumSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['single', 'album'],
    required: true,
  },
  cover: {
    type: String,
    default: '',
  },
  releaseDate: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    default: '',
  },
  mediaCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
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

export interface MediaAlbumType extends Document {
  id: number;
  name: string;
  type: 'single' | 'album';
  cover: string;
  releaseDate: Date;
  description: string;
  mediaCount: number;
  isActive: boolean;
  viewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
