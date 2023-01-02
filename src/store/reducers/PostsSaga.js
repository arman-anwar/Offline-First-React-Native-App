import { call, put } from 'redux-saga/effects';
import {
  handleMetaNavigation,
} from '../../services/utils';
import {
  findPostsByUser,
  updatePost,
  createPostAPI,
} from '../../services/GoRestService';
import { createPostRequest, findPostFailure, updatePostFailure, createPostSuccess, findPostSuccess, updatePostSuccess, updatePostRequest } from './PostsSlice';

// sagas
export function* asyncRequestCreatePostSaga(action) {
  try {
    const { name, email, id } = action.payload;
    const response = yield call(createPostAPI, { name, email });
    const code = response.status;
    if (code === 201) {
      yield put(
        createPostSuccess({
          data: response.data,
          offlineId: id < 0 ? id : null,
          queued: action.meta.queued,
        }),
      );

      return handleMetaNavigation(action.meta);
    }
    console.log('failure', response.data);
    yield put(createPostFailure());
  } catch (err) {
    if (err.message === 'Network Error') {
      const { name, email } = action.payload;
      return yield put(createPostRequest({ name, email }));
    }
    console.log('failure catch', err);
    yield put(createPostFailure());
  }
}

export function* asyncRequestFindPostsSaga(action) {
  try {
    const response = yield call(findPostsByUser);

    yield put(findPostSuccess({ data: response.data }));
  } catch (err) {
    console.log('failure catch', err);
    yield put(findPostFailure());
  }
}

export function* asyncRequestUpdatePostSaga(action) {
  try {
    const { id, name, email } = action.payload;
    const response = yield call(updatePost, { postId: id, name, email });
    // console.log('response', response.status)
    const code = response.status;
    if (code === 200) {
      yield put(updatePostSuccess({ data: response.data }));
      return handleMetaNavigation(action.meta);
    }
    console.log('failure', response.data);
    yield put(updatePostFailure());
  } catch (err) {
    console.log(err.message);
    if (err.message === 'Network Error') {
      const { id, name, email } = action.payload;
      return yield put(updatePostRequest({ id, name, email }));
    }
    yield put(updatePostFailure());
  }
}