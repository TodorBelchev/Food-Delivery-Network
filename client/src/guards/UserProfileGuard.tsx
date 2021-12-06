import { useParams, Redirect } from 'react-router';

import { useAppSelector } from '../hooks/reduxHooks';

import Spinner from '../components/UI/Spinner/Spinner';

const UserProfileGuard = ({ children }: { children: JSX.Element }) => {
    const { id } = useParams<{ id: string }>();
    const user = useAppSelector(state => state.auth);
    const { isInitializing } = useAppSelector(state => state.app);

    if (isInitializing) {
        return <Spinner />
    } else if (!isInitializing && id === user._id) {
        return children;
    } else {
        return <Redirect to="/" />
    }
};

export default UserProfileGuard;