var isObj = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
};

var isArr = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
};

exports.filterObj = (obj) => {
  var result = {};

  for (var key in obj) {
    if (!Object.hasOwnProperty.call(obj, key)) {
      continue;
    }

    if (isObj(obj[key]) && Object.keys(obj[key]).length === 0) {
      continue;
    }

    if (isArr(obj[key]) && obj[key].length === 0) {
      continue;
    }
    
    if (obj[key]) {
      result[key] = obj[key];
    }
  }
  return result;
};