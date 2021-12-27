import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import store from '../../../store';
import { authActions } from '../../../store/auth';

import Comment from './Comment';

describe('Comment', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <Comment commentObj={{ name: 'Pesho Petrov', comment: 'Lorem ipsum', rating: 5, date: 1640158868462, owner: '123' }} />
            </Provider>
        )
    });

    test('should show comment', () => {
        const commentTitle = screen.getByTestId('comment-title');
        expect(commentTitle.textContent).toEqual('Pesho Petrov');
    });

    test('should show edit and delete buttons', () => {
        store.dispatch(authActions.login({ _id: '123', email: 'pesho@abv.bg', firstName: 'Pesho', lastName: 'Petrov' }));
        const commentTitle = screen.getByTestId('comment-title');
        expect(commentTitle.textContent).toEqual('Pesho PetrovEditDelete');
    });

    test('should switch to edit', () => {
        const commentTitle = screen.getByTestId('comment-title');
        const editBtn = screen.getByText('Edit');
        userEvent.click(editBtn);
        expect(commentTitle).not.toBeInTheDocument();
    });

    test('should switch to delete and back to normal', () => {
        const commentTitle = screen.getByTestId('comment-title');
        const deleteBtn = screen.getByText('Delete');
        userEvent.click(deleteBtn);
        expect(commentTitle).not.toBeInTheDocument();
        const cancelBtn = screen.getByText('Cancel');
        userEvent.click(cancelBtn);
        const commentTitle2 = screen.getByTestId('comment-title');
        expect(commentTitle2).toBeInTheDocument();
    });

    test('should send delete request', async () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({ json: async () => { return {} }, });
        const deleteBtn = screen.getByText('Delete');
        userEvent.click(deleteBtn);
        const confirmationDeleteBtn = screen.getByText('Delete');
        userEvent.click(confirmationDeleteBtn);
        await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
    });
});