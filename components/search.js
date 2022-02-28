import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
    };
  }

  getUser = async () => {
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

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text> Search for people or friends</Text>
        <TextInput
          placeholder="search"
          onChangeText={(searchTerm) => this.setState({ searchTerm })}
          value={this.state.searchTerm}
        />
      </View>
    );
  }
}

export default SearchScreen;
