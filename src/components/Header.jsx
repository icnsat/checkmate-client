import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Navbar, Container, Nav } from "react-bootstrap";

import { logout } from "../slices/authSlice";
import DiscountModal from './DiscountModal';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const username = useSelector((state) => state.auth.user.username);
    const role = useSelector((state) => state.auth.user.role);

    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ||
        document.body.getAttribute('data-bs-theme') ||
        'light'
    );

    useEffect(() => {
        document.body.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((oldTheme) => (
            oldTheme === 'light' ? 'dark' : 'light')
        );
    };
    
    const IsAdmin = (isAuthenticated && role === 'admin');
    const IsStaff = (isAuthenticated && role === 'staff');
    const IsUser = (isAuthenticated && role === 'user');

    const onLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const [showModal, setShowModal] = useState(false);


    return(
        <Navbar className="bg-primary bg-opacity-10 rounded">
            <Container>

                <Nav className="me-auto">
                    <Navbar.Brand style={{ cursor: 'pointer' }}>
                        <span onClick={toggleTheme}>
                            {theme === 'light' ? '🌙' : '☀️'}
                        </span>
                        <Link to="/" className="ms-2 text-decoration-none text-reset">
                            Checkmate
                        </Link>
                    </Navbar.Brand>

                    {IsAdmin && (
                        <>
                            <Nav.Link as={Link} to="/users">Пользователи</Nav.Link>
                            <Nav.Link as={Link} to="/bookings">Бронирования</Nav.Link>
                        </>
                    )}

                    {IsStaff && (
                        <Nav.Link as={Link} to="/hotels">Отели</Nav.Link>
                    )}

                    {IsUser && (
                        <Button variant="warning" onClick={() => setShowModal(true)}>
                            Получить скидку!
                        </Button>
                    )}

                </Nav>


                <DiscountModal show={showModal} handleClose={() => setShowModal(false)} />


                <Nav>
                    {isAuthenticated ? 
                    (
                        <>
                            {IsAdmin || IsStaff ? (
                                <>
                                    <Navbar.Text className="me-2">{username}</Navbar.Text>
                                    <Button variant="outline-danger" onClick={onLogout}>Выход</Button>
                                </>
                            ) : (
                                <Nav.Link as={Link} to="/account" class="text-reset text-decoration-none">{username}</Nav.Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Button variant="outline-secondary" as={Link} to="/login" className="me-2">Вход</Button>
                            <Button variant="outline-primary" as={Link} to="/registration" className="">Регистрация</Button>
                        </>
                    )}
                </Nav>

            </Container>
        </Navbar>
    );
};

export default Header;