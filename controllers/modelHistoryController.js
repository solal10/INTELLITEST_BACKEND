const aModelHistory = require('../models/modelhistory');

exports.addModelHistory = async (req, res) => {
    try {
        const { model_id, user_id, modelType,accuracyLVL,con_mat_tp,
            con_mat_fp,con_mat_fn,con_mat_tn,params } = req.body;
        // console.log("model_id " +model_id);
        // console.log("user_id " +user_id);
        // console.log("modelType " +modelType);
        // console.log("accuracyLVL " +accuracyLVL);
        // console.log("con_mat_tp " +con_mat_tp);
        // console.log("con_mat_fp " +con_mat_fp);
        // console.log("con_mat_fn " +con_mat_fn);
        // console.log("con_mat_tn " +con_mat_tn);
        // console.log("params " +params.kernel);

        // if (!model_id || !user_id || !modelType || !accuracyLVL ||!con_mat_tp||
        //     !con_mat_fp|| !con_mat_fn||!con_mat_tn|| !params) {
        //     console.log('Missing required fields');
        //     res.status(400).json({ error: 'Missing required fields' });
        //     return;
        // }
        // console.log(modelType);
        if(modelType==='SVC'){
            console.log('entered svc');
            let modelHistory1 = new aModelHistory({
                model_id:model_id, 
                user_id:user_id, 
                modelType:modelType,
                accuracy:accuracyLVL,
                confusion_matrix_tp:con_mat_tp,
                confusion_matrix_fp:con_mat_fp,
                confusion_matrix_fn:con_mat_fn,
                confusion_matrix_tn:con_mat_tn,
                paramsSVC:params
            });
            modelHistory1.save();
        }
        else if(modelType==='KNN'){
            let modelHistory1 = new aModelHistory({
                model_id:model_id,
                user_id:user_id, 
                modelType:modelType,
                accuracy:accuracyLVL,
                confusion_matrix_tp:con_mat_tp,
                confusion_matrix_fp:con_mat_fp,
                confusion_matrix_fn:con_mat_fn,
                confusion_matrix_tn:con_mat_tn,
                paramsKNN:params
            });
            modelHistory1.save();
        }
        console.log('Model history added');
        res.status(200).json({ message: 'Model history added' });
    } catch (err) {
        console.error('Error adding model history:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getLastHistory = async (req, res) => {
    try {
        const { model_id } = req.body;
        
        if (!model_id) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Assuming `modelhistory` is the model you are using
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

