const toJSON = (items) => {
  if (!items) return;
  if (items.constructor.name === 'Array') {
    for (let i = 0; i < items.length; i++) {
      items[i] = items[i].get({ plain: true });
    }
    return items;
  }
  return items.get({ plain: true });
};

module.exports = toJSON;
