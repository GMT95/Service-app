import React, { Component } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper'
import { Constants, Expo, Facebook, Alert } from 'expo';
import { connect } from 'react-redux';
import { store } from '../redux/store'
import { ipAddress } from '../constants'


class AddPhoneNum extends Component {
  state = {
    phoneNumber: ''
  }

  async addUser() {
    const { phoneNumber } = this.state
    const { id, name, picture } = this.props
    console.log('Phone Number', phoneNumber)
    await fetch(`${ipAddress}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fbId: id,
        picture: picture,
        name: name,
        phoneNum: phoneNumber
      })
    })
      .then(res => res.json())
      .then(res2 => console.log('final response from res2', res2))
      .catch(e => console.log(e))
    this.props.navigation.navigate('App');
  }

  render() {
    console.log(store.getState())
    return (
      <View style={styles.container}>
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
    )
  }
}

const mapStateToProps = (state) => ({
  id: state.authReducer.id,
  picture: state.authReducer.picture,
  name: state.authReducer.name,
})

export default connect(mapStateToProps, null)(AddPhoneNum)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  }
});


//http://192.168.57.1:5000