var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var mailboxController = require('../controllers/mailboxController.js');
var UserModel = require('../models/userModel.js');

function checkIfAdmin(req, res, next) { //preveri ali imamo pravice
    if (req.session.isAdmin === true)
        next();
    else {
        return res.status(500).json({
            message: 'You dont have access!'
        });
    }
}

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        return next(err);
    }
}

function checkSameName(req, res, next) {
    UserModel.findOne({username: req.body.username})
        .exec(function (err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                return next()
            }
            var err = new Error("User with that name already exists");
            err.status = 401;
            return next(err);
        });
}

function checkSameNameApi(req, res, next) {
    UserModel.findOne({username: req.body.username})
        .exec(function (err, user) {
            if (err) {
                return res.json({successful: false, message: "Error when connecting to database!"});
            } else if (!user) {
                return next()
            }
            return res.json({successful: false, message: "User with that name exists!"});
        });
}

/*
 * GET
 */
router.get('/', userController.list);
router.get('/administration', checkIfAdmin, userController.list);
router.get('/register', userController.showRegister);
router.get('/login', userController.showLogin);
router.get('/logout', userController.logout);
router.get('/administration/edit/:id', checkIfAdmin, userController.userEdit);
router.get('/profile', requiresLogin, userController.showProfile);
router.get('/edit', requiresLogin, userController.showEdit);
router.get('/myMailboxes', requiresLogin, userController.showMyMailboxes);
router.get('/myMailboxes/edit/:id', requiresLogin, userController.editMyMailbox);
router.get('/grantAccess/:id', requiresLogin, userController.showGrantAccess);
/*
 * GET
 */
router.get('/:id', userController.show);
router.post('/delete/:id', checkIfAdmin, userController.remove);

/*
 * POST
 */
router.post('/', checkSameName, userController.create);
router.post('/administration/create', checkIfAdmin, checkSameName, userController.createAdmin);
router.post('/login', userController.login);
router.post('/administration/edit/:id', checkIfAdmin, userController.update);
router.post('/edit', requiresLogin, userController.edit)
router.post('/myMailboxes/edit/:id', requiresLogin, mailboxController.mailboxUserUpdate);
router.post('/api/create', checkSameNameApi, userController.apiRegisterUser);
router.post('/api/login', userController.apiLogin);
/*
 * PUT
 */
router.put('/:id', userController.update);
/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
