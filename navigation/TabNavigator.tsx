import React, { FC, useEffect } from "react";
import NavigationConstants from "./NavigationConstants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase'
import HomeNavigator from "./HomeNavigator";
import TimelineNavigator from "./TimelineNavigator";
import SearchNavigator from "./SearchNavigator";
import MessageNavigator from "./MessageNavigator";
import ProfileNavigator from "./ProfileNavigator";
import { useDispatch, useSelector } from "react-redux";
import LoginReducer from "../redux/reducers/LoginReducer";
import { ApplicationState } from "../redux/ReduxStore";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginNavigator from "./LoginNavigator";
import ProfileReducer from "../redux/reducers/ProfileReducer";


const TabNavigator: FC = () => {

    const dispatch = useDispatch<any>()
    const { isLoggedIn } = useSelector((state: ApplicationState) => state.loginReducer)
    const Tab = createBottomTabNavigator();
    var email = ""
    var password = ""

    useEffect(() => {
        login()
    }, [])

    const login = async () => {
        await getLoginItem()
        signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                // Signed in 
                dispatch(LoginReducer.setIsLoggedIn(true))
                dispatch(ProfileReducer.getProfile())
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });
    }
    const getLoginItem = async () => {
        email = await AsyncStorage.getItem('email') ?? ""
        password = await AsyncStorage.getItem('password') ?? ""
    }

    return (
        <>
            {isLoggedIn ?
                <Tab.Navigator
                    initialRouteName={NavigationConstants.homeNavigator}
                    screenOptions={{ headerShown: false ,tabBarHideOnKeyboard: true}}>
                    <Tab.Screen
                        name={NavigationConstants.homeNavigator}
                        component={HomeNavigator}
                        options={{
                            tabBarShowLabel: false,
                            tabBarIcon: ({ size, focused }) => {
                                return <Ionicons
                                    name={focused ? "home-sharp" : "home-outline"}
                                    color="black"
                                    size={size} />
                            }
                        }} />
                    <Tab.Screen
                        name={NavigationConstants.searchNavigator}
                        component={SearchNavigator}
                        options={{
                            tabBarShowLabel: false,
                            tabBarIcon: ({ size, focused }) => {
                                return <Ionicons
                                    name={focused ? "search" : "search-outline"}
                                    color="black"
                                    size={size} />
                            }
                        }} />
                    <Tab.Screen
                        name={NavigationConstants.timelineNavigator}
                        component={TimelineNavigator}
                        options={{
                            tabBarShowLabel: false,
                            tabBarIcon: ({ size, focused }) => {
                                return <Ionicons
                                    name={focused ? "football" : "football-outline"}
                                    color="black"
                                    size={size} />
                            }
                        }} />
                    <Tab.Screen
                        name={NavigationConstants.messagesNavigator}
                        component={MessageNavigator}
                        options={{
                            tabBarShowLabel: false,
                            tabBarIcon: ({ size, focused }) => {
                                return <Ionicons
                                    name={focused ? "mail" : "mail-outline"}
                                    color="black"
                                    size={size} />
                            }
                        }} />
                    <Tab.Screen
                        name={NavigationConstants.profileNavigator}
                        component={ProfileNavigator}
                        options={{
                            tabBarShowLabel: false,
                            tabBarIcon: ({ size, focused }) => {
                                return <Ionicons
                                    name={focused ? "person" : "person-outline"}
                                    color="black"
                                    size={size} />
                            }
                        }} />
                </Tab.Navigator >
                :
                <LoginNavigator />

            }
        </>
    )
}

export default TabNavigator

