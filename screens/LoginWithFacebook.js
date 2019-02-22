import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { Constants, Expo, Facebook, Alert } from 'expo';
import { Avatar,Title } from 'react-native-paper'
import { connect } from 'react-redux';
import { ipAddress } from '../constants';
import { store } from '../redux/store';

class LoginWithFacebook extends Component {
  async logIn() {
    console.log('In Login function')
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync('277830099567519', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`)
          .then((res) => res.json())
          .then((tokenKey) => {
            console.log(tokenKey)
            fetch(`${ipAddress}/users/login`, {
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
                  //this.setState({ phoneNumberInputScreen: true, data: tokenKey })
                  this.props.dispatch({
                    type: 'SAVE_DATA',
                    payload: {
                      phoneNumberInputScreen: true,
                      id: tokenKey.id,
                      name: tokenKey.name,
                      picture: tokenKey.picture.data.url
                    }
                  })
                  console.log(tokenKey);
                } else {
                  console.log('User found -->', data)
                  this.props.dispatch({
                    type: 'SAVE_TOKEN',
                    payload: data.token
                  })
                  //save token
                  console.log('After login success', store.getState())
                  this.props.navigation.navigate('App');
                }

              })
              .catch(e => console.log(e,'eeeeeeeeeeeeeeeeeeeeeeeerororororor'))
          })
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
        <Title style={styles.paragraph}>Service App</Title>
        <Avatar.Image 
          size={200} 
          source={{ uri: 'https://www.nth.ch/app/uploads/2015/02/inner_vas_providers.jpg' }} 
          style={{marginLeft: "20%",marginBottom: 20}}
        />
        <Button onPress={_ => this.logIn()} title="Login with facebook" color="#3a5998" />
      </View>
    )
  }
}

export default connect(null, null)(LoginWithFacebook)


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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 20
  },
});