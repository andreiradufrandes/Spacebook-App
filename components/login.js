import React, { Component } from 'react';
import { View, Text, TextInput,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import TextInjection from 'react-native/Libraries/Text/TextInjection';

const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@spacebook_details', jsonValue)
    } catch (e) {
        console.error(e);
    }
}


class LoginScreen extends Component {


    constructor(props){
        super(props);

        
        this.state = {
            email: "defaultemail@gmail.com",
            password: "defaultPassword"
        };
    }

        // The login function, which takes the data from the state, and fetches it to the website
        login = () => {
            fetch('http://localhost:3333/api/1.0.0/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // this is what we pass to our website
                // email and password, the ones we passed
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                storeData(json);
                // TODO
                // NAVIGATE TO FEED IF THE DETAILS ARE CORRECT
                // this.props.navigation.navigate("Feed");
            })
            .catch((error) => {
                console.error(error);
            });
        }    

    render(){
        return(
            <View>
            <TextInput
                placeholder="email"
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
            />
            <TextInput
                placeholder="password"
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                secureTextEntry={true}
            />
            <Button
                title="LOGIN"
                onPress={() => this.login()}
            />
         </View>    
        )
    }
}

export default LoginScreen;
