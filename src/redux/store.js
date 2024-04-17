import { configureStore } from "@reduxjs/toolkit";
import ClockifySlice from "./ClockifySlice";

export default configureStore({
    reducer: {
        clockify: ClockifySlice 
    }
})