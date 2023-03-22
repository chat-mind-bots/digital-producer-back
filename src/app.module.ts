import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BotModule } from './bot/bot.module';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { BannerModule } from './banner/banner.module';
import { TagsModule } from './tags/tags.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { NewsModule } from './news/news.module';
import { CourseModule } from './course/course.module';
import { DocumentModule } from './document/document.module';
import { TestModule } from './test/test.module';
import { ConfigModule as ConfigAppModule } from './config/config.module';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { S3Module } from 'nestjs-s3';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      connectionFactory: (connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/apps/api/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    S3Module.forRootAsync({
      useFactory: () => ({
        config: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          region: process.env.S3_REGION,
          endpoint: process.env.S3_ENDPOINT,
          s3ForcePathStyle: true,
          // signatureVersion: 'v4',
        },
      }),
    }),
    BotModule,
    BannerModule,
    TagsModule,
    UserModule,
    AuthModule,
    JwtModule,
    NewsModule,
    CourseModule,
    DocumentModule,
    TestModule,
    ConfigAppModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
