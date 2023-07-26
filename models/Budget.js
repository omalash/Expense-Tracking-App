const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
	spendingLimit: {
		type: Number,
		required: true,
		min: 0,
	},
	duration: {
		type: String,
		enum: ['Daily', 'Weekly', 'Monthly', 'Annually'],
		default: 'Monthly',
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

module.exports = mongoose.model('Budget', budgetSchema);
