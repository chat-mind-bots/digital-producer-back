import { extname } from 'path';

export const documentValidator = (req, file, callback) => {
  if (!extname(file.originalname).match(/\.(pdf|pptx?|docx?|xlsx?)$/)) {
    req.fileValidationError = 'The file is not a recognized document type!';
    callback(null, false);
  }
  callback(null, true);
};
