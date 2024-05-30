import React, { createContext, useReducer, useContext } from 'react';


const initialState = {
    user: null,
    favorites: [],
};


const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload
            };
        case 'LOGOUT_USER':
            return {
                ...state,
                user: null
            };
        case 'ADD_FAVORITE':
            return {
                ...state,
                favorites: [...state.favorites, action.payload]
            };
        case 'REMOVE_FAVORITE':
            return {
                ...state,
                favorites: state.favorites.filter(fav => fav.id !== action.payload)
            };
        case 'SET_FAVORITES':
            return {
                ...state,
                favorites: action.payload
            };
        default:
            return state;
    }
};


const FluxContext = createContext();


export const useFlux = () => useContext(FluxContext);


export const FluxProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <FluxContext.Provider value={{ state, dispatch }}>
            {children}
        </FluxContext.Provider>
    );
};

