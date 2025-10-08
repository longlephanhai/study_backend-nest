import { PartialType } from '@nestjs/mapped-types';
import { CreateSpeakingAiDto } from './create-speaking-ai.dto';

export class UpdateSpeakingAiDto extends PartialType(CreateSpeakingAiDto) {}
