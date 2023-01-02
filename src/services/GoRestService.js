import * as Request from './RequestService';
import { API_TOKEN } from '../constants';

const BEARER_AUTH = `Bearer ${API_TOKEN}`;
const BASE_URL = 'https://gorest.co.in/public-api';
const BASE_URL1 = 'https://api-generator.retool.com/1tdqbQ';

export const getConfig = () => ({
  headers: {
    Authorization: BEARER_AUTH,
  },
});

export const findUserById = (id) => {
  const url = `${BASE_URL}/users/${id}`;
  const config = getConfig();
  return Request.get({ url, config });
};

export const createUser = ({ name, gender, email }) => {
  const url = `${BASE_URL}/users`;
  const config = getConfig();
  const data = {
    name,
    gender,
    email,
    status: 'Active',
  };
  return Request.post({ url, config, data });
};

export const findPostsByUser = (id) => {
  // const url = `${BASE_URL}/users/${id}/posts`;
  const url = `${BASE_URL1}/user`;
  const config = getConfig();
  return Request.get({ url, config });
};

export const createPostAPI = ({  name, email }) => {
  const url = `${BASE_URL1}/user`;
  const config = getConfig();
  const data = {
    name,
    email,
  };
  return Request.post({ url, config, data });
};

export const updatePost = ({ postId, name, email }) => {
  const url = `${BASE_URL1}/user/${postId}`;
  // console.log('sssssss', url, name, email, postId)
  const config = getConfig();
  const data = {
    name, email
  };
  return Request.put({ url, config, data });
};
