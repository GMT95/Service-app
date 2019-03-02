import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux'
import { store } from "./redux/store";
import { IconButton } from 'react-native-paper'
import { Platform, InteractionManager } from 'react-native'


//Screens Import
import AddServiceScreen from './screens/AddService';
import SignInScreen from './screens/SignInScreen';
import DrawerNavigator from './screens/DrawerNavigator';
import GetServicesScreen from './screens/GetServices';
import OrderScreen from './screens/OrderScreen';
import MapScreen from './screens/Map';
import ChatScreen from './screens/ChatScreen';

//Timer Fix Firebase Database
import _ from 'lodash';

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
  // Work around issue `Setting a timer for long time`
  // see: https://github.com/firebase/firebase-js-sdk/issues/97
  const timerFix = {};
  const runTask = (id, fn, ttl, args) => {
    const waitingTime = ttl - Date.now();
    if (waitingTime <= 1) {
      InteractionManager.runAfterInteractions(() => {
        if (!timerFix[id]) {
          return;
        }
        delete timerFix[id];
        fn(...args);
      });
      return;
    }

    const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
    timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
  };

  global.setTimeout = (fn, time, ...args) => {
    if (MAX_TIMER_DURATION_MS < time) {
      const ttl = Date.now() + time;
      const id = '_lt_' + Object.keys(timerFix).length;
      runTask(id, fn, ttl, args);
      return id;
    }
    return _setTimeout(fn, time, ...args);
  };

  global.clearTimeout = id => {
    if (typeof id === 'string' && id.startWith('_lt_')) {
      _clearTimeout(timerFix[id]);
      delete timerFix[id];
      return;
    }
    _clearTimeout(id);
  };
}
//Timer Fix firebase database


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
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#505050',
      },
      headerLeft: (
        <IconButton
          icon='menu'
          color='white'
          size={25}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
      headerRight: (
        <IconButton
          icon="exit-to-app"
          color='#e833e5'
          size={25}
          onPress={() => navigation.navigate('Auth')}
        />
      )
    })
  },
  AddService: AddServiceScreen,
  GetServices: GetServicesScreen,
  Order: OrderScreen,
  Map: MapScreen,
  Chat: ChatScreen
}, { initialRouteName: 'Home' });
const AuthStack = createStackNavigator({ SignIn: App });


const Navigator = createAppContainer(createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth',
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