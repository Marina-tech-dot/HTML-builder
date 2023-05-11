const fs = require('node:fs/promises');
const path = require('path');
const { mkdir, readdir } = require('node:fs/promises');

const pathToFiles = path.join(__dirname, 'files');
const pathToCopy = path.join(__dirname, 'filesCopy');


const isFolder = async(path) => {
  try {
    await fs.stat(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      throw error;
    }
  }
};

const deleteIt = async (pathToFolder) => {
  try {
    const files = await fs.readdir(pathToFolder, (err) => {
      throw new Error(err);
    });
    for (const file of files) {
      const curentPath = path.join(pathToFolder, file);
      const stats = await fs.stat(curentPath);
      if (stats.isDirectory()) {
        await deleteIt(curentPath);
      } else {
        await fs.unlink(curentPath);
      }
    }
    await fs.rmdir(pathToFolder);
  } catch (error) {
    console.log(error, 'Some problems with deletion folder');
  }
};


const copy = async () => {
  try {
      
    const curContent = await readdir(pathToFiles,  { withFileTypes: true });

    const isItFolder = await isFolder(pathToCopy);
    if (isItFolder) {
      await deleteIt(pathToCopy);
    }

    await mkdir(pathToCopy, { recursive: true });
  
    curContent.forEach(async(item) => {
      let basicPath = path.join(__dirname, 'files', item.name);
      let pathToCopy = path.join(__dirname, 'filesCopy', item.name);
    
      if (item.isFile()) {
        await fs.copyFile(basicPath, pathToCopy);
      }
    });
  } catch (err) {
    console.log('The files have not been copied');
  }
};


(async () => {
  try {
    copy();
  } catch (err) {
    console.log(err, 'Copying is not accessible');
  }
})();
