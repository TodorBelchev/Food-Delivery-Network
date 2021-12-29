import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from '../../../store';

import FavoriteRestaurants from './FavoriteRestaurants';

describe('Favorite restaurants', () => {
    test('should show no restaurants message', () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => {
                return {
                    restaurants: [],
                    count: 0
                }
            }
        })
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <FavoriteRestaurants />
                </Provider>
            </BrowserRouter>
        );

        const noResMessage = screen.queryByText(/No favorite restaurants yet!/i);
        waitFor(() => expect(noResMessage).toBeInTheDocument());
    });

    test('should show restaurant list', () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => {
                return {
                    restaurants: [{
                        _id: '123',
                        name: 'restaurant name',
                        mainTheme: 'restaurant theme',
                        categories: ['category'],
                        workHours: ['8:00', '23:00'],
                        workDays: ['Monday', 'Sunday'],
                        cities: [{ _id: 0, name: 'Sofia'}],
                        image: { url: '', public_id: ''},
                        owner: '123321',
                        recipes: [],
                        rating: 5,
                        ratingsCount: 11
                    }],
                    count: 1
                }
            }
        });
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <FavoriteRestaurants />
                </Provider>
            </BrowserRouter>
        );

        const restaurantTitle = screen.queryByRole('heading', {  name: /restaurant name/i});
        const allTitles = screen.queryAllByRole('heading', {  name: /restaurant name/i});
        waitFor(() => {
            expect(restaurantTitle).toBeInTheDocument();
            expect(allTitles.length).toEqual(1);
        });
    });
});