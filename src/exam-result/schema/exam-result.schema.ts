import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Part } from 'src/parts/schema/part.schema';
import { Question } from 'src/question/schema/question.schema';


export type ExamResultDocument = HydratedDocument<ExamResult>;

@Schema({ timestamps: true, })
export class ExamResult {
  @Prop({ required: true })
  testId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  totalCorrect: number;

  @Prop({ required: true })
  totalListeningCorrect: number;

  @Prop({ required: true })
  totalReadingCorrect: number;

  @Prop({ required: true, type:[mongoose.Schema.Types.ObjectId], ref: Part.name })
  parts: Part[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Question.name, default: [] })
  correctAnswer: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Question.name, default: [] })
  wrongAnswer: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Question.name, default: [] })
  noAnswer: mongoose.Schema.Types.ObjectId[];

  @Prop()
  totalScore: number;

  @Prop()
  readingScore: number;

  @Prop()
  listeningScore: number;

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

export const ExamResultSchema = SchemaFactory.createForClass(ExamResult);
