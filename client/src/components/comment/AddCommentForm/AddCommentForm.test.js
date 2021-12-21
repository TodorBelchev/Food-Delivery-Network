import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import store from '../../../store';
import { authActions } from '../../../store/auth';

import AddCommentForm from './AddCommentForm';

describe('Add comment form', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <AddCommentForm setFormIsLoading={() => { }} />
            </Provider>
        )
    });

    test('should load user names from store', () => {
        store.dispatch(authActions.login({ _id: '123', email: 'pesho@abv.bg', firstName: 'Pesho', lastName: 'Petrov' }));
        render(
            <Provider store={store}>
                <AddCommentForm />
            </Provider>
        )
        const nameInput = screen.getByRole('textbox', { name: /name:/i });
        expect(nameInput.value).toEqual('Pesho Petrov');
    });

    test('add button should be disabled', async () => {
        const btn = screen.getByRole('button', { name: /add/i });
        expect(btn).toBeDisabled();
    });

    test('add button should be enabled', async () => {
        const nameInput = screen.getByRole('textbox', { name: /name:/i });
        const commentInput = screen.getByRole('textbox', { name: /comment:/i });
        const ratingInput = screen.getByTestId('rating');
        const btn = screen.getByRole('button', { name: /add/i });
        userEvent.type(nameInput, 'Pesho Petrov');
        userEvent.type(commentInput, 'Lorem ipsum');
        userEvent.click(ratingInput);
        expect(btn).toBeEnabled();
    });

    test('should send request', async () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => {
                return { _id: '123', name: 'Pesho Petrov', comment: 'Lorem ipsum' }
            },
        });

        const nameInput = screen.getByRole('textbox', { name: /name:/i });
        const commentInput = screen.getByRole('textbox', { name: /comment:/i });
        const ratingInput = screen.getByTestId('rating');
        const btn = screen.getByRole('button', { name: /add/i });
        userEvent.type(nameInput, 'Pesho Petrov');
        userEvent.type(commentInput, 'Lorem ipsum');
        userEvent.click(ratingInput);
        userEvent.click(btn);

        await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
    });

    test('should not send request if no rating is selected', async () => {
        const nameInput = screen.getByRole('textbox', { name: /name:/i });
        const commentInput = screen.getByRole('textbox', { name: /comment:/i });
        const btn = screen.getByRole('button', { name: /add/i });
        userEvent.type(nameInput, 'Pesho Petrov');
        userEvent.type(commentInput, 'Lorem ipsum');
        userEvent.click(btn);

        await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(0));
    });
});