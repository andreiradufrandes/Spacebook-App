import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';

// Import helper functions
import { checkName, checkPassword } from './functions';
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
      first_name: 'defaultName',
      last_name: 'defaultLastName',
      email: 'defaultemail@mmu.ac.uk',
      password: 'defaultPassword',
      modalVisible: false,
      errorMessage: '',
    };
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  // Signup, passing the users details in
  signup = () => {
    // TODO
    // ADD PASSWORD CHECK AND EMAIL CHECK
    // ADD USABILITY OF SPACE
    // Add condition that checks input NOT empty
    console.log('signup called');
    const firstNameCheck = checkName(this.state.first_name);
    const lastNameCheck = checkName(this.state.last_name);

    // This the line that makes it appear
    // onPress={() => this.setModalVisible(true)}

    // This makes it dissapear
    // onPress={() => this.setModalVisible(!modalVisible)}

    console.log('checkpassword: ', checkPassword(this.state.password));
    // If the inputs are correct, send them to the user
    // else, display toast error
    if (firstNameCheck && lastNameCheck) {
      let user_details = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
      };

      console.log(user_details);
      fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user_details),
      })
        // add error codes
        .then((response) => {
          Alert.alert('User added successfully'); // replace
          // navigate me to main
          this.props.navigation.navigate('Login');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // TODO
      // Add toast error
      // Empty the fiels
      this.state.error = 'error';
      console.log('incorrect input! try again!');
      // set the name of the error you wish to dispplay to the user

      this.state.errorMessage = 'Name or password incorrect! try again';
      // Display the error for the user
      this.setModalVisible(true);
    }
  };

  // Prolly best to delete from here
  componentDidMount() {
    console.log('mounted');
  }

  render() {
    const { modalVisible } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Modal code */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
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
                  <Text style={styles.textStyle}>Hide Modal</Text>
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
        <Label>Password instructions</Label>
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
