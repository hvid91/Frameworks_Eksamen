module.exports = (dal, secret) => {
    let express = require('express');
    let router = express.Router();
    let error = require("../helpers/error_check");

    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');

    router.post('/create', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const admin = req.body.admin;

        if (!username) {
            error.checker(res, "username");
            return;
        }
        if(!password){
            error.checker(res, "password");
            return;
        }

        const exist = await dal.getUser(username);

        if(exist){
            let msg = "email!";
            console.error(msg);
            res.status(401).json({msg: msg});
            return;
        }

        const user = { "username": username, "password": password, "admin": admin};
        bcrypt.hash(user.password, 10, async (err, hash) => {
            user.hash = hash; // The hash has been made, and is stored on the user object.
            delete user.password; // The clear text password is no longer needed
            const newUser = await dal.createUser(user);
            res.json({msg: "New user created!", username: newUser.username});
        });

    });

    router.put('/', (req, res) => {
        // TODO: Implement user update (change password, etc).
        res.status(501).json({msg: "PUT update user not implemented"});
    });

    // This route takes a username and a password and create an auth token
    router.post('/authenticate', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username) {
            error.checker(res, "username");
            return;
        }
        if(!password){
            error.checker(res, "password");
            return;
        }

        const user = await dal.getUser(username);
        if (user) { // If the user is found
            bcrypt.compare(password, user.hash, (err, result) => {
                if (result) { // If the password matched
                    const payload = { username: username, admin: user.admin};
                    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                    res.json({
                        msg: `User '${username}' authenticated successfully`,
                        admin: user.admin,
                        token: token
                    });
                }
                else {
                    console.error(err);
                    res.status(401).json({msg: "Password mismatch!"})
                }
            });
        } else {
            res.status(404).json({msg: "User not found!"});
        }
    });

    return router;
};