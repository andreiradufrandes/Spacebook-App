import React, { Component } from 'react';
import { View, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Label,
  PrimaryButton,
  ButtonText,
  BoxContainer,
  ContainerCentred,
  BodyText,
  PostInput,
  PostText,
  ModalContainer,
  ModalView,
  LoadingContainer,
} from '../styles.js';

// Import a function to be used for displaying the time and date of post in the correct format
import { timeAndDateExtractor } from './functions';

class PostScreen extends Component {
  constructor(props) {
    super(props);

    // Save the required variables for the netwroking query in the state to be used throughtout the component
    this.state = {
      isLoading: true,
      post: [],
      updatePost: false,
      postMessage: '',
      newPostMeesage: '',
      loggedUserId: '',
      isLoggedInUsersPost: false,
      userProfileID: '',
      singlePost: true,
      modalVisible: false,
    };
  }

  componentDidMount = async () => {
    // Store the id of the logged in person in the state to be used for verification
    this.state.loggedUserId = await AsyncStorage.getItem('@id');

    // Get the post from the server and check who the author is
    await this.getSinglePost();
    await this.checkPostIsFromLoggedUser();
    await this.getSinglePost();
  };

  // Add a toggle function to set the visibility of the alerts, to be be used during netwroking requests displaying allerts for the user
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  // Function to like a given post
  likePost = async (post_id) => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID be able to like the right post
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = this.state.userProfileID; // change the name of the var and in the fetch as well

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
        // Catch any errors and display them in the console
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
              // If it's the page for an individual post page, refresh just that one post
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

  // Create a function to update the a given post
  updatePost = async () => {
    // Check that the user has added a new message before subbmitting the request
    if (this.state.newPostMeesage !== '') {
      // Get the user's token to be used for authorising the fetch request, as well as their ID be able to update the right post
      const value = await AsyncStorage.getItem('@session_token');
      let userId = this.state.userProfileID;
      let postId = this.state.post.post_id;

      // Create a temporary variable to copy the old post's content, and replace the text of the post with the user's input
      let newPost = this.state.post;
      newPost.text = this.state.newPostMeesage;

      // Create a fetch request to update the old post with the new text
      return (
        fetch(
          'http://localhost:3333/api/1.0.0/user/' + userId + '/post/' + postId,
          {
            method: 'PATCH',
            headers: {
              'content-type': 'application/json',
              'X-Authorization': value,
            },
            body: JSON.stringify(newPost),
          }
        )
          // Return a promise and different messages for the user depending on if the request was successful or not
          .then((response) => {
            if (response.status === 200) {
              // If the post was updated successfully, set the toggel variable to false to let the compinent know it's been updated already
              this.state.updatePost = false;
              // Refresh the post to display the new contents
              this.getSinglePost();
              // Display a message for the user adivising them that the post has been updated successfuly
              this.state.errorMessage = 'Post updated successfully!';
              this.setModalVisible(true);
              // Display different alerts for the user if the netwroking request was unsuccessful, advising them on what the issue is
            } else if (response.status === 401) {
              this.state.errorMessage =
                'Unauthorised! Make sure you are logged in!';
              this.setModalVisible(true);
            } else if (response.status === 404) {
              this.state.errorMessage =
                'Make sure your new post does not go over 256 characters, and that you are updating your own post!';
              this.setModalVisible(true);
            } else if (response.status === 500) {
              this.state.errorMessage =
                'Server error! Restart the server then try again';
              this.setModalVisible(true);
            }
          })
          // Throw and error with explaining the problem that occured with the post
          .catch((error) => {
            console.log(error);
          })
      );
      // If the user has not entered a new message before subbmiting the updated post, alert them that they should do this first
    } else {
      this.state.errorMessage =
        'Post can not be empty! Add text and try adding it again!';
      this.setModalVisible(true);
    }
  };

  // Create a function to check if a certain post is from the user who is logged in, in order to display the right buttons on the page and have the right functionality
  checkPostIsFromLoggedUser = async () => {
    if (this.state.loggedUserId == this.state.post.author.user_id) {
      this.state.isLoggedInUsersPost = true;
    }
  };

