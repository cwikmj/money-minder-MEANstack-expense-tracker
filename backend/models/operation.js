const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        enum: [
            'Food',
            'Groceries',
            'Transportation',
            'Housing/Rent',
            'Utilities',
            'Car',
            'Clothing',
            'Entertainment',
            'Tax/Insurance',
            'Salary',
            'Part-time Job',
            'Freelance Work'
        ],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: new Date().setHours(0, 0, 0, 0)
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Operation', operationSchema);
