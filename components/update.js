import React, { Component } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabRouter } from '@react-navigation/native';
import {
  Container,
  Label,
  PrimaryButton,
  Center,
  ButtonText,
  Title,
} from '../styles.js';
/*

Left TODO:
   - update so that it check the names are correct and NOT numbers, code, etc
   - display the right message 
   - check the details are correct
   - if the email exists in the database it will give you an error
   - display exactly which input is incorrect
*/

class UpdateScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      origin_first_name: '',
      origin_last_name: '',
      origin_email: '',
      first_name: '',
      last_name: '',
      email: '',
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  // move from here to the import
  checkName(name) {
    if (!/[^a-zA-Z]/.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  getUserInfo = async () => {
    const userId = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');
    console.log(userId); // delete
    console.log(value); // delete

    return fetch('http://localhost:3333/api/1.0.0/user/' + userId, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        // save the users info inside the state
        this.setState({
          isLoading: false, // meaning it finished and now you can display it
          // Update the original user details to be used for checking against the new ones
          origin_first_name: responseJson.first_name,
          origin_last_name: responseJson.last_name,
          origin_email: responseJson.email,
        }),
          console.log(this.state.userInfo);
        console.log('Details after the getUserInfo');
        console.log(this.state.origin_first_name);
        console.log(this.state.origin_last_name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateDetails = async () => {
    let firstNameCheck = this.checkName(this.state.first_name);
    let lastNameCheck = this.checkName(this.state.last_name);

    console.log('Checking names: is firstname only letters');
    console.log(this.checkName(this.state.first_name));
    console.log('Checking names: is lastname only letters');
    console.log(this.checkName(this.state.last_name));

    // Check if the names entered are correct, and only send the request if they dont containt characters that are not letters
    if (firstNameCheck && lastNameCheck) {
      const userId = await AsyncStorage.getItem('@id');
      const value = await AsyncStorage.getItem('@session_token');

      // Only update the user details if they contains letters only

      let to_send = {};

      if (
        this.state.first_name != this.state.origin_first_name &&
        this.state.first_name != ''
      ) {
        to_send['first_name'] = this.state.first_name;
      }
      // if (this.state.last_name != this.state.origin_last_name){
      if (
        this.state.last_name != this.state.origin_last_name &&
        this.state.last_name != ''
      ) {
        to_send['last_name'] = this.state.last_name;
      }

      if (
        this.state.email != this.state.origin_email &&
        this.state.email != ''
      ) {
        to_send['email'] = this.state.email;
      }

      // check the string we're sending
      console.log(JSON.stringify(to_send));

      return fetch('http://localhost:3333/api/1.0.0/user/' + userId, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'X-Authorization': value,
        },
        body: JSON.stringify(to_send),
      })
        .then((response) => {
          console.log('User details updated');
          this.props.navigation.navigate('Profile', {
            user_id: userId,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('WARNING: Incorrect input');
      // TODO
      // ADD POPUP SAYING WRONG INPUT
    }
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
    } else {
      return (
        <View>
          <Title>Enter the details you wish you change</Title>
          <Label>First name:</Label>
          <TextInput
            placeholder="Enter first name"
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
            maxLength="50"
          />
          <Label>Last name:</Label>
          <TextInput
            placeholder="Enter last name"
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
            maxLength="50"
          />
          <Label>Email:</Label>
          <TextInput
            maxLength="256"
            placeholder="Enter email adress"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />

          <Button title="Submit" onPress={() => this.updateDetails()} />
        </View>
      );
    }
  }
}
export default UpdateScreen;
