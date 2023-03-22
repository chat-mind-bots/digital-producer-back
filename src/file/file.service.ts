import { HttpException, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { InjectS3, S3 } from 'nestjs-s3';

@Injectable()
export class FileService {
  constructor(@InjectS3() private readonly s3: S3) {}
  async createBucket() {
    await this.s3.createBucket({ Bucket: 'bucket' }).promise();
    return this.getBucketList();
  }
  async getBucketList() {
    const list = await this.s3.listBuckets().promise();
    return list;
  }

  async uploadFile(dataBuffer: Buffer, filename: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.S3_DOCUMENTS_BUCKET,
        Body: dataBuffer,
        Key: `${uuidv4()}_${filename}`,
        ACL: 'public-read',
      })
      .promise();

    return {
      key: uploadResult.Key,
      // url: uploadResult.Location,
      url: `${process.env.S3_DOMAIN}/${process.env.S3_DOCUMENTS_BUCKET}/${uploadResult.Key}`,
    };
  }

  async getFile(key: string) {
    // const params = {
    //   Bucket: 'BucketName',
    //   Key: 'ObjectName',
    // };
    const response = await this.s3
      .getObject({
        Bucket: process.env.S3_DOCUMENTS_BUCKET,
        Key: key,
      })
      .promise();
    return response.Body;
  }
}
