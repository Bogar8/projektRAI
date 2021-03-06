var MailboxModel = require('../models/mailboxModel.js');


/**
 * mailboxController.js
 *
 * @description :: Server-side logic for managing mailboxs.
 */
module.exports = {

    /**
     * mailboxController.list()
     */
    list: function (req, res) {
        MailboxModel.find(function (err, mailboxs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox.',
                    error: err
                });
            }

            return res.json(mailboxs);
        });
    },

    /**
     * mailboxController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        MailboxModel.findOne({_id: id}, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox.',
                    error: err
                });
            }

            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }

            return res.json(mailbox);
        });
    },

    /**
     * mailboxController.create()
     */
    create: function (req, res) {
        var mailbox = new MailboxModel({
            owner_id: req.body.owner,
            location: req.body.location,
            locked: true,
            last_accessed: new Date(),
            code: req.body.code
        });

        mailbox.save(function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating mailbox',
                    error: err
                });
            }

            return res.redirect(req.get('referer'));
        });
    },

    /**
     * mailboxController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        MailboxModel.findOne({_id: id}, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox',
                    error: err
                });
            }

            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }

            mailbox.owner_id = req.body.owner_id ? req.body.owner_id : mailbox.owner_id;
            mailbox.location = req.body.location ? req.body.location : mailbox.location;
            mailbox.locked = req.body.locked ? req.body.locked : mailbox.locked;
            mailbox.last_accessed = req.body.last_accessed ? req.body.last_accessed : mailbox.last_accessed;
            mailbox.code = req.body.code ? req.body.code : mailbox.code;

            mailbox.save(function (err, mailbox) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating mailbox.',
                        error: err
                    });
                }

                return res.redirect('/mailbox/administration');
            });
        });
    },

    mailboxUserUpdate: function (req, res) {
        var id = req.params.id;

        MailboxModel.findOne({_id: id}, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox',
                    error: err
                });
            }

            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }

            mailbox.owner_id = req.body.owner_id ? req.body.owner_id : mailbox.owner_id;
            mailbox.location = req.body.location ? req.body.location : mailbox.location;
            mailbox.locked = req.body.locked ? req.body.locked : mailbox.locked;
            mailbox.last_accessed = req.body.last_accessed ? req.body.last_accessed : mailbox.last_accessed;

            mailbox.save(function (err, mailbox) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating mailbox.',
                        error: err
                    });
                }

                return res.redirect('/users/myMailboxes');
            });
        });
    },

    /**
     * mailboxController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        MailboxModel.findByIdAndRemove(id, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the mailbox.',
                    error: err
                });
            }

            return res.redirect(req.get('referer'));
        });
    },
    loadMaliboxAdministration: function (req, res) { //nalozi administracijsko stran z vsemi uporabniki in nabiralniki
        var data = [];
        data.users = req.users;

        MailboxModel.find().populate('owner_id').exec(function (err, mailboxs) {
            {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting mailbox.',
                        error: err
                    });
                }
                data.mailboxes = mailboxs;
                return res.render('administration/mailbox', data);
            }
        });
    }, mailboxEdit: function (req, res) {
        var id = req.params.id;
        var data = [];
        data.users = req.users;
        MailboxModel.findOne({_id: id}).populate('owner_id').exec(function (err, mailbox) {
            {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting mailbox.',
                        error: err
                    });
                }
                data.mailbox = mailbox;
                for (i = 0; i < data.users.length; i++) {
                    if (String(data.users[i]._id) === String(mailbox.owner_id._id)) {
                        data.users[i].me = true;
                    }
                }
                return res.render('administration/mailboxEdit', data);
            }
        });
    },

    //API----------------------------------
    apiShowMyMailboxes: function (req, res) {
        if (!req.body.userId) {
            return res.json({successful: false, message: "Error no parameters!"});
        } else {
            MailboxModel.find({owner_id: req.body.userId}).populate('owner_id').exec(function (err, mailboxes) {
                {
                    if (err) {
                        return res.json({successful: false, message: "Error when getting mailboxes!"});
                    }
                    return res.json({
                        successful: true,
                        message: "Getting mailboxes was successful!",
                        mailboxes: mailboxes
                    });

                }
            });
        }
    }
}
