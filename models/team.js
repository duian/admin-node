const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TeamSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
});

TeamSchema.pre('save', function cb(next) {
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

TeamSchema.statics = {
  load(_id) {
    return this.findOne({ _id })
    .exec();
  },

  list(options) {
    const params = options.params || {};
    const page = options.page || 0;
    const limit = options.limit || 50;
    console.log('team params', params);
    return this.find(params)
    // .limit(limit)
    // .skip(limit * page)
    .lean()
    .exec((err, data) => (
      data.map((record, index) => {
        record.index = index + 1;
        return record;
      })
    ));
  },
};

mongoose.model('team', TeamSchema);
