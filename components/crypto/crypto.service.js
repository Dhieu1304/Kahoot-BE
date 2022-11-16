const CryptoJS = require('crypto-js');

const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.KEY_CRYTO).toString();
  } catch (e) {
    console.error(e.message);
  }
};

const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.KEY_CRYTO);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  encryptData,
  decryptData,
};
