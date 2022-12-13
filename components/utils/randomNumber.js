const randomNumberBetweenTwoNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomSixNumber = () => {
  return randomNumberBetweenTwoNumber(100000, 999999);
};

module.exports = {
  randomSixNumber,
};
