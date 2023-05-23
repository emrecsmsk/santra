import { createSlice } from "@reduxjs/toolkit"

interface LoginState {
    isLoggedIn: boolean
}

const initialState: LoginState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: "loginReducer",
    initialState,
    reducers: {
        loginAction: (state: LoginState, action) => {
            state.isLoggedIn = action.payload
        },
    }
})

const { loginAction } = slice.actions

const setIsLoggedIn = (isLoggedIn: boolean) => (dispatch: any) => {

    dispatch(loginAction(isLoggedIn))
}

export default {
    reducer: slice.reducer,
    setIsLoggedIn,
}
