const model = require('../models/model');
const { findOneAndDelete } = require('../models/user');

exports.addModel = async (req, res) => {
    try {
        const { name, CSVpath, user_id } = req.body;
        if (!name || !CSVpath || !user_id ) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        let model = await model.findOne({ name: name, user_id: user_id });
        if (model) {
            console.log('Model already exist');
            res.status(400).json({ error: 'Model already exist' });
            return;
        }
        let newModel = new model({ name, CSVpath, user_id });
        await newModel.save();
        res.status(200).json({ message: 'Model added successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

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
        let model1 = await model.findOne({ name: name, user_id: user_id});
        if (!model1) {
            console.log('Model does not exist');
            res.status(400).json({ error: 'Model does not exist' });
            return;
        }
        let res = await model.deleteOne({ name: name, user_id: user_id});
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
        const { email } = req.body;
        if (!email) {
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
        let models = await model.find({ user_id: user_id});
        res.status(200).json(models);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

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
        let model1 = findOneAndDelete({ name: name, user_id: user_id}, { CSVpath: newCSVpath });
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