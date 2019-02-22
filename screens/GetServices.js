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


  render() {
    const { category, categoryData } = this.state
    console.log(categoryData)
    return (
      <View style={styles.container}>
        <Button 
          onPress={() => console.log('nearby')} 
          color="#0da133" 
          mode="contained"
          style={{marginBottom: 10}}
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
                    <Button onPress={() => console.log('Card button', index)} color="blue">Order</Button>
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
  token: state.authReducer.savedToken
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
