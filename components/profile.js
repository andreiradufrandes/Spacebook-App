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
  ScrollView,
  Modal,
  Pressable,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import {
  Container,
  Label,
  PrimaryButton,
  Center,
  ButtonText,
  ButtonContainer,
  Input,
  BoxContainer,
  Title,
  ContainerCentred,
  BodyText,
  PostInput,
  PostText,
  Header,
  Body,
  ProfileImage,
  Name,
  PostContainer,
  ScrollViewContainer,
  NewPostBox,
} from '../styles.js';

import { timeAndDateExtractor } from './functions';
// import { RootSiblingParent } from 'react-native-root-siblings';
// TODO
// DELETE VIEW USER'S PAGE BUTTON
// Timestamp
// fix remove like so it only shows once AND it shows the error
// move ALL the posts to the invidual post as well
// clean all the buttons so they have the right text inside of them
// add friend so it works and refreshes the page or something when you accept a friend request
// delete new post text and from render too
// add buttons for going back maybe
// some stuff is redundant(camera on profile page for instance) remove it

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUserId: '', // WARNING - delete it think
      userProfileID: '',
      isLoggedInUsersProfile: true,
      isFriend: false,
      isLoading: true,
      userInfo: [],
      userPosts: [], // not sure, might be diferent type
      newPostText: '', // delete
      postaddedWindow: '',

      friendsList: [],
      hasPermission: null,
      type: Camera.Constants.Type.back,
      photo: null,
      hasProfilePicture: false,
      friendsRequestsList: [],
      singlePost: false,
      userRequestedFriendRequest: false,
      modalVisible: false,
      friendRequestSent: false,
    };
  }

  componentDidMount = async () => {
    console.log('\n\n\n\nComponent did mount\n\n\n\n');

    // When the user loggs in
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
    this.state.isLoggedInUsersProfile = true;
    this.state.loggedUserId = await AsyncStorage.getItem('@id');

    this.state.userProfileID = this.state.loggedUserId;
    // These get called WHEN i go  on someones prifile

    await this.getUserInfo();
    await this.getUserPosts();
    await this.getProfileImage();

    console.log('\n\n\n\n\n\n\n\ncomponent did mount\n\n\n\n\n\n\n\nn');

    // ---------------------------------------------------------------
    // When the users travels to their profile using the tab navigator
    this.parentUnsubscribe = this.props.navigation
      .getParent()
      .addListener('tabPress', async (e) => {
        // Nagivate the user
        console.log('\n\n\n\nComponent did mount >> PARENT NAVIGATOR\n\n\n\n');
        this.props.navigation.navigate('Profile', {
          user_id: this.state.loggedUserId,
        });

        await this.startFunction();
      });

    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      console.log('\n\n\n\nComponent did mount >> EVENT LISTENER\n\n\n\n');
      console.log('State at beginning of event listener: ', this.state);
      await this.startFunction();
    });
  };

  componentWillUnmount() {
    this.parentUnsubscribe();
    this.unsubscribe();
  }

  startFunction = async () => {
    this.state.isLoading = true;
    this.state.isFriend = false;
    this.state.isLoggedInUsersProfile = false;
    this.state.friendRequestSent = false;
    console.log(
      '\n\n\n\nState in starter function beginning\n\n\n',
      this.state
    );
    console.log('#function called: startFunction');
    // Resetting parameter
    this.state.loggedUserId = await AsyncStorage.getItem('@id');
    let AsyncStorageID = await AsyncStorage.getItem('@id'); // maye delete
    this.state.userProfileID = AsyncStorageID; /// set it to MY id for now
    let userCheck = typeof this.props.route.params;

    // Check if the profile is mine, and set userProfilId to my id
    if (userCheck === 'undefined') {
      this.state.isLoggedInUsersProfile = true;
      this.state.userProfileID = AsyncStorageID;
      // If it is NOT my profile
    } else {
      this.state.userProfileID = this.props.route.params.user_id; // this
      // If I am navigating back to a profile, check if it is mine or not
      if (this.state.userProfileID == AsyncStorageID) {
        this.state.isLoggedInUsersProfile = true;
        this.state.userProfileID = AsyncStorageID;
      } else {
        this.state.isLoggedInUsersProfile = false;
      }
    }

    // If it is not my profile, check if the user is a friend or not
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

    // this.state.userPosts = []; // refresh it // redo this cleare or in a function

    // Get user info should depend on whose user's page we're on
    await this.getUserInfo();
    //   1. User logged in

    // get the posts for is logged in used && and for friends as well
    // if (this.state.isLoggedInUsersProfile) {
    //   await this.getUserPosts();
    // } else {
    //   // 2. This is NOT my profile, isLoggedInUsersProfile == false, but a frien'ds
    //   if (this.state.isFriend) {
    //     await this.getUserPosts();
    //   }
    // }
    if (this.state.isLoggedInUsersProfile || this.state.isFriend) {
      await this.getUserPosts();
    }

    await this.getFriendRequests();
    // Check if the user sent a friend request
    this.checkUserSentFriendRequest();
    this.getProfileImage();
  };

  getListOfFriends = async () => {
    // Get List Of friends for me
    console.log('------getListOfFriend-------');
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
          console.log('------getListOfFriend-------successful');
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log('list of friends repsonseJson: ' + responseJson);
        this.setState({
          // isLoading: false,
          friendsList: responseJson,
        });
        console.log('list of friends friendsList: ' + this.state.friendsList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // write a function that sets isFriend to no if it's not a friend
  // ONLY call this function IF isMyProfile == false
  checkUserSentFriendRequest = async () => {
    // If the user is not already a friend and this is not my profile
    if (!this.state.isFriend && !this.state.isLoggedInUsersProfile) {
      this.state.userRequestedFriendRequest = false;
      // check list of frinds requests
      console.log('friends requests list:');
      console.log(
        'friend whose profile i am checking: ',
        this.state.userProfileID
      );
      console.log(this.state.friendsRequestsList);

      this.state.friendsRequestsList.forEach((element) => {
        if (element.user_id == this.state.userProfileID) {
          // this.state.isFriend = true;
          console.log(
            'element.user_id == this.state.userProfileID',
            element.user_id,
            ' ',
            this.state.userProfileID
          );
          this.state.userRequestedFriendRequest = true;
          console.log('The user has sent a friend request!');
        }

        console.log(
          'this.state.userRequestedFriendRequest: ',
          this.state.userRequestedFriendRequest
        );
      });
    }
  };

  //   Could be replaced with an error( like 203 not friend from some request do do something )
  checkUserIsFriend = async () => {
    this.state.isFriend = false;
    const loggeduserIDCheck = await AsyncStorage.getItem('@id');

    console.log('async id in getuserinfo' + loggeduserIDCheck);
    await this.getListOfFriends();

    this.state.friendsList.forEach((element) => {
      if (element.user_id == this.props.route.params.user_id) {
        this.state.isFriend = true;
      }
    });

    console.log('isFriend INSIDE checkUserIsFriend: ' + this.state.isFriend);
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

    const loggeduserIDCheck = await AsyncStorage.getItem('@id'); // delete
    console.log('------------getuserinfo: my id: ' + loggeduserIDCheck); // delete
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
            // isLoading: false, // meaning it finished and now you can display it
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
    //
    user_id = await AsyncStorage.getItem('@id');

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
          this.state.errorMessage = 'Post deleted!';
          this.setModalVisible(true);
          this.getUserPosts();
        } else if (response.status === 401) {
          this.state.errorMessage =
            'Unauthorised! Make sure you are logged in and try again';
          this.setModalVisible(true);
        } else if (response.status === 403) {
          this.state.errorMessage =
            'Forbidden! You can only delete your posts!';
          this.setModalVisible(true);
        } else if (response.status === 404) {
          this.state.errorMessage =
            'The post you are trying to delete does not exist anymore!';
          this.setModalVisible(true);
        } else if (response.status === 500) {
          this.state.errorMessage =
            'Server error! Restart the server then try again';
          this.setModalVisible(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   TODO
  // CHANGE SO THAT IT POSTS ON THE RIGHT PERSONS PROFILE
  addNewPost = async () => {
    // Check that the post we wanted to add is not an empty string
    if (this.state.newPostText !== '') {
      const value = await AsyncStorage.getItem('@session_token');

      // Create a post object and store the user's input inside of it
      let postToSend = {};
      postToSend['text'] = this.state.newPostText;

      // Store the id of the user who's profile we are writing on
      const userId = this.state.userProfileID;
      return fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/post', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'X-Authorization': value,
        },
        body: JSON.stringify(postToSend),
      })
        .then((response) => {
          if (response.status === 201) {
            this.state.errorMessage = 'Post added successfully!';
            this.setModalVisible(true);

            this.getUserPosts();
            this.state.newPostText = '';
          } else if (response.status === 401) {
            this.state.errorMessage =
              'Unauthorised! Make sure you are logged in, and then try again!';
            this.setModalVisible(true);
          } else if (response.status === 404) {
            this.state.errorMessage =
              'Something went wrong. Make you the person whos profile you are writing on is your friend';
            this.setModalVisible(true);
          } else if (response.status === 500) {
            this.state.errorMessage =
              'Server error! Restart the server then try again';
            this.setModalVisible(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.state.errorMessage =
        'Post can not be empty! Add text and try adding it again!';
      this.setModalVisible(true);
    }
  };

  likePost = async (post_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    // TODO
    // user_id was initially in the request but it didnt' work

    // const user_id = this.state.userInfo.user_id; // change the name of the var and in the fetch as well
    const user_id = this.state.userProfileID; // change the name of the var and in the fetch as well

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
        // If the post was liked successfully, update the page to reflect that
        if (response.status === 200) {
          // If it's the profile page, refresh all the posts
          if (!this.state.singlePost) {
            this.getUserPosts();
            // If it's the page for an individual post, refresh it
          } else {
            this.getSinglePost();
          }
        } else if (response.status === 401) {
          this.state.errorMessage =
            'Unauthorised! Make sure you are logged in, and then try again!';
          this.setModalVisible(true);
        } else if (response.status === 403) {
          this.state.errorMessage =
            'Forbidden! You can not like your own posts or posts appearing on your profile';
          this.setModalVisible(true);
        } else if (response.status === 400) {
          this.state.errorMessage = 'You have already liked this post!';
          this.setModalVisible(true);
        } else if (response.status === 500) {
          this.state.errorMessage =
            'Server error! Restart the server then try again';
          this.setModalVisible(true);
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
    const user_id = this.state.userProfileID;
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
        console.log('response code: ', response.status);
        // If the post was liked successfully, update the page to reflect that
        if (response.status === 200) {
          // If it's the profile page, refresh all the posts
          if (!this.state.singlePost) {
            this.getUserPosts();
            // If it's the page for an individual post, refresh it
          } else {
            this.getSinglePost();
          }
        } else if (response.status === 401) {
          this.state.errorMessage =
            'Unauthorised! Make sure you are logged in, and then try again!';
          this.setModalVisible(true);
        } else if (response.status === 403) {
          this.state.errorMessage =
            'Forbidden! You can not like or unlike your own posts or posts appearing on your profile';
          this.setModalVisible(true);
        } else if (response.status === 400) {
          this.state.errorMessage = 'You have already unliked this post!';
          this.setModalVisible(true);
        } else if (response.status === 500) {
          this.state.errorMessage =
            'Server error! Restart the server then try again';
          this.setModalVisible(true);
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
          // 'content-type': 'application/json',
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        console.log('response status inside addFriend: ' + response.status);
        if (response.status === 201) {
          // Send add friend alert
          this.state.errorMessage = 'Friend request sent!';
          this.setModalVisible(true);
          //        REFLECT THAT
          this.state.friendRequestSent = true;
        } else if (response.status === 401) {
          this.state.errorMessage =
            'Unauthorised! Make sure you are logged in and try again';
          this.setModalVisible(true);
        } else if (response.status === 403) {
          this.state.errorMessage =
            'Friend request sent already! Wait for the user to answer it';
          this.setModalVisible(true);
        } else if (response.status === 500) {
          this.state.errorMessage =
            'Server error! Restart the server then try again';
          this.setModalVisible(true);
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
          ' inside sendToServer: getProfileImage called to get the image and store it!'
        );
        this.state.hasProfilePicture = true;
        this.getProfileImage();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   Replace to get the users page we are on NOT ours
  //   Replace to get the users page we are on NOT ours
  getProfileImage = async () => {
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
          isLoading: false,
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

  acceptFriendRequest = async () => {
    // how to get the exact id i need

    const value = await AsyncStorage.getItem('@session_token');
    return fetch(
      'http://localhost:3333/api/1.0.0/friendrequests/' +
        this.state.userProfileID,
      {
        method: 'post',
        headers: {
          'X-Authorization': value,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.state.errorMessage = 'Friend request accepted!';
          this.setModalVisible(true);
          // Refresh the page to reflect friendship request was accepted
          this.startFunction(); // delete - this just refreshes the page
          // refresh page
        } else if (response.status === 401) {
          this.state.errorMessage =
            'Unauthorised! Make sure you are logged in and try again';
          this.setModalVisible(true);
        } else if (response.status === 404) {
          this.state.errorMessage =
            'User not found! Log out and back in then try again';
          this.setModalVisible(true);
        } else if (response.status === 500) {
          this.state.errorMessage =
            'Server error! Restart the server then try again';
          this.setModalVisible(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 1. Getlistoffrinedrequests

  // Checking IF the user added me already
  getFriendRequests = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    console.log(value);

    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
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
          // isLoading: false,
          friendsRequestsList: responseJson,
        }),
          console.log(
            'FRIENDS REQUESTS IN getFriendsRequests: ',
            this.state.friendsRequestsList
          );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Add a toggle function to set the visibility for the user alerts
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible } = this.state;
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
        <ContainerCentred>
          {/* <SafeAreaView style={styles.container}> */}
          <ScrollViewContainer>
            <View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    {/* <Text style={styles.modalText}>Hello World!</Text> */}
                    {/* Display the erro you wish to display to the user */}
                    <Text style={styles.modalText}>
                      {this.state.errorMessage}{' '}
                    </Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => this.setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Ok</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>
            <Header>
              {/* <View> */}

              {/* header */}
              <View>
                <Title>
                  {this.state.userInfo.first_name +
                    ' ' +
                    this.state.userInfo.last_name}
                </Title>
                {this.state.hasProfilePicture ? (
                  <ProfileImage
                    source={{
                      uri: this.state.photo,
                    }}
                    alt="Profile image"
                  />
                ) : null}

                <BodyText>Email: {this.state.userInfo.email}</BodyText>
                <ButtonContainer>
                  {this.state.isLoggedInUsersProfile ? (
                    <PrimaryButton
                      onPress={() =>
                        this.props.navigation.navigate('ProfilePhoto')
                      }
                    >
                      <ButtonText>PHOTO</ButtonText>
                    </PrimaryButton>
                  ) : null}
                  {this.state.isLoggedInUsersProfile ? (
                    <PrimaryButton
                      onPress={() => this.props.navigation.navigate('Update')}
                    >
                      <ButtonText>UPDATE</ButtonText>
                    </PrimaryButton>
                  ) : null}
                  {/* Replace where ti */}
                  {/* <Text> {this.state.userInfo.friend_count + ' friends'}</Text>  */}

                  {/* Display the list of friends for the user who is logged in only*/}
                  {this.state.isLoggedInUsersProfile || this.state.isFriend ? (
                    <PrimaryButton
                      onPress={() =>
                        this.props.navigation.navigate('Friends', {
                          user_id: this.state.userProfileID,
                        })
                      }
                    >
                      <ButtonText>FRIENDS</ButtonText>
                    </PrimaryButton>
                  ) : null}
                </ButtonContainer>

                {/* Add the option for adding someone as a friend as a button when on a stranger's profile */}
                {!this.state.isLoggedInUsersProfile &&
                !this.state.isFriend &&
                !this.state.userRequestedFriendRequest &&
                !this.state.friendRequestSent ? (
                  <PrimaryButton onPress={() => this.addFriend()}>
                    <ButtonText>ADD FRIEND</ButtonText>
                  </PrimaryButton>
                ) : null}
              </View>

              {!this.state.isLoggedInUsersProfile &&
              !this.state.isFriend &&
              this.state.userRequestedFriendRequest ? (
                <Button
                  title="Accept friend request"
                  // onPress={() => this.addFriend()} // code it
                  onPress={() => this.acceptFriendRequest()}
                ></Button>
              ) : null}
            </Header>
            {/*------------------------------ Camera ------------------------------    */}

            {/* move this inside the statement */}
            <Body>
              {/* Display someone's posts, as well as the option to add a post only for the logged in user's profile and for their friends */}
              {this.state.isLoggedInUsersProfile || this.state.isFriend ? (
                <View>
                  {/* Add a post only if it is my profile or a friend's profile */}

                  <NewPostBox>
                    <Label>New post:</Label>
                    <PostInput
                      maxLength="260"
                      multiline={true}
                      onChangeText={(newPostText) =>
                        this.setState({ newPostText })
                      }
                      value={this.state.newPostText}
                    />

                    <PrimaryButton onPress={() => this.addNewPost()}>
                      <ButtonText>{'ADD POST'}</ButtonText>
                    </PrimaryButton>
                  </NewPostBox>

                  {/*   Display user's posts as a flatlist, with the option to like, remove like, delete, update posts,
                 and visit person's profile, depending on the posts are from */}
                  {/* display only when display user message true  */}

                  {/* display aler ONLY when it's true */}
                  <Title>Profile wall</Title>
                  <FlatList
                    data={this.state.userPosts}
                    keyExtractor={(item) => item.post_id}
                    renderItem={({ item }) => (
                      <PostContainer>
                        <PostText>"{item.text}"</PostText>
                        <BodyText>
                          From: {item.author.first_name} {item.author.last_name}{' '}
                        </BodyText>
                        <BodyText>
                          {' '}
                          Posted on:{' '}
                          {timeAndDateExtractor(item.timestamp).at(0)} at{' '}
                          {timeAndDateExtractor(item.timestamp).at(1)}
                        </BodyText>
                        <BodyText> {item.numLikes} likes</BodyText>

                        {/* Display only if it's NOT my page */}
                        {/* <Button
                        title="View post"
                        onPress={() => {
                          this.props.navigation.navigate('Post', 
                          
                          item.post_id);
                        }}
                      ></Button> */}
                        <ButtonContainer>
                          <PrimaryButton
                            onPress={() => {
                              this.props.navigation.navigate('Post', {
                                user_id: this.state.userProfileID,
                                post_id: item.post_id,
                              });
                            }}
                          >
                            <ButtonText>{'POST'}</ButtonText>
                          </PrimaryButton>
                          {/* {this.state.isFriend ? (
                          <Button title="Visit user's page(NOT CODED)" />
                        ) : null} */}
                          <PrimaryButton
                            onPress={() => this.likePost(item.post_id)}
                          >
                            <ButtonText>{'LIKE'}</ButtonText>
                          </PrimaryButton>

                          <PrimaryButton
                            onPress={() => this.removeLike(item.post_id)}
                          >
                            <ButtonText>{'DISLIKE'}</ButtonText>
                          </PrimaryButton>

                          {/* Allow the user to delete a post if it's on their own profile */}
                          {this.state.isLoggedInUsersProfile ? (
                            <PrimaryButton
                              onPress={() =>
                                this.deletePost(
                                  item.post_id,
                                  item.author.user_id
                                )
                              }
                            >
                              <ButtonText>{'DELETE'}</ButtonText>
                            </PrimaryButton>
                          ) : null}
                        </ButtonContainer>
                        {/* Add functionality for updating a post if it's on the user's profile */}
                        {/* {this.state.isLoggedInUsersProfile ? (
                          <Button title="Update post(NOT CODED)" />
                        ) : null} */}
                      </PostContainer>
                    )}
                  />
                </View>
              ) : null}
            </Body>
          </ScrollViewContainer>
        </ContainerCentred>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
