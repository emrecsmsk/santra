import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfilePage/ProfileScreen";



const ProfileNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName={NavigationConstants.profile}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name={NavigationConstants.profile} component={ProfileScreen} />
        </Stack.Navigator >
    )
}

export default ProfileNavigator
