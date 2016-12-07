const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ClientSchema = new Schema({
  company: { type: String, required: true, trim: true },
  business: { type: String, default: '', trim: true },
  service: { type: String, default: '', trim: true },
  logo: { type: String, default: '', trim: true },
  brief: { type: String, default: '', trim: true },
  project: {  type: String, default: '', trim: true },
  status: { type: Number, default: 0 },
  publish_time: { type: Date, default: Date.now },
  order: { type: Number, default: 0 },
});


ClientSchema.statics = {
  load(_id) {
    return this.findOne({ _id })
    .exec();
  },

  list(options) {
    const params = options.params || {};
    const page = options.page || 0;
    const limit = options.limit || 50;
    // console.log('params', params);
    return this.find(params)
    // return this.find()
    .limit(limit)
    .skip(limit * page)
    .lean()
    .exec((err, data) => (
      data.map((record, index) => {
        record.index = index + 1;
        return record;
      })
    ));
  },
};

mongoose.model('client', ClientSchema);
