const express = require('express');
const Router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const users = require('../controllers/users')

Router.route('/register')
    .get(users.renderRegister)
    .post(wrapAsync(users.register))


Router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), users.login)

Router.get('/logout', users.logout)

module.exports = Router;