const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    CSVpath: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    impute: { type: Boolean, required: true },
    encode: { type: Boolean, required: true },
    scale: { type: Boolean, required: true },
    feature_select: { type: Boolean, required: true },
    remove_outliers: { type: Boolean, required: true },
    encode_csv: { type: String },
    scale_csv: { type: String },
    isRunning: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Model', modelSchema);