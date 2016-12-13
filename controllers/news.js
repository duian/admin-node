const mongoose = require('mongoose');
// const Product = require('../models/product');
// require('../models/product');
const News = mongoose.model('client');

function handleBodyParam(body) {
  const title = body.title ? body.title.trim() : '';
  const type = body.type ? body.type.trim() : '';
  const cover = body.cover ? body.cover.trim() : '';
  const label = body.label ? body.label.trim() : '';
  const link = body.link ? body.link.trim() : '';
  const content = body.content ? body.content.trim() : '';
  const publish_time = body.publish_time;
  const status = body.status ? parseInt(body.count, 10) : 0;
  const referal = body.referal ? body.referal.trim() : '';
  return {
    title,
    type,
    cover,
    label,
    link,
    content,
    publish_time,
    status,
    referal,
  };
}

// exports.load = (req, res, next, id) => {
//   news.load(id).then((data) => {
//     try {
//       req.news = data;
//       if (!req.news) return next(new Error('NewsSchema not found'));
//     } catch (err) {
//       return next(err);
//     }
//     return next();
//   });
// };

exports.index = (req, res) => {
  const { query } = req;
  const params = {};
  if (query.title) {
    params.title = query.title.trim();
  }
  if (query.type) {
    params.type = query.type.trim();
  }
  if (query.label) {
    params.label = query.label.trim();
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
  News.list(options)
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
  const news = new News(options);
  var promise = News.find({},function(err,result){
    // size = result.length;
    // client.order = size+1;
  }).exec();
  promise.then(() => {
    news.save((err, result) =>{
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
  const news = Object.assign(req.news, options);
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
