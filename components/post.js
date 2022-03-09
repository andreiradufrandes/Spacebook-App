import React, { Component } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Todo
// only SHOW the update posts if they are yours
// Maybe display old messege BY adding it to the text first
// 1. Write query
// 2. Pass stuff from the profile post(like the post id or whatever, to take you here )
// 3. Add did mount of whatever
// /user/{user_id}/post/{post_id}
// 4. display it
// get post_id from post when you nagivate here
// Refresh page when updated
// import delete post instead of rewriting it
// tod
// individual posts not working correctly
// fix update post
// chcek for like and dislike IF it's my own post
// add component did mount
class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      post: [], // maybe change this
      updatePost: false,
      postMessage: '',
      newPostMeesage: '',
      loggedUserId: '',
      isLoggedInUsersPost: false,
    };
  }

  //   PATCH
  // /user/{user_id}/post/{post_id}
  updatePost = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    // Set the text for the new post
    let newPost = this.state.post;
    newPost.text = this.state.newPostMeesage;

    console.log('old post ');
    console.log(this.state.post);
    console.log('newPost(shhould have new text: ');
    console.log(newPost);
    let post_id = this.state.post.post_id;
    let user_id = this.state.post.author.user_id; // not sure if the right id or my id
    console.log('stringified text,:\n', JSON.stringify(newPost));
    // make copy of post
    // set text to something else
    // send it

    // TODO
    // user_id was initially in the request but it didnt' work
    // const user_id = this.state.userInfo.user_id; // change the name of the var and in the fetch as well

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + user_id + '/post/' + post_id,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'X-Authorization': value,
        },
        body: JSON.stringify(newPost),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.state.updatePost = false;
          this.getSinglePost();
          console.log('Post updates refresh page(Take user back to page)');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // update post function
  // On click:
  // 1. Update post = true
  // 2. if update post true, display update field
  // 3. have second button saying update finished which triggers update request
  //   import it from main page
  componentDidMount = async () => {
    console.log('\n\n\n\n\npost component did mount:');

    this.state.loggedUserId = await AsyncStorage.getItem('@id');

    await this.getSinglePost();
    await this.checkPostIsFromLoggedUser();
    await this.getSinglePost();
  };

  checkPostIsFromLoggedUser = async () => {
    // console.log(this.state.loggedUserId, this.state.post.author.user_id);
    // console.log(this.state.loggedUserId == this.state.post.author.user_id);

    if (this.state.loggedUserId == this.state.post.author.user_id) {
      console.log('--- This post is from the user who is logged in--');
      this.state.isLoggedInUsersPost = true;
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
          console.log('post deleted');
          //   Navigate user somewhere
          this.props.navigation.navigate('Profile'); // maybe add something to it
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getSinglePost = async () => {
    // const userId = await AsyncStorage.getItem('@id');

    const value = await AsyncStorage.getItem('@session_token');

    const userId = this.props.route.params.user_id;
    const post_id = this.props.route.params.post_id;
    console.log('Post page: ');
    console.log('userId:' + userId);
    console.log('post_id: ' + post_id);

    // GET POST ID FROM NAVIGATE. WHATEVER

    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + userId + '/post/' + post_id,
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
          // isLoading: false,
          post: responseJson,
        }),
          console.log('original post:');
        console.log(this.state.post);
      })
      .then(() => {
        // Check if its my post
        this.checkPostIsFromLoggedUser();
      })
      .then(() => {
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
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
    } else {
      return (
        <View>
          <Text>
            From {this.state.post.author.first_name}{' '}
            {this.state.post.author.last_name}
          </Text>
          <Text> {this.state.post.text}</Text>

          {/* If it's not my post, you can like it  */}
          {!this.state.isLoggedInUsersPost ? (
            <Button
              title="Like(not sure if it works"
              onPress={() =>
                this.likePost(
                  this.state.post.post_id,
                  this.state.post.author.user_id
                )
              }
            />
          ) : null}

          {!this.state.isLoggedInUsersPost ? (
            <Button title="Remove like(NOT CODED)" />
          ) : null}

          {!this.state.isLoggedInUsersPost ? (
            <Button
              title="Delete post(to complete)"
              onPress={() =>
                this.deletePost(
                  this.state.post.post_id,
                  this.state.post.author.user_id
                )
              }
            />
          ) : null}

          {/* display the update button nly if its my post  */}
          {this.state.isLoggedInUsersPost ? (
            <Button
              title="Update(NOT CODED)"
              onPress={() => {
                (this.state.updatePost = true), this.getSinglePost();
              }}
            />
          ) : null}

          {/* Display the update form */}
          {this.state.updatePost ? (
            <View>
              <TextInput
                maxLength="256"
                placeholder="new post message"
                onChangeText={(newPostMeesage) =>
                  this.setState({ newPostMeesage })
                }
                value={this.state.newPostMeesage}
              />
              <Button
                title="Submit updated post"
                onPress={() => {
                  this.updatePost();
                }}
              />
            </View>
          ) : null}
        </View>
      );
    }
  }
}

export default PostScreen;
