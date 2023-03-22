import {
  Controller,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

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
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './files',
  //       filename(
  //         req,
  //         file: Express.Multer.File,
  //         callback: (error: Error | null, filename: string) => void,
  //       ) {
  //         const uniqSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         const fileName = `${file.originalname}-${uniqSuffix}${ext}`;
  //
  //         callback(null, fileName);
  //       },
  //     }),
  //   }),
  // )
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    // console.log(file);
    return this.fileService.uploadFile(file.buffer, file.originalname);
  }

  // @ApiOperation({ summary: 'getBucket' })
  // @Get('bucket')
  // getBuckets() {
  //   return this.fileService.getBucketList();
  // }
  // @ApiOperation({ summary: 'getBucket' })
  // @Post('bucket')
  // createBucket() {
  //   return this.fileService.createBucket();
  // }
  // @ApiOperation({ summary: 'get file' })
  // @Get(':key')
  // getFile(@Param('key') key: string) {
  //   return this.fileService.getFile(key);
  // }
}
