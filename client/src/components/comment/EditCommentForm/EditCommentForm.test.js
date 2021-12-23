import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import store from '../../../store';
import { authActions } from '../../../store/auth';

import EditCommentForm from './EditCommentForm';

describe('Edit comment form', () => {
    const comment = {
        _id: '1234',
        comment: 'Lorem ipsum',
        rating: 5,
        name: 'Pesho Petrov'
    }
    const setIsEditMode = () => { };
    beforeEach(() => {
        store.dispatch(authActions.login({ _id: '123', firstName: 'Pesho', lastName: 'Petrov' }));
        render(
            <Provider store={store}>
                <EditCommentForm comment={comment} setIsEditMode={setIsEditMode} />
            </Provider>
        );
    });

    test('should show correct comment data', () => {
        const userNameField = screen.getByRole('textbox', { name: /name:/i });
        const commentTextField = screen.getByRole('textbox', { name: /comment:/i });
        expect(userNameField.value).toEqual('Pesho Petrov');
        expect(commentTextField.value).toEqual('Lorem ipsum');
    });

    test('should unmount on cancel click', () => {
        const cancelBtn = screen.getByRole('button', { name: /cancel/i });
        userEvent.click(cancelBtn);
        waitFor(() => expect(setIsEditMode).toBeCalled(1));
    });

    test('should send request', () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => null
        });
        const editBtn = screen.getByRole('button', { name: /edit/i });
        userEvent.click(editBtn);
        waitFor(() => expect(window.fetch).toBeCalled(1));
    });

    test('should not send request if name, comment or rating is missing', () => {
        const userNameField = screen.getByRole('textbox', { name: /name:/i });
        userEvent.type(userNameField, '');
        waitFor(() => expect(window.fetch).toBeCalled(0));
        userEvent.type(userNameField, 'Pesho Petrov');
        const commentTextField = screen.getByRole('textbox', { name: /comment:/i });
        userEvent.type(commentTextField, '');
        waitFor(() => expect(window.fetch).toBeCalled(0));
    });
});