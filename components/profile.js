import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// repalce touchable opacity in camera
// fix it when you go to YOUR PROFILE fro notifications or somewhere else
// todo
// change friends so that it applies only to accepted ones
// can't like posts
// only update your posts
// only delete your posts
// present the button ONLY if its your own post
// CHECK THAT THE USER ID IS CORRECT
// this.props.route.params
// update post
// make all of them scrolable
// make sure it works with 0 friends( the looping through) when it comes to checking if someone is a friend
// move small stuff outside the component did mount into individual functions(like check friend for instance)
// error for haing multiple users with same name
// make sure the loading is right
// display the right details on the user profile(if its me or someone else)
// Display stuff when the user runs into errors
// only allow for your posts to be liked by other people(and viceversa)
// make sure you get the right posts(for example if youre on someone else's page)
/* <Button
title="Remove like(NOT CODED)"
/> */
// change getUserPosts to not have the conditional statement inside of it
// update post no working
// add post on the RIGHT person's profile
// send friend requests
// Make it so that you can go from list of friends > individual friend -> to profile. Atm if you are there and click tab navigator to go to profile component it doesnt go
// remove likes
// change timestamp!! <Text> Posted at {item.timestamp} </Text>
// Add conditional to like post to display something if it's your own post

// go to random person's account
// add them as a friend

