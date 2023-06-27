const fs = require('fs');
const path = require('path');

function goUp() {
  const currentDirectory = process.cwd();
  const parentDirectory = path.resolve(currentDirectory, '..');

  if (isRootDirectory(currentDirectory)) {
    console.log("You can't go higher than the root directory");
  } else {
    try {
      process.chdir(parentDirectory);
    } catch (error) {
      console.log('Operation failed:', error.message);
    }
  }
}

function goToDirectory(directoryPath) {
  const currentDirectory = process.cwd();
  const targetDirectory = path.join(currentDirectory, directoryPath);

  if (!fs.existsSync(targetDirectory)) {
    console.log(`Directory '${directoryPath}' does not exist`);
  } else if (!fs.statSync(targetDirectory).isDirectory()) {
    console.log(`'${directoryPath}' is not a valid directory`);
  } else {
    try {
      process.chdir(targetDirectory);
    } catch (error) {
      console.log('Operation failed:', error.message);
    }
  }
}

function listDirectory() {
  const currentDirectory = process.cwd();
  try {
    const directoryContent = fs.readdirSync(currentDirectory);

    if (directoryContent.length === 0) {
      console.log('Files and directories not found');
      return;
    }

    const directoryEntries = [];
    const fileEntries = [];

    directoryContent.forEach((item) => {
      const itemPath = path.join(currentDirectory, item);
      const itemStat = fs.statSync(itemPath);

      const entry = {
        Name: item,
        Type: itemStat.isDirectory() ? 'Directory' : 'File',
      };

      if (itemStat.isDirectory()) {
        directoryEntries.push(entry);
      } else {
        fileEntries.push(entry);
      }
    });

    directoryEntries.sort((a, b) => a.Name.localeCompare(b.Name));
    fileEntries.sort((a, b) => a.Name.localeCompare(b.Name));

    const allEntries = directoryEntries.concat(fileEntries);

    console.table(allEntries, ['Name', 'Type']);
  } catch (error) {
    console.log('Operation failed:', error.message);
  }
}

function isRootDirectory(directoryPath) {
  const rootDirectory = getRootDirectory(directoryPath);
  return directoryPath === rootDirectory;
}

function getRootDirectory(directoryPath) {
  const rootPath = path.parse(directoryPath).root;
  return rootPath;
}

module.exports = {
  goUp,
  goToDirectory,
  listDirectory,
};
