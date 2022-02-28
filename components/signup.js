import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    // set default values to be replaced by the user's input
    this.state = {
      first_name: "defaultName",
      last_name: "defaultLastName",
      email: "defaultemail@mmu.ac.uk",
      password: "defaultPassword",
    };
  }

  // Signup, passing the users details in
  signup = () => {
    let user_details = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    };
    console.log(user_details);
    fetch("http://localhost:3333/api/1.0.0/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user_details),
    })
      .then((response) => {
        Alert.alert("User added successfully");
        // navigate me to main
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //  not sure if this should be here
  componentDidMount() {
    console.log("mounted");
  }

  render() {
    // const navigation = this.props.navigation;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TextInput
          placeholder="first_name"
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
        />
        <TextInput
          placeholder="last_name"
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
        />
        <TextInput
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          placeholder="password"
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry={true}
        />
        <Button
          title="Signup"
          onPress={() => this.signup()}
          // take me to login
        />
      </View>
    );
  }
}

export default SignupScreen;
