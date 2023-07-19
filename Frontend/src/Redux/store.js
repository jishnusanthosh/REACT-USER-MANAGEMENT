import { configureStore } from '@reduxjs/toolkit';
import userReducer, { login } from './userReducer';
import adminReducer, { adminLogin } from './adminReducer';

const storedUser = localStorage.getItem('user');
const initialState = storedUser ? JSON.parse(storedUser) : null;

const storedAdmin = localStorage.getItem('admin');
const initialAdminState = storedAdmin ? JSON.parse(storedAdmin) : false;

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer, // Include the admin reducer in the store
  },
  preloadedState: {
    user: initialState,
    admin: initialAdminState, // Set the initial admin state
  },
});

// If user data is stored in local storage, dispatch the login action to update the Redux store
if (initialState) {
  store.dispatch(login(initialState));
}

// If admin is authenticated, dispatch the adminLogin action to update the Redux store
if (initialAdminState) {
  store.dispatch(adminLogin());
}

export default store;
