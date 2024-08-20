const express = require('express');
const router = express.Router();
const User = require('./models');

// Register User
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;
        const user = new User({ firstName, lastName, email, phone });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;
        const user = await User.findById(req.params.id);
        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.phone = phone;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.status(200).json({ Message: 'User deleted succesfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List All Users with filters
router.get('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.query;
        const filter = {};
        if (firstName) filter.firstName = new RegExp(firstName, 'i');
        if (lastName) filter.lastName = new RegExp(lastName, 'i');
        if (email) filter.email = new RegExp(email, 'i');
        if (phone) filter.phone = new RegExp(phone, 'i');
        
        const users = await User.find(filter);
        if(users.length> 0) res.json(users);
        else res.json("No users found")
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
