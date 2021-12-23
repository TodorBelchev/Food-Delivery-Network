import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from '../../../store';
import { authActions } from '../../../store/auth';

import loadFontAwesome from '../../../utils/loadFontAwesome';

import Navigation from './Navigation';

loadFontAwesome();

describe('Navigation', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Provider store={store}>
                    <Navigation />
                </Provider>
            </BrowserRouter>
        )
    });

    test('should show correct favorites link if user is logged in or not', () => {
        const link = screen.getByTestId('favorites-link');
        let pathName = new URL(link.href).pathname;
        expect(pathName).toEqual('/favorites');
        store.dispatch(authActions.login({_id: '123', email: 'pesho@abv.bg'}));
        pathName = new URL(link.href).pathname;
        expect(pathName).toEqual('/profile/123/favorites');
    });

});
