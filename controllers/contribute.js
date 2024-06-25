const userIdea = require('../models/userIdeas')

exports.addIdea = async (req, res) => {
    try {
        const { email, idea} = req.body;
        let newModel = new userIdea({ 'Email':email, 'Idea':idea });
        await newModel.save();
        res.status(200).json({ message: 'Model added successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

