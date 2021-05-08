var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');


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
router.get('/', userController.list);
router.get('/administration', checkIfAdmin, userController.list);
router.get('/register', userController.showRegister);
router.get('/login', userController.showLogin);
router.get('/logout',userController.logout);
router.get('/administration/edit/:id', checkIfAdmin, userController.userEdit);
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

/*
 * PUT
 */
router.put('/:id', userController.update);
/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
