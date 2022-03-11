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
import {
  Container,
  Label,
  PrimaryButton,
  Center,
  ButtonText,
} from '../styles.js';

// add isLoading

// Delete this

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'andreifrandes@mmu.ac.uk', // change
      password: 'andreifrandes', // change
    };
  }

  login = async () => {
    console.log(JSON.stringify(this.state)); // delete later
    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw 'Invalid email or password';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        console.log('token is ' + responseJson.token);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@id', responseJson.id);
        // this.props.navigation.navigate("Practice");  // change this to main
        this.props.navigation.navigate('Main'); // change this to main
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={style.container}>
        <Label>Email:</Label>
        <TextInput
          style={style.input}
          placeholder="email"
          maxLength="256"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <Label>Password:</Label>
        <Label>TODO: add instructions for password</Label>
        <TextInput
          style={style.input}
          placeholder="password"
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
          maxLength="16"
        />
        <Button
          style={style.Button}
          title="LOGIN"
          onPress={() => this.login()}
        />

        <Button
          style={style.Button}
          title="Sign up page"
          onPress={() => this.props.navigation.navigate('Signup')}
        />
      </View>
    );
  }
}

export default LoginScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  input: {
    backgroundColor: '#edf7ff',
    borderRadius: 10,
    height: 50,
    // flex: 1,
    padding: 10,
    marginBottom: 20,
  },
  Button: {
    marginBottom: 50,
  },
});
