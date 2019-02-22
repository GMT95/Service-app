import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux'

import LoginWithFacebook from './LoginWithFacebook';
import AddPhoneNum from './AddPhoneNum';


class SignInScreen extends Component {
  static navigationOptions = {
    header: null
  }
  
  
  render() {
    const { screenChanger } = this.props
    return (
     screenChanger === false ?
     <LoginWithFacebook navigation={this.props.navigation}/> : 
     <AddPhoneNum navigation={this.props.navigation}/> 
    )
  }
}

mapStateToProps = (state) => ({
  screenChanger: state.authReducer.screenChanger
})

export default connect(mapStateToProps, null)(SignInScreen)