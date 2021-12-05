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
        sendRequest(
            orderOptions.getOrders(restaurant._id, status, page),
            processResponse
        );
    }, [sendRequest, restaurant._id, status, processResponse, page]);

    const onSuccessDelete = () => {
        fetchOrders();
    };

    const onSuccessChangeStatus = () => {
        fetchOrders();
    };

    useEffect(() => {
        if (restaurant._id) {
            fetchOrders();
        }
    }, [fetchOrders, restaurant._id]);
    return (
        <div className="container">
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
            {totalCount > 20 && <Paginator totalCount={totalCount} shownCount={20} page={page} />}
        </div>
    );
};

export default OrdersList;