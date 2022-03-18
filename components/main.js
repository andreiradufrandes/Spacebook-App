import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the screens to be added to the tab navigator
import SearchScreen from './search';
import NotificationsScreen from './notifications';
import LogoutScreen from './logout';
import ProfileComponentScreen from './profileComponent';

const Tab = createBottomTabNavigator();

class MainScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // Check if the user is logged in
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // Check if the user is logged in, and if they are not navigate them back to the login page
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      // Add a tab navigator to allow the user to travel to different parts of te app
      <Tab.Navigator screenOptions={{ headerShown: false }}>
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

export default MainScreen;
