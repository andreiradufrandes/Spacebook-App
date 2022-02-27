import React, { Component } from 'react';
import { View, Text, TextInput,Button, Alert,StyleSheet } from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';


// todo 
// change friends so that it applies only to accepted ones 

// a6c34fc5a08d92378ff060477ac2d6fa  DELETE THIS 






class ProfileScreen extends Component {

    constructor(props){
        super(props);
    
        this.state = {
          isLoading: true,
          userInfo: [],
          userPosts: [] // not sure, might be diferent type

        }
      }

    // i believe this is to call it 
    // call the get user data (which we need here)
  componentDidMount() {
    this.getUserInfo();
    this.getUserPosts(); // Only 1 function sets loading to false (the last one)
  } 

//  not sure if it needs async
    getUserInfo = async () =>{
        // Store user id
        // IMPORTANT, await waits to get the item first 
        const userId = await AsyncStorage.getItem('@id');
        const value = await AsyncStorage.getItem('@session_token');
        console.log(userId);
        console.log(value);

        return fetch("http://localhost:3333/api/1.0.0/user/" + userId,{
            'headers': {
                'X-Authorization':  value
              }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            // save the users info inside the state
          this.setState({
            //   TODO 
            // uncomment this IF THERE IS A NEED FOR IT
            // isLoading: false, // meaning it finished and now you can display it  t
            userInfo: responseJson
          }),
          console.log(this.state.userInfo);
          
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    getUserPosts = async () =>{
        // Store user id
        // IMPORTANT, await waits to get the item first 
        const userId = await AsyncStorage.getItem('@id');
        const value = await AsyncStorage.getItem('@session_token');
        console.log(userId);
        console.log(value);

        return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/post",{
            'headers': {
                'X-Authorization':  value
              }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            //   NOT sure if we need this here 
            isLoading: false, // meaning it finished and now you can display it 
            userPosts: responseJson
          }),
          console.log(this.state.userPosts);
          
        })
        .catch((error) => {
            console.log(error);
        })
    }





    render(){

        if (this.state.isLoading){
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Loading..</Text>
              </View>
            );
          }else{
      return (
        //   main view 
        <View >
            {/* header */}
            <View> 
                <Text> Placeholder for image</Text> 
                <Button
                    title='Update details'
                    onPress={() => this.props.navigation.navigate('Update')}
                    // Take me to the 
                    
                />
                <Text>{this.state.userInfo.first_name + " " + this.state.userInfo.last_name}</Text>
                <Text> {this.state.userInfo.friend_count + " friends" }</Text> 
                    
                <Button
                    title='Notificatins'
                    // TODO
                    // TAKE USER TO NOTIFICATION SCREEN
                    // HAVE FRIEND REQUESTS THERE
                    onPress={() => this.props.navigation.navigate('Notifications')}
                />
                <Button
                    title='Add post'
                />
                {/* <Button
                    title='Display data in console to test it(DELETE LATER) '
                    onPress={() => this.getUserInfo()}
                />
                 */}

            </View>
            {/* body/ wall */}
            <View style={Styles.wall}>
                {/* wrapped in a flatlist */}
                

                
                {/* <View>
                    <Text>
                    {"Post: " + this.state.userPosts.at(0).text }
                    </Text>
                    <Text>
                    {"From: " + this.state.userPosts.at(0).author.first_name  + " " + this.state.userPosts.at(0).author.last_name}
                    </Text>
                </View> */}


                
                <FlatList
                    // ADD THE POSTS 
                    // POPULATE WITH POST CUSTOME COMPONENT
                    data={this.state.userPosts}
                    keyExtractor = {(item) => item.post_id}

                    renderItem={({item}) =>  
                        <View>
                            <Text> {item.text} </Text>
                            <Text> From: {item.author.first_name} {item.author.last_name}  </Text>
                            <Text> Posted at {item.timestamp} </Text>
                        </View>
                        
                    } 
                    // keyExtractor = {item=>item.id}
                    
                />

            </View>





        </View>
      );
    }
} 
}





export default ProfileScreen;


const Styles = StyleSheet.create({
    wall:{
        backgroundColor: "233232",
    }

})