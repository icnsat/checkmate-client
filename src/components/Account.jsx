import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, ListGroup, Image } from "react-bootstrap";



import api from '../api/api';
import { logout } from "../slices/authSlice";


const Account = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [discount, setDiscount] = useState({
        discount_amount: 0,
        expires_at: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const authResponse = await api.get('/auth/users/me/');
                setUserData(authResponse.data);

                const bookingsResponse = await api.get('/bookings/');
                setBookings(bookingsResponse.data);

                const discountResponse = await api.get('/discounts/roulette/');
                if (discountResponse.status === 200) {
                    setDiscount({
                        ...discount, 
                        discount_amount: discountResponse.data.discount_amount,
                        expires_at: new Date(discountResponse.data.expires_at).toLocaleString(),
                    })
                };

                console.log(discountResponse.status);
            } catch (error) {
                setError('Не удалось загрузить данные');
            } 
            finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    if (loading) return (
        <Container className="text-center py-5">
            <h2>Загрузка данных...</h2>
        </Container>
    );

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
        <Container className="my-5">
            <h2>Профиль пользователя</h2>
            <Card className="mb-4">
                <Card.Body>
                    <Card.Text>
                        <strong>Имя пользователя:</strong> {userData?.username}
                    </Card.Text>
                    <Card.Text>
                        <strong>Email:</strong> {userData?.email}
                    </Card.Text>
                    {discount.discount_amount > 0 && (
                        <Card.Text>
                            <strong>Скидка:</strong> {discount.discount_amount}%
                            <strong> Действует до:</strong> {discount.expires_at}
                        </Card.Text>
                    )}
                    <Button variant="danger" onClick={handleLogout}>
                        Выйти
                    </Button>
                </Card.Body>
            </Card>

            <h2>Ваши бронирования:</h2>
            {bookings.length === 0 ? (
                <p>У вас нет активных бронирований.</p>
            ) : (
                <ListGroup>
                    {bookings.map((booking) => (
                        <ListGroup.Item key={booking.id} className="mb-3">
                            <Row>
                                <Col md={3}>
                                    {/* Фото номера */}
                                    <Image
                                        src={booking.room.image}
                                        alt="Room Image"
                                        thumbnail
                                        style={{ objectFit: 'cover', width: '100%', height: '150px' }}
                                    />
                                </Col>
                                <Col md={9}>
                                    {/* <p><strong>Номер:</strong> {booking.room.id}</p> */}
                                    <p><strong>Дата заезда:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
                                    <p><strong>Дата выезда:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
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
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default Account;
