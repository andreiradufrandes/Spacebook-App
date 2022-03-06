/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class ProfilePhotoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false, // change to true later
      hasPermission: null,
      userProfileID: '',
      type: Camera.Constants.Type.back,
    };
  }

  componentDidMount = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
    this.state.userProfileID = await AsyncStorage.getItem('@id');
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  // Add the errros here
  sendToServer = async (data) => {
    // Get these from AsyncStorage
    const userId = this.state.userProfileID;
    const value = await AsyncStorage.getItem('@session_token');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': value,
      },
      body: blob,
    })
      .then((response) => {
        console.log('Picture added to server', response);
        this.props.navigation.navigate('Profile');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading..</Text>
        </View>
      );

      // eslint-disable-next-line no-else-return
    } else {
      return (
        <View>
          {/*------------------------------ Camera ------------------------------    */}

          {/* If the app has permission to the camera, display it. Otherwise display a text letting the user know what the issue is  */}
          {this.state.hasPermission ? (
            <View style={styles.container}>
              <Camera
                style={styles.camera}
                type={this.state.type}
                ref={(ref) => (this.camera = ref)}
              >
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.takePicture();
                    }}
                  >
                    <Text style={styles.text}> Take Photo </Text>
                  </TouchableOpacity>
                </View>
              </Camera>
            </View>
          ) : (
            <Text>No access to camera</Text>
          )}
        </View>
      );
    }
  }
}

export default ProfilePhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
