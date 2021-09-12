exports.getErrorMessage = (msg) => {
  if (msg.length > 0) {
    return (msg = msg[0]);
  } else {
    return (msg = null);
  }
};
