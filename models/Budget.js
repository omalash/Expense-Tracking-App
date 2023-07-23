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
		enum: ['Daily', 'Weekly', 'Monthly', 'Annualy'],
		default: 'Monthly',
	},
	startDate: {
		type: Date, // Optional: Add start date for the budget
	},
	endDate: {
		type: Date, // Optional: Add end date for the budget
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	transactions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Transaction',
		},
	],
});

module.exports = mongoose.model('Budget', budgetSchema);
