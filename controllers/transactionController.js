const Transaction = require("../models/Transaction");

const getAllTransactions = async (req, res) => {
	let transactions = await Transaction.find({ userId: req.user._id });
	if (!transactions) {
		return res.status(204).json({ success: "No transactions yet." });
	}

	res.json(transactions);
};

const createTransaction = async (req, res) => {
	let { amount, type, category, date, description } = req.body;
	if (!amount || !type) {
		const missingFields = [];
		if (!amount) missingFields.push("Amount");
		if (!type) missingFields.push("Transaction type");

		return res
			.status(400)
			.json({ error: `The following field(s) are required: ${missingFields.join(", ")}` });
	}

	try {
		const result = await Transaction.create({
			amount: amount,
			type: type,
			category: category,
			date: date,
			description: description || "",
			userId: req.user._id,
		});

		res.status(201).json(result);
	} catch (err) {
		res.status(500).json({ error: "An error occurred while creating the transaction." });
	}
};

const getTransaction = async (req, res) => {
	const { id } = req.params;

	try {
		const transaction = await Transaction.findOne({ _id: id, userId: req.user._id }).exec();
		if (!transaction) {
			return res.status(404).json({ error: "Transaction not found." });
		}

		res.json(transaction);
	} catch (error) {
		res.status(500).json({ error: "An error occurred while retrieving the transaction." });
	}
};

const updateTransaction = async (req, res) => {
	const { amount, type, category, date, description } = req.body;
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: "Please specify which transaction you would like to update." });
	}

	try {
		const transaction = await Transaction.findOne({ _id: id, userId: req.user._id }).exec();

		if (!transaction) {
			return res.status(404).json({ error: "Transaction not found." });
		}

		if (type) {
			transaction.type = type;
		}

		transaction.amount = amount;
		transaction.category = category;
		transaction.date = date;
		transaction.description = description;

		// Saving the changes made to the transaction
		await transaction.save();

		res.json(transaction);
	} catch (error) {
		console.error(error); // Log the error for debugging purposes
		res.status(500).json({ error: "An error occurred while updating the transaction." });
	}
};

const deleteTransaction = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ error: "Please specify which transaction you would like to delete." });
	}

	try {
		const transaction = await Transaction.findOne({ _id: id, userId: req.user._id }).exec();
		if (!transaction) {
			return res.status(404).json({ error: "Transaction not found." });
		}

		await Transaction.deleteOne({ _id: id }).exec();

		res.status(200).json({ success: "Successfully deleted transaction." });
	} catch (error) {
		res.status(500).json({ error: "An error occurred while deleting the transaction." });
	}
};

module.exports = {
	getAllTransactions,
	createTransaction,
	getTransaction,
	updateTransaction,
	deleteTransaction,
};
