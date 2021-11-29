import { NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { modalActions } from '../../../store/modal';
import IOrder from '../../../interfaces/IOrder';
import formatDate from '../../../utils/formatDate';

import Modal from '../../UI/Modal/Modal';
import OrderModal from '../OrderModal/OrderModal';


import classes from './OrdersListItem.module.css';

type OrdersListItemProps = JSX.IntrinsicElements['article'] & {
    order: IOrder;
    onSuccessDelete: () => void;
    onSuccessChangeStatus: () => void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onSuccessDelete, onSuccessChangeStatus }) => {
    const dispatch = useAppDispatch();
    const modalState = useAppSelector(state => state.modal);
    const formattedDate = formatDate(order.date);

    const orderClickHandler = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName === "A") { return; }
        dispatch(modalActions.open(`order-${order._id}`));
    }

    return (
        <>
            {modalState.isOpen &&
                modalState.overlayName === `order-${order._id}` &&
                <Modal>
                    <OrderModal
                        order={order}
                        onSuccessDelete={onSuccessDelete}
                        onSuccessChangeStatus={onSuccessChangeStatus}
                    />
                </Modal>
            }
            <article onClick={orderClickHandler} className={classes['order']}>
                <div>
                    <h3 className={classes['order-title']}>
                        Order from:
                        <NavLink to={`/restaurant/${order.restaurant._id}`} className={classes['order-link']}>
                            {order.restaurant.name}
                        </NavLink>
                    </h3>
                    <p className={classes['order-date']}>{formattedDate}</p>
                </div>
                <div>
                    <p className={classes['order-price']}>${order.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)}</p>
                </div>
            </article>
        </>
    );
};

export default OrdersListItem;