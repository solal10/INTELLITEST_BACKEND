const modelHistory = require('../models/modelhistory');

exports.addModelHistory = async (req, res) => {
    try {
        const { model_id, user_id, modelType,DBsize,accuracyLVL,params } = req.body;
        if (!model_id || !user_id || !modelType || !DBsize || !accuracyLVL || !params) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        if(modelType=='SVC'){
            let modelHistory1 = new modelHistory({model_id:model_id, user_id:user_id, modelType:modelType,DBsize:DBsize,accuracyLVL:accuracyLVL,paramsSVC:params});
            modelHistory1.save();
        }
        else if(modelType=='KNN'){
            let modelHistory1 = new modelHistory({model_id:model_id, user_id:user_id, modelType:modelType,DBsize:DBsize,accuracyLVL:accuracyLVL,paramsKNN:params});
            modelHistory1.save();
        }
        console.log('Model history added');
        res.status(200).json({ message: 'Model history added' });
    } catch (err) {
        console.error('Error adding model history:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}