const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const moment = require('moment');

const getBudgetPlans = async (req, res) => {
	const budgets = await Budget.find({ userId: req.user._id });

	if (!budgets || budgets.length === 0) {
		return res.status(200).json({ message: 'No budgets created yet' });
	}

	const currentDate = moment();
	const budgetPlans = [];

	for (const budget of budgets) {
		let startDate, endDate;

		// Gets all the transactions based on the duration given
		switch (budget.duration) {
			case 'Daily':
				startDate = currentDate.startOf('day').toDate();
				endDate = currentDate.endOf('day').toDate();
				break;
			case 'Weekly':
				startDate = currentDate.startOf('week').toDate();
				endDate = currentDate.endOf('week').toDate();
				break;
			case 'Monthly':
				startDate = currentDate.startOf('month').toDate();
				endDate = currentDate.endOf('month').toDate();
				break;
			case 'Annually':
				startDate = currentDate.startOf('year').toDate();
				endDate = currentDate.endOf('year').toDate();
				break;
			default:
				// Skip the budget if the duration is invalid
				continue;
		}

		try {
			const transactions = await Transaction.find({
				userId: req.user._id,
				date: { $gte: startDate, $lte: endDate },
			});

			const expenses = transactions.filter((transaction) => transaction.type === 'Expense');
			const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

			budgetPlans.push({
				spendingLimit: budget.spendingLimit,
				typeOfBudget: budget.duration,
				startDate: startDate,
				endDate: endDate,
				onTrack: totalExpenses <= budget.spendingLimit,
				remainingMoney: budget.spendingLimit - totalExpenses,
			});
		} catch (error) {
			// Handle any errors during budget calculation (optional)
			console.error(`Error calculating budget plan for duration ${budget.duration}:`, error);
		}
	}

	res.json(budgetPlans);
};

const createBudget = async (req, res) => {
	let { spendingLimit, duration } = req.body;

	if (!spendingLimit) {
		return res.status(400).json({ error: 'Enter a spending limit for the budget.' });
	}

	// Validating inputs

	if (spendingLimit < 0) {
		return res.status(400).json({ error: 'Invalid spending limit. Enter a value greater than zero.' });
	}

	if (duration && !['Daily', 'Weekly', 'Monthly', 'Annually'].includes(duration)) {
		return res.status(400).json({ error: 'Please enter either Daily, Weekly, Monthly, or Annually' });
	}

	try {
		const budgetQuery = {
			userId: req.user._id,
		};

		budgetQuery.duration = duration ? duration : 'Monthly';
		const budget = await Budget.findOne(budgetQuery);

		// Check if a budget with the same duration already exists for the current user
		if (budget) {
			budget.spendingLimit = spendingLimit;
			await budget.save();
		} else {
			budget = await Budget.create({
				spendingLimit: spendingLimit,
				duration: duration,
				userId: req.user._id,
			});
		}

		res.status(201).json({ success: 'Budget successfully created.', createdBudget: budget });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'An error occurred while creating/updating the budget.' });
	}
};

const updateBudget = async (req, res) => {
	const { spendingLimit, duration } = req.body;

	if (!spendingLimit && !duration) {
		return res.status(200).json({ message: 'No updates were provided. The budget remains unchanged.' });
	}

	const budget = await Budget.findOne({ userId: req.user._id });
	if (!budget) {
		return res.status(400).json({ error: 'A budget cannot be found. Try creating one first.' });
	}

	if (spendingLimit < 0) {
		return res.status(400).json({ error: 'Invalid spending limit. Enter a value greater than zero.' });
	}

	try {
		if (spendingLimit) {
			budget.spendingLimit = spendingLimit;
		}
		budget.duration = duration;

		await budget.save();

		res.status(200).json({ success: 'Budget successfully updated.', updatedBudget: budget });
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while updating the budget.' });
	}
};

const deleteBudget = async (req, res) => {
	const { duration } = req.body;
	const budgetQuery = {
		userId: req.user._id,
	};

	if (duration) {
		budgetQuery.duration = duration;
	}

	const budget = await Budget.findOne(budgetQuery).exec();
	if (!budget) {
		return res.status(200).json({ success: 'There are no budgets to delete.' });
	}

	try {
		await Budget.deleteOne({ _id: budget._id }).exec();

		res.status(200).json({ success: 'Budget successfully deleted.', deletedBudget: budget });
	} catch (error) {
		res.status(500).json({ error: 'An error occurred while deleting the budget.' });
	}
};

module.exports = { getBudgetPlans, createBudget, updateBudget, deleteBudget };
