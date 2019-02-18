import * as React from 'react';
import { Text, View, StyleSheet, Button, AsyncStorage } from 'react-native';
import { Constants, Expo, Facebook } from 'expo';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

export default class AddServicesScreen extends React.Component {

render() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Add Companies</Text>
        <Button
          title="Add Company"
          color="red"
          onPress={() => console.log('I am a company')}
        />
    </View>);
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
