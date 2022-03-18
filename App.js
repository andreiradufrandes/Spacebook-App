import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import the screens that form the navigation
import MainScreen from './components/main';
import LoginScreen from './components/login';
import SignupScreen from './components/signup';

// Create a stack navigator to contain our screens
const Stack = createNativeStackNavigator();

class App extends Component {
  render() {
    return (
      // create s stack navigator to contain the first 3 components of the app
      <NavigationContainer>
        {/* Hide the header of the page */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
