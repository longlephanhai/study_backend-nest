import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Question } from 'src/question/schema/question.schema';


export type PartDocument = HydratedDocument<Part>;

@Schema({ timestamps: true, })
export class Part {
  @Prop({ required: true })
  partNo: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  durationSec?: number;

  @Prop({ default: 0 })
  orderIndex: number;

  // Questions
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Question.name }] })
  questions: mongoose.Schema.Types.ObjectId[];

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

export const PartSchema = SchemaFactory.createForClass(Part);
