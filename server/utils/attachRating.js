const attachRating = (restaurants, ratings) => {
    ratings.forEach((x, i) => {
        if (x.length === 0) {
            restaurants[i].rating = 0;
        } else {
            restaurants[i].rating = (x.reduce((acc, cur) => acc + cur.rating, 0) / x.length).toFixed(1);
        }
        restaurants[i].ratingsCount = x.length;
    });
}


module.exports = {
    attachRating
}