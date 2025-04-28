import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, Image } from 'react-bootstrap';
import { useSelector } from "react-redux";

import { Trash, Pencil } from 'react-bootstrap-icons';

import api from '../api/api';
import StarRating from './StarRating';

const HotelDetailPage = () => {
    const { hotelId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);

    const hasState = state && state.checkInDate && state.checkOutDate && state.guests;

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const hotelResponse = await api.get(`/hotels/${hotelId}/`);
                setHotel(hotelResponse.data);

                console.log('state', state);
                console.log('hasstate', hasState);
                if (hasState) {
                    const searchData = {
                        check_in: state.checkInDate.toISOString().split('T')[0],
                        check_out: state.checkOutDate.toISOString().split('T')[0],
                        guests: state.guests
                    };

                    const roomsResponse = await api.get(`/hotels/${hotelId}/rooms/`, {
                        params: searchData
                    });
                    setRooms(roomsResponse.data);
                } else {
                    const roomsResponse = await api.get(`/hotels/${hotelId}/rooms/`);
                    setRooms(roomsResponse.data);
                }

                const reviewsResponse = await api.get(`/hotels/${hotelId}/reviews/`);
                setReviews(reviewsResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHotelData();
    }, [hotelId, state, hasState]);

    const bookRoom = (roomId) => {
        navigate(`/booking/${roomId}`, {
            state: {
                hotelId: hotelId,
                checkInDate: state.checkInDate,
                checkOutDate: state.checkOutDate,
                guests: state.guests
            }
        });
    };

    if (!hotel) return (
        <Container className="text-center py-5">
            <h2>Загрузка данных...</h2>
        </Container>
    )

    return (
        <div>
            <Container className="mt-5 border rounded-3 p-0 overflow-hidden">
                <Row className="g-0">
                    {/* Колонка с фото */}
                    <Col md={4} className="bg-light">
                    <Image
                        src={`${hotel.image}`}
                        alt={`Фото отеля ${hotel.name}`}
                        className="w-100 h-100"
                        style={{ 
                            objectFit: 'cover',
                            minHeight: '200px',
                            maxHeight: '250px'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${api.defaults.baseURL}/media/placeholders/hotel_ph.jpg`;
                        }}
                    />
                    </Col>
                    
                    {/* Колонка с текстом */}
                    <Col md={8} className="p-3 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h3 className="mb-0">{hotel.name}</h3>
                            <Badge bg="warning" className="fs-6">
                                {hotel.rating} ★
                            </Badge>
                        </div>
                        
                        <p className="text-muted mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {hotel.city.country}, {hotel.city.name}, {hotel.address}
                        </p>
                        
                        <div className="mt-5">
                            {hotel.description}
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container className="mt-5">
                <div>
                    <h2 className="mb-4">Доступные номера</h2>
                    <div className="d-flex flex-column gap-4">
                        {rooms.map(room => (
                            <div key={room.id} className="border rounded-3 p-0 overflow-hidden">
                                <Row className="g-0">
                                    {/* Колонка с фото */}
                                    <Col md={4} className="bg-light">
                                    <Image
                                        src={`${room.image}`}
                                        alt={`Фото номера в отеле ${hotel.name}`}
                                        className="w-100 h-100"
                                        style={{ 
                                            objectFit: 'cover',
                                            minHeight: '200px',
                                            maxHeight: '250px'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${api.defaults.baseURL}/media/placeholders/room_ph.jpg`;
                                        }}
                                    />
                                    </Col>
                                    
                                    {/* Колонка с текстом */}
                                    <Col md={8} className="p-3 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h3 className="mb-0">{room.room_type}</h3>
                                        </div>
                                        
                                        <p className="text-muted mb-2">
                                            {room.description}
                                        </p>

                                        <p className="text-muted mb-2">
                                            Вместимость: {room.capacity}
                                        </p>
                                        
                                        <div className="mt-auto d-flex justify-content-between align-items-end">
                                            <div className="text-start">
                                                <p className="mb-0 fw-bold">{room.price}</p>
                                                <small className="text-muted">за 1 ночь</small>
                                            </div>

                                            {hasState && (
                                                <Button
                                                    variant="btn btn-outline-primary"
                                                    onClick={() => bookRoom(room.id)}
                                                    size="sm"
                                                >
                                                    Забронировать
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
            <Container className="mt-5">
                <h2 className="mb-4">Отзывы гостей</h2>
                {reviews.length === 0 ? (
                    <Alert variant="info">
                        Пока нет отзывов
                    </Alert>
                ) : (
                    <Row className="g-4">
                        {reviews.map(review => (
                            <Col key={review.id} xs={12}>
                                <Card className="h-100 shadow-sm border">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <Card.Title as="h5" className="mb-1">{review.user}</Card.Title>
                                                <small className="text-muted">
                                                    {new Date(review.created_at).toLocaleDateString('ru-RU')}
                                                </small>
                                            </div>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <Card.Text>{review.text}</Card.Text>
                                    </Card.Body>
                                    {/* {review.user === user.username && (
                                        <Card.Footer className="bg-transparent border-top-0 text-end">
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-warning btn-sm py-0"
                                                title="Редактировать"
                                            >
                                                <Pencil />
                                            </Button>
                                            <Button 
                                                variant="link"
                                                size="sm"
                                                className="text-danger btn-sm py-0"
                                                title="Удалить"
                                            >
                                                <Trash />
                                            </Button>
                                        </Card.Footer>
                                    )} */}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default HotelDetailPage;
