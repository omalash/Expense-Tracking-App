const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
	amount: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		enum: ["Expense", "Income"],
		required: true,
	},
	category: {
		type: String,
		default: "Uncategorized"
	},
	date: {
		type: Date,
		default: Date.now,
	},
	description: {
		type: String,
		default: ""
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	}
});

module.exports = mongoose.model("Transaction", transactionSchema);
