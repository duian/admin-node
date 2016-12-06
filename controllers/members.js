const mongoose = require('mongoose');
// const Product = require('../models/product');
// require('../models/product');
const Member = mongoose.model('member');

function handleBodyParam(body) {
  const name = body.name ? body.name.trim() : '';
  const title = body.title ? body.title.trim() : '';
  const team = body.team ? body.team.trim() : '';
  const status = body.status ? parseInt(body.count, 10) : 0;
  const publish_time = body.publish_time;
  const photo_url = body.photo_url ? body.photo_url.trim() : '';
  const password = body.password ? body.password : 1;
  const order = body.cost ? parseInt(body.cost, 10) : 0;
  return {
    name,
    title,
    team,
    status,
    publish_time,
    photo_url,
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
    params.name = query.name.trim();
  }
  if (query.title) {
    title = query.title.trim();
  }
  if (query.team) {
    params.team = query.team.trim();
  }
  if (query.status) {
    params.status = parseInt(query.status, 10);
  }
  // const title = req.query.title ? req.query.title.trim() : '';
  // const team = req.query.team ? req.query.team.trim() : '';
  // const status = req.query.status ? parseInt(req.query.status, 10) : 0;
  const page = req.query.pageNo ? parseInt(req.query.pageNo, 10) - 1 : 0;
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 100;
  // const params = {
  //   name,
  //   title,
  //   team,
  //   status,
  // };

  const options = {
    params,
    title,
    page,
    limit,
  };
  Member.list(options)
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
  const member = new Member(options);
  var promise = Member.find({},function(err,mem){
    size = mem.length;
    member.order = size+1;
  }).exec();
  promise.then(() => {
    member.save((err, result) =>{
      // console.log('mem:', member, err);
      if (err) {
        return res.send({ err });
      }
      return res.send({ status: true, result });
    })
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
