var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var mailboxSchema = new Schema({
	'owner_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'location' : String,
	'locked' : Boolean,
	'last_accessed' : Date
});

module.exports = mongoose.model('mailbox', mailboxSchema);
