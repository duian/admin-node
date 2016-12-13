const mongoose = require('mongoose');

const Schema = mongoose.Schema;
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

const BusinessSchema = new Schema({
  name: { type: String, required: true },
  client: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
});

// const ServiceSchema = new Schema({
//   name: { type: String, required: true },
//   client: [{ type: Schema.Types.ObjectId, ref: 'Client'}]
// });

mongoose.model('business', BusinessSchema);
