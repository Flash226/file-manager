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

function processCommand(command) {
  const commandParts = command.trim().split(' ');
  const commandName = commandParts[0];
  const commandArgs = commandParts.slice(1);

  if (commandName === '.exit') {
    exitProgram();
  } else if (commandActions.hasOwnProperty(commandName)) {
    try {
      commandActions[commandName](commandArgs);
    } catch (error) {
      console.log('Operation failed:', error.message);
    }
  } else {
    console.log('Invalid input');
  }

  printCurrentDirectory();
  rl.prompt();
}

const commandActions = {
  cd: (directoryPath) => {
    const targetDirectory = path.resolve(process.cwd(), directoryPath);
    if (isSubdirectory(targetDirectory, rootDirectory)) {
      navigation.goToDirectory(directoryPath);
    }
  },
  up: () => {
    if (!isRootDirectory(process.cwd())) {
      navigation.goUp();
    }
  },
  add: (fileName) => {
    if (fileName) {
      fileFunctions.add(fileName);
    } else {
      console.log('Please provide a file name.');
    }
  },
  cat: (fileName) => {
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
  },
  rn: (fileNames) => {
    const oldFileName = fileNames[0];
    const newFileName = fileNames[1];
    if (oldFileName && newFileName) {
      fileFunctions.rn(oldFileName, newFileName);
    } else {
      console.log('Please provide both old and new file names.');
    }
  },
  cp: (fileNames) => {
    const sourceFile = fileNames[0];
    const destinationFile = fileNames[1];
    if (sourceFile && destinationFile) {
      fileFunctions.cp(sourceFile, destinationFile);
    } else {
      console.log('Please provide both source and destination file names.');
    }
  },
  mv: (fileNames) => {
    const sourceFile = fileNames[0];
    const destinationFile = fileNames[1];
    if (sourceFile && destinationFile) {
      fileFunctions.mv(sourceFile, destinationFile);
    } else {
      console.log('Please provide both source and destination file names.');
    }
  },
  rm: (fileName) => {
    if (fileName) {
      fileFunctions.rm(fileName);
    } else {
      console.log('Please provide a file name.');
    }
  },
  hash: (filePath) => {
    if (filePath) {
      calculateHash(filePath);
    } else {
      console.log('Please provide a file path.');
    }
  }
};

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
