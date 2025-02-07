import { configureStore } from "@reduxjs/toolkit";
import rentSlice from './rentSlice'; 
const store = configureStore({
    reducer :{
        rent :rentSlice
    }
})
export default store ;