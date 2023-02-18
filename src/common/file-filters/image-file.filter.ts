export const imageFileFilter = (req, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files allowed!'), false);
  }
  callback(null, true);
};
