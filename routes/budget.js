const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.route('/')
    .get(budgetController.getBudgetPlans)
    .post(budgetController.createBudget)
    .put(budgetController.updateBudget)
    .delete(budgetController.deleteBudget)

module.exports = router;
