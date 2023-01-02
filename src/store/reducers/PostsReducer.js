import { createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { offlineActionTypes } from 'react-native-offline';
import TYPES from '../types';
import {
  generateId,
  getOfflineMeta,
  sortByTitle,
} from '../../services/utils';

// actions
export const createPostRequest = createAction(
  TYPES.REQUEST_CREATE_POST,
  function prepare({ name, email }) {
    return {
      payload: {
        name, email,
        id: generateId(),
      },
      meta: getOfflineMeta({ navigationMethod: 'goBack' }),
    };
  },
);
export const findPostRequest = createAction(
  TYPES.REQUEST_FIND_POSTS,
  function prepare() {
    return {
      meta: getOfflineMeta({ retry: false }),
    };
  },
);

export const updatePostRequest = createAction(
  TYPES.REQUEST_UPDATE_POST,
  function prepare({ name, email, id }) {
    return {
      payload: {
        name,
        email,
        id,
      },
      meta: getOfflineMeta({ navigationMethod: 'goBack' }),
    };
  },
);

export const createPostSuccess = createAction(TYPES.SUCCESS_CREATE_POST);
export const createPostFailure = createAction(TYPES.FAILURE_CREATE_POST);
export const findPostSuccess = createAction(TYPES.SUCCESS_FIND_POSTS);
export const findPostFailure = createAction(TYPES.FAILURE_FIND_POSTS);
export const updatePostSuccess = createAction(TYPES.SUCCESS_UPDATE_POST);
export const updatePostFailure = createAction(TYPES.FAILURE_UPDATE_POST);
export const deletePostRequest = createAction(TYPES.DELETE_POST);

const INITIAL_STATE = {
  data: [],
  error: false,
  loading: false,
};

const postReducer = createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase(TYPES.REQUEST_CREATE_POST, (state) => {
      state.loading = true;
    })
    .addCase(TYPES.SUCCESS_CREATE_POST, (state, action) => {
      state.error = false;
      state.loading = false;
      const { data, offlineId, queued } = action.payload;

      if (offlineId && queued) {
        state.data = state.data.map((post) =>
          post.id === offlineId ? data : post,
        );
      } else {
        state.data.push(action.payload.data);
      }
    })
    .addCase(TYPES.FAILURE_CREATE_POST, (state) => {
      state.error = true;
      state.loading = false;
    })
    .addCase(TYPES.REQUEST_FIND_POSTS, (state) => {
      state.loading = true;

    })
    .addCase(TYPES.SUCCESS_FIND_POSTS, (state, action) => {
      state.error = false;
      state.loading = false;
      state.data = action.payload.data;
    })
    .addCase(TYPES.FAILURE_FIND_POSTS, (state) => {
      state.error = true;
      state.loading = false;
    })
    .addCase(TYPES.REQUEST_UPDATE_POST, (state) => {
      state.loading = true;

    })
    .addCase(TYPES.SUCCESS_UPDATE_POST, (state, action) => {
      state.error = false;
      state.loading = false;
      const updatedPostData = action.payload.data;
      state.data = state.data.map((post) =>
        post.id === updatedPostData.id ? updatedPostData : post,
      );
    })
    .addCase(TYPES.FAILURE_UPDATE_POST, (state) => {
      state.loading = false;
      state.error = true;
    })
    .addCase(offlineActionTypes.FETCH_OFFLINE_MODE, (state, action) => {
      const { prevAction } = action.payload;
      const reducer = {
        [TYPES.REQUEST_CREATE_POST]: () => {
          state.error = false;
          state.loading = false;
          state.data.push(prevAction.payload);
        },
        [TYPES.REQUEST_UPDATE_POST]: () => {
          state.error = false;
          state.loading = false;
          state.data = state.data.map((post) =>
            post?.id === prevAction.payload?.id ? prevAction.payload : post,
          );
        },
      };
      reducer[prevAction.type]();
    })
    .addCase(TYPES.LOGOUT_USER, (state) => {
      state.data = [];
      state.error = false;
      state.loading = false;
    })
    .addCase(TYPES.DELETE_POST, (state, action) => {
      state.data = state.data.filter((post) => post.id !== action.payload.id);

    })
});

export default postReducer;