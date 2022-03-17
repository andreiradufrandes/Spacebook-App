/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

// Import the screen which will be part of the page
import ProfileScreen from './profile';
import UpdateScreen from './update';
import NotificationsScreen from './notifications';
import FriendsScreen from './friends';
import PostScreen from './post';
import ProfilePhotoScreen from './profilePhoto';

// Create a stack navigator which contains all the relavant screens to the profile screen
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
        <ProfileStack.Screen name="Post" component={PostScreen} />
        <ProfileStack.Screen name="Friends" component={FriendsScreen} />
        <ProfileStack.Screen
          name="ProfilePhoto"
          component={ProfilePhotoScreen}
        />
      </ProfileStack.Navigator>
    );
  }
}

export default ProfileComponentScreen;
