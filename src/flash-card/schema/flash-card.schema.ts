import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { VocabulariesFlashCard } from 'src/vocabularies-flash-card/schema/vocabularies-flash-card.schema';

export type FlashCardDocument = HydratedDocument<FlashCard>;

@Schema({ timestamps: true, })
export class FlashCard {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: VocabulariesFlashCard.name })
  vocabulariesFlashCardId: mongoose.Schema.Types.ObjectId[];

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

export const FlashCardSchema = SchemaFactory.createForClass(FlashCard);
