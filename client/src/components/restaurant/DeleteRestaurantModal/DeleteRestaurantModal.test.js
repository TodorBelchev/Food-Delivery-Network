import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import store from '../../../store';

import DeleteRestaurantModal from './DeleteRestaurantModal';

describe('Delete restaurant modal', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <DeleteRestaurantModal _id="123" name="restaurant name" />
            </Provider>
        )
    });

    test('should close modal on cancel click', () => {
        store.dispatch = jest.fn();
        const cancelBtn = screen.getByRole('button', { name: /cancel/i });
        userEvent.click(cancelBtn);
        waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));
    });

    test('should send request on delete click', () => {
        window.fetch = jest.fn();
        const deleteBtn = screen.getByRole('button', { name: /delete/i });
        userEvent.click(deleteBtn);
        waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
    });

    test('should show correct restaurant name', () => {
        const heading = screen.getByRole('heading', { name: /Confirm you want to delete restaurant name?/i });
        expect(heading).toBeInTheDocument();
    });
});