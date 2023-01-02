import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { findPostRequest } from '../../store/reducers/PostsSlice';
import {
  BasicContainer,
  LoadingIndicator,
  PostCard,
  ErrorText,
} from '../../library';

const PostList = ({ navigation }) => {
  const data = useSelector((state) => state.posts.data)
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const dispatch = useDispatch();


  const findPosts = ({ dispatch }) => {
    dispatch(findPostRequest());
  };

  const goToPost = ({ navigation, id }) => () => {
    navigation.navigate('Post', { id });
  };


  useEffect(() => {
    findPosts({ dispatch });
  }, [dispatch]);

  if (loading && data.length < 1) {
    return <LoadingIndicator />;
  }

  return (
    <BasicContainer>
      <FlatList
        contentContainerStyle={{ paddingBottom: 16 }}
        {...{ data }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: { email, name, id } }) => (
          <PostCard {...{ email, name, id }} onPress={goToPost({ navigation, id })} />
        )}
        ListHeaderComponent={() => error && <ErrorText text="Error" />}
      />
    </BasicContainer>
  );
};

PostList.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default PostList;
