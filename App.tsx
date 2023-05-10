import TabNavigator from './navigation/TabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './redux/ReduxStore';


export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <TabNavigator />
      </Provider>
    </NavigationContainer>
  );
}
