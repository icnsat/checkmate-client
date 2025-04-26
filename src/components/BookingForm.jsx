import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import api from '../api/api';
import { savePendingBooking, clearPendingBooking } from '../slices/bookingSlice';


const BookingForm = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const state  = location.state;
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });

    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            if (state) {
                dispatch(savePendingBooking({
                    ...state,
                    roomId: roomId, // ДОБАВЛЯЕМ roomId сюда!
                    checkInDate: state.checkInDate instanceof Date ? state.checkInDate.toISOString() : state.checkInDate,
                    checkOutDate: state.checkOutDate instanceof Date ? state.checkOutDate.toISOString() : state.checkOutDate,
                }));            
            }
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [isAuthenticated, navigate, location, state, dispatch, roomId]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const formatDate = (date) => {
        if (typeof date === 'string') {
            // если это строка, значит уже готовая дата
            return date.split('T')[0];
        } else if (date instanceof Date) {
            // если это объект даты
            return date.toISOString().split('T')[0];
        } else {
            console.error('Unexpected date format', date);
            return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bookingData = {
                room: Number(roomId),  // превращаем в число
                start_date: formatDate(state.checkInDate),
                end_date: formatDate(state.checkOutDate),
                guests: state.guests,
                first_name: form.firstName,
                last_name: form.lastName,
                phone: form.phone,
            };

            await api.post('/bookings/', bookingData);
            alert('Бронирование успешно создано!');
            dispatch(clearPendingBooking);
            navigate('/account');
        } catch (error) {
            console.error(error);
            alert('Ошибка при бронировании');
        }
    };

    return (
        <div>
            <h1>Бронирование номера</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="firstName"
                    placeholder="Имя"
                    value={form.firstName}
                    onChange={handleChange}
                />
                <input
                    name="lastName"
                    placeholder="Фамилия"
                    value={form.lastName}
                    onChange={handleChange}
                />
                <input
                    name="phone"
                    placeholder="Телефон"
                    value={form.phone}
                    onChange={handleChange}
                />
                <button type="submit">Забронировать</button>
            </form>
        </div>
    );
};

export default BookingForm;
