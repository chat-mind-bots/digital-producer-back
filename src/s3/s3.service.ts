import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class S3Service {
  // constructor(private configService: ConfigService) {
  //   // const s3 = new S3Client({ endpoint:})
  // }

  async uploadFile(file: Express.Multer.File, key: string) {}
}
