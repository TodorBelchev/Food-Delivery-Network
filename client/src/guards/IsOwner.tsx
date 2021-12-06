import { Redirect } from 'react-router';

import { useAppSelector } from '../hooks/reduxHooks';

import Spinner from '../components/UI/Spinner/Spinner';

const IsOwner = ({ children }: { children: JSX.Element }) => {
    const restaurant = useAppSelector(state => state.restaurant);
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