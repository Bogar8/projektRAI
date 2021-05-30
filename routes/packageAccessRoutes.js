var express = require('express');
var router = express.Router();
var packageAccessController = require('../controllers/packageAccessController.js');

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
router.get('/', packageAccessController.list);
router.get('/accessHistory/:id', requiresLogin, packageAccessController.accessHistoryList);
router.get('/delete/:id', requiresLogin, packageAccessController.deleteAccess);

/*
 * GET
 */
router.get('/:id', packageAccessController.show);

/*
 * POST
 */
router.post('/', packageAccessController.create);
router.post('/api/create', packageAccessController.apiAddAccessToMyMailbox);
router.post('/api/access', packageAccessController.apiCheckIfCanAccessMailbox);
router.post('/grantAccess', requiresLogin, packageAccessController.grantAccess);

/*
 * PUT
 */
router.put('/:id', packageAccessController.update);

/*
 * DELETE
 */
router.delete('/:id', packageAccessController.remove);

module.exports = router;
