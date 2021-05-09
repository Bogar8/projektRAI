var express = require('express');
var router = express.Router();
var mailboxController = require('../controllers/mailboxController.js');
var UserModel = require('../models/userModel.js');

function getAllUsers(req, res, next) { //pridobi vse uporabnike za combobox za izbiro lastnika nabiralnika
    UserModel.find(function (err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getil all ussers.',
                error: err
            });
        }
        req.users = users;
        next();
    });
}

function checkIfAdmin(req, res, next) { //preveri ali imamo pravice
    if (req.session.isAdmin === true)
        next();
    else {
        return res.status(500).json({
            message: 'You dont have access!'
        });
    }
}

/*
 * GET
 */
router.get('/', mailboxController.list);
router.get('/administration', checkIfAdmin, getAllUsers, mailboxController.loadMaliboxAdministration);
router.get('/administration/edit/:id', checkIfAdmin, getAllUsers, mailboxController.mailboxEdit);
/*
 * GET
 */
router.get('/:id', mailboxController.show);

/*
 * POST
 */
router.post('/', mailboxController.create);
router.post('/delete/:id', checkIfAdmin, mailboxController.remove);
router.post('/administration/edit/:id', checkIfAdmin, mailboxController.update);


/*
 * PUT
 */
router.put('/:id', mailboxController.update);

/*
 * DELETE
 */
router.delete('/:id', mailboxController.remove);

module.exports = router;
