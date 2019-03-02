import React, { Component } from 'react'
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import firebase from '../config/firebase'
import { Constants } from 'expo'
import { Button, Card, Title, Paragraph, Avatar, TextInput } from 'react-native-paper'
import lodash from 'lodash'
const DATABASE = firebase.database();

export class ChatScreen extends Component {
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    //alert('Keyboard Shown');
    this.setState({ keyboardMargin: 80 });
  }

  _keyboardDidHide = () => {
    //alert('Keyboard Hidden');
    this.setState({ keyboardMargin: 0 });
  }

  sendMessage() {
    const { chatData, userData } = this.props;
    console.log(userData)
    // if(chatData.name === userData.buyer) {
    //   buyerName = chatData.name
    //   providerName = userData.provider
    // }
    // else {
    //   buyerName = userData.buyer
    //   providerName = chatData.name
    // }
    DATABASE.ref('messages/' + chatData._id).push({
      message: this.state.text,
      buyer: chatData.buyer,
      provider: chatData.provider,
      sender: userData.name,
      time: Date.now()
    }).then((data) => {
      //success callback
      this.setState({ text: '' })
      Keyboard.dismiss()
      console.log('data ', data)
    }).catch((error) => {
      //error callback
      this.setState({ text: '' })
      Keyboard.dismiss()
      console.log('error ', error)
    })
  }

  async readMessages() {
    const { chatData } = this.props
     const that = this
    DATABASE.ref('messages/' + chatData._id).on('value', (snapshot) => {
      console.log(this, 'this');
      console.log(that, 'that');
      //console.log(lodash.values(snapshot.val()))
      that.state.displayMsgs = lodash.values(snapshot.val())
      console.log(that.state.displayMsgs)
    })
    this.setState((prevState) => {
      return {displayMsgs: prevState.displayMsgs}
    })
  }


  state = {
    text: '',
    keyboardMargin: 0,
    displayMsgs: []
  }

  render() {
    const { displayMsgs } = this.state
    console.log(displayMsgs)
    this.readMessages()
    return (
      <KeyboardAvoidingView style={styles.containerStart} behavior="padding">
        <ScrollView>
          {displayMsgs.length ?
            displayMsgs.map((val, index) => {
              <Card style={{ width: '90%', marginTop: 10, marginBottom: 10, borderRadius: 15 }} key={index}>
                <Card.Content>
                  <Text style={{ textAlign: 'center', fontSize: 16 }}>{val.message}</Text>
                  <Text style={{ textAlign: 'left', fontSize: 16 }}>Status: {val.sender}</Text>
                </Card.Content>
              </Card>
            }) :
            <View style={styles.containerCenter}>
              <Text style={{ color: 'teal', fontSize: 20 }}> No Messages to display </Text>
            </View>

          }
        </ScrollView>
        <View>
          <TextInput
            label='Your Message'
            value={this.state.text}
            onChangeText={text => this.setState({ text })}

          />
          {this.state.text === '' ?
            <Button disabled>
              Send
            </Button> :
            <Button mode="contained" onPress={() => this.sendMessage()}>
              Send
            </Button>
          }
        </View>
        <View style={{ height: this.state.keyboardMargin }} />
      </KeyboardAvoidingView>

    )
  }
}

const mapStateToProps = (state) => ({
  chatData: state.authReducer.chatData,
  userData: state.authReducer.userData,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)

const styles = StyleSheet.create({
  containerStart: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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