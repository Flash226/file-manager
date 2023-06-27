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
  const commandActions = {
    cd: ([directoryPath]) => {
      if (directoryPath) {
        const targetDirectory = path.resolve(process.cwd(), directoryPath);
        if (isSubdirectory(targetDirectory, rootDirectory)) {
          navigation.goToDirectory(directoryPath);
        }
      } else {
        console.log('Invalid input: Please provide a directory path.');
      }
    },
    up: ([directoryPath]) => {
      if (directoryPath) {
        console.log('Invalid input');
      } else {
        if (!isRootDirectory(process.cwd())) {
          navigation.goUp();
        }
      }
    },
    ls: ([directoryPath]) => {
      if (directoryPath) {
        console.log('Invalid input');
      } else {
        navigation.listDirectory();
      }
    },
    add: (fileName) => {
      if (fileName.length !== 1) {
        console.log('Invalid input: Please provide a correct file name.');
      } else {
        fileFunctions.add(fileName[0]);
      }
    },
    cat: (fileName) => {
      if (fileName.length !== 1) {
        console.log('Invalid input: Please provide a correct file name.');
      } else {
        const filePath = path.join(process.cwd(), fileName[0]);
        fileFunctions.cat(filePath, () => {
          printCurrentDirectory();
          rl.prompt();
          return;
        });
      }
    },
    rn: (fileNames) => {
      const oldFileName = fileNames[0];
      const newFileName = fileNames[1];
      if (oldFileName && newFileName) {
        fileFunctions.rn(oldFileName, newFileName);
      } else {
        console.log('Invalid input: Please provide both old and new file names.');
      }
    },
    cp: (fileNames) => {
      const sourceFile = fileNames[0];
      const destinationFile = fileNames[1];
      if (sourceFile && destinationFile) {
        fileFunctions.cp(sourceFile, destinationFile);
      } else {
        console.log('Invalid input: Please provide both source and destination file names.');
      }
    },
    mv: (fileNames) => {
      const sourceFile = fileNames[0];
      const destinationFile = fileNames[1];
      if (sourceFile && destinationFile) {
        fileFunctions.mv(sourceFile, destinationFile);
      } else {
        console.log('Invalid input: Please provide both source and destination file names.');
      }
    },
    rm: (fileName) => {
      if (fileName.length !== 1) {
        console.log('Invalid input: Please provide a correct file name.');
      } else {
        fileFunctions.rm(fileName[0]);
      }
    },
    hash: (fileName) => {
      if (fileName.length !== 1) {
        console.log('Invalid input: Please provide a correct file name.');
      } else {
        calculateHash(fileName[0]);
      }
    },
    os: {
      '--info': systemInfo.getOperatingSystemInfo,
      '--eol': systemInfo.getEndOfLine,
      '--cpus': systemInfo.getCPUsInfo,
      '--homedir': systemInfo.getHomeDirectory,
      '--username': systemInfo.getCurrentSystemUsername,
      '--architecture': systemInfo.getCPUArchitecture,
    },
    '.exit': exitProgram,
  };

  const commandParts = command.trim().split(' ');
  const commandName = commandParts[0];
  const commandArgs = commandParts.slice(1);

  const action = commandActions[commandName];
  if (action) {
    if (typeof action === 'function') {
      action(commandArgs);
    } else if (typeof action === 'object') {
      const subCommand = commandArgs[0];
      const subAction = action[subCommand];
      if (subAction && typeof subAction === 'function') {
        subAction();
      } else {
        console.log('Invalid input');
      }
    } else {
      console.log(action);
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
