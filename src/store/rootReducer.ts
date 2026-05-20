import { combineReducers } from "redux";
import flockSlice from "./slices/flockSlice"

export const rootReducer = combineReducers({
    flock: flockSlice
})