const path = require('path');
const fs = require('node:fs/promises');
const FS = require('fs');

const pathToCSS = path.join(__dirname, 'styles');
const pathToSource = path.join(__dirname, 'project-dist');
const pathToBundleCss = path.join(pathToSource, 'bundle.css');

const stylesArr = [];

(async() => {
  try {
    const cssFiles = await fs.readdir(pathToCSS, {
      withFileTypes: true,
    });

    cssFiles.forEach( async(file) => {
      const pathToFile = path.join(pathToCSS, file.name);
      const ext = path.extname(pathToFile);

      if(file.isFile()) {
        if (ext === '.css' && file.isFile()) {
          const stream = FS.createReadStream(pathToFile, 'utf-8');
          stream.on('data', chunk => stylesArr.push(chunk));
          stream.on('end', () => {
            fs.writeFile(pathToBundleCss, '', (err) => {
              if (err) throw err;
            });

            stylesArr.forEach(item => {
              fs.appendFile(
                pathToBundleCss,
                item,
                (err) => {
                  if (err) throw err;
                }    
              );
            });
          });
        }
      }
    });
  } catch (err) {
    console.log(err, 'Copying is not accessible');
  }
})();
