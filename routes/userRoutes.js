var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var mailboxController = require('../controllers/mailboxController.js');

function checkIfAdmin(req, res, next) { //preveri ali imamo pravice
    if (req.session.isAdmin === true)
        next();
    else {
        return res.status(500).json({
            message: 'You dont have access!'
        });
    }
}

function requiresLogin(req, res, next){
    if(req.session && req.session.userId) {
        return next();
    }
    else {
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', userController.list);
router.get('/administration', checkIfAdmin, userController.list);
router.get('/register', userController.showRegister);
router.get('/login', userController.showLogin);
router.get('/logout',userController.logout);
router.get('/administration/edit/:id', checkIfAdmin, userController.userEdit);
router.get('/profile', requiresLogin, userController.showProfile);
router.get('/edit', requiresLogin, userController.showEdit);
router.get('/myMailboxes', requiresLogin, userController.showMyMailboxes);
router.get('/myMailboxes/edit/:id', requiresLogin, userController.editMyMailbox);
/*
 * GET
 */
router.get('/:id', userController.show);
router.post('/delete/:id', checkIfAdmin, userController.remove);

/*
 * POST
 */
router.post('/', userController.create);
router.post('/administration/create', userController.createAdmin);
router.post('/login', userController.login);
router.post('/administration/edit/:id', checkIfAdmin, userController.update);
router.post('/edit', requiresLogin, userController.edit)
router.post('/myMailboxes/edit/:id', requiresLogin, mailboxController.mailboxUserUpdate);
/*
 * PUT
 */
router.put('/:id', userController.update);
/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
