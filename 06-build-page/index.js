const FS = require("fs");
const fs = require("node:fs/promises");
const path = require("path");
const {  mkdir, readdir } = require("node:fs/promises");

const root = path.join(__dirname, "project-dist");


const copyFolder = async (name) => {
  const pathToSource = path.join(__dirname, name); // .../assets
  const pathToCopy = path.join(root, name); // .. project-dist/assets
  await mkdir(pathToCopy, { recursive: true });

  const curContent = await readdir(pathToSource, {
    withFileTypes: true,
  });

  curContent.forEach(async (item) => {
    copyFile(item, pathToCopy, pathToSource);
  })
};

const copyFile = async(file, pathToCopy, pathToSource) => {
  if (typeof file === 'string') {
        let basicPath = path.join(pathToSource, file);
        let copyPath = path.join(pathToCopy, file);
        try {
          await fs.copyFile(copyPath, basicPath);
        } catch (err) {
          console.log(`The files have not been copied`);
        }
        return
    }

  if (file.isFile() === false) {
      try {
        const pathToSubFolder = path.join(pathToSource, file.name)
        const pathToFile = path.join(pathToCopy, file.name);
        await mkdir(pathToFile, { recursive: true });
        const folder = await readdir(pathToSubFolder);
        folder.forEach((file) => {
          copyFile(file, pathToSubFolder, pathToFile);
        })
      } catch (err) {
        console.log('Err with subfolder copying')
      }
    } 
}

const cssBundle = async () => {
  const pathToCSS = path.join(__dirname, 'styles')
  const pathToBundleCss = path.join(root, 'styles.css' );

  try {
    const cssFiles = await readdir(pathToCSS, {
      withFileTypes: true,
    });

    cssFiles.forEach( async(file) => {
      const pathToFile = path.join(pathToCSS, file.name);
      const ext = path.extname(pathToFile)

      if (ext === ".css" && file.isFile()) {
        const stream = FS.createReadStream(pathToFile, "utf-8");
        let data = "";
        stream.on("data", (chunk) => (data += chunk));
        stream.on("end", () => {
          fs.appendFile(pathToBundleCss, data, (err) => {
            if (err) console.log(err, "Some problems with bundle.css");
          });
        });
      }
  })
  } catch (err) {
    console.log(err, 'Copying is not accessible')
  }
}

const htmlTemplates = async () => {
  const pathToFolder = path.dirname(__filename);
  const pathToTemplates = path.join(__dirname, 'components');
  const pathToNewTempl = path.join(root, 'template.html' );
  const pathToNewHTML = path.join(root, 'index.html' );

  try {
    let HTMLFiles = await readdir(pathToTemplates);
    HTMLFiles = HTMLFiles.map((file) => file.match(/([\w,\s-]+)\.[A-Za-z]{3}/)[1]);

    // if (FS.existsSync(pathToNewHTML)) {
    //   await fs.unlink(pathToNewHTML)
    // } 
      await copyFile("template.html", pathToFolder, root)
      // await fs.rename(pathToNewTempl, pathToNewHTML, (err) => {
      //   if (err) console.log("Problems with rename template to index");
      // });

    // const HTMLValues = {};

    // HTMLFiles.forEach((templName) => (HTMLValues[templName] = templName));

    //   HTMLFiles.forEach(async (templName) => {
    //     const pathToTemplName = path.join(
    //       pathToTemplates,
    //       templName + ".html"
    //     );

    //     const templText = fs.readFile(
    //       pathToTemplName,
    //       "utf-8",
    //       function (err, data) {
    //         console.log(data)
    //         if (err) throw err;
    //         HTMLValues[`${templName}`] = data;
    //         // return data;
    //       }
    //     );

    //     return templText
    //     HTMLValues[`${templName}`] = templText;

    //     // templText.then((data) => {
    //     //   HTMLValues[`${templName}`] = data;
    //     // });
    //   });


    // console.log(HTMLValues);

    




    const newHTML = FS.readFileSync(
        pathToNewTempl,
        "utf8",
        function (err, content) {
          if (err) console.log(err)

          HTMLFiles.forEach(async (templName) => {
            const pathToTemplName = path.join(
              pathToTemplates,
              templName + ".html"
            );

            const templText = fs.readFile(
              pathToTemplName,
              "utf-8",
              function (err, data) {
                if (err) throw err;
                return data;
              }
            );

            templText.then((data) => {
              content = content.replace(`{{${templName}}}`, data);
            });
          });
        }
      );

      // FS.writeFile(pathToNewHTML, newHTML, (err) => console.log(err));
      // await fs.unlink(pathToNewTempl);

} catch(err) {
    console.log('Problems with html templates')
  }
}






(async () => {
  await mkdir(root, { recursive: true });
  try {
    copyFolder('assets')
    cssBundle()
    htmlTemplates()
  } catch (err) {
    console.log(err, "Copying is not accessible");
  }
})();
