var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var packageAccessSchema = new Schema({
	'user_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'mailbox_id' : {
		type: Schema.Types.ObjectId,
		ref: 'mailbox'
	},
	'date_from' : Date,
	'date_to' : Date,
	'date_accessed' : Date
	//TODO: package?
});

module.exports = mongoose.model('packageAccess', packageAccessSchema);
