import React, { Component } from 'react'
import { View, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { TextInput } from 'react-native-paper'
import { Constants, Expo, Facebook, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { store } from '../redux/store'
import { ipAddress } from '../constants'


class AddPhoneNum extends Component {
  state = {
    phoneNumber: '',
    loading: true
  }

  componentDidMount() {
    this.getLocationAsync()
  }

  showAlert = () => {
    Alert.alert(
      'Warning',
      'App is based on location services please press try again to save location',
      [
        { text: 'Try Again', onPress: () => this.getLocationAsync() },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  async getLocationAsync() {
    console.log('In get location async')
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
                     .catch(e => console.log('An error occured',e));
    if (status !== 'granted') {
      // this.setState({
      //   errorMessage: '',
      // });
      this.showAlert()
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location, loading: false });
    console.log(this.state);
  };

  async addUser() {
    const { phoneNumber, location } = this.state
    const { id, name, picture,dispatch } = this.props
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
        phoneNum: phoneNumber,
        location: { 
          type: 'Point', 
          coordinates: [location.coords.longitude, location.coords.latitude] 
        }
      })
    })
      .then(res => res.json())
      .then(res2 => {
        console.log('final response from res2', res2)
        dispatch({
          type: 'SAVE_TOKEN',
          payload: res2.token
        })
      })
      .catch(e => console.log(e))
    console.log('Whole state from props',this.props.wholeState)  
    this.props.navigation.navigate('App');
  }

  render() {
    console.log(store.getState())
    const { loading } = this.state;
    return (
      loading === true ?
      <View style={styles.container}>
        <ActivityIndicator size="large" color="purple" /> 
      </View> :
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
  wholeState: state.authReducer
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