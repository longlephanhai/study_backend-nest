import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema({ timestamps: true, })
export class Vocabulary {

  @Prop({ required: true })
  vocab: string;

  @Prop({ required: true })
  meaning: string;

  @Prop({ required: true })
  example: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  pronounce: string;

  @Prop({ required: true })
  img: string;

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

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
