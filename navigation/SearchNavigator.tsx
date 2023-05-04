import React, { FC } from "react";
import NavigationConstants from "./NavigationConstants";
import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "../screens/SearchPage/SearchScreen";



const SearchNavigator: FC = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName={NavigationConstants.search}>
            <Stack.Screen name={NavigationConstants.search} component={SearchScreen} />
        </Stack.Navigator >
    )
}

export default SearchNavigator
