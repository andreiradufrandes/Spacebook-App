import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { FlatList } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
To implement 
- button for accepting request IF they're not my friend




*/

class NotificationsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendsRequests: [],
      likes: [],
      friendsList: [],
    };
  }

  componentDidMount() {
    console.log("Notifications page");
    this.getFriendRequests();
  }

  getFriendRequests = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    console.log(value);

    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      headers: {
        "X-Authorization": value,
      },
    })
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
          friendsRequests: responseJson,
        }),
          console.log(this.state.friendsRequests);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptFriendRequest = async (id) => {
    // how to get the exact id i need
    console.log(id);
    const value = await AsyncStorage.getItem("@session_token");
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id, {
      method: "post",
      headers: {
        "X-Authorization": value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // return response.json();
          this.getFriendRequests();
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  declineFriendRequest = async (id) => {
    // how to get the exact id i need
    console.log(id);
    const value = await AsyncStorage.getItem("@session_token");
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id, {
      method: "delete",
      headers: {
        "X-Authorization": value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("friend request deleted");
          this.getFriendRequests();
          //   return response.json();
        } else {
          throw "Something went wrong";
        }
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
        <View>
          <FlatList
            data={this.state.friendsRequests}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
              <View>
                <Text>
                  Friend request from {item.first_name} {item.last_name}
                </Text>
                <Button
                  title="Visit user's profile"
                  onPress={() =>
                    this.props.navigation.navigate("Profile", {
                      user_id: item.user_id,
                    })
                  }
                  //   this.props.navigation.navigate("Profile", userId); // can probably get tid of this later
                />

                <Button
                  title="Accept"
                  onPress={() => {
                    this.acceptFriendRequest(item.user_id);
                    this.props.navigation.navigate("Profile", {
                      user_id: item.user_id,
                    });
                  }}
                />
                <Button
                  title="Decline TAKE ME SOMEWHERE"
                  onPress={() => this.declineFriendRequest(item.user_id)}
                />
              </View>
            )}
          />
        </View>
      );
    }
  }
}
export default NotificationsScreen;
