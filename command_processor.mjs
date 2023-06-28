import path from 'path';
import os from 'os';
import {
  goUp,
  goToDirectory,
  listDirectory
} from './navigation.mjs';
import {
  cat,
  add,
  rn,
  cp,
  mv,
  rm
} from './file_functions.mjs';
import {
  compress,
  decompress
} from './archiver.mjs';
import { calculateHash } from './calculate_hash.mjs';
import {
  getOperatingSystemInfo,
  getEndOfLine,
  getCPUsInfo,
  getHomeDirectory,
  getCurrentSystemUsername,
  getCPUArchitecture
} from './system_info.mjs';
import {
  printCurrentDirectory,
  getRootDirectory,
  isSubdirectory,
  isRootDirectory,
  getUsername,
} from './shared_functions.mjs';

const rootDirectory = getRootDirectory(os.homedir());

const processCommand = (command, rl) => {
  let operationCompleted = true;
  const commandActions = {
    cd: ([directoryPath]) => {
      if (directoryPath) {
        const targetDirectory = path.resolve(process.cwd(), directoryPath);
        if (isSubdirectory(targetDirectory, rootDirectory)) {
          goToDirectory(directoryPath);
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
          goUp();
        }
      }
    },
    ls: ([directoryPath]) => {
      if (directoryPath) {
        console.log('Invalid input');
      } else {
        listDirectory();
      }
    },
    add: (fileName) => {
      if (fileName.length !== 1) {
        console.log('Invalid input: Please provide a correct file name.');
      } else {
        operationCompleted = false;
        add(fileName[0], () => {
          printCurrentDirectory();
          rl.prompt();
        });
      }
    },
    cat: (fileName) => {
      if (fileName.length !== 1) {
        console.log('Invalid input: Please provide a correct file name.');
      } else {
        operationCompleted = false;
        const filePath = path.join(process.cwd(), fileName[0]);
        cat(filePath, () => {
          console.log();
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
        operationCompleted = false;
        rn(oldFileName, newFileName, () => {
          printCurrentDirectory();
          rl.prompt();
        });
      } else {
        console.log('Invalid input: Please provide both old and new file names.');
      }
    },
    cp: (fileNames) => {
      const sourceFile = fileNames[0];
      const destinationFile = fileNames[1];
      if (sourceFile && destinationFile) {
        operationCompleted = false;
        cp(sourceFile, destinationFile, () => {
          printCurrentDirectory();
          rl.prompt();
        });
      } else {
        console.log('Invalid input: Please provide both source and destination file names.');
      }
    },
    mv: (fileNames) => {
      const sourceFile = fileNames[0];
      const destinationFile = fileNames[1];
      if (sourceFile && destinationFile) {
        operationCompleted = false;
        mv(sourceFile, destinationFile, () => {
          printCurrentDirectory();
          rl.prompt();
        });
      } else {
        console.log('Invalid input: Please provide both source and destination file names.');
      }
    },
    rm: (fileName) => {
      if (fileName.length !== 1) {
        console.log('Invalid input: Please provide a correct file name.');
      } else {
        operationCompleted = false;
        rm(fileName[0], () => {
          printCurrentDirectory();
          rl.prompt();
        });
      }
    },
    compress: (fileNames) => {
      const sourceFile = fileNames[0];
      const destinationFile = fileNames[1];
      if (sourceFile && destinationFile) {
        operationCompleted = false;
        compress(sourceFile, destinationFile, () => {
          printCurrentDirectory();
          rl.prompt();
        });
      } else {
        console.log('Invalid input: Please provide both source and destination file names.');
      }
    },
    decompress: (fileNames) => {
      const sourceFile = fileNames[0];
      const destinationFile = fileNames[1];
      if (sourceFile && destinationFile) {
        operationCompleted = false;
        decompress(sourceFile, destinationFile, () => {
          printCurrentDirectory();
          rl.prompt();
        });
      } else {
        console.log('Invalid input: Please provide both source and destination file names.');
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
      '--info': getOperatingSystemInfo,
      '--EOL': getEndOfLine,
      '--cpus': getCPUsInfo,
      '--homedir': getHomeDirectory,
      '--username': getCurrentSystemUsername,
      '--architecture': getCPUArchitecture
    },
    '.exit': exitProgram
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

  if (operationCompleted) {
    printCurrentDirectory();
    rl.prompt();
  }
};

const startCommandProcessor = (rl) => {
  rl.on('line', (line) => {
    processCommand(line.trim(), rl);
  });

  rl.prompt();
};

const exitProgram = () => {
  console.log(`\nThank you for using File Manager, ${getUsername()}, goodbye!`);
  process.exit(0);
};

export {
  processCommand,
  startCommandProcessor,
  exitProgram
};
