import React, { Component } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

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
    };
  }

  // Signup, passing the users details in
  signup = () => {
    // TODO
    // ADD PASSWORD CHECK AND EMAIL CHECK
    // ADD USABILITY OF SPACE
    // Add condition that checks input NOT empty
    const firstNameCheck = checkName(this.state.first_name);
    const lastNameCheck = checkName(this.state.last_name);

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
      console.log('incorrect input! try again!');
    }
  };

  // Prolly best to delete from here
  componentDidMount() {
    console.log('mounted');
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
