import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { FlatList } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Todo
// Flatlist of friends
// buttons for going to their profile

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
    console.log("Friends page");
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
    const value = await AsyncStorage.getItem("@session_token");
    const userId = await AsyncStorage.getItem("@id");
    console.log(value);

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + userId + "/friends",
      {
        headers: {
          "X-Authorization": value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw "Something went wrong";
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    } else {
      return (
        //   maybe delete the style AND the container
        <View>
          <Text>List of friends</Text>
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
                    this.props.navigation.navigate("Profile", item.user_id)
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
