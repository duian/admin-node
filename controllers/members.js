const mongoose = require('mongoose');
// const Product = require('../models/product');
// require('../models/product');
const Member = mongoose.model('member');
const filterObj = require('./utils').filterObj;

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

exports.detail = (req, res) => {
  const memberId = req.params.id;
  Member.findOne({_id: memberId}, (err, result) => {
    if (err) {
      return res.send({status: false, err});
    }
    return res.send({status: true, result});
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
        return res.send({status: false, err });
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
  const options = filterObj(body);
  const memberId = req.params.id;
  Member.findOneAndUpdate({_id: memberId}, options, {new: true}, (err, result) => {
    if (err) {
      return res.send({status: false, err});
    }
    return res.send({status: true, result});
  });
};

exports.upward = (req, res) => {
  const memberId = req.params.id;
  Member.findOne({_id: memberId}, (err, member) => {
    if (err) {
      return res.send({status: false, err});
    }
    Member.find({}).sort({order: -1}).findOne({order: {$lt: member.order}}, (err, prevMember) => {
      if (err) {
        return res.send({status: false, err});
      }
      if (!prevMember) {
        return res.send({status: true});
      }
      const prevMemberOrder = prevMember.order;
      prevMember.order = member.order;
      prevMember.save((err) => {
        if (err) {
          return res.send({status: false, err});
        }
        member.order = prevMemberOrder;
        member.save((err) => {
          if (err) {
            return res.send({status: false, err});
          }
          return res.send({status: true});
        });
      });
    });
  });
};

exports.downward = (req, res) => {
  const memberId = req.params.id;
  Member.findOne({_id: memberId}, (err, member) => {
    if (err) {
      return res.send({status: false, err});
    }
    Member.find({}).sort({order: 1}).findOne({order: {$gt: member.order}}, (err, nextMember) => {
      if (err) {
        return res.send({status: false, err});
      }
      if (!nextMember) {
        return res.send({status: true});
      }
      const nextMemberOrder = nextMember.order;
      nextMember.order = member.order;
      nextMember.save((err) => {
        if (err) {
          return res.send({status: false, err});
        }
        member.order = nextMemberOrder;
        member.save((err) => {
          if (err) {
            return res.send({status: false, err});
          }
          return res.send({status: true});
        });
      });
    });
  });
};

/*
exports.destroy = (req, res) => {
  const product = req.product;
  product.remove();
  res.send({ status: true });
};
*/
