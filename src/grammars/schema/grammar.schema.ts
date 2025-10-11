import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type GrammarDocument = HydratedDocument<Grammar>;

@Schema({ timestamps: true, })
export class Grammar {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;


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

export const GrammarSchema = SchemaFactory.createForClass(Grammar);
