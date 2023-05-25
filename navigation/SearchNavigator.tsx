import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "../screens/SearchPage/SearchScreen";
import ProfileScreen from "../screens/ProfilePage/ProfileScreen";
import FollowingAndFollowersScreen from "../screens/ProfilePage/Following&FollowersPage/FollowingAndFollowersScreen";



const SearchNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.search}>
            <Stack.Screen
                name={NavigationConstants.search}
                component={SearchScreen}
                options={{
                    title: "Arama"                    
                }} />
            <Stack.Screen
                name={NavigationConstants.profile}
                component={ProfileScreen}
                options={{
                    headerShown: false
                }} />
                <Stack.Screen
                name={NavigationConstants.followingAndFollowersScreen}
                component={FollowingAndFollowersScreen}
                options={{
                    title: " ",
                    headerBackTitle: " ",
                }}
            />
        </Stack.Navigator >
    )
}

export default SearchNavigator
