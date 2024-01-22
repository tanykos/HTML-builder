const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const dirItems = await fs.readdir(dirPath, { withFileTypes: true });

    dirItems.forEach((item) => {
      if (item.isFile()) {
        const filePath = path.join(item.path, item.name);
        const { name, ext } = path.parse(filePath);

        //fs.stat - for getting size
        (async () => {
          try {
            const fileInfo = await fs.stat(filePath);

            console.log(`${name} - ${ext.slice(1)} - ${fileInfo.size} bytes`);
          } catch (err) {
            console.error('Error getting file info: ', err);
          }
        })();
      }
    });
  } catch (err) {
    console.error('Error reading directory: ', err);
  }
})();
