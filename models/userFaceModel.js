var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userFaceSchema = new Schema({
	'user_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'data' : String
});

module.exports = mongoose.model('userFace', userFaceSchema);
