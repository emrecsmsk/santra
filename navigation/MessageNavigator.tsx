import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import MessagesScreen from "../screens/MessagesPage/MessagesScreen";



const MessageNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.messages}>
            <Stack.Screen name={NavigationConstants.messages} component={MessagesScreen} />
        </Stack.Navigator >
    )
}

export default MessageNavigator
