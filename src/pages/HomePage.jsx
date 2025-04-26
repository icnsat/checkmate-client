import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HotelSearchForm from '../components/HotelSearchForm';


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
                <div className="mt-5">
                    {hotels.length > 0 ? (
                        <div>
                            <h2>Отели и гостиницы в городе {cityName}</h2>
                            {hotels.map(hotel => (
                                <div key={hotel.id}>
                                <h3>{hotel.name}</h3>
                                <p>{hotel.address}</p>
                                <p>Рейтинг: {hotel.rating}</p>
                                <button onClick={() => goToHotel(hotel.id)}>Посмотреть номера</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2>Отели не найдены</h2>
                        </div>
                    )}
                </div>
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