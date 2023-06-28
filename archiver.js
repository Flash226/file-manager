const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function compress(filePath, destinationPath, callback) {
  const sourcePath = path.resolve(process.cwd(), filePath);
  const sourceFileName = path.basename(filePath);
  const destinationDirectoryPath = path.resolve(process.cwd(), destinationPath);

  const sourceFileStream = fs.createReadStream(sourcePath);
  const destinationFileName = `${sourceFileName}.gz`;
  const destinationFilePath = path.join(destinationDirectoryPath, destinationFileName);

  const compressedFileStream = fs.createWriteStream(destinationFilePath);

  const brotliStream = zlib.createBrotliCompress();

  sourceFileStream.pipe(brotliStream).pipe(compressedFileStream);

  compressedFileStream.on('finish', () => {
    console.log(`File '${filePath}' compressed successfully to '${destinationFilePath}'`);
    callback();
  });

  compressedFileStream.on('error', (error) => {
    console.error('Error compressing file:', error.message);
  });
}


function decompress(filePath, destinationPath, callback) {
  const sourcePath = path.resolve(process.cwd(), filePath);
  const sourceFileName = path.basename(filePath);
  const destinationDirectoryPath = path.resolve(process.cwd(), destinationPath);

  const compressedFileStream = fs.createReadStream(sourcePath);
  const destinationFileName = sourceFileName.replace('.gz', '');
  const destinationFilePath = path.join(destinationDirectoryPath, destinationFileName);

  const decompressedFileStream = fs.createWriteStream(destinationFilePath);

  const brotliStream = zlib.createBrotliDecompress();

  compressedFileStream.pipe(brotliStream).pipe(decompressedFileStream);

  decompressedFileStream.on('finish', () => {
    console.log(`File '${filePath}' decompressed successfully to '${destinationFilePath}'`);
    callback();
  });

  decompressedFileStream.on('error', (error) => {
    console.error('Error decompressing file:', error.message);
  });
}


module.exports = {
  compress,
  decompress
};
