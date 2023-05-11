const FS = require('fs');
const fs = require('node:fs/promises');
const path = require('path');


const find = (arr) => {
  let result = [];
  arr.forEach((element) => {
    const regex = /{{(.*?)}}/g;
    let match;
    while ((match = regex.exec(element))) {
      result.push(match[1].replace(/[{}]/g, ''));
    }
  });
  return result;
};

const insert = (arr, str1, str2) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].includes(str1)) {
      arr[i] = arr[i].replace(str1, str2);
    }
  }
};

const cssBundle = async () => {
  const pathToCSS = path.join(__dirname, 'styles');
  const root = path.join(__dirname, 'project-dist');
  const pathToBundleCss = path.join(root, 'style.css');
  const stylesArr = [];

  try {
    const cssFiles = await fs.readdir(pathToCSS, {
      withFileTypes: true,
    });

    cssFiles.forEach(async (file) => {
      const pathToFile = path.join(pathToCSS, file.name);
      const ext = path.extname(pathToFile);

      if (file.isFile()) {
        if (ext === '.css' && file.isFile()) {
          const stream = FS.createReadStream(pathToFile, 'utf-8');
          stream.on('data', (chunk) => stylesArr.push(chunk));
          stream.on('end', () => {
            fs.writeFile(pathToBundleCss, '', (err) => {
              if (err) throw err;
            });

            stylesArr.forEach((item) => {
              fs.appendFile(pathToBundleCss, item, (err) => {
                if (err) throw err;
              });
            });
          });
        }
      }
    });
  } catch (err) {
    console.log(err, 'Copying is not accessible');
  }
};

const copy = async (pathToFiles, pathToCopy) => {
  try {
    await fs.mkdir(pathToCopy, { recursive: true });
    const files = await fs.readdir(pathToFiles);

    for (const file of files) {
      const pathToFile = path.join(pathToFiles, file);
      const pathToCopyFile = path.join(pathToCopy, file);
  
      const fileStat = await fs.stat(pathToFile);
  
      if (fileStat.isDirectory()) {
        await copy(pathToFile, pathToCopyFile);
      } else {
        await fs.copyFile(pathToFile, pathToCopyFile);
      }
    }
  } catch (err) {
    console.log('The files have not been copied');
  }
};



async function dist() {
  const templateContent = [];
  const root = path.join(__dirname, 'project-dist');
  

  fs.mkdir(root, { recursive: true }, (error) => {
    if (error) {
      console.error(error, 'Creating mkdir');
    }
  });

  const templatePath = path.join(__dirname, 'template.html');
  const readableStream = FS.createReadStream(templatePath, 'utf-8');
  readableStream.on('data', chunk => templateContent.push(chunk));
  readableStream.on('end', () => {
    const tags = find(templateContent);
    tags.forEach(async (item) => {
      const filePath = path.join(__dirname, 'components', `${item}.html`);
    
      try {
        const tagContent = await fs.readFile(filePath, 'utf-8');
        insert(templateContent, `{{${item}}}`, tagContent);
    
        const allProcessed = tags.every(async (item) => {
          const newFilePath = path.join(__dirname, 'components', `${item}.html`);
          const compareContent = await fs.readFile(newFilePath, 'utf8');
          return compareContent.trim() === tagContent.trim();
        });
    
        if (allProcessed) {
          await fs.writeFile(
            path.join(root, 'index.html'),
            templateContent.join(''),
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
    
  });

  cssBundle();

  const pathToAssets = path.join(__dirname, 'assets');
  const pathToCopyAssets = path.join(__dirname, 'project-dist','assets');
  copy(pathToAssets, pathToCopyAssets);
}

dist();
