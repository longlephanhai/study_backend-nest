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
    Part1Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
