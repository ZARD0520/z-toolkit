import { Schema, Document } from 'mongoose';
import { MediaType } from '../mediaResource.type';

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
    enum: MediaType,
    required: true,
  },
  subType: {
    type: String,
    enum: ['single', 'album'],
  },
  cover: {
    type: String,
    default: '',
  },
  releaseDate: {
    type: Number,
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
});

export interface MediaAlbumType extends Document {
  id: number;
  name: string;
  type: 'single' | 'album';
  cover: string;
  releaseDate: number;
  description: string;
  mediaCount: number;
}
