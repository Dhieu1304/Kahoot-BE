const firebase = require('../../config/firebaseAdmin.config');

const uploadFile = (file, subDir) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('firebaseBucket: ', firebase);
      let linkFile = '';
      const name = `${new Date().getTime()}-${file.originalname.trim().toLowerCase().replaceAll(' ', '-')}`;
      const blob = firebase.bucket.file(subDir + '/' + name);
      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
      blobWriter.on('error', (err) => {
        console.error(err.message);
      });
      blobWriter.on('finish', async () => {
        await blob.makePublic();
        linkFile = `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${subDir}%2F${name}?alt=media`;
        resolve(linkFile);
      });
      blobWriter.end(file.buffer);
    } catch (e) {
      console.error(e.message);
      reject(e);
    }
  });
};

module.exports = {
  uploadFile,
};
