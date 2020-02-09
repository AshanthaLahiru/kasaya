const functionExecutor = (functionName, argumentArray) => {
  try {
    if (window[functionName]) {
      window[functionName].apply(null, argumentArray);
      return true;
    } else {
      return undefined;
    }
  } catch (err) {
    return null;
  }
};

module.exports = functionExecutor;
