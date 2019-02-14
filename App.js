import React from 'react';
import { Constants, Expo, Facebook, Alert } from 'expo';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class App extends React.Component {
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
            if(data.notfound === true) {
              fetch('http://192.168.57.1:5000/users/register',{
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  fbId: tokenKey.id,
                  picture: tokenKey.picture.data.url,
                  name: tokenKey.name
                })
              })
            } else {
              console.log('User found -->',data)
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
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Service App</Text>
        <Button onPress={_ => this.logIn()} title="Login with facebook" color="#3a5998" />
      </View>
    );
  }
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