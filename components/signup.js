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
import { checkName } from './functions';
import {
  Container,
  Label,
  PrimaryButton,
  Center,
  ButtonText,
} from '../styles.js';
// only navigate me to LOGIN PAGE if the request successfully

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

  // TODO
  // Add email check
  // add check to see if it is empty space
  signup = () => {
    const firstNameCheck = checkName(this.state.first_name);
    const lastNameCheck = checkName(this.state.last_name);
    // Check the password contains more than 5 characters
    const passwordCheck = this.state.password.length >= 5;

    console.log('first name chacek: ', firstNameCheck);
    console.log('correctpassword: ', passwordCheck);
    // Check if the first and second name contain letters only

    // Create an error for the user to inform them the first or second name is incorrect
    if ((firstNameCheck && lastNameCheck) == false) {
      this.state.errorMessage =
        'First or last name incorrect! Make sure you use only letters.';
      this.setModalVisible(true);
      return null;
      // I think return null and stop here
    } else if (passwordCheck == false) {
      this.state.errorMessage =
        'Password incorrect! Password must contain at least 4 characters.';
      this.setModalVisible(true);
      return null;
    } else {
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
      <View>
        {/* Modal code */}
        {/* TODO 
          replace following one with just view no styleing
        */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* <Text style={styles.modalText}>Hello World!</Text> */}
                {/* Display the erro you wish to display to the user */}
                <Text style={styles.modalText}>
                  Error: {this.state.errorMessage}{' '}
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => this.setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Ok</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          {/* <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => this.setModalVisible(true)}
          >
            <Text style={styles.textStyle}>Show Modal</Text>
          </Pressable> */}
        </View>

        <Label>First name:</Label>
        <TextInput
          placeholder="first_name"
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
          maxLength="50"
        />
        <Label>Last name:</Label>
        <TextInput
          placeholder="last_name"
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
          maxLength="50"
        />
        <Label>Email:</Label>
        <TextInput
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          maxLength="256"
        />
        <Label>Password:</Label>
        <TextInput
          placeholder="password"
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
          maxLength="16"
        />
        <Text>Password must contain at least 4 characters</Text>
        <Button
          title="Signup"
          onPress={() => this.signup()}
          // take me to login
        />
      </View>
    );
  }
}

export default SignupScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
