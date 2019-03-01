import * as React from 'react';
import { Text, View, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, createAppContainer, DrawerItems, SafeAreaView } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import AddServiceScreen from '../screens/AddService'
import GetServicesScreen from '../screens/GetServices'
import MyOrdersScreen from '../screens/MyOrders';
import OrderRequestScreen from '../screens/OrderRequest'




const MyDrawerNavigator = createDrawerNavigator(
{
  Home: {
    screen: HomeScreen,

  },
  AddService: {
    screen: AddServiceScreen,

  },
  GetServices: {
    screen: GetServicesScreen
  },
  MyOrders: {
    screen: MyOrdersScreen
  },
  OrderRequest: {
    screen: OrderRequestScreen
  }
},
// { 
//   initialRouteName: 'Home', 
// } initial route name does not work change in stack navigator in app.js
);

export default createAppContainer(MyDrawerNavigator);

