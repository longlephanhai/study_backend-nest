import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { LearningStep } from 'src/learning-step/schema/learning-step.schema';
import { Survey } from 'src/surveys/schema/survey.schema';

export type LearningPathDocument = HydratedDocument<LearningPath>;

@Schema({ timestamps: true, })
export class LearningPath {
  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Survey.name })
  survey: mongoose.Schema.Types.ObjectId;

  // steps
  @Prop({ type: [{ type: Types.ObjectId, ref: LearningStep.name }] })
  steps: LearningStep[];

  @Prop({ default: 1 })
  currentDay: number;

  @Prop({ default: false })
  isCompleted: boolean;

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

export const LearningPathSchema = SchemaFactory.createForClass(LearningPath);
