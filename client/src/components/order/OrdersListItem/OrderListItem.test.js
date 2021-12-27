import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from '../../../store';

import OrdersListItem from './OrdersListItem';

describe('Order list item', () => {
    const order = {
        _id: '123',
        name: 'John Doe',
        phone: 999999999,
        city: 'Sofia',
        address: 'Some address',
        status: 'completed',
        date: '2021-11-27T11:56:29.212+00:00',
        items: [
            { item: { _id: '123', weight: 399 }, quantity: 1, price: 4.99, name: 'Recipe name' }
        ],
        restaurant: {
            _id: '123321',
            name: 'Restaurant name'
        }
    };
    const fakeFunc = () => { };

    beforeEach(() => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <OrdersListItem order={order} onSuccessDelete={fakeFunc} onSuccessChangeStatus={fakeFunc} />
                </Provider>
            </BrowserRouter>
        )
    });

    test('should show correct date', () => {
        const dateField = screen.getByText(/27\/11\/2021/i);
        expect(dateField).toBeInTheDocument();
    });

    test('should show correct price', () => {
        const priceField = screen.getByText(/\$8\.98/i);
        expect(priceField).toBeInTheDocument();
    });

    test('should show correct price 2', () => {
        order.items[0].quantity = 3;
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <OrdersListItem order={order} onSuccessDelete={fakeFunc} onSuccessChangeStatus={fakeFunc} />
                </Provider>
            </BrowserRouter>
        )
        const priceField = screen.getByText(/\$14\.97/i);
        expect(priceField).toBeInTheDocument();
    });

    test('should redirect', () => {
        const link = screen.getByRole('link', { name: /restaurant name/i });
        userEvent.click(link);
        expect(document.location.pathname).toEqual('/restaurant/123321')
    });

    test('should show order modal', () => {
        store.dispatch = jest.fn();
        const priceField = screen.getByText(/\$14\.97/i);
        userEvent.click(priceField);
        const modalState = store.getState().modal;
        expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
}); 