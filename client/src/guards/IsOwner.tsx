import { Redirect } from 'react-router';

import { useAppSelector } from '../hooks/reduxHooks';
import IRestaurant from '../interfaces/IRestaurant';

import Spinner from '../components/UI/Spinner/Spinner';

type IsOwnerProps = {
    children: JSX.Element;
    restaurant: IRestaurant;
}

const IsOwner = ({ children, restaurant }: IsOwnerProps) => {
    const user = useAppSelector(state => state.auth);
    const { isInitializing } = useAppSelector(state => state.app);

    if (isInitializing) {
        return <Spinner />
    } else if (!isInitializing && restaurant.owner === user._id) {
        return children;
    } else {
        return <Redirect to="/" />
    }
};

export default IsOwner;