import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import TimelineScreen from "../screens/TimelinePage/TimelineScreen";
import SharePostScreen from "../screens/TimelinePage/SharePostPage/SharePostScreen";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import colors from "../utilies/colors";



const TimelineNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.timeline}>
            <Stack.Screen
                name={NavigationConstants.timeline}
                component={TimelineScreen}
                options={{ title: "Santra" }} />
            <Stack.Screen
                name={NavigationConstants.sharePost}
                component={SharePostScreen}
                options={{
                    title: "Gönderi paylaş",
                    headerBackTitle: " ",
                    
                }} />
        </Stack.Navigator >
    )
}


export default TimelineNavigator
