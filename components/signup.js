import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';

// Import helper functions
import { checkName, checkEmail, checkLettersAndSpaces } from './functions';
import {
  Container,
  Label,
  PrimaryButton,
  Center,
  ButtonText,
  ButtonContainer,
  Input,
  BoxContainer,
  ContainerCentred,
  ModalContainer,
  ModalView,
  BodyText,
} from '../styles.js';

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    // set default values to be replaced by the user's input
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      modalVisible: false,
      errorMessage: '',
    };
  }

  // Add a toggle function to set the visibility for the user alerts
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  signup = () => {
    const emailCheck = checkEmail(this.state.email);
    const firstNameCheck = checkLettersAndSpaces(this.state.first_name);
    const lastNameCheck = checkLettersAndSpaces(this.state.last_name);
    const passwordCheck = this.state.password.length > 5;

    console.log('first name chacek: ', firstNameCheck);
    console.log('correctpassword: ', passwordCheck);
    // Check if the first and second name contain letters only

    // Create an error for the user to inform them the first or second name is incorrect
    if (firstNameCheck == false) {
      this.state.errorMessage =
        'First name incorrect. The name an contain only letters!';
      this.setModalVisible(true);
      return null;
    } else if (lastNameCheck == false) {
      this.state.errorMessage =
        'Last name incorrect. The name an contain only letters!';
      this.setModalVisible(true);
      return null;
    } else if (passwordCheck == false) {
      this.state.errorMessage =
        'Password incorrect! Password must be greater than 5 characters.';
      this.setModalVisible(true);
      return null;
    } else if (emailCheck == false) {
      this.state.errorMessage = 'Email incorrect! try again.';
      this.setModalVisible(true);
      return null;
    }
    // If all the user's details are correct, send a request to the server to create e new user
    else {
      // User input is correct, set the details in a variable to be sent to the server
      let user_details = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
      };

      // Sent a request to the server with the details provided by the user to create a new account
      fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user_details),
      })
        // If the account was created successfully, navigate the user to the login page. Otherwise, display the appropriate error
        .then((response) => {
          // If the account was created successfully, inform the user and direct the mto the login page
          if (response.status === 201) {
            this.props.navigation.navigate('Login');
          } else if (response.status === 400) {
            this.state.errorMessage =
              ' This could be because there is already an account with your email. Try loggin in instead!';
            this.setModalVisible(true);
          } else if (response.status === 500) {
            this.state.errorMessage =
              'Server error! Restart the server then try again';
            this.setModalVisible(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  componentDidMount() {
    console.log('mounted');
  }

  render() {
    const { modalVisible } = this.state;
    return (
      <ContainerCentred>
        <BoxContainer>
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

          <Label>First name:</Label>
          <Input
            placeholder="first name"
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
            maxLength="100"
          ></Input>
          <Label>Last name:</Label>
          <Input
            placeholder="last name"
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
            maxLength="100"
          ></Input>
          <Label>Email:</Label>
          <Input
            placeholder="email"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            maxLength="256"
          ></Input>
          <Label>Password:</Label>
          <Input
            placeholder="password"
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry={true}
            maxLength="16"
          ></Input>
          <BodyText>(Password must contain greater than 5 characters)</BodyText>

          <ButtonContainer>
            <PrimaryButton onPress={() => this.signup()}>
              <ButtonText>SIGN UP</ButtonText>
            </PrimaryButton>

            <PrimaryButton
              onPress={() => this.props.navigation.navigate('Login')}
            >
              <ButtonText>LOGIN PAGE</ButtonText>
            </PrimaryButton>
          </ButtonContainer>
        </BoxContainer>
      </ContainerCentred>
    );
  }
}

export default SignupScreen;
