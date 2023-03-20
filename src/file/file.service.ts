import { HttpException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  constructor() {}
  // async uploadFile(req): Promise<any> {
  //   const promises = [];
  //
  //   return new Promise((resolve, reject) => {
  //     const mp = req.multipart(handler, onEnd);
  //
  //     function onEnd(err) {
  //       if (err) {
  //         reject(new HttpException(err, 500));
  //       } else {
  //         Promise.all(promises).then(
  //           (data) => {
  //             resolve({ result: 'OK' });
  //           },
  //           (err) => {
  //             reject(new HttpException(err, 500));
  //           },
  //         );
  //       }
  //     }
  //
  //     function handler(field, file, filename, encoding, mimetype: string) {
  //       if (mimetype && mimetype.match(/^image\/(.*)/)) {
  //         const imageType = mimetype.match(/^image\/(.*)/)[1];
  //         const s3Stream = new S3({
  //           accessKeyId: 'minio',
  //           secretAccessKey: 'minio123',
  //           endpoint: 'http://127.0.0.1:9001',
  //           s3ForcePathStyle: true, // needed with minio?
  //           signatureVersion: 'v4',
  //         });
  //         const promise = s3Stream
  //           .upload({
  //             Bucket: 'test',
  //             Key: `200x200_${filename}`,
  //             Body: file.pipe(sharp().resize(200, 200)[imageType]()),
  //           })
  //           .promise();
  //         promises.push(promise);
  //       }
  //       const s3Stream = new S3({
  //         accessKeyId: 'minio',
  //         secretAccessKey: 'minio123',
  //         endpoint: 'http://127.0.0.1:9001',
  //         s3ForcePathStyle: true, // needed with minio?
  //         signatureVersion: 'v4',
  //       });
  //       const promise = s3Stream
  //         .upload({ Bucket: 'test', Key: filename, Body: file })
  //         .promise();
  //       promises.push(promise);
  //     }
  //   });
  // }
}
