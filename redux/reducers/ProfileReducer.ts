import { createSlice } from "@reduxjs/toolkit"
import { ProfileModel } from "../../models/ProfileModel"
import { doc, getDoc } from "firebase/firestore"
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
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const profileModel = docSnap.data();
        dispatch(setProfile(profileModel))
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }

}

export default {
    reducer: slice.reducer,
    getProfile
}
