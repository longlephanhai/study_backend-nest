import { PartialType } from '@nestjs/mapped-types';
import { CreateVocabulariesFlashCardDto } from './create-vocabularies-flash-card.dto';

export class UpdateVocabulariesFlashCardDto extends PartialType(CreateVocabulariesFlashCardDto) {}
