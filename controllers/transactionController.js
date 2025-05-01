const Transaction = require('../models/Transaction');
const moment = require('moment');

async function fetchTransactionSummary(userId) {
	const txs = await Transaction.find({ userId });
	const expenses = txs.filter(t => t.type === 'Expense');
	const income   = txs.filter(t => t.type === 'Income');
  
	const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
	const totalIncome   = income.reduce((sum, i) => sum + i.amount, 0);
  
	return {
	  Income: totalIncome,
	  incomeTransactions: income,
	  Expenses: totalExpenses,
	  expensesTransactions: expenses,
	  total: totalIncome - totalExpenses,
	};
  }

const getAllTransactions = async (req, res) => {
	const summary = await fetchTransactionSummary(req.user._id);
  	return res.json(summary);
};

const createTransaction = async (req, res) => {
	let { amount, type, category, date, description } = req.body;
	if (!amount || !type) {
		const missingFields = [];
		if (!amount) missingFields.push('Amount');
		if (!type) missingFields.push('Transaction Type');

		return res
			.status(400)
			.json({ error: `The following field(s) are required: ${missingFields.join(', ')}` });
	}

	// Validating Inputs

	if (type != 'Expense' && type != 'Income') {
		return res.status(400).json({ error: 'Please enter either Expense or Income.' });
	}

	if (date && !moment(date, 'MM/DD/YYYY', true).isValid()) {
		return res.status(400).json({ error: 'Invalid date format. Please use MM/DD/YYYY format.' });
	}

	try {
		const transaction = await Transaction.create({
			amount: amount,
			type: type,
			category: category,
			date: date,
			description: description || '',
			userId: req.user._id,
		});

		// Displaying the created transaction along with the rest of the transactions
		const updatedTransactions = await fetchTransactionSummary(req.user._id);
		res.status(201).json(updatedTransactions);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'An error occurred while creating the transaction.' });
	}
};

const getTransaction = async (req, res) => {
	const { id } = req.params;

	try {
		const transaction = await Transaction.findOne({ _id: id, userId: req.user._id }).exec();
		if (!transaction) {
			return res.status(404).json({ error: 'Transaction not found.' });
		}

		res.json(transaction);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while retrieving the transaction.' });
	}
};

const updateTransaction = async (req, res) => {
	const { amount, type, category, date, description } = req.body;
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'Please specify which transaction you would like to update.' });
	}

	const transaction = await Transaction.findOne({ _id: id, userId: req.user._id }).exec();

	if (!transaction) {
		return res.status(404).json({ error: 'Transaction not found.' });
	}

	try {
		if (type) {
			transaction.type = type;
		}

		transaction.amount = amount;
		transaction.category = category;
		transaction.date = date;
		transaction.description = description;

		// Saving the changes made to the transaction
		await transaction.save();

		// Displaying the updated transaction along with the rest of the transactions
		const updatedTransactions = await fetchTransactionSummary(req.user._id);
		res.status(200).json(updatedTransactions);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while updating the transaction.' });
	}
};

const deleteTransaction = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ error: 'Please specify which transaction you would like to delete.' });
	}

	try {
		const transaction = await Transaction.findOne({ _id: id, userId: req.user._id }).exec();
		if (!transaction) {
			return res.status(404).json({ error: 'Transaction not found.' });
		}

		await Transaction.deleteOne({ _id: id }).exec();

		// Displaying the all the transactions with the deleted transaction gone
		const updatedTransactions = await fetchTransactionSummary(req.user._id);
		res.status(200).json(updatedTransactions);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while deleting the transaction.' });
	}
};

module.exports = {
	getAllTransactions,
	createTransaction,
	getTransaction,
	updateTransaction,
	deleteTransaction,
};
