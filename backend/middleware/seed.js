const mongoose = require('mongoose');
const operationModel = require('../models/operation')
const { handleError } = require('../middleware/error')

const seedUserData = async (userId) => {
    try {
        const incomeCategories = ['Salary', 'Part-time Job', 'Freelance Work'];
        const expenseCategories = ['Food', 'Groceries', 'Transportation', 'Housing/Rent', 'Utilities', 'Car', 'Clothing', 'Entertainment', 'Tax/Insurance'];

        const getRandomDate = (monthOffset) => {
            const now = new Date();
            const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
            const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
            return new Date(targetDate.getFullYear(), targetDate.getMonth(), Math.floor(Math.random() * daysInMonth) + 1);
        };

        const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const getRandomDescription = (type, category) => {
            const descriptions = {
                income: ['Salary payment', 'Freelance project payout', 'Part-time job earnings', 'Bonus received'],
                expense: ['Bought groceries', 'Paid rent', 'Electricity bill', 'Car repair', 'Dinner out', 'Shopping', 'Insurance payment', 'Movie night'],
            };
            const typeDescriptions = descriptions[type];
            return `${typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]}`;
        };

        const operations = [];

        for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
            let monthlyIncomeCount = 0;
            let monthlyExpenseCount = 0;

            while (monthlyIncomeCount + monthlyExpenseCount < 10) {
                const isIncome = Math.random() > 0.4 && monthlyIncomeCount < 3;
                if (isIncome) {
                    const category = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
                    operations.push({
                        type: 'income',
                        category,
                        amount: getRandomAmount(1000, 5000),
                        date: getRandomDate(monthOffset),
                        description: getRandomDescription('income', category),
                        userId: new mongoose.Types.ObjectId(userId),
                    });
                    monthlyIncomeCount++;
                } else {
                    const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
                    operations.push({
                        type: 'expense',
                        category,
                        amount: getRandomAmount(50, 1000),
                        date: getRandomDate(monthOffset),
                        description: getRandomDescription('expense', category),
                        userId: new mongoose.Types.ObjectId(userId),
                    });
                    monthlyExpenseCount++;
                }
            }
        }

        return await operationModel.insertMany(operations);
    } catch (error) {
        handleError(error, res)
    }
};

module.exports = { seedUserData }
