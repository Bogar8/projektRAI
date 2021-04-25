var PackageModel = require('../models/packageModel.js');

/**
 * packageController.js
 *
 * @description :: Server-side logic for managing packages.
 */
module.exports = {

    /**
     * packageController.list()
     */
    list: function (req, res) {
        PackageModel.find(function (err, packages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package.',
                    error: err
                });
            }

            return res.json(packages);
        });
    },

    /**
     * packageController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PackageModel.findOne({_id: id}, function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package.',
                    error: err
                });
            }

            if (!package) {
                return res.status(404).json({
                    message: 'No such package'
                });
            }

            return res.json(package);
        });
    },

    /**
     * packageController.create()
     */
    create: function (req, res) {
        var package = new PackageModel({
			weight : req.body.weight,
			value : req.body.value,
			deliveryManId : req.body.deliveryManId
        });

        package.save(function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating package',
                    error: err
                });
            }

            return res.status(201).json(package);
        });
    },

    /**
     * packageController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PackageModel.findOne({_id: id}, function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package',
                    error: err
                });
            }

            if (!package) {
                return res.status(404).json({
                    message: 'No such package'
                });
            }

            package.weight = req.body.weight ? req.body.weight : package.weight;
			package.value = req.body.value ? req.body.value : package.value;
			package.deliveryManId = req.body.deliveryManId ? req.body.deliveryManId : package.deliveryManId;
			
            package.save(function (err, package) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating package.',
                        error: err
                    });
                }

                return res.json(package);
            });
        });
    },

    /**
     * packageController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PackageModel.findByIdAndRemove(id, function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the package.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
