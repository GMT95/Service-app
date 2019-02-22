import * as React from 'react';
import { View, StyleSheet, ActivityIndicator, Button, Text } from 'react-native';
import { Constants} from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Avatar} from 'react-native-paper'
import { ipAddress } from '../constants'
import {connect} from 'react-redux'

class HomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: (props) => (
      <MaterialCommunityIcons name="home" size={20} color="blue" />
    ),
  };


  state = {
    data: {}
  }

  componentDidMount() {
    const {token,dispatch} = this.props
    fetch(`${ipAddress}/users/me`,{
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(res2 => dispatch({type: 'GET_AND_SAVE_DATA',payload: res2.user}))
  }

  render() {
    console.log(this.state)
    const {userData} = this.props
    return (
      userData === null ? 
      <View style={styles.container}>
        <ActivityIndicator size="large" color="purple" />
      </View> :
      <View style={styles.container}>
        {/* <Avatar.Image size={100} source={{uri: userData.profilePicURL}} /> */}
        <Text style={{fontStyle: 'italic',fontSize: 50,marginBottom: 20}}>KOKO</Text>
        <Avatar.Image size={200} source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}} />
      </View>
    );
  }

}

const mapStateToProps = (state) => ({
  token: state.authReducer.savedToken,
  userData: state.authReducer.userData
})

export default connect(mapStateToProps,null)(HomeScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
