import React, { Component } from 'react'
import { View, Text, Picker, StyleSheet, ScrollView } from 'react-native'
import { Paragraph, Card, Button, Title } from 'react-native-paper'
import { connect } from 'react-redux'
import { Constants } from 'expo';
import { AntDesign } from '@expo/vector-icons'
import { ipAddress } from '../constants/index'

class GetServicesScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Get Services',
    drawerIcon: (props) => (
      <AntDesign name="customerservice" size={20} color="blue" />
    ),
  };

  state = {
    category: 'none',
    categoryData: { data: [] }
  }

  searchByCategory(category) {
    if (category === 'none') {
      return
    }

    const { token } = this.props
    console.log(category, '<--cat')

    this.setState({ category: category })

    fetch(`${ipAddress}/users/servicebycat`, {
      method: "POST",
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        category: category
      })
    })
      .then(res => res.json())
      .then(res2 => this.setState({ categoryData: res2 }))
  }

  getNearByServices() {
    const { userData, currentLocation, token } = this.props;

    if (currentLocation !== null) {
      locationBody = userData.location

      fetch(`${ipAddress}/users/nearbyservices`, {
        method: "POST",
        headers: {
          'x-access-token': token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location: locationBody
        })
      })
        .then(res => res.json())
        .then(res2 => this.setState({categoryData: res2}))
        .catch(err => console.log(err))

    } else {
      locationBody = {
        type: "Point",
        coordinates: [currentLocation.coords.longitude, currentLocation.coords.latitude]
      }

      fetch(`${ipAddress}/users/nearbyservices`, {
        method: "POST",
        headers: {
          'x-access-token': token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location: locationBody
        })
      })
        .then(res => res.json())
        .then(res2 => this.setState({categoryData: res2}))
        .catch(err => console.log(err))
    }

  }

  orderData(val) {
    const { dispatch } = this.props
    console.log(val)
    dispatch({type: 'ORDER_DATA',payload: val})


    this.props.navigation.navigate('Order')
  }


  render() {
    const { category, categoryData } = this.state
    console.log('useeeeeeeeeeeeeeer ddddddddddddd', this.props.userData)
    console.log(categoryData,'~~~~~~~~~~~~~~~~~~~~~~~~~~~121')
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.getNearByServices()}
          color="#0da133"
          mode="contained"
          style={{ marginBottom: 10 }}
        >
          Near by Services
        </Button>
        <Text style={{ color: 'blue', fontWeight: 'bold', fontSize: 14 }}>Search By Category</Text>
        <Picker
          mode='dropdown'
          selectedValue={category}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue, itemIndex) => this.searchByCategory(itemValue)}>
          <Picker.Item label="Select from dropdown" value="none" />
          <Picker.Item label="Carpenter" value="carpenter" />
          <Picker.Item label="Electrician" value="electrician" />
          <Picker.Item label="Plumber" value="plumber" />
          <Picker.Item label="Software development" value="software development" />
        </Picker>
        <ScrollView>
          {
            categoryData.data.length ?
              categoryData.data.map((val, index) => {
                return <Card style={{ width: '100%', marginTop: 10, marginBottom: 10 }} key={`cardindex${index}`}>
                  <Card.Content>
                    <Title style={{ textAlign: 'center' }}>{val.serviceName}</Title>
                    <Text style={{ textAlign: 'center' }}>Provider: {val.name}</Text>
                    <Paragraph style={{ fontWeight: 'bold', textAlign: 'center' }}>{val.category}</Paragraph>
                  </Card.Content>
                  <Card.Cover source={{ uri: val.profilePicURL }} />
                  <Card.Actions style={{ paddingLeft: '72%' }}>
                    <Button onPress={() => this.orderData(val)} color="blue">Order</Button>
                    {console.log(val._id,'*******Service Idz')}
                  </Card.Actions>
                </Card>
              }) :
              <Title style={{ color: '#EF330A', textAlign: 'center', paddingTop: 20 }}>No Results to Show</Title>
          }
        </ScrollView> 
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.authReducer.savedToken,
  currentLocation: state.authReducer.currentLocation,
  userData: state.authReducer.userData
})


export default connect(mapStateToProps, null)(GetServicesScreen)

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
