import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SurveyDocument = HydratedDocument<Survey>;

@Schema({ timestamps: true, })
export class Survey {
  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  toeicHistory: string;

  @Prop({ required: true })
  readingLevel: string;

  @Prop({ required: true })
  listeningLevel: string;

  @Prop({ required: true })
  vocabularyLevel: string;

  @Prop({ required: true })
  targetScore: number;

  @Prop({ required: true })
  focus: string;

  @Prop({ required: true })
  purpose: string;

  @Prop({ required: true })
  studyTimePerDay: string;

  @Prop({ required: true })
  studyTimePerWeek: string;

  @Prop({ required: true })
  examGoal: string;

  @Prop({ required: true })
  learningStyle: string;

  @Prop({ required: true })
  studyPreference: string;

  @Prop({ required: true })
  mentorSupportType: string;

  @Prop({ required: true })
  occupation: string;

  @Prop({ required: true })
  preferredStudyTime: string;

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

export const SurveySchema = SchemaFactory.createForClass(Survey);
