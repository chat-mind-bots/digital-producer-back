import { forwardRef, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from 'src/file/file.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
