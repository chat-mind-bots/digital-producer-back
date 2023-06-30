import { extname } from 'path';

export const videoFileFilter = (req, file, callback) => {
  if (!extname(file.originalname).match(/\.mp4$/)) {
    req.fileValidationError = 'Only mp4 videos are allowed!';
    callback(null, false);
  }
  callback(null, true);
};
