// const mongoose = require('mongoose'),
// bcrypt = require('bcrypt'),
// SALT_WORK_FACTOR = 10;

// const Schema = mongoose.Schema;

// const NewsSchema = new Schema({
//   title: { type: String, default: '' },
//   _newstype: { type: String, ref: 'Newstype' },
//   cover: { type: String, default: '', trim: true },
//   label: { type: String, default: '', trim: true },
//   link: { type: String, default: '', trim: true },
//   content: { type: String, default: ''},
//   publish_time: { type: Date, default: Date.now },
//   status: { type: Number, default: 0 },
//   referal: { type: Number, default: 0 },
// });

// const NewstypeSchema = new Schema({
//   name: { type: String, required: true },
//   news: [{ type: Schema.Types.ObjectId, ref: 'News'}]
// });


// const MemberSchema = new Schema({
//   name: { type: String, required: true, index: {unique: true}, trim: true },
//   title: { type: String, default: '', trim: true },
//   team: { type: String, required: true },
//   status: { type: Number, default: 0 },
//   order: { type: Number, default: 0 },
//   photo_url: { type: String, default: '', trim: true },
//   password: { type: String },
//   publish_time: { type: Date, default: Date.now },
// });

// MemberSchema.pre('save', function(next) {
//     var user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
//         if (err) return next(err);

//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, (err, hash) => {
//             if (err) return next(err);

//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });

// MemberSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };


// const TeamSchema = new Schema({
//   name: { type: String, required: true },
//   members: [{ type: Schema.Types.ObjectId, ref: 'Member'}]
// });

// const ClientSchema = new Schema({
//   company: { type: String, required: true },
//   _business: { type: Number, ref: 'Business' },
//   _service: { type: Number, ref: 'Service' },
//   logo: { type: String },
//   brief: { type: String, required: true },
//   project: { type: String, required: true },
//   status: { type: Number, default: 0 },
//   publish_time: { type: Date, default: Date.now },
//   order: { type: Number, default: 0 },
// });

// const BusinessSchema = new Schema({
//   name: { type: String, required: true },
//   client: [{ type: Schema.Types.ObjectId, ref: 'Client'}]
// });

// const ServiceSchema = new Schema({
//   name: { type: String, required: true },
//   client: [{ type: Schema.Types.ObjectId, ref: 'Client'}]
// });

// /*
// NewsSchema.path('name').required(true, 'Product name cannot be blank');
// NewsSchema.path('cost').required(true, 'Product cost cannot be blank');

// /*
// NewsSchema.pre('save', (next) => {
//   next();
// });
// */


// TeamSchema.statics = {
//   load(_id) {
//     return this.findOne({ _id })
//     .exec();
//   },

//   list(options) {
//     const params = options.params || {};
//     const page = options.page || 0;
//     const limit = options.limit || 50;
//     return this.find(params)
//     //.limit(limit)
//     //.skip(limit * page)
//     .lean()
//     .exec((err, data) => (
//       data.map((record, index) => {
//         record.index = index + 1;
//         return record;
//       })
//     ));
//   },
// };

// MemberSchema.statics = {
//   load(_id) {
//     return this.findOne({ _id })
//     .exec();
//   },

//   list(options) {
//     const params = options.params || {};
//     const page = options.page || 0;
//     const limit = options.limit || 50;
//     console.log('params', params);
//     return this.find(params)
//     .limit(limit)
//     .skip(limit * page)
//     .lean()
//     .exec((err, data) => (
//       data.map((record, index) => {
//         record.index = index + 1;
//         return record;
//       })
//     ));
//   },
// };

// var Member = mongoose.model('member', MemberSchema);
// var Team = mongoose.model('team', TeamSchema);
// /*
// var News = mongoose.model('news', NewsSchema);
// var Newstype = mongoose.model('newstype', NewstypeSchema);
// var Client = mongoose.model('client', ClientSchema);
// var Business = mongoose.model('business', BusinessSchema);
// var Service = mongoose.model('service', ServiceSchema);
// */
