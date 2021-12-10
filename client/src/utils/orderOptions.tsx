const { REACT_APP_BASE_URL } = process.env;

const add = (orderData: {
    address: string,
    city: string,
    name: string,
    phone: string,
    recipes: { recipe: string, quantity: number }[],
    restaurant: string
}) => {
    return {
        url: `${REACT_APP_BASE_URL}/order`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    }
};

const getOrders = (restaurantId: string, status: string, page: number) => {
    return {
        url: `${REACT_APP_BASE_URL}/order/${restaurantId}/${status}?page=${page}`
    }
};

const getOrdersByOwner = (page: number) => {
    return {
        url: `${REACT_APP_BASE_URL}/order/my-orders?page=${page}`
    }
};

const deleteOrder = (orderId: string) => {
    return {
        url: `${REACT_APP_BASE_URL}/order/${orderId}`,
        method: 'DELETE'
    }
};

const edit = (orderId: string, status: string) => {
    return {
        url: `${REACT_APP_BASE_URL}/order/${orderId}`,
        method: 'PUT',
        body: JSON.stringify({ status }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

const getOrdersCountByCategoryAndPeriod = (restaurantId: string, period: string) => {
    return {
        url: `${REACT_APP_BASE_URL}/order/${restaurantId}/categories/count?period=${period}`
    }
};

const getSalesByPeriod = (restaurantId: string, period: string) => {
    return {
        url: `${REACT_APP_BASE_URL}/order/${restaurantId}/sales-volumes?period=${period}`
    }
};

const orderOptions = {
    add,
    getOrders,
    deleteOrder,
    edit,
    getOrdersCountByCategoryAndPeriod,
    getSalesByPeriod,
    getOrdersByOwner
}

export default orderOptions;