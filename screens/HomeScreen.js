import * as React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar, Card, Title, Paragraph, Button } from 'react-native-paper'
import { ipAddress } from '../constants'
import { connect } from 'react-redux'


class HomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: (props) => (
      <MaterialCommunityIcons name="home" size={20} color="blue" />
    ),
  };


  state = {
    userServices: { data: [] }
  }

  fetchUserServices() {
    fetch(`${ipAddress}/users/myservices`, {
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res2 => this.setState({ userServices: res2 }))
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
    const { dispatch } = this.props
    console.log('In get location async')
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
      .catch(e => console.log('An error occured', e));
    if (status !== 'granted') {
      // this.setState({
      //   errorMessage: '',
      // });
      this.showAlert()
    }

    let location = await Location.getCurrentPositionAsync({}).catch(e => { this.setState({ currentLocation: null }) });
    this.setState({ currentLocation: location });
    dispatch({ type: 'SAVE_CURRENT_LOCATION', payload: location })
    console.log(this.state);
  };

  componentDidMount() {
    const { token, dispatch } = this.props

    this.getLocationAsync()

    fetch(`${ipAddress}/users/me`, {
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res2 => dispatch({ type: 'GET_AND_SAVE_DATA', payload: res2.user }))
      .then(
        fetch(`${ipAddress}/users/myservices`, {
          headers: {
            'x-access-token': token,
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(res2 => this.setState({ userServices: res2 }))
      )
  }

  render() {

    console.log(this.state)
    const { userData } = this.props
    const { userServices } = this.state
    return (
      userData === null ?
        <View style={styles.container}>
          <ActivityIndicator size="large" color="purple" />
        </View> :
        <View style={styles.container}>
          {/* <Avatar.Image size={150} source={{ uri: userData.profilePicURL }} />
          <Text style={{ fontStyle: 'italic', fontSize: 25, marginBottom: 15, textAlign: 'center' }}>{userData.name}</Text> */}
          <Avatar.Image size={200} source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }} />
          <Text style={{ textAlign: 'left', fontSize: 24, marginTop: 10, marginBottom: 5, color: 'blue', fontWeight: 'bold' }}>My Services</Text>
          <View style={{ height: 200 }}>
            <ScrollView>
              {
                userServices.data.length ?
                  userServices.data.map((val, index) => {
                    return <Card style={{ width: '100%', marginTop: 10, marginBottom: 10 }} key={`cardindex${index}`}>
                      <Card.Content>
                        <Title style={{ textAlign: 'center' }}>{val.serviceName}</Title>
                        <Text style={{ textAlign: 'center' }}>Provider: {val.name}</Text>
                        <Paragraph style={{ fontWeight: 'bold', textAlign: 'center' }}>{val.category}</Paragraph>
                      </Card.Content>
                      <Card.Cover source={{ uri: val.profilePicURL }} />
                      <Card.Actions style={{ paddingLeft: '72%' }}>
                        <Button onPress={() => console.log('Card button', index)} color="blue">EDIT</Button>
                      </Card.Actions>
                    </Card>
                  }) :
                  <Title style={{ color: '#EF330A', textAlign: 'center', paddingTop: 20 }}>No User Services</Title>
              }
            </ScrollView>
          </View>
        </View>
    );
  }

}

const mapStateToProps = (state) => ({
  token: state.authReducer.savedToken,
  userData: state.authReducer.userData
})

export default connect(mapStateToProps, null)(HomeScreen)

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
