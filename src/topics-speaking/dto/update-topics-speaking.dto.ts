import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicsSpeakingDto } from './create-topics-speaking.dto';

export class UpdateTopicsSpeakingDto extends PartialType(CreateTopicsSpeakingDto) {}
