import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type TopicsSpeakingDocument = HydratedDocument<TopicsSpeaking>;

@Schema({ timestamps: true, })
export class TopicsSpeaking {

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  description: string;


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

export const TopicsSpeakingSchema = SchemaFactory.createForClass(TopicsSpeaking);
