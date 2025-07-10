// store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import adressReducer from "./reducers/adressReducer"
import producstReducer from "./reducers/productsReducer"
import cartReducer from "./reducers/cartReducer"
import orderReducer from "./reducers/orderReducer"

const store = configureStore({
  reducer: {
    auth: authReducer,
    adress: adressReducer,
    products: producstReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

// Cria os tipos RootState e AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;
