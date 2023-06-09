import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfilePage/ProfileScreen";
import FollowingAndFollowersScreen from "../screens/ProfilePage/Following&FollowersPage/FollowingAndFollowersScreen";
import ProfileEdit from "../screens/ProfilePage/ProfileEditPage/ProfileEdit";
import CommentsScreen from "../screens/TimelinePage/CommentPage/CommentsScreen";
import MessagingScreen from "../screens/MessagesPage/MessagingScreen";



const ProfileNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName={NavigationConstants.profile} >
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
            <Stack.Screen
                name={NavigationConstants.profileEdit}
                component={ProfileEdit}
                options={{
                    title: "Profili düzenle",
                    headerBackTitle: " ",
                }}
            />
            <Stack.Screen
                name={NavigationConstants.comments}
                component={CommentsScreen}
                options={{
                    title: "Yorumlar",
                    headerBackTitle: " ",
                }}
            />
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

export default ProfileNavigator
