import { combineReducers } from "redux";
import flockSlice from "./slices/flockSlice"
import activitySlice from "./slices/activitySlice"

export const rootReducer = combineReducers({
    flock: flockSlice,
    activities: activitySlice
})