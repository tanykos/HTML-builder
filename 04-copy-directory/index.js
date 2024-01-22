const fsPromises = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const newDirPath = path.join(__dirname, 'files-copy');

async function createDir() {
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

(async () => {
  try {
    await createDir();

    const dirItems = await fsPromises.readdir(dirPath);

    dirItems.forEach((item) => {
      const filePath = path.join(dirPath, item);
      const newPath = path.join(newDirPath, item);

      fsPromises.copyFile(filePath, newPath);
    });

    console.log('Files copied successfully!');
  } catch (err) {
    console.error('Error reading directory: ', err);
  }
})();
