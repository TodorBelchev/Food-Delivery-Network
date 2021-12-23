import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import store from '../../../store';
import { authActions } from '../../../store/auth';
import { initialRestaurantState, restaurantActions } from '../../../store/restaurant';
import loadFontAwesome from '../../../utils/loadFontAwesome';

import CommentsModal from './CommentsModal';

loadFontAwesome();

describe('Comments modal', () => {
    beforeEach(() => {
        store.dispatch(restaurantActions.setRestaurant({
            ...initialRestaurantState,
            rating: 5,
            ratingsCount: 16
        }));
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => {
                return {
                    comments: [
                        { name: 'Pesho Petrov', comment: 'Lorem ipsum', rating: 5, date: 1640158868462, owner: '123', _id: '234' },
                        { name: 'Pesho Petrov', comment: 'Lorem ipsum', rating: 5, date: 1640158868464, owner: '123', _id: '235' },
                        { name: 'Pesho Petrov', comment: 'Lorem ipsum', rating: 5, date: 1640158868465, owner: '123', _id: '236' },
                    ],
                    ratingsCount: 16,
                    tokenExpired: false
                }
            }
        });
        render(
            <Provider store={store}>
                <CommentsModal />
            </Provider>
        )
    });

    test('should show comments', async () => {
        const commentsList = await screen.queryAllByRole('listitem');
        waitFor(() => expect(commentsList.length).toEqual(3));
    });

    test('should show rating and comments count', () => {
        const scoreText = screen.getByText(/5 from 16 comments/i);
        expect(scoreText).toBeInTheDocument();
    });

    test('should show add comment button', () => {
        store.dispatch(authActions.login({ _id: '123', email: 'pesho@abv.bg', firstName: 'Pesho', lastName: 'Petrov' }));
        const addBtn = screen.getByRole('button', { name: /add comment/i });
        expect(addBtn).toBeInTheDocument();
    })
});