var express = require('express');
var router = express.Router();
var packageController = require('../controllers/packageController.js');

/*
 * GET
 */
router.get('/', packageController.list);

/*
 * GET
 */
router.get('/:id', packageController.show);

/*
 * POST
 */
router.post('/', packageController.create);

/*
 * PUT
 */
router.put('/:id', packageController.update);

/*
 * DELETE
 */
router.delete('/:id', packageController.remove);

module.exports = router;
