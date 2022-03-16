import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  Button,
  View,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
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
    // Add an event listener to check if the user is logged in everytime they navigate to the logout page
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
      <Container>
        {/* <View style={styles.loginBox}> */}
        <BoxContainer>
          <View style={styles.centeredView}>
            {/* Add a component to display messages for the user */}
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

          {/* Add a button to log the user out  */}
          {/* <Button title="Logout" onPress={() => this.logout()} /> */}
          <PrimaryButton onPress={() => this.logout()}>
            <ButtonText>LOG OUT</ButtonText>
          </PrimaryButton>
        </BoxContainer>
      </Container>
    );
  }
}

export default LogoutScreen;

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
