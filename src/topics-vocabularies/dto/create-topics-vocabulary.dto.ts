import { IsNotEmpty, IsOptional } from "class-validator";
import { Vocabulary } from "src/vocabularies/schema/vocabulary.schema";

export class CreateTopicsVocabularyDto {
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  vocabularies: Vocabulary[];
}
