import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import store from '../../../store';
import { authActions } from '../../../store/auth';
import { restaurantActions } from '../../../store/restaurant';
import loadFontAwesome from '../../../utils/loadFontAwesome';

import Recipe from './Recipe';

loadFontAwesome();

describe('Recipe', () => {
    const recipe = {
        _id: '123',
        name: 'recipe name',
        price: 3.99,
        category: 'category',
        weight: 399,
        ingredients: ['a', 'b', 'c'],
        image: {
            url: '',
            public_id: ''
        }
    }

    test('should add to cart', () => {
        render(
            <Provider store={store}>
                <Recipe recipe={recipe} />
            </Provider>
        )
        store.dispatch = jest.fn();

        const btn = screen.getByTestId('icon-wrapper');
        userEvent.click(btn);
        waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));
    });

    test('should not show admin controls', () => {
        render(
            <Provider store={store}>
                <Recipe recipe={recipe} />
            </Provider>
        )
        const adminControls = screen.queryByTestId('admin-controls');
        expect(adminControls).not.toBeInTheDocument();
    });

    test('should show admin controls', () => {
        store.dispatch(authActions.login({ _id: '123', email: 'pesho@abv.bg' }));
        store.dispatch(restaurantActions.setRestaurant({ owner: '123' }));
        render(
            <Provider store={store}>
                <Recipe recipe={recipe} />
            </Provider>
        )

        const adminControls = screen.queryByTestId('admin-controls');
        waitFor(() => expect(adminControls).toBeInTheDocument());
    });

    test('should show correct recipe data', async () => {
        render(
            <Provider store={store}>
                <Recipe recipe={recipe} />
            </Provider>
        )
        const name = screen.getByRole('heading', {  name: /recipe name \(399g\)/i});
        const price = screen.getByTestId('price');
        const ingredients = screen.getByTestId('ingredients');
        expect(name.textContent).toEqual('recipe name (399g)');
        expect(price.textContent).toEqual('$3.99');
        expect(ingredients.textContent).toEqual('a, b, c');
    });
});