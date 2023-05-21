import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import MessagesScreen from "../screens/MessagesPage/MessagesScreen";
import MessagingPage from "../screens/MessagesPage/MessagingPage";



const MessageNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.messages}>
            <Stack.Screen name={NavigationConstants.messages} component={MessagesScreen} />
            <Stack.Screen name={NavigationConstants.messaging} component={MessagingPage} />
        </Stack.Navigator >
    )
}

export default MessageNavigator
