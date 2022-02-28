import React, { Component } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "./profile";
import UpdateScreen from "./update";
import NotificationsScreen from "./notifications";
import FriendsScreen from "./friends";

// const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();

class ProfileComponentScreen extends Component {
  render() {
    return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
        <ProfileStack.Screen name="Update" component={UpdateScreen} />
        <ProfileStack.Screen
          name="Notifications"
          component={NotificationsScreen}
        />
        <ProfileStack.Screen name="Friends" component={FriendsScreen} />
      </ProfileStack.Navigator>
    );
  }
}

export default ProfileComponentScreen;
