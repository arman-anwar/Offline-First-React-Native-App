import { offlineActionTypes } from 'react-native-offline';
import TYPES from '../types';
import { createSlice } from '@reduxjs/toolkit'

import {
  generateId,
  getOfflineMeta,
  sortByTitle,
} from '../../services/utils';

const initialState = {
  data: [],
  error: false,
  loading: false,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    createPostRequest: {
      reducer: (state, action) => {
        state.isLoading = false
      },
      prepare: ({ name, email }) => {
        return {
          payload: {
            name, email,
            id: generateId(),
          },
          meta: getOfflineMeta({ navigationMethod: 'goBack' }),
        };
      }
    },
    findPostRequest: {
      reducer: (state, action) => {
        state.loading = true;
      },
      prepare: () => {
        return {
          meta: getOfflineMeta({ retry: false }),
        }
      }
    },
    updatePostRequest: {
      reducer: (state, action) => {
        state.loading = true;
      },
      prepare: ({ name, email, id }) => {
        return {
          payload: {
            name,
            email,
            id
          },
          meta: getOfflineMeta({ navigationMethod: 'goBack' }),
        };
      }
    },
    createPostSuccess: {
      reducer: (state, action) => {
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
      }
    },
    createPostFailure: {
      reducer: (state, action) => {
        state.loading = true;
      }
    },
    findPostSuccess: {
      reducer: (state, action) => {
        state.error = false;
        state.loading = false;
        state.data = action.payload.data;
      }
    },
    findPostFailure: {
      reducer: (state, action) => {
        state.error = true;
        state.loading = false;
      }
    },
    updatePostSuccess: {
      reducer: (state, action) => {
        state.error = false;
        state.loading = false;
        const updatedPostData = action.payload.data;
        state.data = state.data.map((post) =>
          post.id === updatedPostData.id ? updatedPostData : post,
        );
      }
    },
    updatePostFailure: {
      reducer: (state, action) => {
        state.loading = false;
        state.error = true;
      }
    },
    deletePostRequest: {
      reducer: (state, action) => {
        state.data = state.data.filter((post) => post.id !== action.payload.id);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(offlineActionTypes.FETCH_OFFLINE_MODE, (state, action) => {
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
  }
})

export const { createPostRequest, updatePostRequest, createPostSuccess, updatePostFailure, findPostRequest, findPostSuccess, findPostFailure, getUsersSuccess, getUsersFetch, updatePostSuccess, updateUserSuccess } = postsSlice.actions

export default postsSlice.reducer