import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import loadFontAwesome from '../../../utils/loadFontAwesome';
import store from '../../../store';

import RegisterModal from './RegisterModal';

loadFontAwesome();

describe('Register modal', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <RegisterModal />
            </Provider>
        )
    });

    test('should show email error', () => {
        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        userEvent.type(emailInput, 'pesho');
        userEvent.click(passwordInput);

        const error = screen.getByText('Please enter a valid email');
        expect(error).toBeInTheDocument();
    });

    test('should not show email error', () => {
        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        userEvent.type(emailInput, 'pesho@abv.bg');
        userEvent.click(passwordInput);

        const error = screen.queryByText('Please enter a valid email');
        expect(error).not.toBeInTheDocument();
    });

    test('should show password error', () => {
        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        userEvent.type(passwordInput, '123');
        userEvent.click(emailInput);

        const error = screen.getByText('At least 6 characters');
        expect(error).toBeInTheDocument();
    });

    test('should not show password error', () => {
        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        userEvent.type(passwordInput, '123123');
        userEvent.click(emailInput);

        const error = screen.queryByText('At least 6 characters');
        expect(error).not.toBeInTheDocument();
    });

    test('button should be disabled', () => {
        const loginBtn = screen.getByText('Sign up');
        expect(loginBtn).toBeDisabled();
    });

    test('button should be enabled', () => {
        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        const rePasswordInput = screen.getByTestId('re-password');
        userEvent.type(emailInput, 'pesho@abv.bg');
        userEvent.type(passwordInput, '123123');
        userEvent.type(rePasswordInput, '123123');

        const loginBtn = screen.getByText('Sign up');
        expect(loginBtn).toBeEnabled();
    });

    test('password should be visible', () => {
        const toggleIcon = screen.getByTestId('show-password');
        userEvent.click(toggleIcon);
        const passwordInput = screen.getByTestId('password');
        const type = passwordInput.getAttribute('type');
        expect(type).toEqual('text');
    });

    test('password should not be visible', () => {
        const passwordInput = screen.getByTestId('password');
        const type = passwordInput.getAttribute('type');
        expect(type).toEqual('password');
    });

    test('rePassword should be visible', () => {
        const toggleIcon = screen.getByTestId('show-re-password');
        userEvent.click(toggleIcon);
        const rePasswordInput = screen.getByTestId('re-password');
        const type = rePasswordInput.getAttribute('type');
        expect(type).toEqual('text');
    });

    test('rePassword should not be visible', () => {
        const rePasswordInput = screen.getByTestId('re-password');
        const type = rePasswordInput.getAttribute('type');
        expect(type).toEqual('password');
    });

    test('should send request', async () => {
        window.fetch = jest.fn();
        window.fetch.mockResolvedValueOnce({
            json: async () => {
                return { _id: '123', email: 'pesho@abv.bg' }
            },
        });

        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        const rePasswordInput = screen.getByTestId('re-password');
        const registerBtn = screen.getByText('Sign up');

        userEvent.type(emailInput, 'pesho@abv.bg');
        userEvent.type(passwordInput, '123123');
        userEvent.type(rePasswordInput, '123123');
        userEvent.click(registerBtn);

        await waitFor(() => expect(window.fetch).toHaveBeenCalledTimes(1));
    });

    test('should switch to login', () => {
        const link = screen.getByRole('link', { name: /sign in now!/i });
        userEvent.click(link);
        const modalState = store.getState().modal;
        expect(modalState.overlayName).toEqual('login');
    });
});