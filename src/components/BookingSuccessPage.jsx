import React from 'react';
import { Container, Row, Col, Button, Alert} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const BookingSuccessPage = () => {
    return (
        <Container className="my-5">
            <Row className="text-center">
                <Col>
                    {/* Иконка успешного бронирования */}
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="currentColor" className="bi bi-check-circle text-success" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
                            <path d="M10.97 4.97a.75.75 0 0 1 1.06 1.06L7.477 10.586 5.525 8.525a.75.75 0 0 1 1.06-1.06l1.415 1.414 3.97-3.97z"/>
                        </svg>
                    </div>

                    <h1 className="text-success">Бронирование завершено!</h1>

                    <p className="mt-3 fs-5 text-secondary">
                        Ваш заказ в обработке. Он появится в списке заказов вашего аккаунта. Спасибо за использование нашего сервиса!
                    </p>

                    <div className="mt-4">
                        <Link to="/" className="btn btn-primary btn-lg me-2">На главную</Link>
                        <Link to="/account" className="btn btn-outline-secondary btn-lg">Мои бронирования</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingSuccessPage;
