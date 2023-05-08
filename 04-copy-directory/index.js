const fs = require('node:fs/promises');
const path = require('path');
const { mkdir, readdir } = require('node:fs/promises');

const pathToFiles = path.join(__dirname, 'files');
const pathToCopy = path.join(__dirname, 'filesCopy');

  
(async() => {
  try {
    await mkdir(pathToCopy, {recursive: true});
    copy()
  } catch (err) {
    console.log(err, 'Copying is not accessible')
  }
})()



const copy = async () => {
  const curContent = await readdir(pathToFiles);
  
  curContent.forEach(async(item) => {
    let basicPath = path.join(__dirname, 'files', item)
    let pathToCopy = path.join(__dirname, 'filesCopy', item)

    try {
      await fs.copyFile(basicPath, pathToCopy)
    } catch (err) {
      console.log(`The files have not been copied`)
    }
  });
}
