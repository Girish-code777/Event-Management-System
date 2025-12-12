import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFeedback extends Document {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number; // 1-5
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comments: { type: String }
}, { timestamps: true });

FeedbackSchema.index({ eventId: 1, userId: 1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
