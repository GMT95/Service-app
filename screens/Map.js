import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Alert, Platform } from 'react-native';
import { Constants, MapView } from 'expo';
import { connect } from 'react-redux'
// Using a local version here because we need it to import MapView from 'expo'
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const GOOGLE_MAPS_APIKEY = 'AIzaSyCx_-uES-cH5MUvOmR6d8DwhQ4cibpzZlk';

class MapScreen extends Component {
  state = {
    coordinates: [
      {
        latitude: this.props.userData.location.coordinates[1],
        longitude: this.props.userData.location.coordinates[0],
      },
      {
        latitude: this.props.userData.location.coordinates[1],
        longitude: this.props.userData.location.coordinates[0],
      },
    ],
  };

  render() {
    const { coordinates } = this.state
    return <MapView
    style = {{ flex: 1 }}
    initialRegion = {{
      latitude: coordinates[0].latitude,
      longitude: coordinates[0].longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
    >
      <MapView.Marker
        coordinate={{
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude
        }}
        title={"user"}
      />
      <MapView.Marker
        coordinate={{
          latitude: coordinates[1].latitude,
          longitude: coordinates[1].longitude
        }}
        title={"user"}
      />
      <MapViewDirections
        origin={this.state.coordinates[0]}
        destination={this.state.coordinates[1]}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor="hotpink"
      />
      </MapView >
  }
}

const mapStateToProps = (state) => ({
  orderData: state.authReducer.orderData,
  userData: state.authReducer.userData
})

export default connect(mapStateToProps, null)(MapScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});