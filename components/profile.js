import React, { Component } from 'react';
import { View, Modal, FlatList } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
// Import styled components
import {
  Container,
  Label,
  PrimaryButton,
  ButtonText,
  ButtonContainer,
  Title,
  ContainerCentred,
  BodyText,
  PostInput,
  PostText,
  Header,
  Body,
  ProfileImage,
  PostContainer,
  ScrollViewContainer,
  NewPostBox,
  LoadingContainer,
  ModalContainer,
  ModalView,
} from '../styles.js';

// Import a function to be used for displaying the time and date of post in the correct format
import { timeAndDateExtractor } from './functions';

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Store a number of variables to store the id's of different users, and help with the requests to the API
      loggedUserId: '',
      userProfileID: '',
      isLoggedInUsersProfile: true,
      isFriend: false,
      isLoading: true,
      // Store a number of details of the user in the state to be displayed later
      userInfo: [],
      userPosts: [],
      friendsList: [],
      newPostText: '',
      // Store a few variables in the state to aid with displaying the profile pciture
      photo: null,
      hasProfilePicture: false,
      friendsRequestsList: [],
      singlePost: false,
      userRequestedFriendRequest: false,
      friendRequestSent: false,
      // Store a toggle variable in the state to be used for displaying alerts
      modalVisible: false,
    };
  }

  componentDidMount = async () => {
    // Store the Initial id in the state to the one of the logged in user, as this the one needed when first navigating to the profile page
    this.state.isLoggedInUsersProfile = true;
    this.state.loggedUserId = await AsyncStorage.getItem('@id');
    this.state.userProfileID = this.state.loggedUserId;

    // Get the users information, posts and profile picture
    await this.getUserInfo();
    await this.getUserPosts();
    await this.getProfileImage();

    // Add a event listener to detect when the user is navigating back to their profile using the tab navigator
    this.parentUnsubscribe = this.props.navigation
      .getParent()
      .addListener('tabPress', async (e) => {
        // Send the user back to their profile by passing in their id as parameter inside the navigation, which gets checked before displaying their details
        this.props.navigation.navigate('Profile', {
          user_id: this.state.loggedUserId,
        });
        // call the starter function responsible for sending all the requests containing the user's detail, and display them
        await this.startFunction();
      });

    // Add an event listener to detect someone navigates to the profile page
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      // Call the starter function to detect who the profile belongs to, and display all the relevant details
      await this.startFunction();
    });
  };

  componentWillUnmount() {
    this.parentUnsubscribe();
    this.unsubscribe();
  }

  // Starter function to be called when navigating to the profile page
  startFunction = async () => {
    // Reset some of the values in the state to their initial intended value, as they might change during navigation
    this.state.isLoading = true;
    this.state.isFriend = false;
    this.state.isLoggedInUsersProfile = false;
    this.state.friendRequestSent = false;
    this.state.loggedUserId = await AsyncStorage.getItem('@id');
    let AsyncStorageID = await AsyncStorage.getItem('@id');
    this.state.userProfileID = AsyncStorageID;

    // Add a usercheck flag to determine wherther the profile belongs to the user who logged in or someone else
    let userCheck = typeof this.props.route.params;

    // If the route parameters are undefined, the profile belongs to the user who is logged in
    if (userCheck === 'undefined') {
      this.state.isLoggedInUsersProfile = true;
      this.state.userProfileID = AsyncStorageID;
    } else {
      // Store the user id passed by navigation in the state
      this.state.userProfileID = this.props.route.params.user_id;
      // Check again if the profile belongs to the logged in user, as its the case when nagiating from certain pages
      if (this.state.userProfileID == AsyncStorageID) {
        this.state.isLoggedInUsersProfile = true;
        this.state.userProfileID = AsyncStorageID;
      } else {
        this.state.isLoggedInUsersProfile = false;
      }
    }

    // If the profile does not belong to the logged in user, check whether it belongs to a friend or stanger
    if (!this.state.isLoggedInUsersProfile) {
      await this.checkUserIsFriend();
    }
    // Get the users details from the server and display them
    await this.getUserInfo();

    // Display the user's posts only if it's their own profile or that of a friend
    if (this.state.isLoggedInUsersProfile || this.state.isFriend) {
      await this.getUserPosts();
    }

    // Get the list of friend requests first, before checking if the user who's profile we are on has requested our friendship
    await this.getFriendRequests();
    this.checkUserSentFriendRequest();
    // Display the profile image
    this.getProfileImage();
  };

  // Function to get the list of friends for a user from the server
  getListOfFriends = async () => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID be able to like the right post
    const userId = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');

    // Send a fetch  request to the server to get the list of friends
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
          // If the request was successful, return the object retrieved from the server to be stored in the state
          return response.json();
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        // Store the list of friend in the state
        this.setState({
          friendsList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to check if a certain user sent a friend request, in order to display the right buttons when on their profiles
  checkUserSentFriendRequest = async () => {
    // Check if the profile belongs to the user or the person who is logged in
    if (!this.state.isFriend && !this.state.isLoggedInUsersProfile) {
      this.state.userRequestedFriendRequest = false;

      // Loop through the friend requests to determine if the user has sent a friend request, and reflect it in the state if they have
      this.state.friendsRequestsList.forEach((element) => {
        if (element.user_id == this.state.userProfileID) {
          this.state.userRequestedFriendRequest = true;
        }
      });
    }
  };

  // Add a function to check if a user is part of the friend group of the logged in user
  checkUserIsFriend = async () => {
    // Set a toggle variable for storing if a user is friend and set it to false in the start
    this.state.isFriend = false;
    // Call the get list of friends function so it stores the friends in the state in order to check if a given person is part of tha group
    await this.getListOfFriends();

    // Loop through the friends list and check if the user's who's profile we are on is their friend
    this.state.friendsList.forEach((element) => {
      if (element.user_id == this.props.route.params.user_id) {
        // If the user is part of the friend group toggle the variable storing the friendship status to true
        this.state.isFriend = true;
      }
    });
  };

  // Add a function to get he users information from the server to be displayed on their profile later
  getUserInfo = async () => {
    // Get the user's token and id to be used for authorising the fetch request
    const userId = this.state.userProfileID;
    const value = await AsyncStorage.getItem('@session_token');

    // Send a fetch request to the server to get the users details
    return (
      fetch('http://localhost:3333/api/1.0.0/user/' + userId, {
        headers: {
          'X-Authorization': value,
        },
      })
        // Check if the requst was successfu l and return the results, otherwise trow an error
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw 'Error! Request failed';
          }
        })
        // Store the users details in the state to be used troughout the component
        .then((responseJson) => {
          this.setState({
            userInfo: responseJson,
          });
        })
        // Display the errors in the console if any occure
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Get the posts for different users to be displayed on profiles
  getUserPosts = async () => {
    // Add a condition to get the posts only if the posts belong to the logged in person or their friends
    if (this.state.isLoggedInUsersProfile || this.state.isFriend) {
      // Get the user's token to be used for authorising the fetch request, as well as their ID be able to like the right post
      const userId = this.state.userProfileID;
      const value = await AsyncStorage.getItem('@session_token');

      // Send a request to the server to get the user's posts
      return (
        fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/post', {
          headers: {
            'X-Authorization': value,
          },
        })
          // Return the posts if the request was successul or throw and error if something went wrong
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              throw 'Something went wrong';
            }
          })
          // Store the user's posts in the state to be displayed on their profile later
          .then((responseJson) => {
            this.setState({
              userPosts: responseJson,
            });
          })
          // Throw an error if one occured in the console
          .catch((error) => {
            console.log(error);
          })
      );
    }
  };

  // Add a function to delete a given post
  deletePost = async (post_id, user_id) => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID be able to delete the right post
    const value = await AsyncStorage.getItem('@session_token');
    user_id = await AsyncStorage.getItem('@id');

    // Send a fetch request to the server to delete the post
    return (
      fetch(
        'http://localhost:3333/api/1.0.0/user/' + user_id + '/post/' + post_id,
        {
          method: 'delete',
          headers: {
            'X-Authorization': value,
          },
        }
      )
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          if (response.status === 200) {
            // If the post was deleted successfully, inform the user about it and refesh the list of post to reflect this
            this.state.errorMessage = 'Post deleted!';
            this.setModalVisible(true);
            this.getUserPosts();
            // Display different alerts for the user if the netwroking request was unsuccessful, advising them on what the issue is
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
        })
    );
  };

  // Add a new post on a profile
  addNewPost = async () => {
    // Check that the post we wanted to add is not an empty string
    if (this.state.newPostText !== '') {
      const value = await AsyncStorage.getItem('@session_token');

      // Create a post object and store the user's input inside of it
      let postToSend = {};
      postToSend['text'] = this.state.newPostText;

      // Store the id of the user who's profile we are writing on
      const userId = this.state.userProfileID;
      return (
        fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/post', {
          method: 'post',
          headers: {
            'content-type': 'application/json',
            'X-Authorization': value,
          },
          body: JSON.stringify(postToSend),
        })
          // Return a promise and different messages for the user depending on if the request was successful or not
          .then((response) => {
            // If successful, let the user know, and refresh the list of posts to reflect that
            if (response.status === 201) {
              this.state.errorMessage = 'Post added successfully!';
              this.setModalVisible(true);
              this.getUserPosts();
              this.state.newPostText = '';
              // Display different alerts for the user if the netwroking request was unsuccessful
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
          // Catch any errors and display them in the console
          .catch((error) => {
            console.log(error);
          })
      );
      // Display and error if the use forgot to add text to their post before submitting
    } else {
      this.state.errorMessage =
        'Post can not be empty! Add text and try adding it again!';
      this.setModalVisible(true);
    }
  };

  // Function to like a given post
  likePost = async (post_id) => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID be able to like the right post
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = this.state.userProfileID;

    // Send a fetch request that add a like to the given post
    return (
      fetch(
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
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          // Check if the post was liked successfully, and refresh it to update the number of likes
          if (response.status === 200) {
            // If it's the profile page, refresh all the posts
            if (!this.state.singlePost) {
              this.getUserPosts();
              // If it's the page for an individual post, refresh it the post
            } else {
              this.getSinglePost();
            }
            // Display differnt alerts for the user if the netwroking request was unsuccessful
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
        // Catch any errors that were trown and display them in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Function to remove likes from a given post
  removeLike = async (post_id) => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID be able remove likes from  the right post
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = this.state.userProfileID;
    return (
      fetch(
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
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          // Check if the post was unliked successfully, and refresh it to update the number of likes

          if (response.status === 200) {
            // If it's the profile page, refresh all the posts
            if (!this.state.singlePost) {
              this.getUserPosts();
              // If it's the page for an individual post, refresh it
            } else {
              this.getSinglePost();
            }
            // Display different alerts for the user if the netwroking request was unsuccessful
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
        // Catch any errors that were trown and display them in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Add a function to accept a friend request
  addFriend = async () => {
    // Get the user's token and id to be used for authorising the fetch request
    const value = await AsyncStorage.getItem('@session_token');
    const myID = await AsyncStorage.getItem('@id'); // delete later
    const userId = this.state.userProfileID;
    // Sore the of the person

    return (
      fetch('http://localhost:3333/api/1.0.0/user/' + userId + '/friends', {
        method: 'post',
        headers: {
          // 'content-type': 'application/json',
          'X-Authorization': value,
        },
      })
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          console.log('response status inside addFriend: ' + response.status);
          if (response.status === 201) {
            // Check if the request was successful and inform the user the friend request was sent
            this.state.errorMessage = 'Friend request sent!';
            this.setModalVisible(true);
            this.state.friendRequestSent = true;
            // Display differnt error alerts for the user if the netwroking request was unsuccessful
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
        // Catch any errors that migh occur during the process and display them in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Function to get the user's profile picture from the database
  getProfileImage = async () => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID used for getting their profile picture
    const userId = this.state.userProfileID;
    const value = await AsyncStorage.getItem('@session_token');

    // Send a fetch request to the server to get the user's profile picture
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
        // Add the photo to the component's state, if successful to be displayed on the screen  later
        this.setState({
          photo: data,
          hasProfilePicture: true,
          isLoading: false,
        });
        // Check for any error that might occur and display them in the console
      })
      .catch((err) => {
        this.setState({
          hasProfilePicture: false,
        });
        console.log('ERROR: ', err);
      });
  };

  // Add a function to accept a friend request
  acceptFriendRequest = async () => {
    // Get the user's token to be used for authorising the fetch request
    const value = await AsyncStorage.getItem('@session_token');
    return (
      fetch(
        'http://localhost:3333/api/1.0.0/friendrequests/' +
          this.state.userProfileID,
        {
          method: 'post',
          headers: {
            'X-Authorization': value,
          },
        }
      )
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          // Check if the request was successful and inform the user the friend request was accepted
          if (response.status === 200) {
            // Display a message to the user informing them the request was accepted
            this.state.errorMessage = 'Friend request accepted!';
            this.setModalVisible(true);
            // Refresh the page to reflect friendship request was accepted
            this.startFunction();
            // Display differnt error alerts for the user if the netwroking request was unsuccessful
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
        // Check for any error that might occur and display them in the console

        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Fucntion to get the friend requests for the user
  getFriendRequests = async () => {
    // Get the user's token to be used for authorising the fetch request
    const value = await AsyncStorage.getItem('@session_token');

    // Send a fetch request to get the user's friend reqeusts from the server
    return (
      fetch('http://localhost:3333/api/1.0.0/friendrequests', {
        headers: {
          'X-Authorization': value,
        },
      })
        // Return theresults from the server and check if the request was successful
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw 'Friend requests request failed!';
          }
        })
        // If successful, store the friend request list in the state to be used later
        .then((responseJson) => {
          this.setState({
            friendsRequestsList: responseJson,
          });
        })
        // Throw an erro in the console if any occured during the request
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Add a toggle function to set the visibility for the user alerts, to be used when displaying messages to the user
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible } = this.state;
    // Display a buffer text if the data required to be displayed in not loaded yet
    if (this.state.isLoading) {
      return (
        <LoadingContainer>
          <BodyText>Loading..</BodyText>
        </LoadingContainer>
      );
    }
    // Renderthe page if the elements finished loading
    else {
      return (
        <ContainerCentred>
          <ScrollViewContainer>
            {/* Display a modal element to show alerts for the user */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!modalVisible);
              }}
            >
              <ModalContainer>
                <ModalView>
                  <BodyText>{this.state.errorMessage} </BodyText>
                  <PrimaryButton
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <ButtonText>{'OK'}</ButtonText>
                  </PrimaryButton>
                </ModalView>
              </ModalContainer>
              {/* </View> */}
            </Modal>

            <Header>
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
                  {/* Allow the user to change the proile picture if it belongs to them */}
                  {this.state.isLoggedInUsersProfile ? (
                    <PrimaryButton
                      onPress={() =>
                        this.props.navigation.navigate('ProfilePhoto')
                      }
                    >
                      <ButtonText>PHOTO</ButtonText>
                    </PrimaryButton>
                  ) : null}
                  {/* Display an update button only for the logged in user's profile */}
                  {this.state.isLoggedInUsersProfile ? (
                    <PrimaryButton
                      onPress={() => this.props.navigation.navigate('Update')}
                    >
                      <ButtonText>UPDATE</ButtonText>
                    </PrimaryButton>
                  ) : null}
                  {/* Take the user to the list of friend if it;s their own profile or a friend's */}
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

                {/* Display the add friend button only when on aa strangers profile */}
                {!this.state.isLoggedInUsersProfile &&
                !this.state.isFriend &&
                !this.state.userRequestedFriendRequest &&
                !this.state.friendRequestSent ? (
                  <PrimaryButton onPress={() => this.addFriend()}>
                    <ButtonText>ADD FRIEND</ButtonText>
                  </PrimaryButton>
                ) : null}
              </View>

              {/* Display a button to accept friends requests if the profile owner sent one */}
              {!this.state.isLoggedInUsersProfile &&
              !this.state.isFriend &&
              this.state.userRequestedFriendRequest ? (
                <PrimaryButton onPress={() => this.acceptFriendRequest()}>
                  <ButtonText>{'ACCEPT FRIEND REQUEST'}</ButtonText>
                </PrimaryButton>
              ) : null}
            </Header>

            <Body>
              <Title>Profile wall</Title>
              {/* Display someone's posts, as well as the option to add a post only for the logged in user's profile and for their friends */}
              {this.state.isLoggedInUsersProfile || this.state.isFriend ? (
                <View>
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
