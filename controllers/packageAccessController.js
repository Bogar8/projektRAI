var PackageaccessModel = require('../models/packageAccessModel.js');

/**
 * packageAccessController.js
 *
 * @description :: Server-side logic for managing packageAccesss.
 */
module.exports = {

    /**
     * packageAccessController.list()
     */
    list: function (req, res) {
        PackageaccessModel.find(function (err, packageAccesss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting packageAccess.',
                    error: err
                });
            }

            return res.json(packageAccesss);
        });
    },

    /**
     * packageAccessController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PackageaccessModel.findOne({_id: id}, function (err, packageAccess) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting packageAccess.',
                    error: err
                });
            }

            if (!packageAccess) {
                return res.status(404).json({
                    message: 'No such packageAccess'
                });
            }

            return res.json(packageAccess);
        });
    },

    /**
     * packageAccessController.create()
     */
    create: function (req, res) {
        var packageAccess = new PackageaccessModel({
			user_id : req.body.user_id,
			date_from : req.body.date_from,
			date_to : req.body.date_to,
			date_accessed : req.body.date_accessed
        });

        packageAccess.save(function (err, packageAccess) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating packageAccess',
                    error: err
                });
            }

            return res.status(201).json(packageAccess);
        });
    },

    /**
     * packageAccessController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PackageaccessModel.findOne({_id: id}, function (err, packageAccess) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting packageAccess',
                    error: err
                });
            }

            if (!packageAccess) {
                return res.status(404).json({
                    message: 'No such packageAccess'
                });
            }

            packageAccess.user_id = req.body.user_id ? req.body.user_id : packageAccess.user_id;
			packageAccess.date_from = req.body.date_from ? req.body.date_from : packageAccess.date_from;
			packageAccess.date_to = req.body.date_to ? req.body.date_to : packageAccess.date_to;
			packageAccess.date_accessed = req.body.date_accessed ? req.body.date_accessed : packageAccess.date_accessed;
			
            packageAccess.save(function (err, packageAccess) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating packageAccess.',
                        error: err
                    });
                }

                return res.json(packageAccess);
            });
        });
    },

    /**
     * packageAccessController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PackageaccessModel.findByIdAndRemove(id, function (err, packageAccess) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the packageAccess.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
