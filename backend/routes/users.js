const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    bcryptjs.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(response => {
            res.status(201).json({
                message: 'User Created.',
                result: response
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Invalid authentication credentials!'
            });
        });
    });
});

router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email}).then(user => {
        if(!user) {
            return res.status(401).json({
                message: 'Auth Failed'
            });
        }
        fetchedUser = user;
        return bcryptjs.compare(req.body.password, user.password);
    })
    .then(result => {
        if(!result) {
            return res.status(401).json({
                message: 'Auth Failed'
            });
        }
        const token = jwt.sign(
            {email: fetchedUser.email, id: fetchedUser._id},
            'my-secret-key',
            {expiresIn: '1h'}
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Invalid authentication credentials!'
        });
    });
});

module.exports = router;