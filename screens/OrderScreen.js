import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Constants, MapView } from 'expo'
import MapViewDirections from 'react-native-maps-directions'
import { Avatar, Card, Title, Paragraph, Button } from 'react-native-paper'
import { ipAddress } from '../constants/index'

export class OrderScreen extends Component {

  confirmOrder() {
    const { userData, orderData,token } = this.props

    // userData.profilePicURL, orderData.profilePicURL, userData.profilePicURL, orderData.category, orderData.serviceName,
    //   orderData.name, userData.name.userData.location, orderData.location

    fetch(`${ipAddress}/users/addorder`, {
      method: "POST",
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serviceName: orderData.serviceName,
        serviceCategory: orderData.category,
        buyer: userData.name,
        provider: orderData.name,
        buyerPic: userData.profilePicURL,
        providerPic: orderData.profilePicURL,
        buyerLocation: userData.location,
        providerLocation: orderData.location,
        serviceId: orderData._id,
        orderStatus: 'pending',
      })
    })
      .then(res => res.json())
      .then(res2 => console.log(res2))
  }



  render() {
    const { userData, orderData } = this.props
    console.log(userData.profilePicURL, '....mypic')
    return (
      <View style={styles.container}>
      <View>
        <Avatar.Image size={200} source={{ uri: userData.profilePicURL }} />
        <Avatar.Image size={200} source={{ uri: orderData.profilePicURL }} />
      </View>
      <Button onPress={() => this.props.navigation.navigate('Map')}>See directions</Button>
      <Button onPress={() => this.confirmOrder()}>Confirm Order</Button>
      </View >
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.authReducer.savedToken,
  userData: state.authReducer.savedToken,
  orderData: state.authReducer.orderData,
  userData: state.authReducer.userData
})



export default connect(mapStateToProps, null)(OrderScreen)

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

