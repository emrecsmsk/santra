import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomePage/HomeScreen";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";



const HomeNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.home}>
            <Stack.Screen name={NavigationConstants.home} component={HomeScreen} options={
                {
                    headerRight: () => (
                        <TouchableOpacity onPress={() => console.log()}>
                            <Ionicons style={{paddingRight: 15}} name="notifications-outline" size={24} color="black" />
                        </TouchableOpacity>

                    ),
                }} />
        </Stack.Navigator >
    )
}

export default HomeNavigator
