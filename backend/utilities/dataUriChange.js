import path from 'path';
import DatauriParser from 'datauri/parser.js';
const parser = new DatauriParser();

const fileToDataUri = (file) => {
  const extensionName = path.extname(file.originalname).toString();
  return parser.format(extensionName, file.buffer).content;
};

export default fileToDataUri;
