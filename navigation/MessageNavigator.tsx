import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import MessagesScreen from "../screens/MessagesPage/MessagesScreen";
import MessagingScreen from "../screens/MessagesPage/MessagingScreen";



const MessageNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.messages}>
            <Stack.Screen
                name={NavigationConstants.messages}
                component={MessagesScreen}
                options={{
                    title: 'Mesajlar'
                }} />
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

export default MessageNavigator
