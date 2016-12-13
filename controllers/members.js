const mongoose = require('mongoose');
// const Product = require('../models/product');
// require('../models/product');
const Member = mongoose.model('member');

function handleBodyParam(body) {
  const name = body.name ? body.name.trim() : '';
  const title = body.title ? body.title.trim() : '';
  const team = body.team ? body.team.trim() : '';
  const status = body.status ? parseInt(body.status, 10) : 0;
  const publish_time = body.publish_time;
  const logo = body.logo ? body.logo : '';
  const password = body.password ? body.password : 1;
  const order = body.cost ? parseInt(body.cost, 10) : 0;
  return {
    name,
    title,
    team,
    status,
    publish_time,
    logo,
    password,
    order,
  };
}

exports.load = (req, res, next, id) => {
  member.load(id).then((data) => {
    try {
      req.member = data;
      if (!req.member) return next(new Error('Product not found'));
    } catch (err) {
      return next(err);
    }
    return next();
  });
};

exports.index = (req, res) => {
  const { query } = req;
  const params = {};
  // 名字或者职位
  let title;
  if (query.name) {
    params.name = new RegExp(query.name.trim());
  }
  if (query.title) {
    title = query.title.trim();
  }
  if (query.team) {
    params.team = new RegExp(query.team.trim());
  }
  if (query.status) {
    params.status = parseInt(query.status, 10);
  }

  const page = req.query.pageNo ? parseInt(req.query.pageNo, 10) - 1 : 0;
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 50;

  const options = {
    params,
    title,
    page,
    limit,
  };
  Member.list(options)
  .then((data) => {
    Member.count(options)
    .then(all => (
      res.send({
        records: data,
        length: all.length,
      })
    ));
    // const length = data.length;
    // const records = data;
    // res.send({
    //   length,
    //   records,
    // });
  });
};

exports.create = (req, res) => {
  const body = req.body;
  const options = handleBodyParam(body);
  const member = new Member(options);
  const promise = Member.find({}, (err, mem) => {
    const size = mem.length;
    member.order = size + 1;
  }).exec();
  promise.then(() => {
    member.save((err, result) => {
      if (err) {
        return res.send({ err });
      }
      return res.send({ status: true, result });
    });
  });
};


exports.index2 = (req, res) => {
  const body = req.body;
  const options = handleBodyParam(body);

  // fetch user and test password verification
  Member.find({
      name: {"$regex": options.name},
      title: {"$regex": options.title},
      team: {"$regex": options.team},
      status: options.status
    }, function(err, user) {
      if (err) throw err;

      // test password
      user.comparePassword(options.password, function(err, isMatch) {
          if (err) throw err;
          console.log(options.password, isMatch);
          res.send(isMatch);
      });
  });
}

exports.update = (req, res) => {
  const body = req.body;
  const options = handleBodyParam(body);
  const member = Object.assign(req.member, options);
  member.save((err, result) => {
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
