import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { FilesModule } from './files/files.module';
import { DatabasesModule } from './databases/databases.module';
import { TestsModule } from './tests/tests.module';
import { PartsModule } from './parts/parts.module';
import { QuestionModule } from './question/question.module';
import { WritingModule } from './writing/writing.module';
import { WritingAiModule } from './writing-ai/writing-ai.module';
import { WritingHistoryModule } from './writing-history/writing-history.module';
import { TopicsVocabulariesModule } from './topics-vocabularies/topics-vocabularies.module';
import { VocabulariesModule } from './vocabularies/vocabularies.module';
import { SpeakingAiModule } from './speaking-ai/speaking-ai.module';
import { TopicsSpeakingModule } from './topics-speaking/topics-speaking.module';
import { ExamResultModule } from './exam-result/exam-result.module';
import { Part5MistakesModule } from './part5-mistakes/part5-mistakes.module';
import { GrammarsModule } from './grammars/grammars.module';
import { SurveysModule } from './surveys/surveys.module';
import { Part1Module } from './part1/part1.module';
import { LearningPathModule } from './learning-path/learning-path.module';
import { LearningStepModule } from './learning-step/learning-step.module';
import { LearningTaskModule } from './learning-task/learning-task.module';
import { UserTaskProgressModule } from './user-task-progress/user-task-progress.module';
import { Part2Module } from './part2/part2.module';
import { Part3Module } from './part3/part3.module';
import { Part4Module } from './part4/part4.module';
import { Part5Module } from './part5/part5.module';
import { Part6Module } from './part6/part6.module';
import { Part7Module } from './part7/part7.module';
import { FlashCardModule } from './flash-card/flash-card.module';
import { VocabulariesFlashCardModule } from './vocabularies-flash-card/vocabularies-flash-card.module';
import { AiAssistantModule } from './ai-assistant/ai-assistant.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    FilesModule,
    DatabasesModule,
    TestsModule,
    PartsModule,
    QuestionModule,
    WritingModule,
    WritingAiModule,
    WritingHistoryModule,
    TopicsVocabulariesModule,
    VocabulariesModule,
    SpeakingAiModule,
    TopicsSpeakingModule,
    ExamResultModule,
    Part5MistakesModule,
    GrammarsModule,
    SurveysModule,
    Part1Module,
    LearningPathModule,
    LearningStepModule,
    LearningTaskModule,
    UserTaskProgressModule,
    Part2Module,
    Part3Module,
    Part4Module,
    Part5Module,
    Part6Module,
    Part7Module,
    FlashCardModule,
    VocabulariesFlashCardModule,
    AiAssistantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
