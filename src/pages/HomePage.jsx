import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelSearchForm from '../components/HotelSearchForm';
import { Container, Row, Col, Card, Button, Badge, Image, ListGroup } from 'react-bootstrap';


import api from '../api/api';



function HomePage() {
    const [hotels, setHotels] = useState([]);
    const [searched, setSearched] = useState(false); // чтобы знать, что был хотя бы один поиск
    const [cityName, setCityName] = useState('');

    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);

    const handleHotelsFound = (foundHotels, city, checkIn, checkOut, guestsNumber) => {
        setHotels(foundHotels);
        setSearched(true);
        setCityName(city);
        setCheckInDate(checkIn);
        setCheckOutDate(checkOut);
        setGuests(guestsNumber);
    };

    
    const navigate = useNavigate();

    const goToHotel = (hotelId) => {
        navigate(`/hotels/${hotelId}/rooms`, {
            state: {
                checkInDate,
                checkOutDate,
                guests
            }
        });
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <HotelSearchForm 
                    onHotelsFound={handleHotelsFound}
                />
            </div>

            {searched ?
            (
                // Найденные отели
                // <div className="mt-5">
                //     {hotels.length > 0 ? (
                //         <div>
                //             <h2>Отели и гостиницы в городе {cityName}</h2>
                //             {hotels.map(hotel => (
                //                 <div key={hotel.id}>
                //                     <h3>{hotel.name}</h3>
                //                     <img 
                //                         src={`${api.defaults.baseURL}${hotel.image}`}
                //                         alt={`Фото отеля ${hotel.name}`}
                //                         style={{ maxWidth: '300px', maxHeight: '300px' }}
                //                     />
                //                     <p>{hotel.address}</p>
                //                     <p>Рейтинг: {hotel.rating}</p>
                //                     <button onClick={() => goToHotel(hotel.id)}>Посмотреть номера</button>
                //                 </div>
                //             ))}
                //         </div>
                //     ) : (
                //         <div className="text-center">
                //             <h2>Отели не найдены</h2>
                //         </div>
                //     )}
                // </div>

                // <div className="mt-5">
                //     {hotels.length > 0 ? (
                //         <Container>
                //         <h2 className="mb-4">Отели и гостиницы в городе {cityName}</h2>
                //         <Row xs={1} md={2} lg={3} className="g-4">
                //             {hotels.map(hotel => (
                //             <Col key={hotel.id}>
                //                 <Card className="h-100 shadow-sm">
                //                 <Card.Img
                //                     variant="top"
                //                     src={`${api.defaults.baseURL}${hotel.image}`}
                //                     alt={`Фото отеля ${hotel.name}`}
                //                     style={{ height: '200px', objectFit: 'cover' }}
                //                     onError={(e) => {
                //                     e.target.onerror = null;
                //                     e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                //                     }}
                //                 />
                //                 <Card.Body className="d-flex flex-column">
                //                     <div className="d-flex justify-content-between align-items-start mb-2">
                //                     <Card.Title className="mb-0">{hotel.name}</Card.Title>
                //                     <Badge bg="warning" className="fs-6">
                //                         {hotel.rating} ★
                //                     </Badge>
                //                     </div>
                //                     <Card.Subtitle className="mb-2 text-muted">
                //                     <i className="bi bi-geo-alt"></i> {hotel.address}
                //                     </Card.Subtitle>
                //                     <Card.Text className="flex-grow-1">
                //                     {/* Можно добавить часть описания, если оно есть в данных */}
                //                     </Card.Text>
                //                     <Button 
                //                     variant="primary" 
                //                     onClick={() => goToHotel(hotel.id)}
                //                     className="mt-auto"
                //                     >
                //                     Посмотреть номера
                //                     </Button>
                //                 </Card.Body>
                //                 </Card>
                //             </Col>
                //             ))}
                //         </Row>
                //         </Container>
                //     ) : (
                //         <Container className="text-center py-5">
                //         <h2 className="mb-3">Отели не найдены</h2>
                //         <p className="text-muted">Попробуйте изменить параметры поиска</p>
                //         {/* Можно добавить кнопку для возврата к поиску */}
                //         </Container>
                //     )}
                //     </div>


                <Container className="mt-5">
                    {hotels.length > 0 ? (
                        <div>
                            <h2 className="mb-4">Отели и гостиницы в городе {cityName}</h2>
                            <div className="d-flex flex-column gap-4">
                                {hotels.map(hotel => (
                                    <div key={hotel.id} className="border rounded-3 p-0 overflow-hidden">
                                        <Row className="g-0">
                                            {/* Колонка с фото */}
                                            <Col md={4} className="bg-light">
                                            <Image
                                                src={`${api.defaults.baseURL}${hotel.image}`}
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
                                                    {hotel.address}
                                                </p>
                                                
                                                <div className="mt-auto d-flex justify-content-between align-items-end">
                                                    <div className="text-start">
                                                        <p className="mb-0 fw-bold">от 5 000 ₽</p>
                                                        <small className="text-muted">за 1 ночь</small>
                                                    </div>

                                                    <Button 
                                                        variant="btn btn-outline-primary"
                                                        onClick={() => goToHotel(hotel.id)}
                                                        size="sm"
                                                    >
                                                        Посмотреть номера
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <h2>Отели не найдены</h2>
                            <p className="text-muted">Попробуйте изменить параметры поиска</p>
                        </div>
                    )}
                </Container>
            ) : (
                // Значки с текстом
                <div class="row text-center mt-5">
                    <div class="col-lg-4 mt-5">
                        <i class="bi bi-house-heart display-3 text-primary"></i>
                        <h5 class="mt-3">Удобные отели</h5>
                        <p>Мы предоставляем широкий выбор отелей, подходящих для любого бюджета и предпочтений.</p>
                    </div>
                    <div class="col-lg-4 mt-5">
                        <i class="bi bi-calendar-check display-3 text-success"></i>
                        <h5 class="mt-3">Быстрое бронирование</h5>
                        <p>Лёгкий процесс бронирования, который занимает всего несколько минут.</p>
                    </div>
                    <div class="col-lg-4 mt-5">
                        <i class="bi bi-shield-check display-3 text-warning"></i>
                        <h5 class="mt-3">Гарантия безопасности</h5>
                        <p>Все платежи защищены, а ваши данные находятся под надёжной охраной.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;