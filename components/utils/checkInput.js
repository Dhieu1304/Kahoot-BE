const checkInput = (presentation_id, code, uid, user_id) => {
  if (!presentation_id && !code) {
    return { status: false, message: 'presentation_id or code is required' };
  }
  if (!uid && !user_id) {
    return { status: false, message: 'uid or bearer token is required' };
  }
  return { status: true };
};

module.exports = checkInput;
