import React, { Component } from 'react';
import { Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Label,
  PrimaryButton,
  ButtonText,
  Input,
  BoxContainer,
  ContainerCentred,
  Title,
  LoadingContainer,
  BodyText,
  ModalView,
  ModalContainer,
} from '../styles.js';
import { checkLettersAndSpaces } from './functions';

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
      errorMessage: '',
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

  // Add a function to get he users information from the server to be displayed on their profile later
  getUserInfo = async () => {
    // Get the user's token and id to be used for authorising the fetch request
    const userId = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');

    // Send a fetch request to the server to get the users details
    return (
      fetch('http://localhost:3333/api/1.0.0/user/' + userId, {
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
        // Check if the requst was successfu l and return the results, otherwise trow an error
        .then((responseJson) => {
          // save the users info inside the state
          this.setState({
            isLoading: false, // meaning it finished and now you can display it
            // Save the user's details inside the state
            origin_first_name: responseJson.first_name,
            origin_last_name: responseJson.last_name,
            origin_email: responseJson.email,
          });
        })
        // Display the errors in the console if any occure
        .catch((error) => {
          console.log(error);
        })
    );
  };

  updateDetails = async () => {
    // Set 2 flag variables for checking if the user's input is corect and if they are changing their details
    let firstNameCharactersCheck = false;
    let firstNameChangeFlag = true;

    // If the input is empty the user is not changing their first name
    if (this.state.first_name == '') {
      firstNameChangeFlag = false;
    } else {
      // If they are changing ther details, check their input for letters and symbols
      firstNameCharactersCheck = checkLettersAndSpaces(this.state.first_name);
    }

    // Alert the user if their input was incorrect
    if (firstNameChangeFlag && !firstNameCharactersCheck) {
      this.state.errorMessage =
        'First name incorrect! Names can only contain letters!';
      this.setModalVisible(true);
      // Stop the function if there is an error
      return null;
    }

    // Set 2 flag variables for checking if the user's input is corect and if they are changing their details
    let lastNameCharactersCheck = false;
    let lastNameChangeFlag = true;

    // If the input is empty the user is not changing their first name
    if (this.state.last_name == '') {
      lastNameChangeFlag = false;
    } else {
      // If they are changing ther details, check their input for letters and symbols
      lastNameCharactersCheck = checkLettersAndSpaces(this.state.last_name);
    }

    // Alert the user if their input was incorrect
    if (lastNameChangeFlag && !lastNameCharactersCheck) {
      console.log('Last name changed incorrecly! try again');
      this.state.errorMessage =
        'Last name incorrect! Names can only contain letters!';
      this.setModalVisible(true);
      // Stop the function if the input is incorrect
      return null;
    }

    // Initialise an empty object to store the user's details in
    let to_send = {};

    // Add the first name to the object to be sent to the server, if any was entered
    if (firstNameChangeFlag) {
      to_send['first_name'] = this.state.first_name;
    }
    // Add the first name to the object to be sent to the server, if any was entered
    if (lastNameChangeFlag) {
      to_send['last_name'] = this.state.last_name;
    }

    // See if the email has been changed, and update it if it has
    if (this.state.email != this.state.origin_email && this.state.email != '') {
      to_send['email'] = this.state.email;
    }

    // Check if the user is submitting any details and alert them if they forgot to add the details
    if (Object.keys(to_send).length == 0) {
      this.state.errorMessage =
        'No new details have been added! You need to add your new details first';
      this.setModalVisible(true);
      return null;
    }

    // Get the user's token and id to be used for authorising the fetch request
    const userId = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');

    // Send a request to the server to send the user's new details to the server
    return (
      fetch('http://localhost:3333/api/1.0.0/user/' + userId, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'X-Authorization': value,
        },
        body: JSON.stringify(to_send),
      })
        .then((response) => {
          // Check if the change was cussesful and let the user know. Afterwards direct them to the profile page
          if (response.status === 200) {
            this.state.errorMessage = 'Details updated successfully!';
            this.setModalVisible(true);
            this.props.navigation.navigate('Profile', {
              user_id: userId,
            });
            // Display different alerts for the user if the netwroking request was unsuccessful, advising them on what the issue is
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
        // Display the errors in the console if any occure
        .catch((error) => {
          console.log(error);
        })
    );
  };

  render() {
    const { modalVisible } = this.state;

    if (this.state.isLoading) {
      return (
        <LoadingContainer>
          <BodyText>Loading..</BodyText>
        </LoadingContainer>
      );
    } else {
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
            </Modal>

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
        </ContainerCentred>
      );
    }
  }
}
export default UpdateScreen;
