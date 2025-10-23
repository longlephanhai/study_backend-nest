import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type LearningTaskDocument = HydratedDocument<LearningTask>;

@Schema({ timestamps: true, })
export class LearningTask {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  resourceUrl: string;

  @Prop({ enum: ['video', 'reading', 'listening', 'quiz', 'practice'], default: 'reading' })
  type: string;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop()
  relatedStep: number;

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

export const LearningTaskSchema = SchemaFactory.createForClass(LearningTask);
