const fsPromises = require('fs').promises;
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const compDirPath = path.join(__dirname, 'components');
const distPath = path.join(__dirname, 'project-dist');
const htmlPath = path.join(distPath, 'index.html');
const cssPath = path.join(distPath, 'style.css');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(distPath, 'style.css');

const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(distPath, 'assets');

async function getStyles() {
  try {
    const dirItems = await fsPromises.readdir(stylesPath);
    const stylesArray = [];

    // array with promises
    const readPromises = dirItems.map(async (item) => {
      const filePath = path.join(stylesPath, item);
      const { ext } = path.parse(filePath);

      // if css, add to styles array
      if (ext === '.css') {
        const contentStyle = await fsPromises.readFile(filePath, 'utf-8');
        stylesArray.push(contentStyle);
      }
    });

    await Promise.all(readPromises);

    return stylesArray;
  } catch (err) {
    console.error('Error: ', err);
  }
}

async function createBundle(bundlePath) {
  try {
    const allStyles = await getStyles();

    console.log('Bundle created successfully!');

    return fsPromises.writeFile(bundlePath, allStyles, 'utf8');
  } catch (err) {
    console.error('Error reading directory: ', err);
  }
}

function read(pathFile) {
  return fsPromises.readFile(path.join(pathFile), 'utf-8');
}

function write(pathFile, content = '') {
  return fsPromises.writeFile(pathFile, content, 'utf-8');
}

async function createDir(newDirPath) {
  try {
    await fsPromises.access(newDirPath);

    await fsPromises.rm(newDirPath, { recursive: true });

    await fsPromises.mkdir(newDirPath, { recursive: true });
  } catch (error) {
    //if directory does NOT exist
    if (error.code === 'ENOENT') {
      await fsPromises.mkdir(newDirPath, { recursive: true });
    }
  }
}

async function copyFiles(dirPath, dir) {
  try {
    await createDir(dirPath);

    const fromPath = path.join(assetsPath, dir);
    const toPath = path.join(distAssetsPath, dir);
    const dirItems = await fsPromises.readdir(fromPath);

    dirItems.forEach((item) => {
      const filePath = path.join(fromPath, item);
      const newPath = path.join(toPath, item);

      fsPromises.copyFile(filePath, newPath);
    });

    console.log('Files copied successfully!');
  } catch (err) {
    console.error('Error reading directory: ', err);
  }
}

(async () => {
  const templateContent = await read(templatePath);
  let newTemplateContent = templateContent;
  const regex = /\{\{(\w+)\}\}/g;
  const templArr = templateContent.match(regex);

  await createDir(distPath);
  await write(htmlPath);
  await write(cssPath);

  //replace {{template}} with content of component
  if (templArr) {
    for (const templ of templArr) {
      const compFileName = templ.match(/\{\{(\w+)\}\}/)[1];
      const compPath = path.join(compDirPath, compFileName + '.html');
      const compContent = await read(compPath);

      newTemplateContent = newTemplateContent.replace(templ, compContent);
    }
  } else {
    console.log('No templates in this file!');
    return;
  }

  await write(htmlPath, newTemplateContent);
  await createBundle(bundlePath);

  const dirAssets = ['fonts', 'img', 'svg'];
  await createDir(distAssetsPath);

  for (const dir of dirAssets) {
    const dirPath = path.join(distAssetsPath, dir);

    await copyFiles(dirPath, dir);
  }
})();