// The props can be changed
// maybe use state display message. Then on click you set that to false and not display anymore
// on click set button to false and refresh page or something
const UserMessage = (props) => {
  return (
    <View>
      {/* <Text>Hello, I am {props.name}!</Text> */}
      <Text>{props.message}</Text>
      <Button
        title="Ok"
        onPress={() => {
          props.displayMessage = false;
        }}
        Fix
        this
      />
    </View>
  );
};

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userInfo: [],
      userPosts: [], // not sure, might be diferent type
      loggedUserId: '', // WARNING - delete it think
      newPostText: '',
      postaddedWindow: '',
      isLoggedInUsersProfile: true,
      userProfileID: '',
      isFriend: false,
      displayMessage: false, // maybe delete later
      friendsList: [],
      //   camera
      hasPermission: null,
      type: Camera.Constants.Type.back,
      photo: null,
      hasProfilePicture: false,
    };
  }

  startFunction = async () => {
    console.log('#function called: startFunction');
    let userCheck = this.props.route.params; // i think
    this.state.isFriend = false; // maybe delete

    if (typeof userCheck === 'undefined') {
      this.state.isLoggedInUsersProfile = true;
      this.state.userProfileID = await AsyncStorage.getItem('@id');
    } else {
      //   check if the profile is mine
      this.state.userProfileID = this.props.route.params.user_id; // this
      let AsyncStorageID = await AsyncStorage.getItem('@id');
      if (this.state.userProfileID == AsyncStorageID) {
        this.state.isLoggedInUsersProfile = true;
        this.state.userProfileID = await AsyncStorage.getItem('@id');
      } else {
        this.state.isLoggedInUsersProfile = false;
      }
    }

    //  Determine if the user is friend and specify in set the state to reflect if the person is a friend or not
    if (!this.state.isLoggedInUsersProfile) {
      await this.checkUserIsFriend();
    }

    console.log(
      '\n -isLoggedInUsersProfile(is this my prfile): ' +
        this.state.isLoggedInUsersProfile +
        "\n ,-userProfileID(user's whos prile this is): " +
        this.state.userProfileID +
        '\n ,-isFriend: ' +
        this.state.isFriend
    ); // delete

    this.state.userPosts = []; // refresh it // redo this cleare or in a function

    this.getUserInfo();
    //   1. User logged in

    if (this.state.isLoggedInUsersProfile) {
      this.getUserPosts();
    } else {
      // 2. This is NOT my profile, isLoggedInUsersProfile == false, but a frien'ds
      if (this.state.isFriend) {
        this.getUserPosts();
      }
    }
  };

  componentDidMount = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });

    // Display the logged in user's information and posts once they log in
    this.state.userProfileID = await AsyncStorage.getItem('@id');
    this.get_profile_image();
    this.getUserInfo();
    this.getUserPosts();

    // camera stuff

    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      console.log(
        '#Function called: Event listener insided component did mount'
      );
      console.log('object passed with user id and params;');
      console.log('params : ' + this.props.route.params);
      // console.log('params user_id: ' + this.props.route.params.user_id);

      this.startFunction();
      this.get_profile_image(); // not sure if it should be here
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  getListOfFriends = async () => {
    const userId = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + userId + '/friends',
      {
        headers: {
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendsList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // write a function that sets isFriend to no if it's not a friend
  // ONLY call this function IF isMyProfile == false

  //   Could be replaced with an error( like 203 not friend from some request do do something )
  checkUserIsFriend = async () => {
    console.log('#function called: checkUserIsFriend');
    const loggeduserIDCheck = await AsyncStorage.getItem('@id');

    console.log('async id in getuserinfo' + loggeduserIDCheck);
    await this.getListOfFriends();

    this.state.friendsList.forEach((element) => {
      if (element.user_id == this.props.route.params.user_id) {
        this.state.isFriend = true;
      }
    });
    console.log('inside checkuserisfriend');
    console.log(
      'isLoggedInUsersProfile: ' +
        this.state.isLoggedInUsersProfile +
        ', isFriend: ' +
        this.state.isFriend
    );
  };

  //   send friend request
  sendFriendRequest() {
    // Set the RIGHT user id

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + user_id + '/friends',
      {
        method: 'post',
        headers: {
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          // TODO, refresh the user page
          console.log('Friend added:');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUserInfo = async () => {
    console.log('#function called: getUserInfo');
    const userId = this.state.userProfileID;
    const value = await AsyncStorage.getItem('@session_token');
    const loggeduserIDCheck = await AsyncStorage.getItem('@id');

    console.log('------------getuserinfo: my id: ' + loggeduserIDCheck);
    console.log("------------getuserinfo: friend i'm adding: " + userId);

    return fetch('http://localhost:3333/api/1.0.0/user/' + userId, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          userInfo: responseJson,
        }),
          console.log('userInfo when getUserInfo is called:');
        console.log(this.state.userInfo); // delete
        console.log('Async id:' + loggeduserIDCheck);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   I think this already happend in the render, so no need here
  getUserPosts = async () => {
    // Display the posts for the user only if it is the logged in user's profile or a friend
    console.log('#Function called: getUserPosts');
    if (this.state.isLoggedInUsersProfile || this.state.isFriend) {
      const userId = this.state.userProfileID;
      const value = await AsyncStorage.getItem('@session_token');
      console.log(userId);
      console.log(value);

      return fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/post', {
        headers: {
          'X-Authorization': value,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw 'Something went wrong';
          }
        })
        .then((responseJson) => {
          this.setState({
            //   NOT sure if we need this here
            isLoading: false, // meaning it finished and now you can display it
            userPosts: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  deletePost = async (post_id, user_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    console.log(post_id, user_id);

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + user_id + '/post/' + post_id,
      {
        method: 'delete',
        headers: {
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log('post deleted'); // delete this
          this.state.displayMessage = true; // maybe delete later
          this.getUserPosts();

          //   return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //   TODO
  // CHANGE SO THAT IT POSTS ON THE RIGHT PERSONS PROFILE
  addNewPost = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    let post_to_send = {};
    post_to_send['text'] = this.state.newPostText;

    // CHANGE FOR OTHER USERS
    // const id = await AsyncStorage.getItem("@id");
    const userId = this.state.userProfileID;
    return fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/post', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': value,
      },
      body: JSON.stringify(post_to_send),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('Post created');
          this.getUserPosts();
          this.state.newPostText = '';
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  likePost = async (post_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    // TODO
    // user_id was initially in the request but it didnt' work
    const user_id = this.state.userInfo.user_id; // change the name of the var and in the fetch as well
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' +
        user_id +
        '/post/' +
        post_id +
        '/like',
      {
        method: 'post',
        headers: {
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.getUserPosts();

          console.log('Post liked!');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //   1. Add condition so you can ONLY unlike the post IF you liked it already
  removeLike = async (post_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    // TODO
    // user_id was initially in the request but it didnt' work
    const user_id = this.state.userInfo.user_id; // change the name of the var and in the fetch as well
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' +
        user_id +
        '/post/' +
        post_id +
        '/like',
      {
        method: 'delete',
        headers: {
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.getUserPosts();
          console.log('Like removed');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   i already created this function somewhere else, just import it
  addFriend = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const myID = await AsyncStorage.getItem('@id'); // delete later
    const userId = this.state.userProfileID;
    const loggeduserIDCheck = await AsyncStorage.getItem('@id'); // delete later

    console.log('------------getuserinfo: my id: ' + loggeduserIDCheck);
    console.log("------------getuserinfo: friend i'm adding: " + userId);

    // the
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + userId + '/friends',
      {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        console.log('response status: ' + response.status);
        if (response.status === 200) {
          console.log('Friend added successfully');
          //   TODO, REFRESH PAGE SO THAT IT DISPLAYS EVERYTHING
          // change ifFriend to true
          this.state.isFriend = true;
        } else {
          throw "Something went wrong.Friend couldn't be added ";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   Camera functions
  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  //   Send image to servet
  sendToServer = async (data) => {
    // Get these from AsyncStorage
    const userId = this.state.userProfileID;
    const value = await AsyncStorage.getItem('@session_token');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': value,
      },
      body: blob,
    })
      .then((response) => {
        console.log('Picture added', response);
        console.log(
          ' inside sendToServer: get_profile_image called to get the image and store it!'
        );
        this.state.hasProfilePicture = true;
        this.get_profile_image();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   Replace to get the users page we are on NOT ours
  //   Replace to get the users page we are on NOT ours
  get_profile_image = async () => {
    const userId = this.state.userProfileID;
    const value = await AsyncStorage.getItem('@session_token');

    fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);

        this.setState({
          photo: data,
          hasProfilePicture: true,
        });
        // Call getUserInfo so it displays the image now
      })
      .catch((err) => {
        this.setState({
          hasProfilePicture: false,
        });
        console.log('error', err);
      });
  };

  render() {
    // Display a buffer text if the data required to be displayed in not loaded yet
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading..</Text>
        </View>
      );
    }
    // Display if the the page is ready
    else {
      return (
        <View>
          {/* header */}
          <View>
            {/* Change the sizes */}
            {this.state.hasProfilePicture ? (
              <View style={styles.container}>
                <Image
                  source={{
                    uri: this.state.photo,
                  }}
                  style={{
                    width: 400,
                    height: 400,
                    borderWidth: 5,
                  }}
                />
              </View>
            ) : null}
            {/* Make it so it only appears for my profile */}
            <Text> is there an image? {this.state.hasProfilePicture}</Text>

            {this.state.isLoggedInUsersProfile ? (
              <Button
                title="Update profile picture"
                onPress={() => this.props.navigation.navigate('ProfilePhoto')}
              />
            ) : null}

            {/* Display the update button only for the user's who are logged in*/}
            {this.state.isLoggedInUsersProfile ? (
              <Button
                title="Update details"
                onPress={() => this.props.navigation.navigate('Update')}
              />
            ) : null}

            {/* Display the details of the user's who's profile we are on */}
            <Text>
              {this.state.userInfo.first_name +
                ' ' +
                this.state.userInfo.last_name}
            </Text>
            <Text>{this.state.userInfo.email}</Text>
            {/* Replace where ti */}
            {/* <Text> {this.state.userInfo.friend_count + ' friends'}</Text>  */}

            {/* Display the list of friends for the user who is logged in only*/}
            {this.state.isLoggedInUsersProfile ? (
              <Button
                title="See list of friends"
                onPress={() => this.props.navigation.navigate('Friends')}
              ></Button>
            ) : null}

            {/* Add the option for adding someone as a friend as a button when on a stranger's profile */}
            {!this.state.isLoggedInUsersProfile && !this.state.isFriend ? (
              <Button
                title="Add friend(NOT CODED)"
                onPress={() => this.addFriend()} // code it
              ></Button>
            ) : null}
          </View>

          {/*------------------------------ Camera ------------------------------    */}

          {/* ------------------------------ BODY ------------------------------ 

          {/* Display someone's posts, as well as the option to add a post only for the logged in user's profile and for their friends */}
          {this.state.isLoggedInUsersProfile || this.state.isFriend ? (
            <View>
              {/* Add a post only if it is my profile or a friend's profile */}

              <View>
                <TextInput
                  placeholder="Add post.."
                  onChangeText={(newPostText) => this.setState({ newPostText })}
                  value={this.state.newPostText}
                />
                <Button
                  //  TODO
                  //  This changes if it's on someone else's profile
                  title="Add post(not coded) ADD INPUT AND MAKE IT ONE ELEMENT TO BE ABLE TO GET THE CONTENT"
                  onPress={() => this.addNewPost()}
                />
              </View>

              {/*   Display user's posts as a flatlist, with the option to like, remove like, delete, update posts,
                 and visit person's profile, depending on the posts are from */}
              {/* display only when display user message true  */}

              {/* display aler ONLY when it's true */}
              {this.state.displayMessage ? (
                <UserMessage
                  message="Delete post"
                  displayMessage="false"
                ></UserMessage>
              ) : null}

              <FlatList
                data={this.state.userPosts}
                keyExtractor={(item) => item.post_id}
                renderItem={({ item }) => (
                  <View>
                    <Text> {item.text} </Text>
                    <Text>
                      From: {item.author.first_name} {item.author.last_name}{' '}
                    </Text>
                    <Text> Posted at {item.timestamp} </Text>
                    <Text> {item.numLikes} likes</Text>

                    {/* Display only if it's NOT my page */}
                    <Button
                      title="View post"
                      onPress={() => {
                        this.props.navigation.navigate('Post', item.post_id);
                      }}
                    ></Button>

                    {this.state.isFriend ? (
                      <Button title="Visit user's page(NOT CODED)" />
                    ) : null}

                    <Button
                      title="Like post(not sure if the right one is liked)"
                      onPress={() => this.likePost(item.post_id)}
                    />

                    <Button
                      title="Remove like (not finished)"
                      onPress={() => this.removeLike(item.post_id)}
                    />

                    {/* Allow the user to delete a post if it's on their own profile */}
                    {this.state.isLoggedInUsersProfile ? (
                      <Button
                        title="Delete post(complete)"
                        onPress={() =>
                          this.deletePost(item.post_id, item.author.user_id)
                        }
                      />
                    ) : null}

                    {/* Add functionality for updating a post if it's on the user's profile */}
                    {this.state.isLoggedInUsersProfile ? (
                      <Button title="Update post(NOT CODED)" />
                    ) : null}
                  </View>
                )}
              />
            </View>
          ) : null}
        </View>
      );
    }
  }
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
