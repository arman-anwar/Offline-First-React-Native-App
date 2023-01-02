import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { reducer as network } from 'react-native-offline';
import createSagaMiddleware from 'redux-saga';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import user from './ducks/UserDuck';
import postReducer from './reducers/PostsSlice';
import rootSagas from './sagasRoot';
import Reactotron from '../config/ReactotronConfig';
import TYPES from './types';
import createOfflineMiddleware from './offlineMiddleware';

const sagaMonitor = Reactotron.createSagaMonitor();
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });


// console.log('postReducer>> ' , postReducer.reducer)
const {
  handleOfflineActionsMiddleware,
  networkMiddleware,
} = createOfflineMiddleware({
  actionTypes: [
    TYPES.REQUEST_CREATE_POST,
    TYPES.REQUEST_UPDATE_POST,
    TYPES.REQUEST_FIND_POSTS,
  ],
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
};

const reducer = combineReducers({
  // user,
  posts: postReducer,
  network,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  enhancers: [Reactotron.createEnhancer()],
  middleware: [
    handleOfflineActionsMiddleware,
    networkMiddleware,
    sagaMiddleware,
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  ],
});

sagaMiddleware.run(rootSagas);

const persistor = persistStore(store);

export { persistor, store };
