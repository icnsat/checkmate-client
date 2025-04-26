import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        pendingBookingData: null,
    },
    reducers: {
        savePendingBooking(state, action) {
            state.pendingBookingData = action.payload;
        },
        clearPendingBooking(state) {
            state.pendingBookingData = null;
        },
    },
});

export const { savePendingBooking, clearPendingBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
