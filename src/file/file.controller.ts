import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/file/validators/size-validator';
import { diskStorage } from 'multer';
// import { extname } from 'src/file/utils/file.utils';
import { extname } from 'path';

@Controller('file')
@ApiTags('file')
export class FileController {
  @ApiOperation({ summary: 'upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // comment: { type: 'string' },
        // outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  // @FileSizeValidationPipe()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename(
          req,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const uniqSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${file.originalname}-${uniqSuffix}${ext}`;

          callback(null, fileName);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // ... Set of file validator instances here
          // new FileSizeValidationPipe(),
          // FileSizeValidationPipe,
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return { image_path: file.path };
  }
}
