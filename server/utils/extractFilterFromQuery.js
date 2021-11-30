const extractFilterFromQuery = (query) => {
    const filter = {};
    if (query.city) {
        filter.cities = { $elemMatch: { name: query.city } };
    }
    if (query.mainTheme) {
        filter.mainTheme = { $regex: new RegExp(query.mainTheme, 'i') };
    }
    return filter;
};

module.exports = {
    extractFilterFromQuery
}