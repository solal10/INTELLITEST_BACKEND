const user = require('../models/user');


exports.registerUser = async (req, res) => {
    try {
        const { email, password, accountType } = req.body;
        if (!email || !password || !accountType) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }
        if (!isValidEmail(email)) {
            res.status(400).json({ error: 'Invalid email address' });
            return;
        }
        if (!isGoodPassword(password)) {
            res.status(400).json({ error: 'Password does not meet requirements' });
            return;
            }
        else {
            const newUser = new user({
                Email: email,
                Password: password,
                accountType: accountType
              });
              await newUser.save();
              res.status(201).json(newUser);           
        } 
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }  
    };

