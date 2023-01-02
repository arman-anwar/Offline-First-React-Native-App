import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useSelector, useDispatch} from 'react-redux';
import {BasicContainer, InputText, Button, ErrorText} from '../../library';
import useForm from '../../hooks/useForm';
import { normalizeFormData } from '../../services/utils';
import { createPostRequest, updatePostRequest } from '../../store/reducers/PostsSlice';

const InputContainer = styled.View`
  width: 100%;
`;

const PostScreen = ({route}) => {
  const postId = route.params?.id;

  const validateFields = ({ name, email, setInvalidFieldValue }) => {
    if (!name) {
      setInvalidFieldValue('O título do post é obrigatório!');
      return false;
    }
    if (!email) {
      setInvalidFieldValue('A descrição do post é obrigatória!');
      return false;
    }
    return true;
  };

  const initialFormState = [
    { name: 'name', placeholder: 'Name', value: '' },
    { name: 'email', placeholder: 'Email', value: '' },
  ];

  const goToPost = ({ navigation, id }) => () => {
    navigation.navigate('Post', { id });
  };

  const findPosts = ({ dispatch }) => {
 
    dispatch(requestFindPosts());
  };
  
  
  const createPost = ({
    form,
    dispatch,
    setInvalidFieldValue,
  }) => () => {
    const post = normalizeFormData(form);
    if (validateFields({ ...post, setInvalidFieldValue })) {
      dispatch(createPostRequest({ ...post }));
    }
  };
  
  
  
  const updatePost = ({
    postId,
    form,
    dispatch,
    setInvalidFieldValue,
  }) => () => {
    const post = normalizeFormData(form);
    if (validateFields({ ...post, setInvalidFieldValue })) {
      dispatch(updatePostRequest({ ...post, id: postId }));
    }
  };
  

  const [invalidFieldValue, setInvalidFieldValue] = useState();

  const dispatch = useDispatch();
  const post = useSelector((state) =>
    postId ? state.posts.data.find((item) => item.id === postId) : null,
  );
  const {loading, error} = useSelector((state) => state.posts);

  const [form, formDispatch] = useForm(initialFormState);
  useEffect(() => {
    if (post) {
      formDispatch({name: 'initialValues', value: post});
    }
  }, [post, formDispatch]);

  return (
    <BasicContainer>
      <InputContainer>
        {form.map((field) => (
          <InputText
            value={field.value}
            key={field.name}
            placeholder={field.placeholder}
            onChangeText={(text) =>
              formDispatch({name: field.name, value: text})
            }
          />
        ))}
      </InputContainer>
      <Button
        {...{loading}}
        text="Save"
        onPress={
          postId
            ? updatePost({postId, form, dispatch, setInvalidFieldValue})
            : createPost({form,  dispatch, setInvalidFieldValue})
        }
      />
      {invalidFieldValue && <ErrorText text={invalidFieldValue} />}
      {error && <ErrorText text="We had a problem creating the post" />}
    </BasicContainer>
  );
};

export default PostScreen;
