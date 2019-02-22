import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux'
import { store } from "./redux/store";
import { Button } from 'react-native'
import {IconButton} from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Screens Import
import HomeScreen from './screens/HomeScreen';
import AddServiceScreen from './screens/AddService';
import SignInScreen from './screens/SignInScreen';
import DrawerNavigator from './screens/DrawerNavigator';

class App extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    phoneNumber: '',
    phoneNumberInputScreen: false,
    data: {}
  }

  render() {
    console.log(store.getState())
    return (
      <SignInScreen navigation={this.props.navigation} />
    );
  }
}
//Home: {screen: DrawerNavigator,navigationOptions: {header: null}} for no header
const AppStack = createStackNavigator({
  Home: {
    screen: DrawerNavigator,
    navigationOptions: ({navigation}) => ({
      headerLeft: (
        <IconButton
          icon='menu'
          color='blue'
          size={25}
          onPress={() => navigation.toggleDrawer()}
        />  
      ),
      headerRight: (
        <IconButton
          icon="exit-to-app"
          color='red'
          size={25}
          onPress={() => navigation.navigate('Auth')}
        />
      )
    })
  },
  AddService: AddServiceScreen
}, { initialRouteName: 'Home' });
const AuthStack = createStackNavigator({ SignIn: App });


const Navigator = createAppContainer(createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'App',
  }
));

export default ReduxNav = () => {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingTop: Constants.statusBarHeight,
//     backgroundColor: '#ecf0f1',
//     padding: 8,
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });