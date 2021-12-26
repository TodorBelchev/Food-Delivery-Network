import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../../../store';

import OrdersList from './OrdersList';

describe('OrdersList', () => {
    test('should fetch active orders', () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => [
                {
                    _id: '123456',
                    name: 'John Doe',
                    phone: 999999999,
                    city: 'Sofia',
                    address: 'Lorem ipsum',
                    status: 'completed',
                    date: '1640505878104',
                    items: [
                        { item: { _id: '123', weight: 399 }, quantity: 1, price: 4.99, name: 'Recipe name' }
                    ]
                }
            ]
        });
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <OrdersList status='active' />
                </Provider>
            </BrowserRouter>
        )
        waitFor(() => expect(window.fetch).toBeCalled(1));
    });

    test('should fetch completed orders', () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => [
                {
                    _id: '123456',
                    name: 'John Doe',
                    phone: 999999999,
                    city: 'Sofia',
                    address: 'Lorem ipsum',
                    status: 'completed',
                    date: '1640505878104',
                    items: [
                        { item: { _id: '123', weight: 399 }, quantity: 1, price: 4.99, name: 'Recipe name' }
                    ]
                }
            ]
        });
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <OrdersList status='completed' />
                </Provider>
            </BrowserRouter>
        )
        waitFor(() => expect(window.fetch).toBeCalled(1));
    });

    test('should fetch my orders', () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => [
                {
                    _id: '123456',
                    name: 'John Doe',
                    phone: 999999999,
                    city: 'Sofia',
                    address: 'Lorem ipsum',
                    status: 'completed',
                    date: '1640505878104',
                    items: [
                        { item: { _id: '123', weight: 399 }, quantity: 1, price: 4.99, name: 'Recipe name' }
                    ]
                }
            ]
        });
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <OrdersList status='my-orders' />
                </Provider>
            </BrowserRouter>
        )
        waitFor(() => expect(window.fetch).toBeCalled(1));
    });
});