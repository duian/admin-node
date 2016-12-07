const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;
const MemberSchema = new Schema({
  name: { type: String, required: true, index: { unique: true }, trim: true },
  title: { type: String, default: '', trim: true },
  team: { type: String, required: true },
  status: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  photo_url: { type: String, default: '', trim: true },
  password: { type: String },
  publish_time: { type: Date, default: Date.now },
});

MemberSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

MemberSchema.methods.comparePassword = function(cb) {
  this.model('merber').find({ name: this.name });
    // bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    //     if (err) return cb(err);
    //     cb(null, isMatch);
    // });
};

MemberSchema.statics = {
  load(_id) {
    return this.findOne({ _id })
    .exec();
  },

  list(options) {
    const params = options.params || {};
    const title = new RegExp(options.title) || new RegExp('');
    // params.title = title;
    const page = options.page || 0;
    const limit = options.limit || 50;
    return this.find(params)
    .or([{ title }, { name: title }])
    .limit(limit)
    .skip(limit * page)
    .lean()
    .exec((err, data) => {
      return data.map((record, index) => {
        record.index = index + 1;
        return record;
      });
    });
  },

  count(options) {
    const params = options.params || {};
    const title = new RegExp(options.title) || new RegExp('');
    // params.title = title;
    return this.find(params)
    .or([{ title }, { name: title }])
    .lean()
    .exec((err, data) => {
      return data.length;
    });
  },
};

mongoose.model('member', MemberSchema);

