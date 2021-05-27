var express = require('express');
var router = express.Router();
var userFaceController = require('../controllers/userFaceController.js');

/*
 * GET
 */
router.get('/', userFaceController.list);

/*
 * GET
 */
router.get('/:id', userFaceController.show);

/*
 * POST
 */
router.post('/', userFaceController.create);
router.post('/api/add',userFaceController.addPhoto)
router.post('/api/unlock', userFaceController.comparePhoto);
/*
 * PUT
 */
router.put('/:id', userFaceController.update);

/*
 * DELETE
 */
router.delete('/:id', userFaceController.remove);

module.exports = router;
