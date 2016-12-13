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

exports.filterQueries = (obj) => {
    var result = {
        and: {},
        or: []
    };

    for (var key in obj) {
        if (!Object.hasOwnProperty.call(obj, key)) {
            continue;
        }

        if ('pageNo' === key
         || 'pageSize' === key
         || 'order_by' === key
         || 'desc' === key
         || 'total' === key) {
             continue;
         }
        
         if (key.indexOf('__') !== -1) {
             var condList = key.split('__');
             condList.forEach((newKey) => {
                 var cond = {};
                 cond[newKey] = new RegExp(obj[key].trim());
                 result.or.push(cond);
             });
         } else {
           if (obj[key] === '-1') {
             continue;
           }
           if (key === 'status') {
             result.and[key] = parseInt(obj[key], 10);
           } else {
             result.and[key] = new RegExp(obj[key].trim());
           }
         }
    }

    return result;
};