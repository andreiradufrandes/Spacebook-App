import React, { Component } from 'react';
import { View, Text, ScrollView, Modal } from 'react-native';
import {
  PrimaryButton,
  ButtonText,
  ButtonContainer,
  ContainerCentred,
  Title,
  FriendBox,
  BodyText,
  ModalContainer,
  ModalView,
  LoadingContainer,
} from '../styles.js';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendsRequests: [],
      likes: [],
      friendsList: [],
      modalVisible: false,
    };
  }
  // Add a toggle function to set the visibility of the alerts, to be be used during netwroking requests displaying allerts for the user
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  componentDidMount() {
    // Add an event listener to refresh the friend requests when navigating to the notificaitons screen
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getFriendRequests();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // Add a request to get the friend requests for a given user

  getFriendRequests = async () => {
    // Get the user's token to be used for authorising the fetch request
    const value = await AsyncStorage.getItem('@session_token');

    return (
      fetch('http://localhost:3333/api/1.0.0/friendrequests', {
        headers: {
          'X-Authorization': value,
        },
      })
        // Return theresults from the server and check if the request was successful
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw 'Something went wrong';
          }
        })
        // If successful, store the friend request list in the state to be used later
        .then((responseJson) => {
          this.setState({
            friendsRequests: responseJson,
            isLoading: false,
          });
        })
        // Throw an erro in the console if any occured during the request
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Add a function to accept a friend request
  acceptFriendRequest = async (id) => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID be able to like the right post
    const value = await AsyncStorage.getItem('@session_token');
    return (
      fetch('http://localhost:3333/api/1.0.0/friendrequests/' + id, {
        method: 'post',
        headers: {
          'X-Authorization': value,
        },
      })
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          // Check if the request was successful and inform the user the friend request was accepted
          if (response.status === 200) {
            // Refresh the page to reflect that the request was accepted
            this.getFriendRequests();
            // Display a message to the user informing them the request was accepted
            this.state.errorMessage = 'Frind request accepted!';
            this.setModalVisible(true);
            // Display differnt error alerts for the user if the netwroking request was unsuccessful
          } else if (response.status === 404) {
            this.state.errorMessage =
              'Something went wront! Try logging out and back in before attempting it again';
            this.setModalVisible(true);
          } else if (response.status === 401) {
            this.state.errorMessage =
              'Unauthorised! Try logging out and then back in before attempting it again!';
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

  // Add a function that declines a friend request when the user click a button
  declineFriendRequest = async (id) => {
    // Get the user's token to be used for authorising the fetch request
    const value = await AsyncStorage.getItem('@session_token');
    // Send a request to delete the given friend request
    return (
      fetch('http://localhost:3333/api/1.0.0/friendrequests/' + id, {
        method: 'delete',
        headers: {
          'X-Authorization': value,
        },
      })
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          // Check if the friend request was deleted successfully and inform the user if it was
          if (response.status === 200) {
            this.getFriendRequests();
            this.state.errorMessage = 'Friend request declined!';
            this.setModalVisible(true);
            // Display different alerts for the user if the request was unssuccesful
          } else if (response.status === 404) {
            this.state.errorMessage =
              'Something went wront! Try logging out and back in before attempting it again';
            this.setModalVisible(true);
          } else if (response.status === 401) {
            this.state.errorMessage =
              'Unauthorised! Try logging out and then back in before attempting it again!';
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
    // Check if the component is still loading, and render a message for the user to let them know the page is loading
    if (this.state.isLoading) {
      return (
        <LoadingContainer>
          <BodyText>Loading..</BodyText>
        </LoadingContainer>
      );
      // Display the friend requests once they have once they have been store inside the state
    } else {
      return (
        <ContainerCentred>
          <ScrollView>
            <Title>Friend requests</Title>

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

            <View>
              {/* Display the list of friends requests */}
              <FlatList
                data={this.state.friendsRequests}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => (
                  <FriendBox>
                    <BodyText>
                      Friend request from: {item.first_name} {item.last_name}
                    </BodyText>

                    <ButtonContainer>
                      <PrimaryButton
                        onPress={() => this.declineFriendRequest(item.user_id)}
                      >
                        <ButtonText>{'DECLINE'}</ButtonText>
                      </PrimaryButton>

                      <PrimaryButton
                        onPress={() =>
                          this.props.navigation.navigate('Profile', {
                            user_id: item.user_id,
                          })
                        }
                      >
                        <ButtonText>{'PROFILE'}</ButtonText>
                      </PrimaryButton>

                      <PrimaryButton
                        onPress={() => {
                          this.acceptFriendRequest(item.user_id);
                          this.props.navigation.navigate('Profile', {
                            user_id: item.user_id,
                          });
                        }}
                      >
                        <ButtonText>{'ACCEPT'}</ButtonText>
                      </PrimaryButton>
                    </ButtonContainer>
                  </FriendBox>
                )}
              />
            </View>
          </ScrollView>
        </ContainerCentred>
      );
    }
  }
}

export default NotificationsScreen;
