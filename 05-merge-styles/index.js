const FS = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

const pathToCSS = path.join(__dirname, 'styles');
const pathToSource = path.join(__dirname, 'project-dist');
const pathToBundleCss = path.join(pathToSource, 'bundle.css');


(async() => {
  try {
    const cssFiles = await readdir(pathToCSS, {
      withFileTypes: true,
    });

    let styles = "";

    cssFiles.forEach( async(file) => {
      const pathToFile = path.join(pathToCSS, file.name);
      const ext = path.extname(pathToFile)

      if (ext === ".css" && file.isFile()) {
        const stream = FS.readFileSync(pathToFile, "utf-8");
        styles += stream;
      }
  })
    FS.writeFile(pathToBundleCss, styles, { flag: "w+" }, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log(err, 'Copying is not accessible')
  }
})()
