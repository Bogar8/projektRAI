var UserfaceModel = require('../models/userFaceModel.js');
const {PythonShell} = require('python-shell');
fs = require('fs');
/**
 * userFaceController.js
 *
 * @description :: Server-side logic for managing userFaces.
 */
module.exports = {

    /**
     * userFaceController.list()
     */
    list: function (req, res) {
        UserfaceModel.find(function (err, userFaces) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting userFace.',
                    error: err
                });
            }

            return res.json(userFaces);
        });
    },

    /**
     * userFaceController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserfaceModel.findOne({_id: id}, function (err, userFace) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting userFace.',
                    error: err
                });
            }

            if (!userFace) {
                return res.status(404).json({
                    message: 'No such userFace'
                });
            }

            return res.json(userFace);
        });
    },

    /**
     * userFaceController.create()
     */
    create: function (req, res) {
        var userFace = new UserfaceModel({
            user_id: req.body.user_id,
            data: req.body.data
        });

        userFace.save(function (err, userFace) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating userFace',
                    error: err
                });
            }

            return res.status(201).json(userFace);
        });
    },

    /**
     * userFaceController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserfaceModel.findOne({_id: id}, function (err, userFace) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting userFace',
                    error: err
                });
            }

            if (!userFace) {
                return res.status(404).json({
                    message: 'No such userFace'
                });
            }

            userFace.user_id = req.body.user_id ? req.body.user_id : userFace.user_id;
            userFace.data = req.body.data ? req.body.data : userFace.data;

            userFace.save(function (err, userFace) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating userFace.',
                        error: err
                    });
                }

                return res.json(userFace);
            });
        });
    },

    /**
     * userFaceController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserfaceModel.findByIdAndRemove(id, function (err, userFace) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the userFace.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
    addPhoto: function (req, res) {
        let photo = req.body.photo
        let path = "tmp/tmp.txt"
        fs.writeFile(path, photo, function (err) {
            if (err) return console.log(err);
        });
        let options = {
            mode: 'text',
            pythonPath: 'C:\\Users\\blazb\\Desktop\\2.letnik2.sem\\rac_vid\\venv\\Scripts\\python.exe',
            pythonOptions: ['-u'],
            args: path
        };

        PythonShell.run('python/znacilnica.py', options, function (err, results) {
            if (err)
                return res.json({successful: false, message: "error!"});
            if (String(results) === "error")
                return res.json({successful: false, message: "error python!"});
            var userFace = new UserfaceModel({
                user_id: req.body.user_id,
                data: String(results)
            });
            userFace.save(function (err, userFace) {
                if (err) {
                    console.log("123" + err)
                    return res.status(500).json({
                        message: 'Error when creating userFace',
                        error: err
                    });
                }
                console.log("shranjeno")
                return res.json({successful: true, message: "Photo successfully added!"});
            });
        });
    }, comparePhoto: function (req, res) {
        let photo = req.body.photo
        let path = "tmp/tmp.txt"
        let paths = []
        fs.writeFile(path, photo, function (err) {
            if (err) return console.log(err);
        });
        UserfaceModel.find().populate('user_id').exec(function (err, userFaces) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting userFace.',
                    error: err
                });
            }
            let i = 0;
            userFaces.forEach(function (face) {
                i++;
                let path2 = "tmp/znacilnice" + i + ".txt";
                paths.push(path2)
                fs.writeFile(path2, face.data, function (err) {
                    if (err) return console.log(err);
                });
            });

            let options = {
                mode: 'text',
                pythonPath: 'C:\\Users\\blazb\\Desktop\\2.letnik2.sem\\rac_vid\\venv\\Scripts\\python.exe',
                args: [path, paths]
            };
            PythonShell.run('python/compare.py', options, function (err, results) {
                if (err) {
                    console.log(err)
                    return res.json({successful: false, message: "error!"});
                }
                if (String(results) === "error")
                    return res.json({successful: false, message: "error!"});
                if (String(results) === "No matching")
                    return res.json({successful: false, message: "No matching"});


                let user = userFaces[Number(results)].user_id
                return res.json({successful: true, message: "Face recognized!", user_id: user._id, username:user.username, email:user.email, isAdmin: user.isAdmin});
            });
        });
    },
};
