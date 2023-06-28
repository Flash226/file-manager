import fs from 'fs';
import path from 'path';
import { Readable, Writable } from 'stream';

const cat = (filePath, callback) => {
  const readableStream = fs.createReadStream(filePath);

  readableStream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  readableStream.on('error', (error) => {
    console.error('Error reading file:', error.message);
  });

  readableStream.on('end', () => {
    callback();
  });
};

const add = (fileName, callback) => {
  const filePath = path.join(process.cwd(), fileName);

  fs.writeFile(filePath, '', (error) => {
    if (error) {
      console.error('Error creating file:', error.message);
    } else {
      console.log(`File '${fileName}' created successfully`);
    }
    callback();
  });
};

const rn = async (oldFilePath, newFileName, callback) => {
  const oldPath = path.resolve(process.cwd(), oldFilePath);
  const newPath = path.join(process.cwd(), newFileName);

  try {
    await fs.promises.rename(oldPath, newPath);
    console.log(`File '${oldFilePath}' renamed to '${newFileName}' successfully`);
  } catch (error) {
    console.error('Error renaming file:', error.message);
  }
  callback();
};

const cp = async (sourceFilePath, destinationDirectory, callback) => {
  const sourcePath = path.resolve(process.cwd(), sourceFilePath);
  const destinationPath = path.resolve(process.cwd(), destinationDirectory, path.basename(sourcePath));

  const readableStream = fs.createReadStream(sourcePath);
  const writableStream = fs.createWriteStream(destinationPath);

  readableStream.pipe(writableStream);

  readableStream.on('error', (error) => {
    console.error('Error reading file:', error.message);
  });

  writableStream.on('error', (error) => {
    console.error('Error writing file:', error.message);
  });

  writableStream.on('finish', () => {
    console.log(`File '${sourceFilePath}' copied to '${destinationDirectory}' successfully`);
    callback();
  });
};

const mv = async (sourceFilePath, destinationDirectory, callback) => {
  const sourcePath = path.resolve(process.cwd(), sourceFilePath);
  const destinationPath = path.resolve(process.cwd(), destinationDirectory, path.basename(sourcePath));

  const readableStream = fs.createReadStream(sourcePath);
  const writableStream = fs.createWriteStream(destinationPath);

  readableStream.pipe(writableStream);

  readableStream.on('error', (error) => {
    console.error('Error reading file:', error.message);
  });

  writableStream.on('error', (error) => {
    console.error('Error writing file:', error.message);
  });

  writableStream.on('finish', async () => {
    try {
      await fs.promises.unlink(sourcePath);
      console.log(`File '${sourceFilePath}' moved to '${destinationDirectory}' successfully`);
    } catch (error) {
      console.error('Error moving file:', error.message);
    }
    callback();
  });
};

const rm = async (filePath, callback) => {
  const fullPath = path.resolve(process.cwd(), filePath);

  try {
    await fs.promises.unlink(fullPath);
    console.log(`File '${filePath}' deleted successfully`);
  } catch (error) {
    console.error('Error deleting file:', error.message);
  }
  callback();
};

export {
  cat,
  add,
  rn,
  cp,
  mv,
  rm,
};
