import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from '../../../store';
import { authActions } from '../../../store/auth';
import { restaurantActions } from '../../../store/restaurant';

import OrderModal from './OrderModal';

describe('Order modal', () => {
    const order = {
        name: 'Pesho Petrov',
        phone: '999999999',
        city: 'Sofia',
        address: 'Lorem ipsum 11',
        status: 'pending',
        restaurant: {
            _id: '123456',
            name: 'Restaurant name'
        },
        items: [
            {
                quantity: 3,
                price: 4.99,
                item: {
                    _id: '12345678',
                    name: 'Recipe name',
                    weight: 399
                }
            }
        ]
    }
    beforeEach(() => {
        store.dispatch(restaurantActions.setRestaurant({ _id: '123', owner: '123' }))
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <OrderModal order={order} />
                </Provider>
            </BrowserRouter>
        )
    });

    test('should show correct restaurant name and link', () => {
        const heading = screen.getByRole('heading');
        expect(heading.textContent).toEqual('Order from:Restaurant name');
    });

    test('should show admin buttons', () => {
        store.dispatch(authActions.login({ _id: '123', email: 'pesho@abv.bg' }));
        const statusBtn = screen.getByRole('button', { name: /change status/i });
        const deleteBtn = screen.getByRole('button', { name: /delete/i });
        expect(statusBtn).toBeInTheDocument();
        expect(deleteBtn).toBeInTheDocument();
    });

    test('should prompt message on change status button click', () => {
        store.dispatch(authActions.login({ _id: '123', email: 'pesho@abv.bg' }));
        const statusBtn = screen.getByRole('button', { name: /change status/i });
        userEvent.click(statusBtn);
        const promptTitle = screen.getByRole('heading', { name: /are you sure?/i });
        expect(promptTitle).toBeInTheDocument();
    });

    test('should prompt message on delete button click', () => {
        store.dispatch(authActions.login({ _id: '123', email: 'pesho@abv.bg' }));
        const deleteBtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(deleteBtn);
        const promptTitle = screen.getByRole('heading', { name: /are you sure?/i });
        expect(promptTitle).toBeInTheDocument();
    });

    test('should close prompt message', () => {
        store.dispatch(authActions.login({ _id: '123', email: 'pesho@abv.bg' }));
        const statusBtn = screen.getByRole('button', { name: /change status/i });
        userEvent.click(statusBtn);
        const cancelBtn = screen.getByRole('button', { name: /cancel/i });
        userEvent.click(cancelBtn);
        expect(cancelBtn).not.toBeInTheDocument();
    });

    test('should send request upon deleting', () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => null
        });
        const deleteBtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(deleteBtn);
        const confirmBtn = screen.getByRole('button', { name: /Delete/ });
        userEvent.click(confirmBtn);
        waitFor(() => expect(window.fetch).toBeCalled(1));
    });

    test('should send request upon changing status', () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => null
        });
        const statusBtn = screen.getByRole('button', { name: /change status/i });
        userEvent.click(statusBtn);
        const confirmBtn = screen.getByRole('button', { name: /Change/ });
        userEvent.click(confirmBtn);
        waitFor(() => expect(window.fetch).toBeCalled(1));
    });

    test('should show correct order amount', () => {
        const orderAmount = screen.getByTestId('order-amount');
        expect(orderAmount.textContent).toEqual('$14.97');
    });
});