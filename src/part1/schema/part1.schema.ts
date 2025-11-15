import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type Part1Document = HydratedDocument<Part1>;

@Schema({ timestamps: true, })
export class Part1 {
  @Prop({ default: 'Part1' })
  type: string;

  @Prop({ required: true })
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

export const Part1Schema = SchemaFactory.createForClass(Part1);
