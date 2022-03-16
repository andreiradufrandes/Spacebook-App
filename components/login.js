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
  ButtonContainer,
  Input,
  BoxContainer,
  Title,
  ContainerCentred,
} from '../styles.js';
import { greaterThan } from 'react-native-reanimated';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'andreifrandes@mmu.ac.uk', // change
      password: 'andreifrandes', // change
      modalVisible: false,
    };
  }

  // Add a toggle function to set the visibility for the user alerts
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

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
        // Check if the request was successful and log the user in if it was
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
                  <Text style={styles.modalText}>
                    {this.state.errorMessage}{' '}
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
          </View>
          {/* Display the instructions and buttons for th user to log in */}
          {/* <Label>Email:</Label>
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
          /> */}
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
          {/* 
          <View style={styles.ButtonContainer}>
            <Button
              style={styles.Button}
              title="LOGIN"
              onPress={() => this.login()}
            />

            
            <Button
              style={styles.Button}
              title="SIGN UP PAGE"
              onPress={() => this.props.navigation.navigate('Signup')}
            />
          </View> */}

          {/* <View style={styles.ButtonContainer}> */}
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

          {/* </View> */}
        </BoxContainer>
        {/* </View> */}
      </ContainerCentred>
      // </View>
    );
  }
}

export default LoginScreen;
// Dimension of he screen

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'column',
    backgroundColor: '#520f9A', // remove
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'space-between',
    minHeight: '100%',
    minHeight: '100vh',
  },
  loginBox: {
    // flex: 1,
    // height: '40%',

    width: '80%',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    maxWidth: 500,
    backgroundColor: '#ffffff',
  },

  input: {
    backgroundColor: '#ffffff',

    height: 51,
    // // flex: 1,
    padding: 8,
    // marginBottom: 20,
    marginBottom: '20px',
    borderWidth: 2,
    borderColor: 'black',
  },
  ButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Button: {
    marginBottom: '10px',
  },

  // All of this is modal
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
