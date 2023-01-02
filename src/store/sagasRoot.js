import { all, fork, takeEvery } from 'redux-saga/effects';
import { networkSaga } from 'react-native-offline';
import TYPES from './types';
import {
  asyncRequestCreatePostSaga,
  asyncRequestFindPostsSaga,
  asyncRequestUpdatePostSaga,
} from './reducers/PostsSaga';

export default function* root() {
  yield all([
    // takeEvery(TYPES.REQUEST_FIND_USER_BY_ID, asyncRequestFindUserById),
    takeEvery(TYPES.REQUEST_CREATE_POST, asyncRequestCreatePostSaga),
    takeEvery(TYPES.REQUEST_FIND_POSTS, asyncRequestFindPostsSaga),
    takeEvery(TYPES.REQUEST_UPDATE_POST, asyncRequestUpdatePostSaga),
    fork(networkSaga),
  ]);
}
