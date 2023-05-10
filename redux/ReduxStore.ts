import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import LoginReducer from "./reducers/LoginReducer";

const reducer = combineReducers({
    loginReducer: LoginReducer.reducer,

})



export type ApplicationState=ReturnType<typeof reducer>


const store = configureStore({
    reducer
})

export { store, reducer }