var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var packageSchema = new Schema({
	'weight' : Number,
	'value' : Number,
	'delivery_man_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}
});

module.exports = mongoose.model('package', packageSchema);
