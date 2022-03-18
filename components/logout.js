import React, { Component } from 'react';
import { Modal } from 'react-native';
import {
  PrimaryButton,
  ButtonText,
  ContainerCentred,
  ModalContainer,
  ModalView,
  BodyText,
} from '../styles.js';

import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      errorMessage: '',
      modalVisible: false,
    };
  }

  componentDidMount() {
    // Check if the user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // Add a toggle function to set the visibility of the alerts, to be be used during networking requests displaying allerts for the user
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  // Check if the user is logged in, and navigate them back to the login page if the are not logged in
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value !== null) {
      this.setState({ token: value });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  // Add a function to log out the user
  logout = async () => {
    // Get the user's token to be used for authorising the fetch request
    const token = await AsyncStorage.getItem('@session_token');

    // Remove the authentification token from the Async library before logging out
    await AsyncStorage.removeItem('@session_token');
    return (
      fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'post',
        headers: {
          'X-Authorization': token,
        },
      })
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          // Navigate the user to the login page if they have logged out successfully
          if (response.status === 200) {
            console.log('response code:', response.status);
            this.props.navigation.navigate('Login');
            // Display differnt error alerts for the user if the netwroking request was unsuccessful
          } else if (response.status === 401) {
            this.state.errorMessage =
              'Logout failed! This is because you are not logged in!';
            this.setModalVisible(true);
          } else if (response.status === 500) {
            this.state.errorMessage =
              'Server error! Restart the server then try again';
            this.setModalVisible(true);
          }
        })
        // Throw an error if one is to occur
        .catch((error) => {
          console.log(error);
        })
    );
  };

  render() {
    const { modalVisible } = this.state;

    return (
      <ContainerCentred>
        {/* Display a modal element to show alerts for the user */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);
          }}
        >
          <ModalContainer>
            <ModalView>
              <BodyText>{this.state.errorMessage} </BodyText>
              <PrimaryButton
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <ButtonText>{'OK'}</ButtonText>
              </PrimaryButton>
            </ModalView>
          </ModalContainer>
        </Modal>

        <PrimaryButton onPress={() => this.logout()}>
          <ButtonText>LOG OUT</ButtonText>
        </PrimaryButton>
      </ContainerCentred>
    );
  }
}

export default LogoutScreen;
