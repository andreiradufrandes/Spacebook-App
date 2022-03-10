const removeLike = async (post_id) => {
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
      if (response.status === 200) {
        // If it is not the page of a single post, display all posts
        if (!this.state.singlePost) {
          this.getUserPosts();
          // Refresh the individual post
        } else {
          this.getSinglePost();
        }
        console.log('Post liked!');
      } else {
        throw 'Something went wrong';
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export default removeLike;
