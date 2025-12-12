import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  userId: Types.ObjectId;
  name: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)
