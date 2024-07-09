const aModel = require('../models/model');
const aModelHistory = require('../models/modelhistory');

exports.addModel = async (req, res) => {
    try {
        const {
            name,
            CSVpath,
            encode_csv,
            scale_csv,
            user_id,
            impute,
            encode,
            scale,
            feature_select,
            remove_outliers
        } = req.body;

        if (!name || !CSVpath || !user_id || impute === undefined || encode === undefined || scale === undefined || feature_select === undefined || remove_outliers === undefined) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        let model = await aModel.findOne({ name, user_id });
        if (model) {
            console.log('Model already exists');
            res.status(400).json({ error: 'Model already exists' });
            return;
        }

        let newModel = new aModel({
            name,
            CSVpath,
            user_id,
            impute,
            encode,
            scale,
            feature_select,
            remove_outliers,
            encode_csv,
            scale_csv
        });
        await newModel.save();
        res.status(200).json({ data: newModel._id, message: 'Model added successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.deleteModel = async (req, res) => {
    try {
        const { model_id } = req.body;
        if (!model_id) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        let res1 = await aModelHistory.deleteMany({model_id:model_id})
        let res2 = await aModel.deleteOne({ _id:model_id});
        if (res.deletedCount === 0) {
            console.log('model does not exist');
            res.status(500).json({ error: 'Error deleting model' });
            return;
        }
        res.status(200).json({ message: 'Model deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getModel = async (req, res) => {
    try {
        const { model_id } = req.body;
        let model1 = await aModel.findOne({ _id:model_id});
        if (!model1) {
            console.log('Model does not exist');
            res.status(400).json({ error: 'Model does not exist' });
            return;
        }
        res.status(200).json(model1);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllModels = async (req, res) => {
    try {
        const user_id = req.body.id;

        if (!user_id) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }
        console.log(user_id);
        let models = await aModel.find({ user_id: user_id });

        if (models.length === 0) {
            console.log('No models found for user');
            return res.status(200).json([]); // Return an empty array if no models are found
        }

        res.status(200).json(models);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};



exports.updateModel = async (req, res) => {
    try {
        const { model_id,CSVpath, encode_csv,scale_csv } = req.body;
        if (!model_id || !CSVpath || !encode_csv || !scale_csv) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        
        let model1 = aModel.findOneAndUpdate({ _id:model_id}, { CSVpath: CSVpath,encode_csv:encode_csv,scale_csv:scale_csv });
        if (!model1) {
            console.log('Model does not exist');
            res.status(400).json({ error: 'Model does not exist' });
            return;
        }
        res.status(200).json({ message: 'Model updated successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getModelHistory = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        let user_id = await user.findOne({ Email: email }, '_id');
        if (!user_id) {
            console.log('User does not exist');
            res.status(400).json({ error: 'User does not exist' });
            return;
        }
        let model1 = await model.findOne({ name: name, user_id: user_id});
        if (!model1) {
            console.log('Model does not exist');
            res.status(400).json({ error: 'Model does not exist' });
            return;
        }
        let modelhistory = await modelhistory.find({ model_id: model1._id});
        res.status(200).json(modelhistory);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.startLearn = async(req,res) => {
    try{
        const model_id = req.body.model_id;
        console.log("solalalala" + model_id);
        const res1 = await aModel.updateOne({_id:model_id},{isRunning:true})
        console.log("solalalala" + res1);
        if(!res1){
            console.log('Model does not exist');
            res.status(400).json({ error: 'Model does not exist' });
            return;
        }
        console.log("solalalala");
        res.status(200).json({message:'good'});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.finishLearn = async(req,res) => {
    try{
        const model_id = req.body.model_id;
        const res1 = await aModel.updateOne({_id:model_id},{isRunning:false})
        if(!res1){
            console.log('Model does not exist');
            res.status(400).json({ error: 'Model does not exist' });
            return;
        }
        res.status(200).json({message:'good'});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}