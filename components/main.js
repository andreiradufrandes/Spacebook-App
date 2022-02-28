import React, { Component } from "react";
import { View, Text } from "react-native";
// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import screens
import ProfileScreen from "./profile";
import SearchScreen from "./search";
import NotificationsScreen from "./notifications";
import LogoutScreen from "./logout";
import ProfileComponentScreen from "./profileComponent";

const Tab = createBottomTabNavigator();

class MainScreen extends Component {
  // From solution code
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
    });
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    return fetch("http://localhost:3333/api/1.0.0/search", {
      headers: {
        "X-Authorization": value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          listData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    if (value == null) {
      this.props.navigation.navigate("Login");
    }
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
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
          {/* add the profile stack */}

          <Tab.Screen
            name="ProfileComponent"
            component={ProfileComponentScreen}
          />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Notifications" component={NotificationsScreen} />
          <Tab.Screen name="Logout" component={LogoutScreen} />
        </Tab.Navigator>
      );
    }
  }
}

export default MainScreen;
