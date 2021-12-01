import { useHistory } from 'react-router';

import { useAppDispatch } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import { modalActions } from '../../../store/modal';


import classes from './DeleteRestaurantModal.module.css';

type DeleteRestaurantModalProps = JSX.IntrinsicElements['section'] & {
    _id: string;
    name: string;
}

const DeleteRestaurantModal: React.FC<DeleteRestaurantModalProps> = (props) => {
    const dispatch = useAppDispatch();
    const { sendRequest } = useHttp();
    const history = useHistory();

    const cancelClickHandler = () => {
        dispatch(modalActions.close());
    }

    const processResponse = () => {
        dispatch(modalActions.close());
        history.replace('/');
    }

    const deleteClickHandler = () => {
        sendRequest({
            url: 'http://localhost:3030/api/restaurant/' + props._id,
            method: 'DELETE'
        }, processResponse);
    }

    return (
        <section className={classes['delete-restaurant']}>
            <h3 className={classes['delete-restaurant-title']}>Confirm you want to delete {props.name}?</h3>
            <button onClick={deleteClickHandler} className={`${classes['delete-restaurant-btn']} ${classes['delete-restaurant-btn--danger']}`}>Delete</button>
            <button onClick={cancelClickHandler} className={classes['delete-restaurant-btn']}>Cancel</button>
        </section>
    )
}

export default DeleteRestaurantModal;