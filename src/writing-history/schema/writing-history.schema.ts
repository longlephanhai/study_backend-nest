import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Writing } from 'src/writing/schema/writing.schema';

export type WritingHistoryDocument = HydratedDocument<WritingHistory>;

@Schema({ timestamps: true, })
export class WritingHistory {
  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Writing.name })
  writingId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Object })
  feedback: WritingFeedback;

  @Prop({ type: Object })
  score: any;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  }

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  }

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  }

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const WritingHistorySchema = SchemaFactory.createForClass(WritingHistory);
