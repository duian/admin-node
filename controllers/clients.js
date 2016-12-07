const mongoose = require('mongoose');
// const Product = require('../models/product');
// require('../models/product');
const Client = mongoose.model('client');

function handleBodyParam(body) {
  const company = body.company ? body.company.trim() : '';
  const business = body.business ? body.business.trim() : '';
  const service = body.service ? body.service.trim() : '';
  const logo = body.logo ? body.logo.trim() : '';
  const brief = body.brief ? body.brief.trim() : '';
  const project = body.project ? body.project.trim() : '';
  const status = body.status ? parseInt(body.count, 10) : 0;
  const publish_time = body.publish_time;
  const order = body.cost ? parseInt(body.cost, 10) : 0;
  return {
    company,
    business,
    service,
    logo,
    brief,
    project,
    status,
    publish_time,
    order,
  };
}

exports.load = (req, res, next, id) => {
  client.load(id).then((data) => {
    try {
      req.client = data;
      if (!req.client) return next(new Error('Client not found'));
    } catch (err) {
      return next(err);
    }
    return next();
  });
};

exports.index = (req, res) => {
  const { query } = req;
  const params = {};
  if (query.company) {
    params.company = query.company.trim();
  }
  if (query.service) {
    params.service = query.service.trim();
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
    page,
    limit,
  };
  Client.list(options)
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
  const client = new Client(options);
  var promise = Client.find({},function(err,result){
    size = result.length;
    client.order = size+1;
  }).exec();
  promise.then(() => {
    client.save((err, result) =>{
      // console.log('mem:', member, err);
      if (err) {
        return res.send({ err });
      }
      return res.send({ status: true, result });
    })
  });
};


exports.update = (req, res) => {
  const body = req.body;
  const options = handleBodyParam(body);
  const client = Object.assign(req.client, options);
  client.save((err, result) => {
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
