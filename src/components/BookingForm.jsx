import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button, Alert, Badge, Image, Form} from 'react-bootstrap';


import api from '../api/api';
import { savePendingBooking, clearPendingBooking } from '../slices/bookingSlice';


const BookingForm = () => {
    const location = useLocation();
    const state = location.state;
    const { roomId } = useParams();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });

    const [user, setUser] = useState(null);

    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            if (state) {
                dispatch(savePendingBooking({
                    ...state,
                    hotelId: state.hotelId,
                    roomId: roomId, // ДОБАВЛЯЕМ roomId сюда!
                    checkInDate: state.checkInDate instanceof Date ? state.checkInDate.toISOString() : state.checkInDate,
                    checkOutDate: state.checkOutDate instanceof Date ? state.checkOutDate.toISOString() : state.checkOutDate,
                }));            
            }
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [isAuthenticated, navigate, location, state, dispatch, roomId]);

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const userResponse = await api.get(`/auth/users/me/`);
                setUser(userResponse.data);

                const hotelResponse = await api.get(`/hotels/${state.hotelId}/`);
                setHotel(hotelResponse.data);

                const roomResponse = await api.get(`/hotels/${state.hotelId}/rooms/${roomId}`);
                setRoom(roomResponse.data);         

                const discountResponse = await api.get('/discounts/roulette/');
                if (discountResponse.status === 200) {
                    setDiscount(discountResponse.data.discount_amount);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);  // После завершения запроса данные загружены
            }
        };

        if (state && roomId) {
            fetchHotelData();
        }
    }, [state, roomId]);

    if (loading) {
        return <div>Загрузка...</div>; // Если данные ещё загружаются
    }

    // Обработка ошибки, если hotel или room равны null
    if (!room || !hotel) {
        return (
            <Container className="text-center py-5">
                <h2>Данные о номере или отеле не найдены</h2>
                <p className="text-muted">Попробуйте снова или обратитесь в службу поддержки</p>
            </Container>
        );
    }

    if (user.is_blocked) {
        navigate('/booking/fail');
    }

    const nights = (new Date(state.checkOutDate) - new Date(state.checkInDate)) / (1000 * 60 * 60 * 24);
    const basePrice = room.price * nights;
    const finalPrice = discount ? basePrice * (1 - discount / 100) : basePrice;   
    

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const formatDate = (date) => {
        if (typeof date === 'string') {
            return date.split('T')[0];
        } else if (date instanceof Date) {
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
                room: Number(roomId),
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
            navigate('/booking/success', { state: { bookingData } });
        } catch (error) {
            alert('Ошибка при бронировании');
            console.error("Ошибка при бронировании:", error);
            if (error.response) {
                // Выводим полный ответ от сервера, чтобы понять, что не так
                console.error("Ответ сервера:", error.response.data);
                alert(`Ошибка: ${error.response.data.non_field_errors ? error.response.data.non_field_errors.join(', ') : 'Неизвестная ошибка'}`);
            } else {
                alert('Ошибка при бронировании');
            }
        }
    };


    return (
        <div>
            {state && room && hotel ? (
                <Container className="py-5">
                    <h1 className="mb-4">Бронирование номера</h1>
                    <Row>
                        <Col md={8}>
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                <Card.Title>{hotel.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {hotel.city.country}, {hotel.city.name}, {hotel.address}
                                </Card.Subtitle>
                                <Badge bg="success" className="mb-3">Рейтинг: {hotel.rating}★</Badge>

                                <div className="mb-3">
                                    <Card.Img variant="top" src={room.image} style={{ borderRadius: "10px", objectFit: "cover", height: "200px" }} />
                                </div>

                                <h5>{room.type}</h5>
                                <p className="text-muted">{room.description}</p>
                                <p>Вместимость: {room.capacity} чел.</p>
                                <p>Цена за ночь: <strong>{room.price} ₽</strong></p>

                                <hr />

                                <p><strong>Заезд:</strong> {new Date(state.checkInDate).toLocaleDateString('ru-RU')}</p>
                                <p><strong>Выезд:</strong> {new Date(state.checkOutDate).toLocaleDateString('ru-RU')}</p>
                                <p><strong>Гостей:</strong> {state.guests}</p>

                                <hr />

                                <div className="text-end">
                                    {discount ? (
                                    <>
                                        <div className="text-muted" style={{ textDecoration: 'line-through' }}>
                                            {basePrice.toFixed(0)} ₽
                                        </div>
                                        <div className="fs-4 fw-bold text-success">
                                            -{discount}% = {finalPrice.toFixed(0)} ₽
                                        </div>
                                    </>
                                    ) : (
                                    <div className="fs-4 fw-bold">
                                        {basePrice.toFixed(0)} ₽
                                    </div>
                                    )}
                                </div>

                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="firstName">
                                    <Form.Label>Имя</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        placeholder="Введите имя"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="lastName">
                                    <Form.Label>Фамилия</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        placeholder="Введите фамилию"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="phone">
                                    <Form.Label>Телефон</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        placeholder="Введите телефон"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Забронировать
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    </Container>
            ) : (
                <Container className="text-center py-5">
                    <h2>Вы не передали нужные данные для бронирования :(</h2>
                    <p className="text-muted">Вернитесь на главную страницу</p>
                </Container>
            )}
        </div>
    );
};

export default BookingForm;
