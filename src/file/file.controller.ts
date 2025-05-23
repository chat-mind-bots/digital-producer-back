import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { imageFileFilter } from 'src/file/validators/image.validator';
import { videoFileFilter } from 'src/file/validators/video.validator';
import { documentValidator } from 'src/file/validators/document.validator';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';

@Controller('file')
@ApiTags('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: 'upload image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20971520,
      },
      fileFilter: imageFileFilter,
    }),
  )
  @Roles(UserRoleEnum.PRODUCER)
  async uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file || req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError || 'Invalid file');
    }
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.fileService.uploadImage(
      file.buffer,
      file.originalname,
      file.size,
      token,
    );
  }

  @ApiOperation({ summary: 'upload video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('video')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 209715200,
      },
      fileFilter: videoFileFilter,
    }),
  )
  @Roles(UserRoleEnum.PRODUCER)
  async uploadVideo(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file || req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError || 'Invalid file');
    }

    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.fileService.uploadVideo(
      file.buffer,
      file.originalname,
      file.size,
      token,
    );
  }

  @ApiOperation({ summary: 'upload documents' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('document')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20971520,
      },
      fileFilter: documentValidator,
    }),
  )
  @Roles(UserRoleEnum.PRODUCER)
  async uploadDocument(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file || req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError || 'Invalid file');
    }

    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.fileService.uploadDocument(
      file.buffer,
      file.originalname,
      file.size,
      token,
    );
  }
}
