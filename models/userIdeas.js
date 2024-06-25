const mongoose = require('mongoose');
const userIdea = new mongoose.Schema({
    Email: {type:String, required: true},
    Idea: {type:String, required: true}
  }, { timestamps: true });

module.exports = mongoose.model('UserIdea', userIdea);
    