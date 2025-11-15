import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schema/user.schema';


export type UserTaskProgressDocument = HydratedDocument<UserTaskProgress>;

@Schema({ timestamps: true, })
export class UserTaskProgress {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  taskId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  completed: boolean;

  @Prop({ type: Date })
  submittedAt: Date

  @Prop({ default: 0 })
  score: number;

  @Prop()
  feedback: string;

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

export const UserTaskProgressSchema = SchemaFactory.createForClass(UserTaskProgress);
