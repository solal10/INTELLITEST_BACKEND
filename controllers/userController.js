const user = require('../models/user');

function isGoodPassword(password) {
    // Check if password has at least one lowercase letter
    const lowercaseRegex = /[a-z]/;
    if (!lowercaseRegex.test(password)) {
        return false;
    }

    // Check if password has at least one uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
        return false;
    }

    // Check if password has at least one digit
    const digitRegex = /\d/;
    if (!digitRegex.test(password)) {
        return false;
    }

    // Check if password has at least one special character
    const specialCharRegex = /[^a-zA-Z0-9]/;
    if (!specialCharRegex.test(password)) {
        return false;
    }

    // Check if password has minimum length of 8 characters
    if (password.length < 8) {
        return false;
    }

    // If all conditions pass, return true
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

exports.registerUser = async (req, res) => {
    try {
        const { email, password, accountType } = req.body;
        if (!email || !password || !accountType) {
            console.log('Missing required fields');
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }
        if (!isValidEmail(email) ) {
            
            console.log('Invalid email address');
            res.status(400).json({ error: 'Invalid email address' });
            return;
        }
        let user1 = await user.findOne({ Email: email })
            if (user1) {
                console.log('User already exists');
                res.status(400).json({ error: 'User already exists' });
                return;
            }
        if (!isGoodPassword(password)) {
            console.log('Password does not meet requirements');
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
              console.log('User created)');
              res.status(201).json(newUser);           
        } 
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }  
    };

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        let user1 = await user.findOne({ Email: email })
        if (!user1) {
            console.log('User does not exist');
            res.status(400).json({ error: 'User does not exist' });
            return;
        }
        if (user1.Password !== password) {
            console.log('Invalid password');
            res.status(400).json({ error: 'Invalid password' });
            return;
        }
        console.log('valid credentials, user logged in successfully');
        res.status(200).json(user1);
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.editUser = async (req, res) => {
    try {
        const { email, newEmail, newpassword, newaccountType } = req.body;
        let emailF= false, passwordF= false, accountTypeF = false;
        if (email){
            let user1 = await user.findOne({ Email: email })
        }
        else
        {
            res.status(400).json({ error: 'Email is empty' });
            return;
        }
        if(newEmail){
            if (!isValidEmail(newEmail) ) {
                console.log('Invalid new email address');
                res.status(400).json({ error: 'Invalid new email address' });
                return;
            }
            let user2 = await user.findOne({ Email: newEmail })
            if (user2) {
                console.log('User already exist');
                res.status(400).json({ error: 'User already exist' });
                return;
            }
            emailF = true;
        }
        if(newpassword){    
            if (!isGoodPassword(password)) {
                console.log('Password does not meet requirements');
                res.status(400).json({ error: 'Password does not meet requirements' });
                return;
            }
            if(newpassword === user1.Password){
                console.log('New password is the same as old password');
                res.status(400).json({ error: 'New password is the same as old password' });
                return;
            }
            passwordF = true;
        }
        if(newaccountType){
            if(user1.accountType === newaccountType){
                console.log('New account type is the same as old account type');
                res.status(400).json({ error: 'New account type is the same as old account type' });
                return;
            }
            accountTypeF = true;
        }
    }
    catch (err) {
        console.error('Error editing user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}