var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
	'isAdmin' : Boolean
});


userSchema.statics.authenticate = function (username, password, callback) { //prijava uporabnika
	User.findOne({username: username})
		.exec(function (err, user) {
			if (err) {
				return callback(err);
			} else if (!user) {
				var err = new Error("User not found");
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, function (err, result) {
				if (result === true) {
					return callback(null, user);
				} else {
					return callback();
				}
			});
		});
}

module.exports = mongoose.model('user', userSchema);
var User = mongoose.model('user', userSchema, 'users');