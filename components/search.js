import React, { Component } from 'react';
import { FlatList, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkLettersAndSpaces } from './functions';

// Import the styled components
import {
  Label,
  PrimaryButton,
  ButtonText,
  ButtonContainer,
  Input,
  ContainerCentred,
  Title,
  Header,
  Body,
  FriendBox,
  BodyText,
  ModalContainer,
  ModalView,
} from '../styles.js';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      previousSearchTerm: '',
      searchResults: [],
      modalVisible: false,
      errorMessage: '',
      searchLimit: 5,
      initialOffset: 5,
      offectCounter: 0,
      firstCycle: true,
      cycleToggler: true,
    };
  }
  // Add a toggle function to set the visibility for the user alerts
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  // Function to search for a user
  searchName = async (direction) => {
    // Toggle the loadign variable to display a loading message when the fetch request takes place
    this.state.isLoading = true;

    // Check if the user has entered any words to look for
    if (!(this.state.searchTerm === '')) {
      // add a variable to be used for getting the direction of the search, left or right
      let signedOffset = 0;
      // Store the user's token for authentification
      const value = await AsyncStorage.getItem('@session_token');
      const serachTermCheck = checkLettersAndSpaces(this.state.searchTerm);

      // Check that the search term only contains letters
      if (!serachTermCheck) {
        // Alert the user if their search term is incorrect
        this.state.errorMessage =
          'Incorrect input, the name can only contain letters, no numbers or  special characters. Try again!';
        this.setModalVisible(true);
      } else {
        // Check if the user wants to see the search results to teh left
        if (direction == 'previousResults' && this.state.offectCounter <= 0) {
          // Alert them if they are back to the first results
          this.state.errorMessage =
            'You have reached the first search results! you can only go forward from here';
          this.setModalVisible(true);
        } else {
          if (direction == 'previousResults') {
            // Set the offset variable to be negative, in order to decrese the offset when setting the search request
            signedOffset -= this.state.initialOffset;
            // set the toggle variable to ttrue to signal we have reached the first page
            this.state.firstCycle = true;
          } else {
            // Otherwise the user is going right(for more search results) and the signed offset becomes positive integer
            signedOffset = this.state.initialOffset;
          }

          // Check if the last mage has been reached
          if (
            this.state.searchResults.length < this.state.initialOffset &&
            !this.state.firstCycle
          ) {
            // Inform the user they have reached the last page
            this.state.errorMessage =
              'You have reached the last page of search results';
            this.setModalVisible(true);
          }
          //  otherwise continue to display more results
          else {
            this.state.firstCycle = false;
            this.state.offectCounter += signedOffset;
          }
        }
      }

      // Set the counter for the offset back to 0 if we are on the first page
      if (this.state.cycleToggler) {
        this.state.offectCounter = 0;
        this.state.cycleToggler = false;
      }

      // Check if we are looking for a new term, and flag it in the state if that is the case
      if (this.state.previousSearchTerm == '') {
        this.state.previousSearchTerm = this.state.searchTerm;
      } else {
        if (this.state.previousSearchTerm != this.state.searchTerm) {
          // If we are looking for a new term, reset teh counter
          this.state.offectCounter = 0;
          // Store the new term in the state to be used for checking next cycle
          this.state.previousSearchTerm = this.state.searchTerm;
          // set the toggle variable storing if it is the first cycle to true
          this.state.firstCycle = true;
        }
      }
      // Send a fetch request to the server to get back the results for a search
      return (
        fetch(
          'http://localhost:3333/api/1.0.0/search?q=' +
            this.state.searchTerm +
            '&limit=' +
            this.state.searchLimit +
            '&offset=' +
            this.state.offectCounter,
          {
            headers: {
              'X-Authorization': value,
            },
          }
        )
          // Return a promise and different messages for the user depending on if the request was successful or not
          .then((response) => {
            if (response.status === 200) {
              return response.json();
              // Display different alerts for the user if the netwroking request was unsuccessful, advising them on what the issue is
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
          // Store the results in the state to be displayed later
          .then((responseJson) => {
            this.setState({
              isLoading: false,
              searchResults: responseJson,
            });
          })
          // Display the errors in the console if any occured
          .catch((error) => {
            console.log(error);
          })
      );

      // Alert the user they forgot to enter a search term
    } else {
      this.state.errorMessage =
        "Search box can not be empty! Add person's name and try again";
      this.setModalVisible(true);
    }
  };

  render() {
    const { modalVisible } = this.state;

    return (
      <ContainerCentred>
        {/* Display a modal element to show alerts for the user */}
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

        <ScrollView>
          <Header>
            <Title>Search for people or friends</Title>
            <Label>Name:</Label>
            <Input
              placeholder="user's name"
              onChangeText={(searchTerm) => this.setState({ searchTerm })}
              value={this.state.searchTerm}
              maxLength="50"
            ></Input>

            <ButtonContainer>
              <PrimaryButton onPress={() => this.searchName('previousResults')}>
                <ButtonText>{'<'}</ButtonText>
              </PrimaryButton>
              <PrimaryButton onPress={() => this.searchName('initialResults')}>
                <ButtonText>SEARCH</ButtonText>
              </PrimaryButton>
              <PrimaryButton onPress={() => this.searchName('nextResults')}>
                <ButtonText>{'>'}</ButtonText>
              </PrimaryButton>
            </ButtonContainer>
          </Header>

          <Body>
            <FlatList
              data={this.state.searchResults}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => (
                <FriendBox>
                  <BodyText>
                    {item.user_givenname} {item.user_familyname}{' '}
                  </BodyText>
                  <PrimaryButton
                    onPress={() => {
                      console.log('userId=', item.user_id);
                      this.props.navigation.navigate('Profile', {
                        user_id: item.user_id,
                      });
                    }}
                  >
                    <ButtonText>{'PROFILE'}</ButtonText>
                  </PrimaryButton>
                </FriendBox>
              )}
            />
          </Body>
        </ScrollView>
      </ContainerCentred>
    );
  }
}

export default SearchScreen;
