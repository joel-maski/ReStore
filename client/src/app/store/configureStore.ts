import { configureStore } from "@reduxjs/toolkit";
import { basketSlice } from "../../features/basket/basketSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { catalogSlice } from "../../features/catalog/catalogSlice";

// all new slice to be configure at store
export const store = configureStore({
    reducer: {
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//Create custom hooks for Dispatch and Selector
export const useAppDispatch = () => useDispatch<AppDispatch>();//to update store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; //to read store

