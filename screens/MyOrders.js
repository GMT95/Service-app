import React, { Component } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Button, Card, Title, Paragraph, Avatar } from 'react-native-paper'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Constants } from 'expo'
import { AntDesign } from '@expo/vector-icons'
import { ipAddress } from '../constants';

export class MyOrders extends Component {
  static navigationOptions = {
    drawerLabel: 'My Orders',
    drawerIcon: (props) => (
      <AntDesign name="shoppingcart" size={20} color="blue" />
    ),
  };

  state = {
    myOrder: { data: [] },
  }

  getMyOrders() {
    const { token } = this.props;
    fetch(`${ipAddress}/users/myorders`, {
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res2 => this.setState({ myOrder: res2 }))
      .catch(err => console.log(err))

  }

  componentDidMount() {
    this.getMyOrders()
  }

  cancelOrder(id) {
    const { token } = this.props
    fetch(`${ipAddress}/users/rejectorder`, {
      method: "PUT",
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: id, 
        rejectedBy: 'buyer'
      })
    })
      .then(res => res.json())
      .then(res2 => {
        console.log(res2, 'order canceling log')
        this.getMyOrders()
      })
      .catch(err => console.log(err))
  }

  render() {
    const { myOrder } = this.state
    return (
      myOrder.data.length ?
        <ScrollView contentContainerStyle={styles.containerStart}>
          {myOrder.data.map(val =>
            <Card style={{ width: '90%', marginTop: 10, marginBottom: 10, borderRadius: 15 }} key={val._id}>
              <Card.Content>
                <Title style={{ textAlign: 'center', color: 'royalblue', fontSize: 25 }}>{val.serviceName}</Title>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>{val.provider}</Text>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>Status: {val.orderStatus}</Text>
              </Card.Content>
              {/* <Card.Cover source={{ uri: val.profilePicURL }} /> */}
              <Card.Actions style={{ paddingLeft: '72%' }}>
                {
                  val.orderStatus === 'pending' &&
                  <Button onPress={_ => this.cancelOrder(val._id)} color="red">Cancel</Button>
                }
              </Card.Actions>
            </Card>
          )}
        </ScrollView> :
        <View style={styles.containerCenter}>
          <Text style={{ color: 'teal', fontSize: 20 }}> No Orders to Show </Text>
        </View>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.authReducer.savedToken
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders)

const styles = StyleSheet.create({
  containerStart: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
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