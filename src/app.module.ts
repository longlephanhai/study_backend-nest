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
    WritingHistoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
