import * as React from 'react';
import { Text, View, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, createAppContainer, DrawerItems, SafeAreaView } from 'react-navigation';
import { SimpleLineIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AddServiceScreen from '../screens/AddService'




const MyDrawerNavigator = createDrawerNavigator(
{
  Home: {
    screen: HomeScreen,

  },
  AddService: {
    screen: AddServiceScreen,

  }
},
{ 
  initialRouteName: 'Home', 
}
);

export default createAppContainer(MyDrawerNavigator);

