const aModelHistory = require('../models/modelhistory');

exports.addModelHistory = async (req, res) => {
    try {
        const { model_id, user_id, modelType, accuracyLVL, con_mat_tp,
            con_mat_fp, con_mat_fn, con_mat_tn, params } = req.body;

        if(modelType==='SVC'){
            let modelHistory1 = new aModelHistory({
                model_id: model_id, 
                user_id: user_id, 
                modelType: modelType,
                accuracy: accuracyLVL,
                confusion_matrix_tp: con_mat_tp,
                confusion_matrix_fp: con_mat_fp,
                confusion_matrix_fn: con_mat_fn,
                confusion_matrix_tn: con_mat_tn,
                paramsSVC: params
            });
            await modelHistory1.save();
        }
        else if(modelType==='KNN'){
            let modelHistory1 = new aModelHistory({
                model_id: model_id,
                user_id: user_id, 
                modelType: modelType,
                accuracy: accuracyLVL,
                confusion_matrix_tp: con_mat_tp,
                confusion_matrix_fp: con_mat_fp,
                confusion_matrix_fn: con_mat_fn,
                confusion_matrix_tn: con_mat_tn,
                paramsKNN: params
            });
            await modelHistory1.save();
        }
        res.status(200).json({ message: 'Model history added' });
    } catch (err) {
        console.error('Error adding model history:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getLastHistory = async (req, res) => {
    try {
        const { model_id } = req.body;
        
        if (!model_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const modelHistory = await aModelHistory.find({ model_id }).sort({ createdAt: -1 }).limit(1).exec();

        if (!modelHistory || modelHistory.length === 0) {
            return res.status(404).json({ error: 'No history found for the given model ID' });
        }

        res.status(200).json(modelHistory[0]);
    } catch (error) {
        console.error('Error fetching model history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllHistory = async (req, res) => {
    try {
        const { model_id } = req.body;
        console.log("lalalalla" + model_id);
        if (!model_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const modelHistory = await aModelHistory.find({ model_id:model_id }).sort({ createdAt: 1 }).exec();

        if (!modelHistory || modelHistory.length === 0) {
            return res.status(404).json({ error: 'No history found for the given model ID' });
        }

        res.status(200).json(modelHistory);
    } catch (error) {
        console.error('Error fetching all model history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
