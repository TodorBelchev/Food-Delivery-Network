import env from "./env";

const add = (data: FormData) => {
    return {
        url: `${env.BASE_URL}/restaurant/create`,
        method: 'POST',
        body: data
    }
};

const edit = (restaurantId: string, data: FormData) => {
    return {
        url: `${env.BASE_URL}/restaurant/${restaurantId}`,
        method: 'PUT',
        body: data
    }
};

const getById = (id: string) => {
    return {
        url: `${env.BASE_URL}/restaurant/${id}`
    }
};

const getByOwner = () => {
    return {
        url: `${env.BASE_URL}/restaurant/by-owner`
    }
};

const getByCity = (city: string) => {
    return {
        url: `${env.BASE_URL}/restaurant?city=${city}`
    }
};

const getByTheme = (theme: string) => {
    return {
        url: `${env.BASE_URL}/restaurant?mainTheme=${theme}`
    }
};

const getFavorites = (query: string) => {
    return {
        url: `${env.BASE_URL}/restaurant/favorites?${query}`
    }
};

const deleteRestaurant = (restaurantId: string) => {
    return {
        url: `${env.BASE_URL}/restaurant/${restaurantId}`,
        method: 'DELETE'
    }
};

const addComment = (restaurantId: string, name: string, comment: string, rating: string) => {
    return {
        url: `${env.BASE_URL}/restaurant/${restaurantId}/comment`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, comment, rating })
    }
};

const deleteComment = (restaurantId: string, commentId: string) => {
    return {
        url: `${env.BASE_URL}/restaurant/${restaurantId}/comment/${commentId}`,
        method: 'DELETE'
    }
};

const getComments = (restaurantId: string, page: number) => {
    return { url: `${env.BASE_URL}/restaurant/${restaurantId}/comment?page=${page}` }
};

const editComment = (restaurantId: string, commentId: string, name: string, comment: string, rating: string) => {
    return {
        url: `${env.BASE_URL}/restaurant/${restaurantId}/comment/${commentId}`,
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
    getFavorites,
    addComment,
    deleteComment,
    getComments,
    editComment,
}

export default restaurantOptions;