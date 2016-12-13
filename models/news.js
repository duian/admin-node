const mongoose = require('mongoose');

const { Schema } = mongoose;
const NewsSchema = new Schema({
  title: { type: String, default: '' },
  type: { type: String },
  logo: { type: String, default: '', trim: true },
  label: { type: String, default: '', trim: true },
  link: { type: String, default: '', trim: true },
  content: { type: String, default: '' },
  publish_time: { type: Date },
  modified_time: { type: Date },
  status: { type: Number, default: 0 },
  referal: { type: Number, default: 0 },
});

NewsSchema.statics = {
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

NewsSchema.pre('save', function (next) {
  now = new Date();
  this.modified_time = now;
  if (!this.publish_time) {
    this.publish_time = now;
  }
  next();
});

mongoose.model('news', NewsSchema);
