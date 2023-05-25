import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import TimelineScreen from "../screens/TimelinePage/TimelineScreen";
import SharePostScreen from "../screens/TimelinePage/SharePostPage/SharePostScreen";
import ProfileScreen from "../screens/ProfilePage/ProfileScreen";
import FollowingAndFollowersScreen from "../screens/ProfilePage/Following&FollowersPage/FollowingAndFollowersScreen";



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
        </Stack.Navigator >
    )
}


export default TimelineNavigator
