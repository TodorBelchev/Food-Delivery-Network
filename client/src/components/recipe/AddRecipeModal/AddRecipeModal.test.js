import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import store from '../../../store';
import { restaurantActions } from '../../../store/restaurant';

import AddRecipeModal from './AddRecipeModal';

describe('Add recipe modal', () => {
    const recipe = {
        _id: '123',
        name: 'recipe name',
        price: 3.99,
        category: 'category',
        weight: 399,
        ingredients: ['a', 'b', 'c'],
        image: {
            url: '',
            public_id: ''
        }
    }

    test('add button should be disabled', () => {
        render(<Provider store={store}><AddRecipeModal /></Provider>);

        const btn = screen.getByRole('button', { name: /add/i });
        expect(btn).toBeDisabled();
    });

    test('should show error messages', () => {
        render(<Provider store={store}><AddRecipeModal /></Provider>);

        const nameInput = screen.getByTestId('name');
        const ingredientsInput = screen.getByTestId('ingredients');
        const weightInput = screen.getByTestId('weight');
        const priceInput = screen.getByTestId('price');
        const categorySelect = screen.getByTestId('category');

        userEvent.click(nameInput);
        userEvent.click(ingredientsInput);
        userEvent.click(weightInput);
        userEvent.click(priceInput);
        userEvent.click(categorySelect);
        userEvent.click(nameInput);

        const nameErrorNotification = screen.getByText(/At least 5 characters long!/i);
        const ingredientsErrorNotification = screen.getByText(/At least 3!/i);
        const weightErrorNotification = screen.getByText(/Weight is required!/i);
        const priceErrorNotification = screen.getByText(/Price is required!/i);
        const categoryErrorNotification = screen.getByText(/Category is required!/i);

        expect(nameErrorNotification).toBeInTheDocument();
        expect(ingredientsErrorNotification).toBeInTheDocument();
        expect(weightErrorNotification).toBeInTheDocument();
        expect(priceErrorNotification).toBeInTheDocument();
        expect(categoryErrorNotification).toBeInTheDocument();
    });

    test('add button should be enabled', () => {
        store.dispatch(restaurantActions.setRestaurant({
            _id: '123',
            categories: ['category']
        }));
        render(<Provider store={store}><AddRecipeModal /></Provider>);

        const nameInput = screen.getByTestId('name');
        const ingredientsInput = screen.getByTestId('ingredients');
        const weightInput = screen.getByTestId('weight');
        const priceInput = screen.getByTestId('price');
        const categorySelect = screen.getByTestId('category');

        userEvent.type(nameInput, 'recipe name');
        userEvent.type(ingredientsInput, 'a,b,c');
        userEvent.type(weightInput, '299');
        userEvent.type(priceInput, '3.99');
        userEvent.selectOptions(categorySelect, 'category');

        const btn = screen.getByRole('button', { name: /add/i });
        expect(btn).toBeEnabled();
    });

    test('should show upload image error', () => {
        render(<Provider store={store}><AddRecipeModal /></Provider>);

        const nameInput = screen.getByTestId('name');
        const ingredientsInput = screen.getByTestId('ingredients');
        const weightInput = screen.getByTestId('weight');
        const priceInput = screen.getByTestId('price');
        const categorySelect = screen.getByTestId('category');

        userEvent.type(nameInput, 'recipe name');
        userEvent.type(ingredientsInput, 'a,b,c');
        userEvent.type(weightInput, '299');
        userEvent.type(priceInput, '3.99');
        userEvent.selectOptions(categorySelect, 'category');

        const btn = screen.getByRole('button', { name: /add/i });
        userEvent.click(btn);

        const imgErrorNotification = screen.getByText(/Restaurant cover image is required!/i);
        expect(imgErrorNotification).toBeInTheDocument();
    });

    test('should send request', () => {
        render(<Provider store={store}><AddRecipeModal /></Provider>);
        window.fetch = jest.fn();
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        const nameInput = screen.getByTestId('name');
        const ingredientsInput = screen.getByTestId('ingredients');
        const weightInput = screen.getByTestId('weight');
        const priceInput = screen.getByTestId('price');
        const categorySelect = screen.getByTestId('category');
        const imageInput = screen.getByTestId('image');

        userEvent.type(nameInput, 'recipe name');
        userEvent.type(ingredientsInput, 'a,b,c');
        userEvent.type(weightInput, '299');
        userEvent.type(priceInput, '3.99');
        userEvent.selectOptions(categorySelect, 'category');
        userEvent.upload(imageInput, file);

        const btn = screen.getByRole('button', { name: /add/i });
        userEvent.click(btn);

        waitFor(() => expect(window.fetch).toBeCalled(1));
    });

    test('should populate inputs if in edit mode', () => {
        render(<Provider store={store}><AddRecipeModal recipe={recipe} /></Provider>);

        const nameInput = screen.queryByTestId('name');
        const ingredientsInput = screen.getByTestId('ingredients');
        const weightInput = screen.getByTestId('weight');
        const priceInput = screen.getByTestId('price');
        const categorySelect = screen.getByTestId('category');

        waitFor(() => {
            expect(nameInput.value).toEqual(recipe.name);
            expect(ingredientsInput.value).toEqual(recipe.ingredients.join(','));
            expect(weightInput.value).toEqual(recipe.weight.toString());
            expect(priceInput.value).toEqual(recipe.price.toString());
            expect(categorySelect.value).toEqual(recipe.category);
        });
    });

    test('should send edit request', () => {
        render(<Provider store={store}><AddRecipeModal recipe={recipe} /></Provider>);

        const imageInput = screen.getByTestId('image');
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        userEvent.upload(imageInput, file);
        const btn = screen.getByRole('button', { name: /edit/i });
        userEvent.click(btn);

        waitFor(() => expect(window.fetch).toBeCalled(1));
    });
});