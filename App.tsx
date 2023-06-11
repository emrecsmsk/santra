import TabNavigator from './navigation/TabNavigator';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './redux/ReduxStore';
import SplashScreen from './screens/SplashScreen';

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white'
  },
};

export default function App() {
  return (
    <NavigationContainer theme={Theme}>
      <Provider store={store}>
        <TabNavigator />
        <SplashScreen />
      </Provider>
    </NavigationContainer>
  );
}
