import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/reduxHooks';

import useHttp from '../../../hooks/useHttp';
import IOrder from '../../../interfaces/IOrder';
import orderOptions from '../../../utils/orderOptions';

import Spinner from '../../UI/Spinner/Spinner';
import OrdersListItem from '../OrdersListItem/OrdersListItem';


import classes from './OrdersList.module.css';

type OrdersListProps = JSX.IntrinsicElements['ul'] & {
    status: string;
}

const OrdersList: React.FC<OrdersListProps> = ({ status }) => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const { sendRequest, isLoading } = useHttp();
    const restaurant = useAppSelector(state => state.restaurant);

    const processResponse = useCallback((res: IOrder[]) => {
        setOrders(res);
    }, []);

    const fetchOrders = useCallback(() => {
        sendRequest(
            orderOptions.getOrders(restaurant._id, status),
            processResponse
        );
    }, [sendRequest, restaurant._id, status, processResponse]);

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
            {isLoading && <Spinner />}
            {!isLoading && orders.map(x => (
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