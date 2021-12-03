const add = (restaurantId: string, data: FormData) => {
    return {
        url: `http://localhost:3030/api/recipe/${restaurantId}/add-recipe`,
        method: 'POST',
        body: data
    }
};

const edit = (recipeId: string, restaurantId: string, data: FormData) => {
    return {
        url: `http://localhost:3030/api/recipe/${recipeId}/${restaurantId}`,
        method: 'PUT',
        body: data
    }
};

const deleteRecipe = (recipeId: string, restaurantId: string) => {
    return {
        url: `http://localhost:3030/api/recipe/${recipeId}/${restaurantId}`,
        method: 'DELETE'
    }
};

const recipeOptions = {
    add,
    edit,
    deleteRecipe
}

export default recipeOptions;