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
  ModalContainer,
  ModalView,
  LoadingContainer,
} from '../styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

class ProfilePhotoScreen extends Component {
  constructor(props) {
    super(props);

    // Set the relevant variables for the image permissin in the state
    this.state = {
      isLoading: true,
      hasPermission: null,
      userProfileID: '',
      type: Camera.Constants.Type.back,
    };
  }

  componentDidMount = async () => {
    // Request camera permission and store it
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.state.isLoading = false;
    // Mirror in the state the permission fo the camere
    this.setState({ hasPermission: status === 'granted' });
    // Store the user's id in the state
    this.state.userProfileID = await AsyncStorage.getItem('@id');
  };

  // Function to trigger the camera to take a picture when the user clicks a button
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

  // Add a function to send th photo data to the server once ready
  sendToServer = async (data) => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID send a request to the server
    const userId = this.state.userProfileID;
    const value = await AsyncStorage.getItem('@session_token');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return (
      fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'image/png',
          'X-Authorization': value,
        },
        body: blob,
      })
        .then((response) => {
          // Navigate the user to the server once the profile photo has been added
          this.props.navigation.navigate('Profile');
        })
        // Throw an error if one is to occur
        .catch((err) => {
          console.log(err);
        })
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingContainer>
          <BodyText>Loading..</BodyText>
        </LoadingContainer>
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
