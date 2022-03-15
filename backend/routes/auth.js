const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Vivekisagoodb$oy';

// ROUTE 1: Create a user using: POST "/api/auth/createUser". No Login Required
router.post('/createUser', [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    //if there are errors, return bad request with errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        //Check whether the user with this email exist already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: 'Sorry a user with this email already exist' });
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
        //   .then(user => res.json(user))
        //   .catch(err=> {console.log(err,
        //     res.json({error:'Please enter a Uniqure value for Email', message: err.message}))});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }

});

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No Login Required
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    //if there are errors, return bad request with errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        //Check whether the user with this email exist already
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Get logged in user details: POST "/api/auth/getUser". Login Required
router.post('/getUser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router