const handleError = (err = {}, res = {}) => {
    console.error(err);
    res.status(500).json({ message: 'INTERNAL ERROR' });
};

module.exports = { handleError };
