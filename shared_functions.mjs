import path from 'path';

let username = '';

const setUsername = (value) => {
  username = value;
};

const getUsername = () => {
  return username;
};

const printCurrentDirectory = () => {
  const currentDirectory = process.cwd();
  console.log(`You are currently in ${currentDirectory}`);
};

const getRootDirectory = (directoryPath) => {
  const rootPath = path.parse(directoryPath).root;
  return rootPath;
};

const isSubdirectory = (childPath, parentPath) => {
  const relativePath = path.relative(parentPath, childPath);
  return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
};

const isRootDirectory = (directoryPath) => {
  const rootDirectory = getRootDirectory(directoryPath);
  return directoryPath === rootDirectory;
};

export {
  printCurrentDirectory,
  getRootDirectory,
  isSubdirectory,
  isRootDirectory,
  setUsername,
  getUsername,
};
