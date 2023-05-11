const fs = require('fs');
const { stdin, stdout } = require('process');

fs.open('userNote.txt', 'w', err => {
  if (err) throw new err;
});

console.log('So, tell me whatever you want... \n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') process.exit();

  fs.appendFile('userNote.txt', data, err => {
    if (err) throw new err;
  });
});

process.on('SIGINT', function () {
  process.exit();
});

process.on('exit', () => stdout.write('Your thoughts are written in the userNote.txt. You can find it in the current folder. \n'));