  // Add a function to delete a given post
  deletePost = async (post_id) => {
    const value = await AsyncStorage.getItem('@session_token');

    let user_id = this.state.userProfileID;
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
        // Check the response from the server and inform the user if this was succsessfull or not
        .then((response) => {
          // Check if the post was deleted successfully, and refresh the posts to reflect this
          if (response.status === 200) {
            // Redirect the user back to their profile once the post has been deleted
            this.props.navigation.navigate('Profile', {
              user_id: user_id,
            });
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

  // Create a request to retrive a given post from the server
  getSinglePost = async () => {
    // Get the user's token to be used for authorising the fetch request, as well as their ID be able to retrieve the right post
    const value = await AsyncStorage.getItem('@session_token');
    let userId = this.props.route.params.user_id;

    // Store the id of the user's who's profile we are on to be used for other requests checking the profile owner
    this.state.userProfileID = userId;

    // Store the post id to be used for requests
    const post_id = this.props.route.params.post_id;
    console.log('Post page: ');
    console.log('userId:' + userId);
    console.log('post_id: ' + post_id);

    // GET POST ID FROM NAVIGATE. WHATEVER

    return (
      fetch(
        'http://localhost:3333/api/1.0.0/user/' + userId + '/post/' + post_id,
        {
          headers: {
            'X-Authorization': value,
          },
        }
      )
        // Return a promise and different messages for the user depending on if the request was successful or not
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw 'Something went wrong';
          }
        })
        // If the request was successful, update the user's state to store the post
        .then((responseJson) => {
          this.setState({
            post: responseJson,
          });
        })
        .then(() => {
          // Call the function to check if the post if from the logged user or not
          this.checkPostIsFromLoggedUser();
        })
        // Once the previous requests have finished, set isLoading to false to render the component on the page
        .then(() => {
          this.setState({
            isLoading: false,
          });
        })
        // Display the error to the user in case something goes wrong
        .catch((error) => {
          console.log(error);
        })
    );
  };

  render() {
    const { modalVisible } = this.state;

    // Display a buffer text if the data required to be displayed in not loaded yet    if (this.state.isLoading) {
    if (this.state.isLoading) {
      return (
        <LoadingContainer>
          <BodyText>Loading..</BodyText>
        </LoadingContainer>
      );

      // If the request was successful, render the post on the page
    } else {
      return (
        <ContainerCentred>
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

          <BoxContainer>
            <BodyText>
              From: {this.state.post.author.first_name}{' '}
              {this.state.post.author.last_name}
            </BodyText>
            <PostText>"{this.state.post.text}"</PostText>
            <BodyText>
              {' '}
              Posted on: {timeAndDateExtractor(this.state.post.timestamp).at(
                0
              )}{' '}
              at {timeAndDateExtractor(this.state.post.timestamp).at(1)}
            </BodyText>
            <BodyText> {this.state.post.numLikes} likes</BodyText>
            {!this.state.isLoggedInUsersPost ? (
              <PrimaryButton
                onPress={() => this.likePost(this.state.post.post_id)}
              >
                <ButtonText>{'LIKE'}</ButtonText>
              </PrimaryButton>
            ) : null}
            {!this.state.isLoggedInUsersPost ? (
              <PrimaryButton
                onPress={() => this.removeLike(this.state.post.post_id)}
              >
                <ButtonText>{'REMOVE LIKE'}</ButtonText>
              </PrimaryButton>
            ) : null}

            {this.state.isLoggedInUsersPost ? (
              <PrimaryButton
                onPress={() => this.deletePost(this.state.post.post_id)}
              >
                <ButtonText>{'DELETE'}</ButtonText>
              </PrimaryButton>
            ) : null}

            {this.state.isLoggedInUsersPost ? (
              <PrimaryButton
                onPress={() => {
                  (this.state.updatePost = true), this.getSinglePost();
                }}
              >
                <ButtonText>{'UPDATE'}</ButtonText>
              </PrimaryButton>
            ) : null}

            {this.state.updatePost ? (
              <View>
                <Label>New post:</Label>
                <PostInput
                  maxLength="256"
                  multiline={true}
                  onChangeText={(newPostMeesage) =>
                    this.setState({ newPostMeesage })
                  }
                  value={this.state.newPostMeesage}
                />

                <PrimaryButton
                  onPress={() => {
                    this.updatePost();
                  }}
                >
                  <ButtonText>{'SUBMIT'}</ButtonText>
                </PrimaryButton>
              </View>
            ) : null}
          </BoxContainer>
        </ContainerCentred>
      );
    }
  }
}

export default PostScreen;
