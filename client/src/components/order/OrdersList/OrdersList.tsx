import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../hooks/reduxHooks';

import useHttp from '../../../hooks/useHttp';
import IOrder from '../../../interfaces/IOrder';
import orderOptions from '../../../utils/orderOptions';
import Paginator from '../../UI/Paginator/Paginator';
import { extractQueryObject } from '../../../utils/queryHelper';

import Spinner from '../../UI/Spinner/Spinner';
import OrdersListItem from '../OrdersListItem/OrdersListItem';


import classes from './OrdersList.module.css';

type OrdersListProps = JSX.IntrinsicElements['ul'] & {
    status: string;
}

const OrdersList: React.FC<OrdersListProps> = ({ status }) => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const { sendRequest, isLoading } = useHttp();
    const history = useHistory();
    const restaurant = useAppSelector(state => state.restaurant);

    useEffect(() => {
        setPage(1);
        setTotalCount(0);
        setOrders([]);
    }, [status]);

    useEffect(() => {
        if (history.location.search) {
            const query = extractQueryObject(history.location.search);
            setPage(Number(query.page) || 1);
        }
    }, [history.location.search]);

    const processResponse = useCallback((res: { orders: IOrder[], count: number }) => {
        setOrders(res.orders);
        setTotalCount(res.count);
    }, []);

    const fetchOrders = useCallback(() => {
        let options = orderOptions.getOrders(restaurant._id, status, page);
        if (status === 'my-orders') {
            options = orderOptions.getOrdersByOwner(page);
        }
        sendRequest(options, processResponse);
    }, [sendRequest, restaurant._id, status, processResponse, page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const onSuccessDelete = () => {
        fetchOrders();
    };

    const onSuccessChangeStatus = () => {
        fetchOrders();
    };

    return (
        <div className="container">
            <ul className={classes.list}>
                {isLoading && <Spinner />}
                {!isLoading && orders.length > 0 &&
                    orders.map(x => (
                        <li key={x._id} className={classes['list-item']}>
                            <OrdersListItem
                                order={x}
                                onSuccessDelete={onSuccessDelete}
                                onSuccessChangeStatus={onSuccessChangeStatus}
                            />
                        </li>
                    ))}
                {!isLoading && orders.length === 0 &&
                    <h2 className={classes['no-orders-title']}>No orders yet!</h2>}
            </ul>
            {totalCount > 20 && <Paginator totalCount={totalCount} shownCount={20} page={page} isLoading={isLoading} />}
        </div>
    );
};

export default OrdersList;