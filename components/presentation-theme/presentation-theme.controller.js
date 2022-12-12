const presentationService = require('./presentation-theme.service');

const listPresentationTheme = async (req, res) => {
  const theme = await presentationService.findAllPresentationTheme();
  if (theme) {
    return res.status(200).json({ status: true, message: 'Successful', data: theme });
  }
  return res.status(400).json({ status: false, message: 'Do not find user in system' });
};

module.exports = {
  listPresentationTheme,
};
