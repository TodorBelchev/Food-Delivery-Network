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

const getOrders = (restaurantId: string, status: string) => {
    return {
        url: `http://localhost:3030/api/order/${restaurantId}/${status}`
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

const getOrdersCountByCategory = (restaurantId: string) => {
    return {
        url: `http://localhost:3030/api/order/${restaurantId}/categories/count`,
    }
};

const orderOptions = {
    add,
    getOrders,
    deleteOrder,
    edit,
    getOrdersCountByCategory
}

export default orderOptions;