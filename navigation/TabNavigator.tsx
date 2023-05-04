import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import HomeNavigator from "./HomeNavigator";
import TimelineNavigator from "./TimelineNavigator";
import SearchNavigator from "./SearchNavigator";
import MessageNavigator from "./MessageNavigator";
import ProfileNavigator from "./ProfileNavigator";


const TabNavigator: FC = () => {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            initialRouteName={NavigationConstants.homeNavigator}
            screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name={NavigationConstants.homeNavigator}
                component={HomeNavigator}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons
                            name={focused ? "home-sharp" : "home-outline"}
                            color="black"
                            size={size} />
                    }
                }} />
            <Tab.Screen
                name={NavigationConstants.searchNavigator}
                component={SearchNavigator}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons
                            name={focused ? "search" : "search-outline"}
                            color="black"
                            size={size} />
                    }
                }} />
            <Tab.Screen
                name={NavigationConstants.timelineNavigator}
                component={TimelineNavigator}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons
                            name={focused ? "football" : "football-outline"}
                            color="black"
                            size={size} />
                    }
                }} />
            <Tab.Screen
                name={NavigationConstants.messagesNavigator}
                component={MessageNavigator}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons
                            name={focused ? "chatbox" : "chatbox-outline"}
                            color="black"
                            size={size} />
                    }
                }} />
            <Tab.Screen
                name={NavigationConstants.profileNavigator}
                component={ProfileNavigator}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons
                            name={focused ? "person" : "person-outline"}
                            color="black"
                            size={size} />
                    }
                }} />
        </Tab.Navigator >
    )
}

export default TabNavigator

