import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

import api from '../api/api';

const HotelSearchForm = ({onHotelsFound}) => {
    const [city, setCity] = useState(null); // Выбранный город (объект)
    const [cityInput, setCityInput] = useState(''); // Вводимый текст
    const [cityOptions, setCityOptions] = useState([]);
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(() => {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    });
    const [guests, setGuests] = useState(1);
    const [isLoading, setIsLoading] = useState(false);


    // Загрузка городов при вводе
    useEffect(() => {
        const fetchCities = async () => {
            if (cityInput.length > 2) { //2) {
                setIsLoading(true);
                try {
                    const response = await api.get('/cities/', {
                        params: {
                            search: cityInput // Параметр для фильтрации
                        }
                    });
                    
                    setCityOptions(response.data.map(city => ({
                        value: city.id,
                        name: city.name,
                        label: `${city.name}, ${city.country.name}` // Формат "Город, Страна"
                    })));
                } catch (error) {
                    console.error('Error fetching cities:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        const timer = setTimeout(fetchCities, 500);
        return () => clearTimeout(timer);
    }, [cityInput]);



    const handleCheckInChange = (date) => {
        setCheckInDate(date);
        // Если новая дата заезда позже даты выезда
        if (checkOutDate && date > checkOutDate) {
            const newCheckOut = new Date(date);
            newCheckOut.setDate(newCheckOut.getDate() + 1);
            setCheckOutDate(newCheckOut);
        }
    };

    const handleCheckOutChange = (date) => {
        // Не позволяем выбрать дату выезда раньше даты заезда
        if (date > checkInDate) {
            setCheckOutDate(date);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!city) {
            alert('Пожалуйста, выберите город');
            return;
        }
        
        const searchData = {
            city_id: city.value,
            // city_name: city.label.split(',')[0], // Извлекаем только название города
            check_in: checkInDate.toISOString().split('T')[0],
            check_out: checkOutDate.toISOString().split('T')[0],
            guests
        };
        
        try {
            const response = await api.get('/search/', {
                params: searchData
            });
            onHotelsFound(response.data, city.name, checkInDate, checkOutDate, guests); // Отправляем найденные отели и название города

        } catch (error) {
            console.error('Ошибка при загрузке отелей:', error);
            alert('Не удалось загрузить отели');
            onHotelsFound([], city.name); // Если ошибка, отелей нет
        }
    };


    return (
        <div className="hotel-search-form">
            <form onSubmit={handleSubmit} className='row align-items-end g-3 border rounded p-4'>
                <div className="col-md-4">
                    <div className="d-flex flex-column h-100">
                        <label htmlFor="city" className="form-label">Куда хотите поехать?</label>
                        <Select
                            id="city"
                            options={cityOptions}
                            onInputChange={setCityInput}
                            onChange={(selected) => setCity(selected)}
                            isLoading={isLoading}
                            placeholder="Начните вводить город..."
                            noOptionsMessage={() => cityInput.length > 2 ? "Город не найден" : "Введите минимум 3 символа"}
                            value={city}
                        />
                    </div>
                </div>

                {/* 1 вариант */}
                {/* 
                <div className="col-md-4 position-relative">
                    <div className="d-flex flex-column h-100">
                        <label htmlFor="city" className="form-label">Куда хотите поехать?</label>
                        <input
                            id="city"
                            type="text"
                            className="form-control"
                            value={cityInput}
                            onChange={(e) => {
                                setCityInput(e.target.value);
                                setCity(null); // Сброс выбранного города при ручном вводе
                            }}
                            placeholder="Начните вводить город..."
                            autoComplete="off"
                        />
                        
                        {cityOptions.length > 0 && (
                            <div className="list-group position-absolute w-100" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                {cityOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className="list-group-item list-group-item-action"
                                        onClick={() => {
                                            setCity(option);       // выбираем город
                                            setCityInput(option.label); // заполняем input
                                            setCityOptions([]);    // скрываем подсказки
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div> */}

                {/* 2 вариант */}
                {/* <div className="col-md-4 position-relative">
                    <div className="d-flex flex-column h-100">
                        <label htmlFor="city" className="form-label">Куда хотите поехать?</label>
                        <input
                            id="city"
                            type="text"
                            className="form-control"
                            value={cityInput}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCityInput(value);
                                setCity(null);

                                // Очищаем варианты, если пользователь стер текст
                                if (value.trim() === '') {
                                    setCityOptions([]);
                                }
                            }}
                            placeholder="Начните вводить город..."
                            autoComplete="off"
                        />

                        {(cityOptions.length > 0 && cityInput.trim() !== '') && (
                        <div
                            className="list-group position-absolute"
                            style={{
                            top: '100%',       // чтобы ПОД инпутом
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            backgroundColor: 'white'
                            }}
                        >
                            {cityOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                setCity(option);               // выбрать город
                                setCityInput(option.label);    // вставить его в поле
                                setCityOptions([]);             // скрыть список
                                }}
                            >
                                {option.label}
                            </button>
                            ))}
                        </div>
                        )}
                    </div>
                </div> */}


                <div className="col-md-2">
                    <div className="d-flex flex-column h-100">
                        <label className="form-label">Заезд</label>
                        <DatePicker
                        selected={checkInDate}
                        onChange={handleCheckInChange}
                        selectsStart
                        startDate={checkInDate}
                        endDate={checkOutDate}
                        minDate={new Date()}
                        className="form-control"
                        dateFormat="dd.MM.yyyy"
                        />
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="d-flex flex-column h-100">
                        <label className="form-label">Выезд</label>
                        <DatePicker
                        selected={checkOutDate}
                        onChange={handleCheckOutChange}
                        selectsEnd
                        startDate={checkInDate}
                        endDate={checkOutDate}
                        minDate={checkInDate}
                        className="form-control"
                        dateFormat="dd.MM.yyyy"
                        />
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="d-flex flex-column h-100">
                        <label className="form-label">Гости</label>
                        <input
                            type="number"
                            className="form-control"
                            value={guests}
                            min="1"
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0) {
                                    setGuests(value);
                                } else if (e.target.value === "") {
                                    setGuests(1);
                                }
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "" || parseInt(e.target.value) < 1) {
                                    setGuests(1);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">
                        Найти
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelSearchForm;