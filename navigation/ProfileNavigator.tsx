import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfilePage/ProfileScreen";
import FollowingAndFollowersScreen from "../screens/ProfilePage/Following&FollowersPage/FollowingAndFollowersScreen";
import ProfileEdit from "../screens/ProfilePage/ProfileEditPage/ProfileEdit";



const ProfileNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName={NavigationConstants.profile} >
            <Stack.Screen
                name={NavigationConstants.profile}
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={NavigationConstants.followingAndFollowersScreen}
                component={FollowingAndFollowersScreen}
                options={{
                    title: " ",
                    headerBackTitle: " ",
                }}
            />
            <Stack.Screen
                name={NavigationConstants.profileEdit}
                component={ProfileEdit}
                options={{
                    title: "Profili düzenle",
                    headerBackTitle: " ",
                }}
            />
        </Stack.Navigator >
    )
}

export default ProfileNavigator
