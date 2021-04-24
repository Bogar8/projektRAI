var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
	'id' : Number
});

module.exports = mongoose.model('user', userSchema);
