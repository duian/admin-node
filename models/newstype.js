const mongoose = require('mongoose');

const { Schema } = mongoose;
const NewsTypeSchema = new Schema({
  name: { type: String, default: '' }
});

mongoose.model('newstype', NewsTypeSchema);
