const fs = require('fs');
const path = require('path');
const { Readable, Writable } = require('stream');

function cat(filePath, callback) {
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
}

function add(fileName) {
  const filePath = path.join(process.cwd(), fileName);

  try {
    fs.writeFileSync(filePath, '');
    console.log(`File '${fileName}' created successfully`);
  } catch (error) {
    console.error('Error creating file:', error.message);
  }
}


async function rn(oldFilePath, newFileName) {
  const oldPath = path.resolve(process.cwd(), oldFilePath);
  const newPath = path.join(process.cwd(), newFileName);

  try {
    await fs.promises.rename(oldPath, newPath);
    console.log(`File '${oldFilePath}' renamed to '${newFileName}' successfully`);
  } catch (error) {
    console.error('Error renaming file:', error.message);
  }
}

async function cp(sourceFilePath, destinationDirectory) {
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
  });
}

async function mv(sourceFilePath, destinationDirectory) {
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
  });
}

async function rm(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);

  try {
    await fs.promises.unlink(fullPath);
    console.log(`File '${filePath}' deleted successfully`);
  } catch (error) {
    console.error('Error deleting file:', error.message);
  }
}

module.exports = {
  cat,
  add,
  rn,
  cp,
  mv,
  rm,
};
