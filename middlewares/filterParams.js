function removeEmptyProperty(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '' || parseInt(obj[key], 10) === -1) {
      delete obj[key];
    }
  });

  return obj;
}

module.exports = function filterParam(req, res, next) {
  const { query } = req;
  req.query = removeEmptyProperty(query);
  next();
};
