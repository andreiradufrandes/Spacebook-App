import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    // Check if the component is still loading, and render a message for the user to let them know the page is loading
    return (
      // Add a tab navigator to allow the user to travel to different parts of te app
      <Tab.Navigator
        style={styles.tabNavigator}
        screenOptions={{ headerShown: false }}
      >
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

const styles = StyleSheet.create({
  tabNavigator: {
    backgroundColor: 'red',
  },
});
