const mongoose = require('mongoose');

const { Schema } = mongoose;
const NewsSchema = new Schema({
  title: { type: String, default: '' },
  type: { type: String },
  cover: { type: String, default: '', trim: true },
  label: { type: String, default: '', trim: true },
  link: { type: String, default: '', trim: true },
  content: { type: String, default: '' },
  publish_time: { type: Date, default: Date.now },
  status: { type: Number, default: 0 },
  referal: { type: Number, default: 0 },
});

mongoose.model('news', NewsSchema);
