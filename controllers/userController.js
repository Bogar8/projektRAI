var UserModel = require('../models/userModel.js');
var MailboxModel = require('../models/mailboxModel.js')
var bcrypt = require('bcrypt');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        data = [];
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            data.users = users;
            return res.render('administration/user', data);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },
    userEdit: function (req, res) {
        data = []
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            data.user = user;
            return res.render('administration/userEdit', data);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            isAdmin: false
        });

        bcrypt.hash(user.password, 10, function (err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when hashing password.',
                    error: err
                });
            }
            user.password = hash;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating user',
                        error: err
                    });
                }
            });

            return res.redirect("/")
        });
    },
    createAdmin: function (req, res) {
        var user = new UserModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            isAdmin: Boolean(req.body.isAdmin)
        });


        bcrypt.hash(user.password, 10, function (err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }
            user.password = hash;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating user',
                        error: err
                    });
                }
            });

            return res.redirect(req.get('referer'));
        });

    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
            user.email = req.body.email ? req.body.email : user.email;
            user.isAdmin = Boolean(req.body.isAdmin);
            if (req.body.password.length !== 0) {
                user.password = req.body.password ? req.body.password : user.password;
                bcrypt.hash(user.password, 10, function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating user',
                            error: err
                        });
                    }
                    user.password = hash;

                    user.save(function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when creating user',
                                error: err
                            });
                        }
                    });
                });
            } else {
                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating user',
                            error: err
                        });
                    }
                });
            }
            return res.redirect('/users/administration');
        });
    },

    edit: function (req, res) {
        var id = req.session.userId;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
            user.email = req.body.email ? req.body.email : user.email;
            if (req.body.password.length !== 0) {
                user.password = req.body.password ? req.body.password : user.password;
                bcrypt.hash(user.password, 10, function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating user',
                            error: err
                        });
                    }
                    user.password = hash;

                    user.save(function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating user',
                                error: err
                            });
                        }
                    });
                });
            } else {
                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating user',
                            error: err
                        });
                    }
                });
            }

            return res.redirect('/users/profile');
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.redirect(req.get('referer'));
        });
    }, showRegister: function (req, res) { //pokaže stran za registracijo
        return res.render('user/register');
    }, showLogin: function (req, res) { //pokaze stran za prijavo
        return res.render('user/login');
    }, showProfile: function (req, res) { //pokaze stran za profil
        var id = req.session.userId;
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.render('user/profile', user);
        });
    }, showEdit: function (req, res) { //pokaze stran za spreminjanje uporabnika
        var id = req.session.userId;
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.render('user/edit', user);
        });
    }, login: function (req, res, next) { //prijava
        UserModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error("Wrong username or password");
                err.status = 401;
                return next(err);
            } else {
                console.log(user);
                req.session.userId = user._id;
                req.session.username = user.username;
                req.session.login = true;
                req.session.isAdmin = user.isAdmin;
                return res.redirect('/');
            }
        });
    }, showMyMailboxes: function (req, res) {
        var data = [];
        data.users = req.users;
        MailboxModel.find({owner_id: req.session.userId}).populate('owner_id').exec(function (err, mailboxes) {
            {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting mailbox.',
                        error: err
                    });
                }
                data.mailboxes = mailboxes;
                return res.render('user/myMailboxes.hbs', data);
            }
        });
    }, logout: function (req, res, next) { //odjava uporabnika
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    return next(err)
                } else {
                    return res.redirect('/');
                }
            });
        }
    },
};
