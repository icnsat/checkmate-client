import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token');

// Функция проверки валидности токена
const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

// Функция загрузки начального состояния
const loadInitialState = () => {
    // if (!token || !isTokenValid(token)) {
    //     localStorage.removeItem('token');
    //     return {
    //         token: null,
    //         user: {
    //         username: null,
    //         role: null,
    //         },
    //         isAuthenticated: false,
    //     };
    // }

    if (isTokenValid(token)) {
        // Если токен валиден, декодируем данные
        const decoded = jwtDecode(token);
        return {
            token: token,
            user: {
                username: decoded.username,
                role: decoded.role,
            },
            isAuthenticated: true,
        };
    } 
    
    if (token) {
        // Если есть в памяти токен - удаляем его, т.к. он точно уже не валидный
        localStorage.removeItem('token');
    } 
    return {
        token: null,
        user: {
        username: null,
        role: null,
        },
        isAuthenticated: false,
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: loadInitialState(),

    // {
    //     token: null,
    //     user: {
    //         username: null,
    //         // theme: 'light',
    //         role: null,
    //     },
    //     isAuthenticated: false,
    //     // isLoading: false,
    //     // error: null
    // },

    reducers: {
        login: (state, action) => {
            // state.token = action.payload.token;
            // state.user = {
            //     username: action.payload.user.username,
            //     // theme: action.payload.user.theme,
            //     role: action.payload.user.role,
            // }
            // state.isAuthenticated = true;

            const { token } = action.payload;
            const decoded = jwtDecode(token);
            state.token = token;
            state.user = {
                username: decoded.username,
                role: decoded.role,
            }
            state.isAuthenticated = true;

            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.token = null;
            state.user = {
                username: null,
                // theme: action.payload.user.theme,
                role:  null,
            }
            state.isAuthenticated = false;

            localStorage.removeItem('token');
        }
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; 



