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
import {
  Container,
  Label,
  PrimaryButton,
  Center,
  ButtonText,
  ButtonContainer,
  Input,
  BoxContainer,
  Title,
  ContainerCentred,
  BodyText,
  PostInput,
  PostText,
  Header,
  Body,
  ProfileImage,
  Name,
  PostContainer,
  ScrollViewContainer,
  NewPostBox,
} from '../styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class ProfilePhotoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, // change to true later
      hasPermission: null,
      userProfileID: '',
      type: Camera.Constants.Type.back,
    };
  }

  componentDidMount = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.state.isLoading = false;
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
        <ContainerCentred>
          {/* If the app has permission to the camera, display it. Otherwise display a text letting the user know what the issue is  */}

          {this.state.hasPermission ? (
            <BoxContainer>
              <Title>Update profile photo</Title>
              {/* <View> */}
              {/* <View style={styles.loginBox}> */}

              <Camera
                style={styles.camera}
                type={this.state.type}
                ref={(ref) => (this.camera = ref)}
              ></Camera>
              <PrimaryButton
                onPress={() => {
                  this.takePicture();
                }}
              >
                <ButtonText>TAKE PHOTO</ButtonText>
              </PrimaryButton>
              {/* </View> */}
            </BoxContainer>
          ) : (
            <BodyText>No access to camera</BodyText>
          )}
        </ContainerCentred>
      );
    }
  }
}

export default ProfilePhotoScreen;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    minHeight: 280,
    minWidth: 280,
    marginBottom: 10,
  },
});
