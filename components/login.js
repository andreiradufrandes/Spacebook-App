import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container,
  Label,
  PrimaryButton,
  Center,
  ButtonText,
} from '../styles.js';

// TODO
// add isLoading
// change default email and password
// delete console logs
// Comment
// check email check

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'andreifrandes@mmu.ac.uk', // change
      password: 'andreifrandes', // change
      // modalVisible: true,
      modalVisible: false,
    };
  }

  // Add a toggle function to set the visibility for the user alerts
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  login = async () => {
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
          // Add error
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
        console.log(responseJson);
        console.log('token is ' + responseJson.token);
        // Store the users details in Async library to be used thourghout the ap
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
    const { modalVisible } = this.state;

    return (
      <View style={styles.container}>
        {/* <View style={styles.centeredView}> */}
        <View>
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
                <Text style={styles.modalText}>{this.state.errorMessage} </Text>
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

        <Label>Email:</Label>
        <TextInput
          style={styles.input}
          placeholder="email"
          maxLength="256"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <Label>Password:</Label>

        <TextInput
          style={styles.input}
          placeholder="password"
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
          maxLength="16"
        />

        <Button
          style={styles.Button}
          title="LOGIN"
          onPress={() => this.login()}
        />

        <Button
          style={styles.Button}
          title="Sign up page"
          onPress={() => this.props.navigation.navigate('Signup')}
        />
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
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
