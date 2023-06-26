const os = require('os');

function getOperatingSystemInfo() {
  console.log('Operating system info:');
  console.log(`OS Platform: ${os.platform()}`);
  console.log(`OS Type: ${os.type()}`);
  console.log(`OS Release: ${os.release()}`);
  console.log(`OS Architecture: ${os.arch()}`);
  console.log();
}

function getEndOfLine() {
  console.log('End-Of-Line:');
  console.log(`Default EOL: ${os.EOL}`);
  console.log();
}

function getCPUsInfo() {
  console.log('Host machine CPUs info:');
  const cpus = os.cpus();
  console.log(`Total CPUs: ${cpus.length}`);
  cpus.forEach((cpu, index) => {
    console.log(`CPU ${index + 1}:`);
    console.log(`  Model: ${cpu.model}`);
    console.log(`  Clock rate: ${cpu.speed / 1000} GHz`);
  });
  console.log();
}

function getHomeDirectory() {
  console.log('Home directory:');
  console.log(os.homedir());
  console.log();
}

function getCurrentSystemUsername() {
  console.log('Current system username:');
  console.log(os.userInfo().username);
  console.log();
}

function getCPUArchitecture() {
  console.log('CPU architecture:');
  console.log(process.arch);
  console.log();
}

module.exports = {
  getOperatingSystemInfo,
  getEndOfLine,
  getCPUsInfo,
  getHomeDirectory,
  getCurrentSystemUsername,
  getCPUArchitecture,
};
