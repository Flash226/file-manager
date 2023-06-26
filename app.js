const fs = require('fs');
const path = require('path');
const readline = require('readline');
const systemInfo = require('./system_info');

let username = '';

const usernameIndex = process.argv.findIndex(arg => arg.startsWith('--username='));

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
};

function processCommand(command) {
  const action = commandActions[command];
  if (action) {
    action();
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

rl.prompt();
