import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { FlatList } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

class PracticeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userInfo: [], // not sure, might be diferent type
    };
  }

  // i believe this is to call it
  // call the get user data (which we need here)
  componentDidMount() {
    this.getUserInfo();
  }

  //  not sure if it needs async
  getUserInfo = async () => {
    // Store user id
    // IMPORTANT, await waits to get the item first
    const userId = await AsyncStorage.getItem("@id");
    const value = await AsyncStorage.getItem("@session_token");
    console.log(userId);
    console.log(value);

    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
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
        // save the users info inside the state
        this.setState({
          isLoading: false, // meaning it finished and now you can display it
          userInfo: responseJson,
        }),
          console.log(this.state.userInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //  insert is loading and the rest

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
        //   main view
        <View>
          {/* header */}
          <View>
            <Text> Placeholder for image</Text>
            <Button
              title="Update details"
              // Take me to the
            />
            <Text>
              {this.state.userInfo.first_name +
                " " +
                this.state.userInfo.last_name}
            </Text>
            <Text> {this.state.userInfo.friend_count + " friends"}</Text>

            <Button
              title="Notificatins"
              // TODO
              // TAKE USER TO NOTIFICATION SCREEN
              // HAVE FRIEND REQUESTS THERE
            />
            <Button title="Add post" />
            <Button
              title="Display data in console to test it(DELETE LATER) "
              onPress={() => this.getUserInfo()}
            />
          </View>
          {/* body/ wall */}
          <View style={Styles.wall}>
            {/* wrapped in a flatlist */}

            <Text>
              {" "}
              Individual custome POST components which get the info from the
              user{" "}
            </Text>
            <Text>
              {" "}
              Individual custome POST components which get the info from the
              user{" "}
            </Text>
            <Text>
              {" "}
              Individual custome POST components which get the info from the
              user{" "}
            </Text>
            <Text>
              {" "}
              Individual custome POST components which get the info from the
              user{" "}
            </Text>

            <FlatList
            // ADD THE POSTS
            // POPULATE WITH POST CUSTOME COMPONENT
            />
          </View>
        </View>
      );
    }
  }
}

export default PracticeScreen;

const Styles = StyleSheet.create({
  wall: {
    backgroundColor: "233232",
  },
});
