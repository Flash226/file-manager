import os from 'os';
import readline from 'readline';
import {
  startCommandProcessor,
  exitProgram
} from './command_processor.mjs';

import {
  printCurrentDirectory,
  setUsername,
} from './shared_functions.mjs';

const initialWorkingDirectory = os.homedir();
process.chdir(initialWorkingDirectory);

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

setUsername(username);

console.log(`Welcome to the File Manager, ${username}!`);

printCurrentDirectory();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter a command: ',
});

startCommandProcessor(rl);

rl.on('SIGINT', () => {
  exitProgram();
});
