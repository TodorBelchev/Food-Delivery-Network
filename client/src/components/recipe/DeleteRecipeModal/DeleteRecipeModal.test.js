import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import store from '../../../store';

import DeleteRecipeModal from './DeleteRecipeModal';

describe('Delete recipe modal', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <DeleteRecipeModal _id="123" name="recipe name" restaurantId='123321' />
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

    test('should show correct recipe name', () => {
        const heading = screen.getByRole('heading', { name: /Confirm you want to delete recipe name?/i});
        expect(heading).toBeInTheDocument();
    });
});