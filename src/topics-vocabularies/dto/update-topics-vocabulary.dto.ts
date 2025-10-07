import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicsVocabularyDto } from './create-topics-vocabulary.dto';

export class UpdateTopicsVocabularyDto extends PartialType(CreateTopicsVocabularyDto) {}
