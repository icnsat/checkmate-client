import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';

const ReviewForm = () => {
    const { hotelId } = useParams();
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const { state } = useLocation();
    const bookingId = state?.bookingId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log({
                booking: bookingId,
                text,
                rating,});

            const ratingInt = parseInt(rating, 10);
            await api.post(`/hotels/${hotelId}/reviews/`, {
                booking: bookingId,
                text,
                rating: ratingInt,
            });
            alert('Отзыв успешно отправлен!');
            navigate(`/hotels/${hotelId}/rooms`); // возвращаем на страницу отеля (или куда захочешь)
        } catch (error) {
            console.error(error);
            alert('Ошибка при отправке отзыва.');
            console.log(error.response?.data); // <<< ВОТ СЮДА

        }
    };

    return (
        <div className="container my-4">
            <h2>Оставить отзыв</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Оценка (1-5)</label>
                    <input
                        type="number"
                        id="rating"
                        className="form-control"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Комментарий</label>
                    <textarea
                        id="comment"
                        className="form-control"
                        rows="4"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Отправить отзыв</button>
            </form>
        </div>
    );
};

export default ReviewForm;
