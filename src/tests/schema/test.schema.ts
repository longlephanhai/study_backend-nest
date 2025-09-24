import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Part } from 'src/parts/schema/part.schema';


export type TestDocument = HydratedDocument<Test>;

@Schema({ timestamps: true, })
export class Test {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 7200 })
  durationSec: number;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: 0 })
  totalQuestions: number;

  @Prop({ required: true })
  audioUrl: string;

  // parts
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Part.name }] })
  parts?: mongoose.Schema.Types.ObjectId[];

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

export const TestSchema = SchemaFactory.createForClass(Test);
