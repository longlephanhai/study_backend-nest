import { IsNotEmpty } from "class-validator";

export class CreateTopicsVocabularyDto {
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  description: string;
}
