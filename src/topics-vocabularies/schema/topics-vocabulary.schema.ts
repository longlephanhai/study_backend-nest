import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type TopicsVocabularyDocument = HydratedDocument<TopicsVocabulary>;

@Schema({ timestamps: true, })
export class TopicsVocabulary {

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  description: string;

  // vocabulary 

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

export const TopicsVocabularySchema = SchemaFactory.createForClass(TopicsVocabulary);
