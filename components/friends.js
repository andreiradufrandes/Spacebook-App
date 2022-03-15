import React, { Component } from 'react';
import { View, Text, Button, ScrollView, FlatList } from 'react-native';
import { Title } from '../styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    // Set the state to store a variable which checks if the component is ready to render and another one to store the user's friend
    this.state = {
      isLoading: true,
      friendsList: [],
    };
  }

  componentDidMount() {
    this.getListOfFriends();
  }

  // Create a function to send a request to the API and get back the list of friends for a given user
  getListOfFriends = async () => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID be able to get that user's list of friends
    const value = await AsyncStorage.getItem('@session_token');
    const userId = this.props.route.params.user_id;

    // Send a fetch request to get the user's list of friends
    return (
      fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/friends', {
        headers: {
          'X-Authorization': value,
        },
      })
        // Check the response code to see if the request was successful, and return it as a json object if it was, or throw and error if it was not
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw 'Something went wrong';
          }
        })
        // If the request is successful, store the list of friends inside the state, to be displayed later
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            friendsList: responseJson,
          });
        })
        // Throw an error to inform the user there was a problem if the requet was unsuccessful
        .catch((error) => {
          console.log(error);
        })
    );
  };

  render() {
    // Check if the component is still loading, and render a message for the user to let them know the page is loading
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
      // If the necessary request have been completed, render the list of friends for the user
    } else {
      return (
        // Wrap the contents in a scrollview to allow the ability to scroll when the components are bigger than the screen
        <ScrollView>
          <Title>Friends list</Title>
          <View>
            {/* Get the user's friends list and display it */}
            <FlatList
              data={this.state.friendsList}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => (
                <View>
                  {/* Display the first and second name of a given friend  */}
                  <Text>
                    {item.user_givenname} {item.user_familyname}
                  </Text>
                  {/* Add a button to allow the user to visit their friend's profile */}
                  <Button
                    title="Visit user's profile"
                    onPress={() =>
                      this.props.navigation.navigate('Profile', {
                        user_id: item.user_id,
                      })
                    }
                  />
                </View>
              )}
            />
          </View>
        </ScrollView>
      );
    }
  }
}

export default FriendsScreen;
