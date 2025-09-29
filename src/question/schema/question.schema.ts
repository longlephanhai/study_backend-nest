import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true, })
export class Question {
  @Prop({ required: true })
  numberQuestion: number;

  @Prop()
  questionContent?: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  explanation?: string;

  @Prop()
  audioUrl?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  transcript?: string;

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

export const QuestionSchema = SchemaFactory.createForClass(Question);
