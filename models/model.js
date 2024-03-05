const model = new mongoose.Schema({
    name: {type:String, required: true},
    CSVpath: {type:String, required: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, { timestamps: true });

  module.exports = mongoose.model('Model', model);