// import logo from './logo.svg';
// import './App.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Provider } from 'react-redux';
import { store } from './app/store';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import HotelDetailPage from './components/HotelDetailPage';
import BookingForm from './components/BookingForm';
import ReviewForm from './components/ReviewForm';

import Registration from './components/Registration';
import Login from './components/Login';
import Account from './components/Account';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';


import { Container } from 'react-bootstrap';


function App() {
    return (
        <Provider store={store}>
            <Container className="col-lg-10 mx-auto p-4 py-md-5">
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />}></Route>
                        <Route path="/registration" element={<Registration />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route path="/account" element={
                            <ProtectedRoute allowedRoles={['user']}>
                                <Account />
                            </ProtectedRoute>
                        }></Route>


                        {/* <Route path="/account" element={<Account />}></Route> */}

                        {/* <Route path="/users" element={<UsersList />}></Route>

                        <Route path="/bookings" element={<BookingsList />}></Route>

                        <Route path="/hotels" element={<HotelsList />}></Route>*/}
                        <Route path="/hotels/:hotelId/rooms" element={<HotelDetailPage />}></Route>
                        <Route path="/booking/:roomId" element={<BookingForm />}></Route>
                        <Route path="/hotels/:hotelId/reviews" element={<ReviewForm />}></Route>
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </Container>
        </Provider>
    );
}

export default App;
