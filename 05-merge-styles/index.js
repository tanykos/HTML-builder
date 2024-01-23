const fsPromises = require('fs').promises;
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

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

(async () => {
  try {
    const allStyles = await getStyles();

    console.log('Bundle created successfully!');

    return fsPromises.writeFile(bundlePath, allStyles, 'utf8');
  } catch (err) {
    console.error('Error reading directory: ', err);
  }
})();
