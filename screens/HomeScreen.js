import * as React from 'react';
import { Text, View, StyleSheet, Button, AsyncStorage, ActivityIndicator } from 'react-native';
import { Constants, Expo, Facebook } from 'expo';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { TextInput } from 'react-native-paper'

export default class HomeScreen extends React.Component {
  state = {
    phoneNumber: ""
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          label='Phone Number'
          keyboardType='numeric'
          value={this.state.phoneNumber}
          type='outlined'
          onChangeText={text => this.setState({ phoneNumber: text })}
          maxLength={11}
        />
        {/* <Text style={styles.paragraph}>Are you Company or a User waiting for tokens</Text>
        <Button
          title="I am a Company"
          color="red"
          onPress={() => this.props.navigation.navigate('AddCompany')}
        />
        <Button
          title="I am waiting for tokens"
          color="orange"
          onPress={() => console.log('I am waiting for tokens')}
        />
        <Button
          title="Get Token"
          color="purple"
          onPress={() => AsyncStorage.getItem('userToken')
            .then((d) => console.log(d))}
        /> */}
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
