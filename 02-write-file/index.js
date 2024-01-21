const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const process = require('node:process');

const wStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.output.write('*** Please, enter your message! ***\n');

rl.on('line', (message) => {
  if (message.toLowerCase() === 'exit') {
    console.log('\n*** Bye! Have a good day! ***');

    wStream.end(() => process.exit(0));
  }

  wStream.write(`${message}\n`);
});

//When ctrl + C
rl.on('SIGINT', () => {
  console.log('\n*** Bye! Have a good day! ***');
  wStream.end(() => process.exit(0));
});
