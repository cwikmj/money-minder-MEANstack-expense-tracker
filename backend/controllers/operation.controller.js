const dayjs = require('dayjs');
const mongoose = require('mongoose');
const { getUserIdFromToken } = require('../middleware/auth');
const { encrypt, decrypt } = require('../middleware/hash');
const operationModel = require('../models/operation');
const { handleError } = require('../middleware/error')

exports.getDayOperations = async (req, res) => {
    const { date } = req.body;
    const tokenEncrypted = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(tokenEncrypted);

    const operations = await operationModel.find({
        date: new Date(date).setHours(0, 0, 0, 0),
        userId
    }, 'type amount category description')

    const result = operations.map(operation => {
        return {
            ...operation.toObject(),
            _id: encrypt(operation._id.toString())
        };
    });

    const dateFrom = new Date(dayjs(date).startOf('month').toISOString());
    const dateTo = new Date(dayjs(date).endOf('month').toISOString());
    const monthOperatons = await operationModel.find({
        date: { $gte: dateFrom, $lte: dateTo },
        userId
    }, 'date')
    const dates = monthOperatons.map(item => item.date.getUTCDate());

    res.status(200).json({ message: 'Success', result, dates });
}

exports.addOperation = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(tokenEncrypted);
        const { type, category, amount, description, date } = req.body;

        if (!type || !category || !amount || !description || !date) {
            return res.status(400).json({ message: 'MISSING FIELDS' });
        }

        const operation = new operationModel({ type, category, amount, description, date, userId })
        await operation.save()

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        handleError(error, res)
    }
}

exports.editOperation = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(tokenEncrypted);
        const { _id, type, category, amount, description } = req.body;

        if (!_id || !type || !category || !amount || !description) {
            return res.status(400).json({ message: 'MISSING FIELDS' });
        }

        const operation = await operationModel.findOneAndUpdate({
            _id: decrypt(_id),
            userId: new mongoose.Types.ObjectId(userId)
        }, { type, category, amount, description })

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        handleError(error, res)
    }
}

exports.removeOperation = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(tokenEncrypted);
        const operationId = decrypt(req.params.id);

        const operation = await operationModel.findOne({
            _id: new mongoose.Types.ObjectId(operationId),
            userId: new mongoose.Types.ObjectId(userId)
        })
        if (!operation) {
            return res.status(404).json({ message: 'Operation not found' });
        }

        await operationModel.findByIdAndDelete(new mongoose.Types.ObjectId(operationId))
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        handleError(error, res)
    }
}

exports.getMonthReport = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(tokenEncrypted);
        const { month, year } = req.body;

        const dateFrom = new Date(dayjs(`${year}-${month}-01`).startOf('month').toISOString());
        const dateTo = new Date(dayjs(`${year}-${month}-01`).endOf('month').toISOString());
        const operations = await operationModel.find({ userId, type: 'expense', date: { $gte: dateFrom, $lte: dateTo } }, 'type category amount -_id')
        const monthOperations = operations.reduce((acc, item) => {
            if (acc[item.category]) {
                acc[item.category] += item.amount
            } else {
                acc[item.category] = item.amount
            }
            return acc
        }, {});

        const result = Object.entries(monthOperations).map(([name, value]) => ({
            name: name,
            value: value
        }))

        res.status(200).json({ message: 'Success', result: result });
    } catch (error) {
        handleError(error, res)
    }
}

exports.getStatistics = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(tokenEncrypted);
        const sixMonths = dayjs().subtract(6, 'month').startOf('day');

        const operations = await operationModel.find({
            userId, date: { $gte: sixMonths.toDate() }
        }, 'type amount date -_id').sort({ date: 1 });

        const groupedData = operations.reduce((acc, { type, amount, date }) => {
            const month = dayjs(date).format('YYYY-MM');
            acc[month] = acc[month] || { income: 0, expense: 0 };
            acc[month][type] += amount;
            return acc;
        }, {});

        const result = Object.entries(groupedData).map(([month, totals], index, data) => ({
            month,
            income: totals.income,
            expense: totals.expense,
            total: totals.income - totals.expense
        }));
        
        for (let i = 0; i < result.length; i++) {
            if (i > 0) {
                result[i].total += result[i - 1].total
            }
        }

        res.status(200).json({ message: 'Success', result });
    } catch (error) {
        handleError(error, res)
    }
}

exports.getAccountSummary = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(tokenEncrypted);

        const accountOperations = await operationModel.find({ userId })
        const result = accountOperations.reduce((acc, transaction) => {
            if (transaction.type === 'expense') {
                acc.expenses += transaction.amount;
            } else if (transaction.type === 'income') {
                acc.incomes += transaction.amount;
            }
            return acc;
        }, { expenses: 0, incomes: 0 });

        res.status(200).json({ message: 'Success', result });
    } catch (error) {
        handleError(error, res)
    }
}
