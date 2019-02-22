import * as React from 'react';
import { Text, View, StyleSheet,ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, RadioButton, Button,Snackbar } from 'react-native-paper'
import { connect } from 'react-redux'
import {ipAddress} from '../constants/index'

//Duplicate Service flaw

class AddServicesScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Add Service',
    drawerIcon: (props) => (
      <MaterialCommunityIcons name="worker" size={20} color="blue" />
    ),
  };

  state = {
    serviceName: '',
    category: '',
    snackVisible: false,
    loading: false,
    snackMsg: ''
  }

  postService() {
    const { serviceName, category } = this.state;
    const { userData,token } = this.props;
    this.setState({loading: true,serviceName: '',category: ''})
    fetch(`${ipAddress}/users/addservice`, {
      method: "POST",
      headers: {
        'x-access-token': token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serviceName: serviceName,
        category: category,
        location: userData.location,
        phoneNumber: userData.phoneNumber,
        name: userData.name,
        profilePicURL: userData.profilePicURL      
      })
    })
    .then(res => res.json())
    .then(res2 => this.setState({snackMsg: res2.msg,snackVisible: true,loading: false}))
  }


  render() {
    console.log(this.state)
    const { serviceName, category,snackVisible, snackMsg,loading } = this.state
    return (
      loading === false ?
      <View style={styles.container}>
        <Text style={styles.paragraph}>Add Service</Text>
        <TextInput
          label='Service Name'
          keyboardType='ascii-capable'
          value={serviceName}
          type='outlined'
          onChangeText={text => this.setState({ serviceName: text })}
          maxLength={20}
        />
        <Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 14, paddingTop: 12, color: 'blue' }}>Service Category</Text>
        <View style={{ paddingBottom: 50, paddingTop: 10 }}>
          <RadioButton.Group
            onValueChange={value => this.setState({ category: value })}
            value={this.state.category}
            style
          >
            <View style={{ flexDirection: 'row' }}>
              <RadioButton value="carpenter" color='blue' />
              <Text style={{ marginTop: 7 }}>Carpenter</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <RadioButton value="electrician" color='blue' />
              <Text style={{ marginTop: 7 }}>Electrician</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <RadioButton value="plumber" color='blue' />
              <Text style={{ marginTop: 7 }}>Plumber</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <RadioButton value="software development" color='blue' />
              <Text style={{ marginTop: 7 }}>Software Development</Text>
            </View>
          </RadioButton.Group>
        </View>
        {serviceName !== '' && category !== '' ?
          <Button icon="add" mode="contained" onPress={() => this.postService()}>
            Add Service
        </Button> :
          <Button icon="add" mode="contained" onPress={() => console.log('Pressed')} disabled>
            Add Service
        </Button>
        }
        <Snackbar
        visible={snackVisible}
        onDismiss={() => this.setState({ snackVisible: false })}
        duration={2000}
        style={{textalign: 'center'}}
        >
        {snackMsg}
        </Snackbar>
        </View> :
        <View style={styles.container}>
          <ActivityIndicator size="large" color="purple" />
        </View>
        );
  }

}

const mapStateToProps = (state) => ({
  token: state.authReducer.savedToken,
  userData: state.authReducer.userData
});

export default connect(mapStateToProps, null)(AddServicesScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  paragraph: {
    margin: 24,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue'
  },
});
