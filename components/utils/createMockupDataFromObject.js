module.exports.createMockupDataFromObject = (obj) => {
  const data = [];
  for (let i = 0; i < Object.values(obj).length; i++) {
    data.push({ name: Object.values(obj)[i] });
  }
  return data;
};
