const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const moment = require('moment');

const getBudgetPlan = async (req, res) => {
	try {
		let budget = await Budget.findOne({ userId: req.user._id });
		if (!budget) {
			return res.status(200).json({ message: 'No budget created yet' });
		}

		const transactions = await Transaction.find({ userId: req.user._id });
		if (!transactions || transactions.length === 0) {
			return res.status(200).json({ message: 'No transactions yet.' });
		}

		const expenses = transactions.filter((transaction) => transaction.type === 'Expense');
		const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

		res.json({
			spendingLimit: budget.spendingLimit,
			typeOfBudget: budget.duration,
			onTrack: totalExpenses <= budget.spendingLimit,
			remainingMoney: budget.spendingLimit - totalExpenses,
		});
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while fetching the budget plan.' });
	}
};

const createBudget = async (req, res) => {
	const { spendingLimit, duration, startDate, endDate } = req.body;
	if (!spendingLimit) {
		res.status(400).json({ error: 'Enter a spending limit for the budget.' });
	} else if (spendingLimit < 0) {
		res.status(400).json({ error: 'Invalid spending limit. Enter a value greater than zero.' });
	}

	// Validating inputs
    
    if (duration && (duration != 'Daily' && duration != 'Weekly' && duration != 'Monthly' && duration != 'Annually')) {
        res.status(400).json({ error: 'Please enter either Daily, Weekly, Monthly, or Annually' }) 
    }
};

module.exports = { getBudgetPlan };
