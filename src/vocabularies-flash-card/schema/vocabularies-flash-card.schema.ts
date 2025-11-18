import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type VocabulariesFlashCardDocument = HydratedDocument<VocabulariesFlashCard>;

@Schema({ timestamps: true, })
export class VocabulariesFlashCard {
  @Prop({ required: true })
  vocabulary: string;

  @Prop({ required: true })
  meaning: string;

  @Prop()
  example: string;

  @Prop()
  pronunciation: string;

  @Prop()
  image: string;

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

export const VocabulariesFlashCardSchema = SchemaFactory.createForClass(VocabulariesFlashCard);
