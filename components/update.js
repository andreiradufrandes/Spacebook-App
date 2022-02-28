import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*

Left TODO:
   - update so that it check the names are correct and NOT numbers, code, etc

*/

class UpdateScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      origin_first_name: "",
      origin_last_name: "",
      origin_email: "",
      //   id : '',
      first_name: "",
      last_name: "",
      email: "",
    };
  }

  // i believe this is to call it
  // call the get user data (which we need here)
  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const userId = await AsyncStorage.getItem("@id");
    const value = await AsyncStorage.getItem("@session_token");
    console.log(userId); // delete
    console.log(value); // delete

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
          // Update the original user details to be used for checking against the new ones
          origin_first_name: responseJson.first_name,
          origin_last_name: responseJson.last_name,
          origin_email: responseJson.email,
        }),
          console.log(this.state.userInfo);
        console.log("Details after the getUserInfo");
        console.log(this.state.origin_first_name);
        console.log(this.state.origin_last_name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   Updating the user
  //      TODO
  //      ADD error handling here
  updateDetails = async () => {
    const userId = await AsyncStorage.getItem("@id");
    const value = await AsyncStorage.getItem("@session_token");

    let to_send = {};

    if (
      this.state.first_name != this.state.origin_first_name &&
      this.state.first_name != ""
    ) {
      to_send["first_name"] = this.state.first_name;
    }
    // if (this.state.last_name != this.state.origin_last_name){
    if (
      this.state.last_name != this.state.origin_last_name &&
      this.state.last_name != ""
    ) {
      to_send["last_name"] = this.state.last_name;
    }
    // TODO
    // UPDATE THE EMAIL TO BE LIKE FIRST NAME AND LAST NAME IF WE NEED THAT
    if (
      this.state.email != this.state.origin_email &&
      this.state.last_name != ""
    ) {
      to_send["email"] = this.state.email;
    }

    // check the string we're sending
    console.log(JSON.stringify(to_send));

    return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "X-Authorization": value,
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        console.log("User details updated");
        //   ADD ALERT HERE
        // TAKE USER TO PROFILE PAGE
        Alert.alert("Update", "User details have been updated correctly", [
          {
            text: "Ok",
            onPress: () => console.log("alert has been closed"),
          },
        ]);
        this.props.navigation.navigate("Profile");
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
          <TextInput
            placeholder="Enter first name"
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
          />
          <TextInput
            placeholder="Enter last name"
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
          />
          <TextInput
            placeholder="Enter email adress"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />
          <Button title="Update details" onPress={() => this.updateDetails()} />
        </View>
      );
    }
  }
}
export default UpdateScreen;
