import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginPage/LoginScreen";
import SignUpScreen from "../screens/LoginPage/SignUpScreen";
import SignUpNextScreen from "../screens/LoginPage/SignUpNextScreen";



const LoginNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName={NavigationConstants.login}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name={NavigationConstants.login} component={LoginScreen} options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }} />
            <Stack.Screen name={NavigationConstants.signUp} component={SignUpScreen} options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }} />
            <Stack.Screen name={NavigationConstants.signUpNext} component={SignUpNextScreen} />
        </Stack.Navigator >
    )
}
export default LoginNavigator
