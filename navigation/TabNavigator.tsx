import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomePage/HomeScreen";
import SearchScreen from "../screens/SearchPage/SearchScreen";
import TimelineScreen from "../screens/TimelinePage/TimelineScreen";
import MessagesScreen from "../screens/MessagesPage/MessagesScreen";
import ProfileScreen from "../screens/ProfilePage/ProfileScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from "react-native-paper";


const TabNavigator: FC = () => {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator initialRouteName={NavigationConstants.home}>
            <Tab.Screen name={NavigationConstants.home} component={HomeScreen} options={{
                tabBarShowLabel: false,
                headerRight: () => (
                    <Button icon="bell" textColor="black">
                    </Button>
                ),
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name={NavigationConstants.search} component={SearchScreen} options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="magnify" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name={NavigationConstants.timeline} component={TimelineScreen} options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="chart-timeline-variant" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name={NavigationConstants.messages} component={MessagesScreen} options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="message-text-outline" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name={NavigationConstants.profile} component={ProfileScreen} options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account" color={color} size={size} />
                ),
            }} />
        </Tab.Navigator>
    )
}

export default TabNavigator

