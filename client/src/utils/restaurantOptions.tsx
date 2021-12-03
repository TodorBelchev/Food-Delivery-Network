const add = (data: FormData) => {
    return {
        url: 'http://localhost:3030/api/restaurant/create',
        method: 'POST',
        body: data
    }
};

const edit = (restaurantId: string, data: FormData) => {
    return {
        url: `http://localhost:3030/api/restaurant/${restaurantId}`,
        method: 'PUT',
        body: data
    }
};

const getById = (id: string) => {
    return {
        url: `http://localhost:3030/api/restaurant/${id}`
    }
};

const getByOwner = () => {
    return {
        url: 'http://localhost:3030/api/restaurant/by-owner'
    }
};

const getByCity = (city: string) => {
    return {
        url: `http://localhost:3030/api/restaurant?city=${city}`
    }
};

const getByTheme = (theme: string) => {
    return {
        url: `http://localhost:3030/api/restaurant?mainTheme=${theme}`
    }
};

const deleteRestaurant = (restaurantId: string) => {
    return {
        url: `http://localhost:3030/api/restaurant/${restaurantId}`,
        method: 'DELETE'
    }
};

const addComment = (restaurantId: string, name: string, comment: string, rating: string) => {
    return {
        url: `http://localhost:3030/api/restaurant/${restaurantId}/comment`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, comment, rating })
    }
};

const deleteComment = (restaurantId: string, commentId: string) => {
    return {
        url: `http://localhost:3030/api/restaurant/${restaurantId}/comment/${commentId}`,
        method: 'DELETE'
    }
};

const getComments = (restaurantId: string, page: number) => {
    return { url: `http://localhost:3030/api/restaurant/${restaurantId}/comment?page=${page}` }
};

const editComment = (restaurantId: string, commentId: string, name: string, comment: string, rating: string) => {
    return {
        url: `http://localhost:3030/api/restaurant/${restaurantId}/comment/${commentId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, comment, rating })
    }
};

const restaurantOptions = {
    add,
    edit,
    deleteRestaurant,
    getById,
    getByOwner,
    getByCity,
    getByTheme,
    addComment,
    deleteComment,
    getComments,
    editComment,
}

export default restaurantOptions;