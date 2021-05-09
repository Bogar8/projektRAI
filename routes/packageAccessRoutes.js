var express = require('express');
var router = express.Router();
var packageAccessController = require('../controllers/packageAccessController.js');

/*
 * GET
 */
router.get('/', packageAccessController.list);

/*
 * GET
 */
router.get('/:id', packageAccessController.show);

/*
 * POST
 */
router.post('/', packageAccessController.create);

/*
 * PUT
 */
router.put('/:id', packageAccessController.update);

/*
 * DELETE
 */
router.delete('/:id', packageAccessController.remove);

module.exports = router;