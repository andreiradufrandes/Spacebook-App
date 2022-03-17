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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabRouter } from '@react-navigation/native';
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
  Title,
} from '../styles.js';
import { checkName } from './functions';
/*

Left TODO:
   - update so that it check the names are correct and NOT numbers, code, etc
   - display the right message 
   - check the details are correct
   - if the email exists in the database it will give you an error
   - display exactly which input is incorrect
   - maybe change get user info
   - change the 400 response code after checking the correct email
   - check finished code examplle for login containing SCROLLVIEW 
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
      modalVisible: false,
    };
  }
  // Add a toggle function to set the visibility for the user alerts
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  componentDidMount() {
    this.getUserInfo();
  }

  // // move from here to the import
  // checkName(name) {
  //   if (!/[^a-zA-Z]/.test(name)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

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
    let firstNameCheck;
    let lastNameCheck;
    // Check if the input has been changed
    if (this.state.first_name == '') {
      firstNameCheck = true;
    } else {
      firstNameCheck = checkName(this.state.first_name);
    }

    if (this.state.last_name == '') {
      lastNameCheck = true;
    } else {
      lastNameCheck = checkName(this.state.lastNameCheck);
    }

    // Create an error for the user to inform them the first or second name is incorrect
    if ((firstNameCheck && lastNameCheck) == false) {
      this.state.errorMessage =
        'First or last name incorrect! Make sure you use only letters.';
      this.setModalVisible(true);
      return null;
    } else {
      // Store the user's details to be userd in the networking requests
      const userId = await AsyncStorage.getItem('@id');
      const value = await AsyncStorage.getItem('@session_token');

      // Only update the user details if they contains letters only
      let to_send = {};

      // Check the details provided by the user against their previous details, and only update the ones that have been changed
      if (
        this.state.first_name != this.state.origin_first_name &&
        this.state.first_name != ''
      ) {
        to_send['first_name'] = this.state.first_name;
      }
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

      // DELETE
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
          console.log('responseCode: ', response.status);
          if (response.status === 200) {
            this.state.errorMessage = 'Details updated successfully!';
            this.setModalVisible(true);
            this.props.navigation.navigate('Profile', {
              user_id: userId,
            });
          } else if (response.status === 400) {
            this.state.errorMessage =
              'This might be because the email you are trying to use is already assigned to another account, or the email provided is incorrect';
            this.setModalVisible(true);
          } else if (response.status === 401) {
            this.state.errorMessage =
              'Unauthorised! Try logging in again to make sure the right details are sent to the server.';
            this.setModalVisible(true);
          } else if (response.status === 403) {
            this.state.errorMessage =
              'Forbidden! You can only update your own details.';
            this.setModalVisible(true);
          } else if (response.status === 500) {
            this.state.errorMessage =
              'Server error! Restart the server then try again.';
            this.setModalVisible(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  render() {
    const { modalVisible } = this.state;

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
        <ContainerCentred>
          {/* <View style={styles.loginBox}> */}
          <BoxContainer>
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

            <Title>Update profile</Title>
            <Label>First name:</Label>
            <Input
              placeholder="Enter first name"
              onChangeText={(first_name) => this.setState({ first_name })}
              value={this.state.first_name}
              maxLength="50"
            ></Input>
            <Label>Last name:</Label>
            <Input
              placeholder="Enter last name"
              onChangeText={(last_name) => this.setState({ last_name })}
              value={this.state.last_name}
              maxLength="50"
            ></Input>
            <Label>Email:</Label>
            <Input
              maxLength="256"
              placeholder="Enter email adress"
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            ></Input>

            <PrimaryButton onPress={() => this.updateDetails()}>
              <ButtonText>SUBMIT</ButtonText>
            </PrimaryButton>
          </BoxContainer>
          {/* </View> */}
        </ContainerCentred>
      );
    }
  }
}
export default UpdateScreen;

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
