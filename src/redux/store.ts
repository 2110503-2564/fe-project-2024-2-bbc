import { configureStore } from "@reduxjs/toolkit";
import  bookSlice  from "./features/bookingSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import { persistReducer , FLUSH , REHYDRATE , PAUSE , PURGE , REGISTER, PERSIST } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { WebStorage } from "redux-persist/lib/types";
import { combineReducers } from "@reduxjs/toolkit";

function createPersistStorage():WebStorage{
    const isServer = typeof window === 'undefined';
    if(isServer){
        return{
            getItem(){
                return Promise.resolve(null);
            },
            setItem(){
                return Promise.resolve();
            },
            removeItem(){
                return Promise.resolve();
            },
        }
    }
    return createWebStorage('local');
}

const storage = createPersistStorage()

const persistConfig={
    key:"rootPersist",
    storage
}

const rootReducer = combineReducers({bookSlice})
const reduxPersistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer:reduxPersistedReducer,
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:{
            ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
        }
    })
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector
