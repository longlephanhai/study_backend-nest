import { IsNotEmpty } from "class-validator";

export class CreateTopicsSpeakingDto {
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  description: string;
}
