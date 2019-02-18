import React from 'react';
import { Constants, Expo, Facebook, Alert } from 'expo';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput } from 'react-native-paper'
import { Provider } from 'react-redux'
import { store } from "./redux/store";
//Screens Import
import HomeScreen from './screens/HomeScreen';
import AddServiceScreen from './screens/AddService';

class SignInScreen extends React.Component {
  state = {
    phoneNumber: '',
    phoneNumberInputScreen: false,
    data: {}
  }

  async addUser() {
    const { data,phoneNumber } = this.state
    console.log('Phone Number',phoneNumber)
    await fetch('http://192.168.57.1:5000/users/register', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              fbId: data.id,
              picture: data.picture.data.url,
              name: data.name,
              phoneNum: phoneNumber
            })
          })
    this.props.navigation.navigate('App');      
  }

  async logIn() {
    console.log('In Login function')
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('277830099567519', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`)
          .then((res) => res.json())
          .then((tokenKey) => {
            //AsyncStorage.setItem('userToken',JSON.stringify(tokenKey))
            //.then(() => this.props.navigation.navigate('App'))
            console.log(tokenKey)
            // this.setState({ phoneNumberInputScreen: true })
            fetch('http://192.168.57.1:5000/users/login', {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                fbId: tokenKey.id,
              })
            })
              .then(res => res.json())
              .then(data => {
                console.log(data.notfound)
                if (data.notfound === true) {
                  this.setState({ phoneNumberInputScreen: true, data: tokenKey })
                  console.log(tokenKey);
                  // fetch('http://192.168.57.1:5000/users/register', {
                  //   method: "POST",
                  //   headers: {
                  //     "Content-Type": "application/json"
                  //   },
                  //   body: JSON.stringify({
                  //     fbId: tokenKey.id,
                  //     picture: tokenKey.picture.data.url,
                  //     name: tokenKey.name
                  //   })
                  // })
                } else {
                  console.log('User found -->', data)
                  this.props.navigation.navigate('App');
                }

              })
          })
        //_signInAsync();
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  render() {
    const { phoneNumberInputScreen } = this.state
    return (
      phoneNumberInputScreen === false ?
        <View style={styles.container}>
          <Text style={styles.paragraph}>Service App</Text>
          <Button onPress={_ => this.logIn()} title="Login with facebook" color="#3a5998" />
        </View> :
        <View>
          <TextInput
            label='Phone Number'
            keyboardType='numeric'
            value={this.state.phoneNumber}
            type='outlined'
            onChangeText={text => this.setState({ phoneNumber: text })}
            maxLength={11}
          />
          <Button onPress={_ => this.addUser()} title="Next" color="blue" />
        </View>
    );
  }
}

const AppStack = createStackNavigator({ Home: HomeScreen, AddService: AddServiceScreen }, { initialRouteName: 'Home' });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

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
      <Navigator/>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});