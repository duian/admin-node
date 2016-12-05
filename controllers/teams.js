const mongoose = require('mongoose');
// const Product = require('../models/product');
// require('../models/product');
const Team = mongoose.model('team');
function removeEmptyProperty(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      delete obj[key];
    }
  });

  return obj;
}

function handleBodyParam(body) {
  console.log(body);
  const name = body.name ? body.name.trim() : '';
  const memref = body.memref;
  return {
    name,
    memref,
  };
}

exports.load = (req, res, next, id) => {
  Team.load(id).then((data) => {
    try {
      req.team = data;
      if (!req.team) return next(new Error('Product not found'));
    } catch (err) {
      return next(err);
    }
    return next();
  });
};

exports.index = (req, res) => {
  const memref = req.query.memref;
  const name = req.query.name?req.query.name.trim():'';
  //const code = req.query.code.trim();
  const page = parseInt(req.query.page, 10) - 1;
  const limit = parseInt(req.query.limit, 10);
  const params = removeEmptyProperty({
    memref,
    name,
  });
  const options = {
    params,
    page,
    limit,
  };
  Team.list(options)
  .then((data) => {
    const length = data.length;
    const records = data;
    res.send({
      length,
      records,
    });
  });
};

exports.create = (req, res) => {
  const body = req.body;
  const options = handleBodyParam(body);
//  console.log(options);
  const team = new Team(options);
  console.log('access team');
  team.save((err, result) => {
    if (err) {
      res.send({ err });
    }
    res.send({ status: true, result });
  });
};

exports.get = (req, res) => {
  const body = req.body;
  const options = handleBodyParam(body);

  Team.find({name: {"$regex": options.name}}, function(err, team) {
    if (err) throw err;

    res.send(team);
  });
}

exports.update = (req, res) => {
  const body = req.body;
  const options = handleBodyParam(body);
  const team = Object.assign(req.team, options);
  Team.save((err, result) => {
    if (err) {
      res.send({ err });
    }
    res.send({ status: true, result });
  });
};
/*
exports.destroy = (req, res) => {
  const product = req.product;
  product.remove();
  res.send({ status: true });
};
*/
