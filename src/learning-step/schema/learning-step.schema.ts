import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { LearningTask } from 'src/learning-task/schema/learning-task.schema';


export type LearningStepDocument = HydratedDocument<LearningStep>;

@Schema({ timestamps: true, })
export class LearningStep {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  order: number;

  // task
  @Prop({ type: [{ type: Types.ObjectId, ref: LearningTask.name }] })
  tasks: LearningTask[];

  @Prop({ type: Date, default: Date.now })
  unlockAt: Date;


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

export const LearningStepSchema = SchemaFactory.createForClass(LearningStep);
