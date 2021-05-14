var PackageaccessModel = require('../models/packageAccessModel.js');
var UserModel = require("../models/userModel");
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

    apiAddAccessToMyMailbox: function (req, res) {
        if (!req.body.username || !req.body.mailbox_id || !req.body.date_from || !req.body.date_to)
            return res.json({successful: false, message: "Error not all data have been set!"});
        UserModel.findOne({username: req.body.username}, function (err, user) {
            if (err) {
                return res.json({successful: false, message: "Error when getting user!"});
            }

            if (!user) {
                return res.json({successful: false, message: "No such user!"});
            }
            var packageAccess = new PackageaccessModel({
                user_id: user._id,
                mailbox_id: req.body.mailbox_id,
                date_from: req.body.date_from,
                date_to: req.body.date_to,
                date_accessed: ""
            });

            packageAccess.save(function (err, packageAccess) {
                if (err) {
                    return res.json({successful: false, message: "Error when creating packageAccess!"});
                }
                return res.json({successful: true, message: "Access successfully added!"});
            });
        });
    },

    apiCheckIfCanAccessMailbox: function (req, res) {
        if (!req.body.user_id || !req.body.mailbox_id)
            return res.json({successful: false, message: "Error not all data have been set!"});
        PackageaccessModel.findOne({date_from: { $lte: new Date().toISOString() }, date_to: { $gte: new Date().toISOString() }, user_id: req.body.user_id, mailbox_id: req.body.mailbox_id, date_accessed: ""  }, function (err, packageAccess) {
            if (err) {
                return res.json({successful: false, message: "Error when getting package access!"});
            }

            if (!packageAccess) {
                return res.json({successful: false, message: "No such package acces!"});
            }

            packageAccess.date_accessed = new Date().toISOString();

            packageAccess.save(function (err, packageAccess) {
                if (err) {
                    return res.json({successful: false, message: "Error when saving package access!"});
                }
                return res.json({successful: true, message: "Access successfully used!"});
            });
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
