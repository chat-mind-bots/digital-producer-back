import { forwardRef, Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from 'src/test/test.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
