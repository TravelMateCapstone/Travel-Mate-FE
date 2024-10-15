import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Couter from '../components/Shared/Couter';
import { increase, decrease } from '../redux/actions/couterAction';

const mockStore = configureStore([]);

describe('Couter Component', () => {
    let store;

    beforeEach(() => {
        // Tạo một store giả để sử dụng trong bài test
        store = mockStore({
            couter: { count: 0 }, // Giá trị khởi tạo của count
        });

        // Render component với store giả
        render(
            <Provider store={store}>
                <Couter />
            </Provider>
        );
    });

    it('renders count correctly', () => {
        // Kiểm tra xem giá trị count được hiển thị đúng không
        const countElement = screen.getByText(/count:/i);
        expect(countElement).toHaveTextContent('Count: 0');
    });

    it('dispatches increase action when Increase button is clicked', () => {
        // Mô phỏng việc nhấn nút Increase
        const increaseButton = screen.getByRole('button', { name: /increase/i });
        fireEvent.click(increaseButton);

        // Kiểm tra xem action increase được dispatch
        const actions = store.getActions();
        expect(actions).toEqual([{ type: increase().type }]);
    });

    it('dispatches decrease action when Decrease button is clicked', () => {
        // Mô phỏng việc nhấn nút Decrease
        const decreaseButton = screen.getByRole('button', { name: /decrease/i });
        fireEvent.click(decreaseButton);

        // Kiểm tra xem action decrease được dispatch
        const actions = store.getActions();
        expect(actions).toEqual([{ type: decrease().type }]);
    });
});
