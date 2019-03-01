import React, { Component } from 'react'
import { View, Text,StyleSheet,ScrollView } from 'react-native'
import { Button, Card, Title, Paragraph, Avatar } from 'react-native-paper'
import PropTypes from 'prop-types'
import { Constants } from 'expo'
import { ipAddress } from '../constants';
import { connect } from 'react-redux'
import { AntDesign } from '@expo/vector-icons'

export class OrderRequest extends Component {
  static navigationOptions = {
    drawerLabel: 'Order Request',
    drawerIcon: (props) => (
      <AntDesign name="sound" size={20} color="blue" />
    ),
  };

  state = {
    orderRequests: { data: [] }
  }

  getOrderRequests() {
    const { token } = this.props;
    fetch(`${ipAddress}/users/orderrequests`, {
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res2 => this.setState({ orderRequests: res2 }))
      .catch(err => console.log(err))

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
        rejectedBy: 'provider'
      })
    })
      .then(res => res.json())
      .then(res2 => {
        console.log(res2, 'order canceling log')
        this.getOrderRequests()
      })
      .catch(err => console.log(err))
  }

  acceptOrder(id) {
    const { token } = this.props
    fetch(`${ipAddress}/users/acceptorder`, {
      method: "PUT",
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: id, 
      })
    })
      .then(res => res.json())
      .then(res2 => {
        console.log(res2, 'order canceling log')
        this.getOrderRequests()
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getOrderRequests()
  }

  render() {
    const { orderRequests } = this.state
    console.log(orderRequests)
    return (
      orderRequests.data.length ?
        <ScrollView contentContainerStyle={styles.containerStart}>
          {orderRequests.data.map(val =>
            <Card style={{ width: '90%', marginTop: 10, marginBottom: 10, borderRadius: 15,paddingBottom: 10 }} key={val._id}>
              <Card.Content>
                <Title style={{ textAlign: 'center', color: 'royalblue', fontSize: 25 }}>{val.serviceName}</Title>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>{val.provider}</Text>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>Status: {val.orderStatus}</Text>
              </Card.Content>
              {
                val.orderStatus === 'pending' &&
                <Card.Actions style={{ paddingLeft: '30%' }}>
                  <Button onPress={_ => this.acceptOrder(val._id)} color="green">Accept</Button>
                  <Button onPress={_ => this.cancelOrder(val._id)} color="red">Reject</Button>
                </Card.Actions>
              }
              {  
                val.orderStatus === 'accepted' &&
                <Button onPress={_ => this.cancelOrder(val._id)} color="red">Reject</Button>
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderRequest)

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