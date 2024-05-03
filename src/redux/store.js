import {configureStore} from "@reduxjs/toolkit";
import ClockifySlice from "./ClockifySlice";

export function setupStore(preloadedState) {
  return configureStore({
    reducer: {
      clockify: ClockifySlice
    },
    preloadedState
  })
}
