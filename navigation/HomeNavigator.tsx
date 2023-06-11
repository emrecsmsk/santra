import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomePage/HomeScreen";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import FavoriteFootballCourts from "../screens/HomePage/FavoriteFootballCourtsPage/FavoriteFootballCourts";
import FootballCourtScreen from "../screens/HomePage/FootballCourtPage/FootballCourtScreen";
import MessagingScreen from "../screens/MessagesPage/MessagingScreen";



const HomeNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.home}>
            <Stack.Screen name={NavigationConstants.home} component={HomeScreen} options={
                {
                    title: "Santra",
                }} />
            <Stack.Screen name={NavigationConstants.favoriteFootballCourts} component={FavoriteFootballCourts} options={
                {
                    title: "Favori halısahalar",
                    headerBackTitle: " "
                }} />
            <Stack.Screen
                name={NavigationConstants.footballCourt}
                component={FootballCourtScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name={NavigationConstants.messaging}
                component={MessagingScreen}
                options={{
                    headerBackTitle: " "
                }}
            />
        </Stack.Navigator >
    )
}

export default HomeNavigator
