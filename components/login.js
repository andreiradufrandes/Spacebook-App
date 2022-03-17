import React, { Component } from 'react';
import { Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container,
  Label,
  PrimaryButton,
  ButtonText,
  ButtonContainer,
  Input,
  BoxContainer,
  Title,
  ContainerCentred,
  ModalContainer,
  ModalView,
  BodyText,
} from '../styles.js';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'andreifrandes@mmu.ac.uk',
      password: 'andreifrandes',
      modalVisible: false,
    };
  }

  // Add a toggle function to set the visibility for the user alerts
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  // Add a function to checks the users's details
  login = async () => {
    // Send a request to the server to log the user in
    return (
      fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 400) {
            // Display a message for the user informing them that the emai and password they used is wrong
            this.state.errorMessage = 'Invalid email or password! Try again';
            this.setModalVisible(true);
            throw 'Invalid email or password';
          } else if (response.status === 500) {
            this.state.errorMessage =
              'Server error! Restart the server then try again';
            this.setModalVisible(true);
          }
        })
        .then(async (responseJson) => {
          // Once logged in store the users token and id to be used throughtout the app for authorisation and requests
          await AsyncStorage.setItem('@session_token', responseJson.token);
          await AsyncStorage.setItem('@id', responseJson.id);
          // Once the user's details have been stored, navigate them to the main page
          this.props.navigation.navigate('Main');
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
      // <View style={styles.container}>
      <ContainerCentred>
        {/* <View style={styles.loginBox}> */}
        <BoxContainer>
          {/* Add a component to display messages for the user when accepting and decling friends requests */}
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
            {/* </View> */}
          </Modal>

          <Title>Login</Title>
          <Label>Email:</Label>
          <Input
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            maxLength="256"
          ></Input>

          <Label>Password:</Label>
          <Input
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry={true}
            maxLength="16"
          ></Input>

          <ButtonContainer>
            <PrimaryButton onPress={() => this.login()}>
              <ButtonText>LOGIN</ButtonText>
            </PrimaryButton>

            <PrimaryButton
              onPress={() => this.props.navigation.navigate('Signup')}
            >
              <ButtonText>SIGN UP</ButtonText>
            </PrimaryButton>
          </ButtonContainer>
        </BoxContainer>
      </ContainerCentred>
    );
  }
}

export default LoginScreen;
