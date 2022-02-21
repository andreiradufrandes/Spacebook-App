import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './components/main';
import LoginScreen from './components/login';
import SignupScreen from './components/signup';
const Stack = createNativeStackNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
          {/* Stack navigator */}
        <Stack.Navigator>
          
          <Stack.Screen name="Main" component={MainScreen} />
          
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
}

export default App;