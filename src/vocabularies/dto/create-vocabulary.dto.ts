import { IsNotEmpty } from "class-validator";

export class CreateVocabularyDto {
  @IsNotEmpty({ message: 'Vocab is required' })
  vocab: string;

  @IsNotEmpty({ message: 'Meaning is required' })
  meaning: string;

  @IsNotEmpty({ message: 'Example is required' })
  example: string;

  @IsNotEmpty({ message: 'Level is required' })
  level: string;

  @IsNotEmpty({ message: 'Pronounce is required' })
  pronounce: string;

  @IsNotEmpty({ message: 'Image is required' })
  img: string;
}
