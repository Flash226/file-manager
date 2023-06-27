const os = require('os');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const systemInfo = require('./system_info');
const navigation = require('./navigation');
const fileFunctions = require('./file_functions');
const calculateHash = require('./calculate_hash');


const initialWorkingDirectory = os.homedir();
process.chdir(initialWorkingDirectory);

const rootDirectory = getRootDirectory(initialWorkingDirectory);

let username = '';

const usernameIndex = process.argv.findIndex((arg) =>
  arg.startsWith('--username=')
);

if (usernameIndex !== -1) {
  username = process.argv[usernameIndex].split('=')[1];
}

if (username === '') {
  username = 'Not entered username';
}

console.log(`Welcome to the File Manager, ${username}!`);

function printCurrentDirectory() {
  const currentDirectory = process.cwd();
  console.log(`You are currently in ${currentDirectory}`);
}

printCurrentDirectory();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter a command: ',
});

rl.on('line', (line) => {
  processCommand(line.trim());
});

rl.on('SIGINT', () => {
  exitProgram();
});

const commandActions = {
  '.exit': exitProgram,
  'os --info': systemInfo.getOperatingSystemInfo,
  'os --eol': systemInfo.getEndOfLine,
  'os --cpus': systemInfo.getCPUsInfo,
  'os --homedir': systemInfo.getHomeDirectory,
  'os --username': systemInfo.getCurrentSystemUsername,
  'os --architecture': systemInfo.getCPUArchitecture,
  up: navigation.goToParentDirectory,
  cd: navigation.goToDirectory,
  ls: navigation.listDirectory,
  cat: fileFunctions.cat,
  add: fileFunctions.add,
  rn: fileFunctions.rn,
  cp: fileFunctions.cp,
  mv: fileFunctions.mv,
  rm: fileFunctions.rm,
};

function processCommand(command) {
  const action = commandActions[command];
  if (action) {
    try {
      action();
    } catch (error) {
      console.log('Operation failed:', error.message);
    }
  } else if (command.startsWith('cd')) {
    const directoryPath = command.slice(3).trim();
    const targetDirectory = path.resolve(process.cwd(), directoryPath);
    if (isSubdirectory(targetDirectory, rootDirectory)) {
      navigation.goToDirectory(directoryPath);
    }
  } else if (command === 'up') {
    if (!isRootDirectory(process.cwd())) {
      navigation.goUp();
    }
  } else if (command.trim() === 'add') {
    console.log('Please provide a file name.');
  } else if (command.startsWith('add ')) {
    const fileName = command.slice(4).trim();
    if (fileName) {
      fileFunctions.add(fileName);
    } else {
      console.log('Please provide a file name.');
    }
  } else if (command.startsWith('cat')) {
    const fileName = command.slice(4).trim();
    if (fileName) {
      const filePath = path.join(process.cwd(), fileName);
      fileFunctions.cat(filePath, () => {
        printCurrentDirectory();
        rl.prompt();
      });
    } else {
      console.log('Please provide a file name.');
      printCurrentDirectory();
      rl.prompt();
    }
  } else if (command.startsWith('rn')) {
    const fileNames = command.slice(2).trim().split(' ');
    const oldFileName = fileNames[0];
    const newFileName = fileNames[1];
    if (oldFileName && newFileName) {
      fileFunctions.rn(oldFileName, newFileName);
    } else {
      console.log('Please provide both old and new file names.');
    }
  } else if (command.startsWith('cp')) {
    const fileNames = command.slice(2).trim().split(' ');
    const sourceFile = fileNames[0];
    const destinationFile = fileNames[1];
    if (sourceFile && destinationFile) {
      fileFunctions.cp(sourceFile, destinationFile);
    } else {
      console.log('Please provide both source and destination file names.');
    }
  } else if (command.startsWith('mv')) {
    const fileNames = command.slice(2).trim().split(' ');
    const sourceFile = fileNames[0];
    const destinationFile = fileNames[1];
    if (sourceFile && destinationFile) {
      fileFunctions.mv(sourceFile, destinationFile);
    } else {
      console.log('Please provide both source and destination file names.');
    }
  } else if (command.startsWith('rm')) {
    const fileName = command.slice(2).trim();
    if (fileName) {
      fileFunctions.rm(fileName);
    } else {
      console.log('Please provide a file name.');
    }
  } else if (command.startsWith('hash ')) {
    const filePath = command.slice(5).trim();
    if (filePath) {
      calculateHash(filePath);
    } else {
      console.log('Please provide a file path.');
      rl.prompt();
    }
  } else {
    console.log('Invalid input');
  }
  printCurrentDirectory();
  rl.prompt();
}



function exitProgram() {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}

function getRootDirectory(directoryPath) {
  const rootPath = path.parse(directoryPath).root;
  return rootPath;
}

function isSubdirectory(childPath, parentPath) {
  const relativePath = path.relative(parentPath, childPath);
  return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}

function isRootDirectory(directoryPath) {
  const rootDirectory = getRootDirectory(directoryPath);
  return directoryPath === rootDirectory;
}

rl.prompt();
