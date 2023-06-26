const fs = require('fs');
const path = require('path');
const readline = require('readline');

let username = '';

const usernameIndex = process.argv.findIndex(arg => arg.startsWith('--username='));

if (usernameIndex !== -1) {
  username = process.argv[usernameIndex].split('=')[1];
}

if (username === '') {
  username = 'Not entered username';
}

console.log(`Welcome to the File Manager, ${username}!`);

const startDirectory = process.cwd();
console.log(`You are currently in ${startDirectory}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter a command: ',
});

rl.on('line', (line) => {
  processCommand(line.trim());
});

rl.on('SIGINT', () => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});

function exitProgram() {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}

function processCommand(command) {
  if (command === '.exit') {
    exitProgram();
  } else {

    rl.prompt();
  }
}

rl.prompt();
