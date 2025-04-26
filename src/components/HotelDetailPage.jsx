import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const HotelDetailPage = () => {
    const { hotelId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);

    const hasState = state && state.checkInDate && state.checkOutDate && state.guests;

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const hotelResponse = await api.get(`/hotels/${hotelId}/`);
                setHotel(hotelResponse.data);

                if (hasState) {
                    const searchData = {
                        check_in: state.checkInDate.toISOString().split('T')[0],
                        check_out: state.checkOutDate.toISOString().split('T')[0],
                        guests: state.guests
                    };

                    const roomsResponse = await api.get(`/hotels/${hotelId}/rooms/`, searchData);
                    setRooms(roomsResponse.data);
                } else {
                    // Если state не передан, просто получаем все номера
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
                checkInDate: state.checkInDate,
                checkOutDate: state.checkOutDate,
                guests: state.guests
            }
        });
    };

    if (!hotel) return <div>Загрузка...</div>;

    return (
        <div>
            <h1>{hotel.name}</h1>
            <p>{hotel.description}</p>

            <h2>Доступные номера</h2>
            {rooms.map(room => (
                <div key={room.id}>
                    <h3>{room.room_type}</h3>
                    <p>Цена: {room.price}</p>
                    {hasState && <button onClick={() => bookRoom(room.id)}>Забронировать</button>}
                </div>
            ))}

            <h2>Отзывы</h2>
            {reviews.length === 0 ? (
                <p>Пока нет отзывов.</p>
            ) : (
                reviews.map(review => (
                    <div key={review.id} className="mb-3">
                        <strong>Оценка:</strong> {review.rating} / 5 <br />
                        <strong>Автор:</strong> {review.user} <br />
                        <strong>Дата:</strong> {new Date(review.created_at).toLocaleDateString()} <br />
                        <strong>Комментарий:</strong> {review.text}
                    </div>
                ))
            )}
        </div>
    );
};

export default HotelDetailPage;
