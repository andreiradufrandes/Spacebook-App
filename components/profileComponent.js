/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from './profile';
import UpdateScreen from './update';
import NotificationsScreen from './notifications';
import FriendsScreen from './friends';
import PostScreen from './post';
import ProfilePhotoScreen from './profilePhoto';
import ProfileCheck from './profileCheck';
// const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();

// REPLACE WITH ASYNC ID

// eslint-disable-next-line react/prefer-stateless-function
class ProfileComponentScreen extends Component {
  render() {
    return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen
          name="Profile"
          component={ProfileScreen}
          //    set the initial param id to that one
        />
        {/* Delete later maybe */}
        <ProfileStack.Screen
          name="ProfileCheck"
          component={ProfileCheck}
          //    set the initial param id to that one
        />
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
