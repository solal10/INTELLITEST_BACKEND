const aModel = require('../models/model');

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
        let model1 = await aModel.findOne({ name: name, user_id: user_id});
        if (!model1) {
            console.log('Model does not exist');
            res.status(400).json({ error: 'Model does not exist' });
            return;
        }
        let res = await aModel.deleteOne({ name: name, user_id: user_id});
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
        const { name,email, newCSVpath } = req.body;
        if (!name || !email || !newCSVpath) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        let user_id = await user.findOne({ Email : email }, '_id');
        if (!user_id) {
            console.log('User does not exist');
            res.status(400).json({ error: 'User does not exist' });
            return;
        }
        let model1 = findOneAndUpdate({ name: name, user_id: user_id}, { CSVpath: newCSVpath });
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


exports.modelToolkitLearn = async (req,res) => {
    
}