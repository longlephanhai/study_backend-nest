import { PartialType } from '@nestjs/mapped-types';
import { CreateWritingHistoryDto } from './create-writing-history.dto';

export class UpdateWritingHistoryDto extends PartialType(CreateWritingHistoryDto) {}
