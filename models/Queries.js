const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
		token:{
				type:String,
				required:true
		},
		name:{
				type:String,
				required:true
		},
		email:{
				type:String,
				required:true
		},
		querylist:[String]
})

const Queries = mongoose.model('querydetail',QuerySchema);

module.exports = Queries;


