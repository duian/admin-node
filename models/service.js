const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ServiceSchema = new Schema({
  name: { type: String, required: true },
  // client: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
});

mongoose.model('service', ServiceSchema);
