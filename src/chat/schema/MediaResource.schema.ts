import { Schema, Document } from 'mongoose';

export const MediaResourceSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
});

export interface MediaResourceType extends Document {
  id: string;
}
