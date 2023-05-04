import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import TimelineScreen from "../screens/TimelinePage/TimelineScreen";



const TimelineNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.timeline}>
            <Stack.Screen name={NavigationConstants.timeline} component={TimelineScreen} />
        </Stack.Navigator >
    )
}

export default TimelineNavigator
