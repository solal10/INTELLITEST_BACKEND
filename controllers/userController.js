const user = require('../models/user');
const model = require('../models/model');
const modelhistory = require('../models/modelhistory');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

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

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  
  function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  }
  
  function getRandomNumber() {
    return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
  }
  
  function getRandomSymbol() {
    const symbols = '!@#$%^&*()_+=';
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function generateRandomPassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    const randomFunc = {
      lower: getRandomLower,
      upper: getRandomUpper,
      number: getRandomNumber,
      symbol: getRandomSymbol,
    };
    retVal += getRandomLower();
    retVal += getRandomUpper();
    retVal += getRandomNumber();
    retVal += getRandomSymbol();
    for (let i = 4; i < length; i++) {
      const keys = Object.keys(randomFunc);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      retVal += randomFunc[randomKey]();
    }
    return retVal.split('').sort(() => Math.random() - 0.5).join('');
  }
  
exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, password, accountType } = req.body;
        if (!fullname || !email || !password || accountType == null) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!isValidEmail(email) ) {
            
            console.log('Invalid email address');
            return res.status(400).json({ error: 'Invalid email address' });
        }
        let user1 = await user.findOne({ Email: email })
            if (user1) {
                console.log('User already exists');
                return res.status(400).json({ error: 'User already exists' });
            }
        if (!isGoodPassword(password)) {
            console.log('Password does not meet requirements');
            return res.status(400).json({ error: 'Password does not meet requirements' });
            }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new user({
                FullName: fullname,
                Email: email,
                Password: hashedPassword,
                accountType: accountType
              });
              await newUser.save();
              console.log('User created');
              return res.status(201).json(newUser);           
        } 
        } catch (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }  
    };

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }
        let user1 = await user.findOne({ Email: email })
        if (!user1) {
            console.log('User does not exist');
            return res.status(400).json({ error: 'User does not exist' });
        }
        const validPassword = await bcrypt.compare(password, user1.Password);
        if (!validPassword) {
            console.log('Invalid password');
            return res.status(400).json({ error: 'Invalid password' });
        }
        console.log('valid credentials, user logged in successfully');
        return res.status(200).json(user1);
    } catch (err) {
        console.error('Error logging in user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.editUser = async (req, res) => {
    try {
        const {newfullname, email, newEmail, newpassword, newaccountType } = req.body;
        let emailF = false, passwordF= false, accountTypeF = false, nameF = false;
        var user1;
        if (email){
            user1 = await user.findOne({ Email: email })
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
            if (!isGoodPassword(newpassword)) {
                console.log('Password does not meet requirements');
                res.status(400).json({ error: 'Password does not meet requirements' });
                return;
            }
            const validPassword = await bcrypt.compare(newpassword, user1.Password);
            if(validPassword){
                console.log('New password is the same as old password');
                res.status(400).json({ error: 'New password is the same as old password' });
                return;
            }
            passwordF = true;
        }
        if(newaccountType != null){
            if(user1.accountType == newaccountType){
                console.log('New account type is the same as old account type');
                res.status(400).json({ error: 'New account type is the same as old account type' });
                return;
            }
            accountTypeF = true;
        }
        if(newfullname){
            if(user1.FullName == newfullname){
                console.log('New full name is the same as old full name');
                res.status(400).json({ error: 'New account type is the same as old account type' });
                return
            }
            nameF = true
        }
        console.log('User updated');
        if(emailF){
            user1.Email = newEmail;
        }
        if(passwordF){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newpassword, salt);
            user1.Password = hashedPassword;
        }
        if(accountTypeF){
            user1.accountType = newaccountType;
        }
        if(nameF){
            user1.FullName = newfullname;
        }
        await user.updateOne({Email: email}, user1);
    }
    catch (err) {
        console.error('Error editing user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
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
        await model.deleteMany({user_id: user1._id});
        await modelhistory.deleteMany({user_id: user1._id});
        await user.deleteOne({Email: email});
        console.log('User deleted');
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getUser = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
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
        console.log('User found');
        res.status(200).json(user1);
    } catch (err) {
        console.error('Error getting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getUserModels = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        let models = await model.find({ user_id: user1._id });
        console.log('Models found');
        res.status(200).json(models);
    } catch (err) {
        console.error('Error getting user models:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            console.log('Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        let user1 = await user.findOne({ Email: email });
        if (!user1) {
            console.log('User does not exist');
            res.status(400).json({ error: 'User does not exist' });
            return;
        }
        const newPassword = generateRandomPassword();
        const mailOptions = {
            from: 'intellitestrecovery@gmail.com',
            to: email,
            subject: 'Password Recovery',
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                    <p>Dear ${user1.FullName},</p>
                    <p>We received a request to reset your password. Your new password is:</p>
                    <p style="font-size: 16px; font-weight: bold;">${newPassword}</p>
                    <p>Please change your password immediately after logging in for security purposes.</p>
                    <p>Thank you,</p>
                    <p>The Intellitest Team</p>
                    <div style="margin-top: 20px;">
                        <img src="https://i.ibb.co/T4XxSsv/Logo-2.png" alt="Intellitest Icon" style="width: 50px; height: 50px;">
                        <p style="font-size: 12px; color: #888;">Intellitest - Empower Your AI Innovations</p>
                    </div>
                </div>
            `,
        };
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS,
            },
        });
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Password recovery email sent');
            }
        });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user1.Password = hashedPassword;
        await user.updateOne({ Email: email }, user1);
    } catch (err) {
        console.error('Error recovering password:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
