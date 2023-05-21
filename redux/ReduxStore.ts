import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import LoginReducer from "./reducers/LoginReducer";
import ProfileReducer from "./reducers/ProfileReducer";

const reducer = combineReducers({
    loginReducer: LoginReducer.reducer,
    profileReducer: ProfileReducer.reducer,

})



export type ApplicationState=ReturnType<typeof reducer>


const store = configureStore({
    reducer
})

export { store, reducer }