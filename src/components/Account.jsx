import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Navbar, Container, Nav } from "react-bootstrap";



import api from '../api/api';
import { logout } from "../slices/authSlice";


const Account = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();

    // Если не авторизован, редиректим на страницу входа
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Загружаем данные о пользователе и бронированиях
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const authResponse = await api.get('/auth/users/me/');
                setUserData(authResponse.data);

                const bookingsResponse = await api.get('/bookings/');
                setBookings(bookingsResponse.data);
            } catch (error) {
                setError('Не удалось загрузить данные');
            } 
            finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Функция для выхода из аккаунта
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    if (loading) return <div>Загрузка...</div>;

    // if (error) return <div>{error}</div>;

    const translateStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'В обработке';
            case 'confirmed':
                return 'Подтверждено';
            case 'canceled':
                return 'Отменено';
            default:
                return status;
        }
    };

    return (
        <div>
            <h1>Профиль пользователя</h1>
            <div>
                <p><strong>Имя пользователя:</strong> {userData?.username}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
                <button onClick={handleLogout}>Выйти</button>
            </div>

            <h2>Ваши бронирования:</h2>
            <ul>
                {bookings.length === 0 ? (
                    <li>У вас нет активных бронирований.</li>
                ) : (
                    bookings.map((booking) => (
                        <li key={booking.id}>
                            <p><strong>Номер:</strong> {booking.room.id}</p>
                            <p><strong>Дата заезда:</strong> {booking.start_date}</p>
                            <p><strong>Дата выезда:</strong> {booking.end_date}</p>
                            <p><strong>Гости:</strong> {booking.guests}</p>
                            <p><strong>Стоимость:</strong> {booking.total_price} руб.</p>
                            <p><strong>Статус:</strong> {translateStatus(booking.status)}</p>
                            {booking.status === 'confirmed' && !booking.has_review && (
                                <Link to={`/hotels/${booking.room.hotel}/reviews`} state={{ bookingId: booking.id }}>
                                    <Button variant="outline-success" size="sm">
                                        Оставить отзыв
                                    </Button>
                                </Link>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Account;
