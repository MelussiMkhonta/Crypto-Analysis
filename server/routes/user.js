const express = require("express");
const { check, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const User = require("../models/user")
const Token = require("../models/verification")

router.post(
    "/signup",(request,response,next) =>
    {
        User.find({ email: request.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return response.status(400).json({
                        message: "User already registered"
                    });
                }
                else{

                    bcrypt.hash(request.body.password, 10, (err, hash) => {
                        if(err)
                        {
                            return response.status(500).json({
                                error: err
                            });
                        }
                        else
                        {
                            const user= new User({
                                username: request.body.username,
                                email: request.body.email,
                                password: hash
                            });

                            user
                            .save(function (err)
                                {
                                    if(err){
                                        return response.status(500).send({msg: err.message});
                                    }
                                    var token = new Token({ _id: user._id, token: crypto.randomBytes(10).toString('hex') });
                                    token.save(function (err)
                                    {
                                        if(err){
                                            return response.status(500).send({msg: err.message});
                                        }
                                        var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                                        var mailOptions = { from: process.env.SENDGRID_USERNAME, to: request.body.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by Entering this code when you log in: ' + token.token + '.\n' };
                                        transporter.sendMail(mailOptions, function (err) {
                                            if (err) { return response.status(500).send({ msg: err.message }); }
                                            response.status(200).send('A verification email has been sent to ' + request.body.email+ '.');
                                        });

                                    });
                                }

                               )/*.then(result => {
                                console.log(result);
                                response.status(200).json({
                                    message: "User Registered"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                response.status(401).json({
                                    error: err
                                });
                            });*/
                        }
                    });
                }
            });
    }

);
router.post("/verify",(request, response, next)=>
{
    Token.findOne({ token: request.body.token }, function (err, token) {
        if (!token) return response.status(400).send({ type: 'user is not verified', msg: 'Token expired' });

        User.findOne({ _id: token._id, email: request.body.email }, function (err, user) {
            if (!user) return response.status(400).send({ msg: 'Invalid token' });
            if (user.Verified) return response.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

            user.Verified = true;
            user.save(function (err) {
                if (err) { return response.status(500).send({ msg: err.message }); }
                response.status(200).send("Account successfully verified log in.");
            });
        });
    });
});

router.delete("/:Email", (req, res, next) => {
    User.remove({ email: req.params.Email })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;