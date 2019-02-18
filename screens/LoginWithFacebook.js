import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class LoginWithFacebook extends Component {
  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.paragraph}>Service App</Text>
          <Button onPress={_ => this.logIn()} title="Login with facebook" color="#3a5998" />
      </View>
    )
  }
}
