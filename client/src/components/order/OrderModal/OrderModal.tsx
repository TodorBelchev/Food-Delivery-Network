import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import IOrder from '../../../interfaces/IOrder';
import { modalActions } from '../../../store/modal';
import formatDate from '../../../utils/formatDate';
import orderOptions from '../../../utils/orderOptions';

import Spinner from '../../UI/Spinner/Spinner';


import classes from './OrderModal.module.css';

type OrderModalProps = JSX.IntrinsicElements['article'] & {
    order: IOrder;
    onSuccessDelete: () => void;
    onSuccessChangeStatus: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ order, onSuccessDelete, onSuccessChangeStatus }) => {
    const [promptAction, setPromptAction] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const { sendRequest, isLoading } = useHttp();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth);
    const restaurant = useAppSelector(state => state.restaurant);
    const formattedDate = formatDate(order.date);
    const price = order.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const delivery = price > 10 ? 'Free' : '$3.99';
    const totalPrice = price > 10 ? (price + 3.99).toFixed(2) : price.toFixed(2);
    const isOwner = user._id === restaurant.owner;

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
            dispatch(modalActions.close())
        };
    }, [dispatch]);

    const onDeleteClickHandler = () => {
        setPromptAction('delete');
    };

    const onChangeStatusClickHandler = () => {
        setPromptAction('status');
    };

    const processResponse = () => {
        if (isMounted) {
            dispatch(modalActions.close());
            if (promptAction === 'delete') {
                onSuccessDelete();
            } else {
                onSuccessChangeStatus();
            }
            setPromptAction('');
        }
    }

    const deleteSubmitHandler = () => {
        sendRequest(orderOptions.deleteOrder(order._id), processResponse);
    };

    const changeStatusSubmitHandler = () => {
        const newStatus = order.status === 'pending' ? 'completed' : 'pending';
        sendRequest(orderOptions.edit(order._id, newStatus), processResponse);
    };

    const cancelClickHandler = () => {
        setPromptAction('');
    };

    return (
        <article className={classes['modal']}>
            <div>
                <h3 className={classes['order-title']}>
                    Order from:
                    <NavLink to={`/restaurant/${order.restaurant._id}`} className={classes['order-link']}>
                        {order.restaurant.name}
                    </NavLink>
                </h3>
                <p className={classes['order-date']}>{formattedDate}</p>
            </div>
            <ul className={classes['order-list']}>
                {order.items.map(x => (
                    <li key={x.item._id} className={classes['order-list-item']}>
                        <p className={classes['order-list-item-text']}>{x.item.name} ({x.item.weight}g) - {x.price} x {x.quantity}</p>
                        <span>${x.price * x.quantity}</span>
                    </li>
                ))}
            </ul>
            <article className={classes['order-summary']}>
                <p>
                    <span>Order:</span>
                    <span>${price.toFixed(2)}</span>
                </p>
                <p>
                    <span>Delivery:</span>
                    <span>{delivery}</span>
                </p>
                <p>
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                </p>
                <p>
                    <span>Status:</span>
                    <span className={order.status === 'pending' ? classes['status-red'] : classes['status']}>{order.status}</span>
                </p>
                <p>
                    <span>Address:</span>
                    <span>{order.city}, {order.address}</span>
                </p>
                <p>
                    <span>Customer:</span>
                    <span>{order.name}</span>
                </p>
                <p>
                    <span>Contact phone:</span>
                    <span>{order.phone.toString().length === 9 ? `+359${order.phone}` : order.phone}</span>
                </p>
            </article>
            {isOwner && !promptAction &&
                <article className={classes['admin-controls']}>
                    <button onClick={onChangeStatusClickHandler} className={classes['admin-controls-control']}>Change status</button>
                    <button onClick={onDeleteClickHandler} className={`${classes['admin-controls-control']} ${classes['admin-controls-control--red']}`}>Delete</button>
                </article>}
            {isOwner && promptAction && !isLoading &&
                <article className={classes['delete']}>
                    <h4 className={classes['delete-title']}>Are you sure?</h4>
                    <button
                        className={`${classes['admin-controls-control--red']} ${classes['admin-controls-control']}`}
                        onClick={promptAction === 'delete' ? deleteSubmitHandler : changeStatusSubmitHandler}
                    >
                        {promptAction === 'delete' ? 'Delete' : 'Change'}
                    </button>
                    <button className={classes['admin-controls-control']} onClick={cancelClickHandler}>Cancel</button>
                </article>}
            {isOwner && promptAction && isLoading && <div className={classes['loader-container']}><Spinner size="medium" /></div>}
        </article>
    );
};

export default OrderModal;