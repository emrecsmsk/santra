import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomePage/HomeScreen";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import SharePostScreen from "../screens/TimelinePage/SharePostPage/SharePostScreen";
import FavoriteFootballCourts from "../screens/HomePage/FavoriteFootballCourtsPage/FavoriteFootballCourts";
import FootballCourtScreen from "../screens/HomePage/FootballCourtPage/FootballCourtScreen";



const HomeNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.home}>
            <Stack.Screen name={NavigationConstants.home} component={HomeScreen} options={
                {
                    title: "Santra",
                    headerRight: () => (
                        <TouchableOpacity onPress={() => console.log()}>
                            <Ionicons style={{ paddingRight: 15 }} name="notifications-outline" size={24} color="black" />
                        </TouchableOpacity>
                    ),
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
        </Stack.Navigator >
    )
}

export default HomeNavigator
