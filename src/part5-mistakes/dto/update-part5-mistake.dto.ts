import { PartialType } from '@nestjs/mapped-types';
import { CreatePart5MistakeDto } from './create-part5-mistake.dto';

export class UpdatePart5MistakeDto extends PartialType(CreatePart5MistakeDto) {}
