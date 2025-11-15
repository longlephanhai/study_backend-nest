import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type Part4Document = HydratedDocument<Part4>;

@Schema({ timestamps: true, })
export class Part4 {
  @Prop({ default: 'Part4' })
  type: string;
  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  audioUrl: string;

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

export const Part4Schema = SchemaFactory.createForClass(Part4);
