const dayjs = require('dayjs');
const mongoose = require('mongoose');
const { generateAndReturnToken, getUserIdFromToken } = require('../middleware/auth');
const { seedUserData } = require('../middleware/seed')
const { handleError } = require('../middleware/error');
const userModel = require('../models/user');


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            user.incrementLoginAttempts();
            await user.save();
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateAndReturnToken(user._id)
        const tokenExpirationTime = dayjs().add(15, 'minute').toDate();
        user.updateLastLogin();
        user.loginAttempts = 0;
        user.tokens = [{ token: token, expiresAt: tokenExpirationTime }]
        await user.save();

        res.status(200).json({ token, userId: user._id.toString(), creds: `${user.name} ${user.surname}`, timeStart: dayjs().valueOf().toString() });
    } catch (error) {
        handleError(error, res);
    }
};

exports.logout = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization.split(' ')[1]
        const userId = getUserIdFromToken(tokenEncrypted)

        const user = await userModel.findById(new mongoose.Types.ObjectId(userId))
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.tokens = [];
        await user.save();
        res.status(200).json({ message: 'LOGGED OUT' });
    } catch (error) {
        handleError(error, res);
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(tokenEncrypted);

        const user = await userModel.findById(new mongoose.Types.ObjectId(userId));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newToken = generateAndReturnToken(user._id);
        const newTokenExpirationTime = dayjs().add(15, 'minute').toDate();

        user.tokens = [{
            token: newToken, expiresAt: newTokenExpirationTime
        }]
        await user.save();

        res.status(200).json({ token: newToken, timeStart: dayjs().valueOf().toString() });
    } catch (error) {
        handleError(error, res)
    }
};

exports.register = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        if (!name || !surname || !email || !password) {
            return res.status(400).json({ message: 'MISSING FIELDS' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new userModel({
            name,
            surname,
            email,
            password,
        });

        const user = await newUser.save();
        await seedUserData(user._id)

        res.status(201).json({ message: 'Success' });
    } catch (error) {
        handleError(error, res)
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Old password and new password are required' });
        }

        const tokenEncrypted = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(tokenEncrypted);

        const user = await userModel.findById(new mongoose.Types.ObjectId(userId));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        user.password = newPassword;
        user.tokens = [];
        await user.save();

        res.status(200).json({ message: 'Password changed successfully<br>Please log in again' });
    } catch (error) {
        handleError(error, res);
    }
};

exports.updateProfile = async (req, res) => {
    const { name, surname } = req.body;

    try {
        if (!name || !surname) {
            return res.status(400).json({ message: 'New details are required' });
        }

        const tokenEncrypted = req.headers.authorization.split(' ')[1]
        const userId = getUserIdFromToken(tokenEncrypted)

        const user = await userModel.findById(new mongoose.Types.ObjectId(userId))
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (name === user.name && surname === user.surname) {
            return res.status(400).json({ message: 'New data must be different that the existing one' });
        }

        user.name = name
        user.surname = surname
        user.save()

        res.status(200).json({ message: 'You data has been successfully updated' });
    } catch (error) {
        handleError(error, res);
    }
};
