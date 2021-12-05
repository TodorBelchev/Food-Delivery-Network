const add = (orderData: {
    address: string,
    city: string,
    name: string,
    phone: string,
    recipes: { recipe: string, quantity: number }[],
    restaurant: string
}) => {
    return {
        url: 'http://localhost:3030/api/order',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    }
};

const getOrders = (restaurantId: string, status: string, page: number) => {
    return {
        url: `http://localhost:3030/api/order/${restaurantId}/${status}?page=${page}`
    }
};

const deleteOrder = (orderId: string) => {
    return {
        url: `http://localhost:3030/api/order/${orderId}`,
        method: 'DELETE'
    }
};

const edit = (orderId: string, status: string) => {
    return {
        url: `http://localhost:3030/api/order/${orderId}`,
        method: 'PUT',
        body: JSON.stringify({ status }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

const getOrdersCountByCategoryAndPeriod = (restaurantId: string, period: string) => {
    return {
        url: `http://localhost:3030/api/order/${restaurantId}/categories/count?period=${period}`
    }
};

const getSalesByPeriod = (restaurantId: string, period: string) => {
    return {
        url: `http://localhost:3030/api/order/${restaurantId}/sales-volumes?period=${period}`
    }
};

const orderOptions = {
    add,
    getOrders,
    deleteOrder,
    edit,
    getOrdersCountByCategoryAndPeriod,
    getSalesByPeriod
}

export default orderOptions;