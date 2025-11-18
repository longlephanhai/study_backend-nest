import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateVocabulariesFlashCardDto {
  @IsNotEmpty({ message: 'Vocabulary is required' })
  vocabulary: string;

  @IsNotEmpty({ message: 'Meaning is required' })
  meaning: string;

  @IsOptional()
  example: string;

  @IsOptional()
  pronunciation: string;

  @IsOptional()
  image: string;
}
