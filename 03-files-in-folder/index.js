const { readdir } = require("node:fs/promises");
const path = require('path');
const { stat } = require('node:fs');

(async () => {
  try {
    const files = await readdir(path.resolve(__dirname, "./secret-folder"), {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const name = file.name;
        const extension = path.extname(file.name)

          stat(
            path.join(__dirname, "./secret-folder", file.name),
            (err, stats) => {
              console.log(`${name} - ${extension} - ${stats.size}b`);
            }
          );
      }
    }
  } catch (err) {
    console.error(err);
  }
})();

