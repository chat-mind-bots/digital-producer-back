export const documentFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback,
) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    req.fileValidationError('Only pdf files allowed!');
    return callback(null, false);
  }
  callback(null, true);
};
