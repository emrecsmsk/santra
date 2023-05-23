import { createSlice } from "@reduxjs/toolkit"
import { ProfileModel } from "../../models/ProfileModel"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface ProfileState {
    profileModel?: ProfileModel,
}

const initialState: ProfileState = {
    profileModel: undefined
}

const slice = createSlice({
    name: "profileReducer",
    initialState,
    reducers: {
        setProfile: (state: ProfileState, action) => {
            state.profileModel = action.payload
        },
    }
})

const { setProfile, } = slice.actions

const getProfile = () => async (dispatch: any) => {
    const email = await AsyncStorage.getItem('email') ?? ""

    const q = query(collection(db, "users"), where('email', "==", email))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
        const profileModel = docSnap.data();
        dispatch(setProfile(profileModel))
    })


}

export default {
    reducer: slice.reducer,
    getProfile
}
