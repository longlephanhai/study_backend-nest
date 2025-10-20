import { IsNotEmpty } from "class-validator";

export class CreateSurveyDto {
  @IsNotEmpty({ message: 'Toeic history is required' })
  toeicHistory: string;

  @IsNotEmpty({ message: 'Reading level is required' })
  readingLevel: string;

  @IsNotEmpty({ message: 'Listening level is required' })
  listeningLevel: string;

  @IsNotEmpty({ message: 'Vocabulary level is required' })
  vocabularyLevel: string;

  @IsNotEmpty({ message: 'Target score is required' })
  targetScore: number;

  @IsNotEmpty({ message: 'Focus is required' })
  focus: string;

  @IsNotEmpty({ message: 'Purpose is required' })
  purpose: string;

  @IsNotEmpty({ message: 'Study time per day is required' })
  studyTimePerDay: string;

  @IsNotEmpty({ message: 'Study time per week is required' })
  studyTimePerWeek: string;

  @IsNotEmpty({ message: 'Exam goal is required' })
  examGoal: string;

  @IsNotEmpty({ message: 'Learning style is required' })
  learningStyle: string;

  @IsNotEmpty({ message: 'Study preference is required' })
  studyPreference: string;

  @IsNotEmpty({ message: 'Mentor support type is required' })
  mentorSupportType: string;

  @IsNotEmpty({ message: 'Occupation is required' })
  occupation: string;

  @IsNotEmpty({ message: 'Preferred study time is required' })
  preferredStudyTime: string;
}
