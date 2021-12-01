import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/reduxHooks';

import useHttp from '../../../hooks/useHttp';
import IOrder from '../../../interfaces/IOrder';

import OrdersListItem from '../OrdersListItem/OrdersListItem';


import classes from './OrdersList.module.css';

type OrdersListProps = JSX.IntrinsicElements['ul'] & {
    status: string;
}

const OrdersList: React.FC<OrdersListProps> = ({ status }) => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const { sendRequest } = useHttp();
    const restaurant = useAppSelector(state => state.restaurant);

    const fetchOrders = useCallback(() => {
        sendRequest({
            url: `http://localhost:3030/api/order/${restaurant._id}/${status}`
        }, (res: IOrder[]) => {
            setOrders(res);
        });
    }, [sendRequest, restaurant._id, status]);

    const onSuccessDelete = () => {
        fetchOrders();
    };

    const onSuccessChangeStatus = () => {
        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    return (
        <ul className={classes.list}>
            {orders.map(x => (
                <li key={x._id} className={classes['list-item']}>
                    <OrdersListItem
                        order={x}
                        onSuccessDelete={onSuccessDelete}
                        onSuccessChangeStatus={onSuccessChangeStatus}
                    />
                </li>
            ))}
        </ul>
    );
};

export default OrdersList;