import React, { Component } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendsList: [],
    };
  }
  // get friends list
  componentDidMount() {
    console.log('Friends page');
    this.getListOfFriends();
  }

  //   getListOfFriends = async () => {
  //     const value = await AsyncStorage.getItem("@session_token");
  //     const userId = await AsyncStorage.getItem("@id");
  //     console.log(value);

  //     return fetch(
  //       "http://localhost:3333/api/1.0.0/user/" + userId + "/friends",
  //       {
  //         headers: {
  //           "X-Authorization": value,
  //         },
  //       }
  //     )
  //       .then((response) => {
  //         if (response.status === 200) {
  //           return response.json();
  //         } else {
  //           throw "Something went wrong";
  //         }
  //       })
  //       .then((responseJson) => {
  //         this.setState({
  //           isLoading: false,
  //           friendsList: responseJson,
  //         }),
  //           console.log("friends list :" + this.state.friendsList); // delete later
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
  getListOfFriends = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const userId = this.props.route.params.user_id;

    // display that person's friend NOT mine
    console.log(value);

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + userId + '/friends',
      {
        headers: {
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendsList: responseJson,
        }),
          console.log(this.state.friendsList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
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
        //   maybe delete the style AND the container
        <View>
          <FlatList
            // ADD THE POSTS
            // POPULATE WITH POST CUSTOME COMPONENT
            data={this.state.friendsList}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
              <View>
                {/* <Text> {item.text} </Text> */}
                <Text>
                  {item.user_givenname} {item.user_familyname}
                </Text>
                <Button
                  title="Visit user's profile"
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
        </View>
      );
    }
  }
}

export default FriendsScreen;
// post id 58 , user id: 41
