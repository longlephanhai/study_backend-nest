import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type Part7Document = HydratedDocument<Part7>;

@Schema({ timestamps: true, })
export class Part7 {
  @Prop({ required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true })
  explanation: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  transcript: string;

  @Prop({ required: true })
  questionContent: string;

  @Prop({ required: true })
  reading: string;

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

export const Part7Schema = SchemaFactory.createForClass(Part7);
