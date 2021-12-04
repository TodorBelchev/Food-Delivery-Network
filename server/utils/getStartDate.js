const getStartDate = (period = 'week') => {
    const periodInMs = {
        'week': 518400000,
        'month': 2542140000
    };
    const startDate = Date.now() - periodInMs[period];
    const convertedDate = new Date(startDate).setHours(0, 0, 0, 0);
    return convertedDate;
};

module.exports = {
    getStartDate
}