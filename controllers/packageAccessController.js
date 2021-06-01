var PackageaccessModel = require('../models/packageAccessModel.js');
var UserModel = require("../models/userModel");
var MailboxModel = require('../models/mailboxModel.js');
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
    accessHistoryList: function (req, res) {
        var data = [];
        PackageaccessModel.find({mailbox_id : req.params.id, date_accessed: { $ne: null } }).populate("user_id").populate("mailbox_id").exec(function (err, accesses) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting packageAccess.',
                    error: err
                });
            }
            data.accesses = accesses;
            data.accesses.forEach(element => {
                var date = new Date(element.date_accessed);
                element.date = date.getHours() + ":" + date.getMinutes() + ", " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
            });
            return res.render('user/myMailboxesAccessHistory', data);
        });
    },
    deleteAccess: function (req, res) {
        var id = req.params.id;
        PackageaccessModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the access.',
                    error: err
                });
            }

            return res.redirect(req.get('referer'));
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
            user_id: req.body.user_id,
            date_from: req.body.date_from,
            date_to: req.body.date_to,
            date_accessed: req.body.date_accessed
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

    grantAccess: function (req, res, next) {
        var data = [];
        if (!req.body.username || !req.body.mailbox_id || !req.body.date_from || !req.body.date_to || !req.body.user_id)
            return res.json({successful: false, message: "Error not all data have been set!"});

        MailboxModel.findOne({_id: req.body.mailbox_id}, function (err, mailbox) {
            if (err) {
                return res.json({successful: false, message: "Error when getting mailbox!"});
            } else if (String(mailbox.owner_id) !== String(req.session.userId)) {
                return res.json({successful: false, message: "Only owner of mailbox can add access!"});
            }

            UserModel.findOne({username: req.body.username}, function (err, user) {
                if (err) {
                    data.message = "Error when getting user!";
                    return res.render('error', data);
                }

                if (!user) {
                    data.message = "No such user!";
                    return res.render('error', data);
                }
                var packageAccess = new PackageaccessModel({
                    user_id: user._id,
                    mailbox_id: mailbox._id,
                    date_from: req.body.date_from,
                    date_to: req.body.date_to,
                    date_accessed: ""
                });

                packageAccess.save(function (err, packageAccess) {
                    if (err) {
                        data.message = "Error when saving.";
                        return res.render('error', data);
                    }
                    return res.redirect(req.get('referer'));
                });
            });
        });
    },

    apiAddAccessToMyMailbox: function (req, res) {
        if (!req.body.username || !req.body.mailbox_code || !req.body.date_from || !req.body.date_to || !req.body.user_id)
            return res.json({successful: false, message: "Error not all data have been set!"});
        MailboxModel.findOne({code: req.body.mailbox_code}, function (err, mailbox) {
            if (err) {
                return res.json({successful: false, message: "Error when getting mailbox!"});
            } else if (String(mailbox.owner_id) !== String(req.body.user_id)) {
                return res.json({successful: false, message: "Only owner of mailbox can add access!"});
            }

            UserModel.findOne({username: req.body.username}, function (err, user) {
                if (err) {
                    return res.json({successful: false, message: "Error when getting user!"});
                }

                if (!user) {
                    return res.json({successful: false, message: "No such user!"});
                }
                var packageAccess = new PackageaccessModel({
                    user_id: user._id,
                    mailbox_id: mailbox._id,
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
        });
    },

    apiCheckIfCanAccessMailbox: function (req, res) {
        if (!req.body.user_id || !req.body.mailbox_code)
            return res.json({successful: false, message: "Error not all data have been set!"});
        MailboxModel.findOne({code: req.body.mailbox_code}, function (err, mailbox) {
            if (err) {
                return res.json({successful: false, message: "Error when getting mailbox!"});
            } else if (String(req.body.user_id) === String(mailbox.owner_id)) {
                mailbox.last_accessed = new Date().toISOString();
                mailbox.save(function (err, mailbox) {
                    if (err) {
                        return res.json({successful: false, message: "Error when saving mailbox!"});
                    }
                    return res.json({successful: true, message: "Access successfully used!"});
                });
            } else {
                PackageaccessModel.findOne({
                    date_from: {$lte: new Date().toISOString()},
                    date_to: {$gte: new Date().toISOString()},
                    user_id: req.body.user_id,
                    mailbox_id: mailbox._id,
                    date_accessed: ""
                }, function (err, packageAccess) {
                    if (err) {
                        return res.json({successful: false, message: "Error when getting package access!"});
                    }

                    if (!packageAccess) {
                        return res.json({successful: false, message: "You dont have access to unlock mailbox!"});
                    }

                    packageAccess.date_accessed = new Date().toISOString();

                    packageAccess.save(function (err, packageAccess) {
                        if (err) {
                            return res.json({successful: false, message: "Error when saving package access!"});
                        }

                        mailbox.last_accessed = new Date().toISOString();
                        mailbox.save(function (err, mailbox) {
                            if (err) {
                                return res.json({successful: false, message: "Error when saving mailbox!"});
                            }
                            return res.json({successful: true, message: "Access successfully used!"});
                        });
                    });
                });
            }
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
    }


    ,

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
