import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import loadFontAwesome from '../../../utils/loadFontAwesome';
import store from '../../../store';

import CreateRestaurant from './CreateRestaurant';
import { restaurantActions } from '../../../store/restaurant';

loadFontAwesome();

describe('Create restaurant', () => {
    test('should show error messages', () => {
        render(<Provider store={store}><CreateRestaurant /></Provider>);

        const nameInput = screen.getByTestId('name');
        const themeInput = screen.getByTestId('theme');
        const categoriesInput = screen.getByTestId('categories');
        const workTimeInput = screen.getByTestId('work-time');
        const citiesInput = screen.getByText(/select cities/i);

        userEvent.click(nameInput);
        userEvent.click(themeInput);
        userEvent.click(categoriesInput);
        userEvent.click(workTimeInput);
        userEvent.click(citiesInput);
        userEvent.click(nameInput);

        const nameError = screen.getByText(/Name must be at least 6 characters long!/i);
        const themeError = screen.getByText(/Main theme must be at least 6 characters long!/i);
        const categoriesError = screen.getByText(/At least 1 category is required!/i);
        const workTimeError = screen.getByText(/Please fill working time in the correct format!/i);
        const citiesError = screen.getByText(/At least one city is required!/i);

        expect(nameError).toBeInTheDocument();
        expect(themeError).toBeInTheDocument();
        expect(categoriesError).toBeInTheDocument();
        expect(workTimeError).toBeInTheDocument();
        expect(citiesError).toBeInTheDocument();
    });

    test('button should be disabled', () => {
        render(<Provider store={store}><CreateRestaurant /></Provider>);

        const btn = screen.getByRole('button', { name: /create/i });
        expect(btn).toBeDisabled();
    });

    test('button should be enabled', () => {
        render(<Provider store={store}><CreateRestaurant /></Provider>);
        const nameInput = screen.getByTestId('name');
        const themeInput = screen.getByTestId('theme');
        const categoriesInput = screen.getByTestId('categories');
        const workTimeInput = screen.getByTestId('work-time');
        const citiesInput = screen.getByText(/select cities/i);

        userEvent.type(nameInput, 'restaurant name');
        userEvent.type(themeInput, 'restaurant theme');
        userEvent.type(categoriesInput, 'category');
        userEvent.type(workTimeInput, 'Monday-Sunday 11:00-22:00');
        userEvent.click(citiesInput);
        const cityOption = screen.getByLabelText(/sofia/i);
        userEvent.click(cityOption);
        userEvent.click(nameInput);

        const btn = screen.getByRole('button', { name: /create/i });
        expect(btn).toBeEnabled();
    });

    test('should not send request', () => {
        window.fetch = jest.fn();
        render(<Provider store={store}><CreateRestaurant /></Provider>);
        const nameInput = screen.getByTestId('name');
        const themeInput = screen.getByTestId('theme');
        const categoriesInput = screen.getByTestId('categories');
        const workTimeInput = screen.getByTestId('work-time');
        const citiesInput = screen.getByText(/select cities/i);

        userEvent.type(nameInput, 'restaurant name');
        userEvent.type(themeInput, 'restaurant theme');
        userEvent.type(categoriesInput, 'category');
        userEvent.type(workTimeInput, 'Monday-Sunday 11:00-22:00');
        userEvent.click(citiesInput);
        const cityOption = screen.getByLabelText(/sofia/i);
        userEvent.click(cityOption);
        userEvent.click(nameInput);

        const btn = screen.getByRole('button', { name: /create/i });
        userEvent.click(btn);
        expect(window.fetch).not.toHaveBeenCalled();
    });

    test('should send create request', () => {
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        window.fetch = jest.fn();
        render(<Provider store={store}><CreateRestaurant /></Provider>);
        const nameInput = screen.getByTestId('name');
        const themeInput = screen.getByTestId('theme');
        const categoriesInput = screen.getByTestId('categories');
        const workTimeInput = screen.getByTestId('work-time');
        const citiesInput = screen.getByText(/select cities/i);
        const imageInput = screen.getByTestId('image');

        userEvent.type(nameInput, 'restaurant name');
        userEvent.type(themeInput, 'restaurant theme');
        userEvent.type(categoriesInput, 'category');
        userEvent.type(workTimeInput, 'Monday-Sunday 11:00-22:00');
        userEvent.click(citiesInput);
        const cityOption = screen.getByLabelText(/sofia/i);
        userEvent.click(cityOption);
        userEvent.click(nameInput);
        userEvent.upload(imageInput, file);

        const btn = screen.getByRole('button', { name: /create/i });
        userEvent.click(btn);
        waitFor(() => expect(window.fetch).toBeCalled(1));
    });

    test('should send edit request', () => {
        const restaurant = {
            _id: '123',
            name: 'restaurant name',
            mainTheme: 'restaurant theme',
            categories: ['category'],
            workHours: ['8:00', '23:00'],
            workDays: ['Monday', 'Sunday'],
            cities: [{ _id: 0, name: 'Sofia'}],
            image: { url: '', public_id: ''},
            owner: '123321',
            recipes: [],
            rating: 5,
            ratingsCount: 11
        };
        store.dispatch(restaurantActions.setRestaurant(restaurant));
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        window.fetch = jest.fn();
        render(<Provider store={store}><CreateRestaurant edit={true} /></Provider>);
        const imageInput = screen.getByTestId('image');

        userEvent.upload(imageInput, file);

        const btn = screen.getByRole('button', { name: /edit/i });
        userEvent.click(btn);
        waitFor(() => expect(window.fetch).toBeCalled(1));
    });
});