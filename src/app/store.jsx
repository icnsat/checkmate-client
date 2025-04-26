import { configureStore } from '@reduxjs/toolkit';
// import agreementReducer from '../features/agreementSlice';
import authReducer from '../slices/authSlice';
// import postsReducer from '../features/postsSlice';
import bookingReducer from '../slices/bookingSlice';

export const store = configureStore({
    reducer: {
        // agreement: agreementReducer,
        auth: authReducer,
        // posts: postsReducer,
        booking: bookingReducer, 
    },
});