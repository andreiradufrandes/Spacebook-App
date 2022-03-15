import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkLettersAndSpaces } from './functions';

// when you create name it can

import {
  Container,
  PrimaryButton,
  Center,
  TextBox,
  ButtonText,
  Title,
  Label,
} from '../styles.js';
/*
TODO 
- Display only if the list is not empty of addPost

- fix the search to show LIMITED number of searches 
- change profile component name

*/

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      searchResults: [],
      modalVisible: false,
      errorMessage: '',
      searchLimit: 5,
      initialOffset: 5,
      searchOffset: -5,
    };
  }
  // Add a toggle function to set the visibility for the user alerts
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  //   ADD LIMIT TO THE FETCH RESULT, AND MAKE IT LOOK LIKE THE REAL ONE
  // searchName = async () => {
  //   // If the search box is not empty, execute the code looking for the person
  //   if (!(this.state.searchTerm === '')) {
  //     const value = await AsyncStorage.getItem('@session_token');

  //     const serachTermCheck = checkLettersAndSpaces(this.state.searchTerm);

  //     // Check that the user input contain letters only, and no numbers or special characters
  //     if (!serachTermCheck) {
  //       this.state.errorMessage =
  //         'Incorrect input, the name can only contain letters, no numbers or  special characters. Try again!';
  //       this.setModalVisible(true);
  //     } else {
  //       return fetch(
  //         'http://localhost:3333/api/1.0.0/search?q=' + this.state.searchTerm,
  //         {
  //           headers: {
  //             'X-Authorization': value,
  //           },
  //         }
  //       )
  //         .then((response) => {
  //           console.log('----Response code------: ', response.status);
  //           if (response.status === 200) {
  //             return response.json();
  //           } else if (response.status === 400) {
  //             this.state.errorMessage =
  //               'Bad request! Make sure you have use only letters inside the search box!';
  //             this.setModalVisible(true);
  //           } else if (response.status === 401) {
  //             this.state.errorMessage =
  //               'Unauthorised! Make sure you are logged in, and then try again!';
  //             this.setModalVisible(true);
  //           } else if (response.status === 500) {
  //             this.state.errorMessage =
  //               'Server error! Restart the server then try again';
  //             this.setModalVisible(true);
  //           }
  //         })
  //         .then((responseJson) => {
  //           this.setState({
  //             isLoading: false,
  //             searchResults: responseJson,
  //           });
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //   } else {
  //     this.state.errorMessage =
  //       "Search box can not be empty! Add person's name and try again";
  //     this.setModalVisible(true);
  //   }
  // };

  //   ADD LIMIT TO THE FETCH RESULT, AND MAKE IT LOOK LIKE THE REAL ONE
  searchName = async (direction) => {
    console.log(direction);
    // If the search box is not empty, execute the code looking for the person
    if (!(this.state.searchTerm === '')) {
      const value = await AsyncStorage.getItem('@session_token');
      const serachTermCheck = checkLettersAndSpaces(this.state.searchTerm);

      // currect offset - or pluse the offset
      let directionOffest = this.state.searchOffset;
      // If you want to see the following results, offset stays positive
      if (direction == 'nextResults') {
        // Direction forwards, therefore offset will be positive
        directionOffest = this.state.initialOffset;
        console.log('next results');
        console.log('directionOffest: ', directionOffest);
      }
      // Previous results want to be displayed therefor directionOffset is negative
      else if (direction == 'previousResults') {
        directionOffest = directionOffest - this.state.initialOffset;
        console.log('previous results');
        console.log('directionOffest: ', directionOffest);
      }

      // Then move in that direction IF

      // increase offset
      // 1. if offset 0
      // First time it runs it will be -5 + 5 = 0

      // Check that you are not on the last page OR the first one  when you go back
      // check IF it is the first round
      // if it is not the first turn
      if (this.state.searchOffset != -5) {
        if (this.state.searchResults.length >= this.state.searchLimit) {
        }

        // if it is the first turn
      } else {
        this.state.searchOffset += this.state.searchLimit;
      }

      // Check the limit to see if you've reached the end

      // Increase offset at each turn to display the right pagination
      this.state.searchOffset += this.state.searchLimit;

      //    dont increase
      // otherwise
      // increase BY limit each turn
      // 2. If you passed it and reached the end of list
      //  STOP
      // by

      // Check that the user input contain letters only, and no numbers or special characters
      if (!serachTermCheck) {
        this.state.errorMessage =
          'Incorrect input, the name can only contain letters, no numbers or  special characters. Try again!';
        this.setModalVisible(true);
      } else {
        return fetch(
          'http://localhost:3333/api/1.0.0/search?q=' +
            this.state.searchTerm +
            '&limit=' +
            this.state.searchLimit +
            '&offset=' +
            this.state.searchOffset,
          {
            headers: {
              'X-Authorization': value,
            },
          }
        )
          .then((response) => {
            console.log('----Response code------: ', response.status);
            if (response.status === 200) {
              return response.json();
            } else if (response.status === 400) {
              this.state.errorMessage =
                'Bad request! Make sure you have use only letters inside the search box!';
              this.setModalVisible(true);
            } else if (response.status === 401) {
              this.state.errorMessage =
                'Unauthorised! Make sure you are logged in, and then try again!';
              this.setModalVisible(true);
            } else if (response.status === 500) {
              this.state.errorMessage =
                'Server error! Restart the server then try again';
              this.setModalVisible(true);
            }
          })
          .then((responseJson) => {
            this.setState({
              isLoading: false,
              searchResults: responseJson,
            });
            console.log(
              'searchResults length:',
              this.state.searchResults.length
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      this.state.errorMessage =
        "Search box can not be empty! Add person's name and try again";
      this.setModalVisible(true);
    }
  };

  render() {
    const { modalVisible } = this.state;

    return (
      <Container>
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

        <Button
          title="take me to Andrei's profile"
          onPress={() =>
            this.props.navigation.navigate('Profile', {
              user_id: 17,
            })
          }
        />

        <Title>Search for people or friends</Title>

        <Label>Enter user's name:</Label>
        <TextBox
          placeholder="user's name"
          onChangeText={(searchTerm) => this.setState({ searchTerm })}
          value={this.state.searchTerm}
          maxLength="50"
        ></TextBox>

        {/* <Button title="search" onPress={() => this.searchName()} /> */}
        {/* Trial for primary button */}
        <Center>
          <PrimaryButton onPress={() => this.searchName('initialResults')}>
            <ButtonText>SEARCH</ButtonText>
          </PrimaryButton>
        </Center>

        <FlatList
          data={this.state.searchResults}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.user_givenname} {item.user_familyname}
              </Text>
              <Button
                title="Visit Profile"
                onPress={() =>
                  this.props.navigation.navigate('Profile', {
                    user_id: item.user_id,
                  })
                }

                //   this.props.navigation.navigate("Profile", userId); // can probably get tid of this later
              />
            </View>
          )}
        />

        <Center>
          {/* plus limin  */}
          <PrimaryButton onPress={() => this.searchName('previousResults')}>
            <ButtonText>Previous results</ButtonText>
          </PrimaryButton>
        </Center>
        <Center>
          {/* minus limit  */}
          <PrimaryButton onPress={() => this.searchName('nextResults')}>
            <ButtonText>More results</ButtonText>
          </PrimaryButton>
        </Center>

        {/* {true ? <Button title="Hi" /> : <Button title="Bye" />} */}
      </Container>
    );
  }
}

export default SearchScreen;

// delete later
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
