import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectS3, S3 } from 'nestjs-s3';
import { extname } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from 'src/file/file.schema';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateFileDto } from 'src/file/dto/create-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectS3() private readonly s3: S3,
    @InjectModel(File.name)
    private readonly fileModel: Model<FileDocument>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  async createBucket() {
    await this.s3.createBucket({ Bucket: 'bucket' }).promise();
    return this.getBucketList();
  }
  async getBucketList() {
    const list = await this.s3.listBuckets().promise();
    return list;
  }

  async uploadImage(
    dataBuffer: Buffer,
    filename: string,
    fileSize: number,
    token: string,
  ) {
    return this.uploadFile(
      dataBuffer,
      filename,
      fileSize,
      process.env.S3_IMAGE_BUCKET,
      token,
      process.env.S3_DOMAIN_IMAGES,
    );
  }

  async uploadVideo(
    dataBuffer: Buffer,
    filename: string,
    fileSize: number,
    token: string,
  ) {
    return this.uploadFile(
      dataBuffer,
      filename,
      fileSize,
      process.env.S3_VIDEO_BUCKET,
      token,
      process.env.S3_DOMAIN_VIDEO,
      2e10, //20 GB to Bytes
    );
  }

  async uploadDocument(
    dataBuffer: Buffer,
    filename: string,
    fileSize: number,
    token: string,
  ) {
    return this.uploadFile(
      dataBuffer,
      filename,
      fileSize,
      process.env.S3_DOCUMENTS_BUCKET,
      token,
      process.env.S3_DOMAIN_DOCUMENTS,
    );
  }

  async uploadFile(
    dataBuffer: Buffer,
    filename: string,
    fileSize: number,
    bucket: string,
    token: string,
    domain: string,
    maxTotalSize?: number,
  ) {
    const { _id: owner } = await this.authService.getUserInfo(token);

    if (maxTotalSize) {
      const aggregateResult = await this.fileModel.aggregate([
        {
          $match: {
            domain: domain,
            owner: owner,
          },
        },
        {
          $group: {
            _id: null,
            totalSize: { $sum: '$file_size' },
          },
        },
      ]);

      if (
        aggregateResult.length > 0 &&
        aggregateResult[0].totalSize > maxTotalSize
      ) {
        throw new HttpException(`Memory limit exceeded`, HttpStatus.FORBIDDEN);
      }
    }

    const uploadResult = await this.s3
      .upload({
        Bucket: bucket,
        Body: dataBuffer,
        Key: `${uuidv4()}_${extname(filename)}`,
        ACL: 'public-read',
      })
      .promise();

    const url = `https://${domain}/${uploadResult.Key}`;

    const dto: CreateFileDto = {
      e_tag: uploadResult.ETag,
      key: uploadResult.Key,
      bucket: uploadResult.Bucket,
      location: uploadResult.Location,
      domain,
      file_size: fileSize,
      url,
    };

    await this.createNewFile(dto, token);

    return {
      key: uploadResult.Key,
      url,
    };
  }

  async getFile(key: string) {
    const response = await this.s3
      .getObject({
        Bucket: process.env.S3_DOCUMENTS_BUCKET,
        Key: key,
      })
      .promise();
    return response.Body;
  }

  async createNewFile(dto: CreateFileDto, token: string) {
    const { _id } = await this.authService.getUserInfo(token);

    await this.fileModel.create({
      ...dto,
      owner: _id,
    });
  }
}
