import {
  checkInternetConnection,
  createNetworkMiddleware,
} from 'react-native-offline';
import { handleMetaNavigation } from '../services/utils';

export const handleOfflineActionsMiddleware = (actionTypes) => (store) => (
  next,
) => async (action) => {
  // console.log('OFFLINE_ACTIONS >> ', action)
  try {
    if (!actionTypes.includes(action.type)) {
      return next(action);
    }
    const isConnected = await checkInternetConnection();
    if (isConnected) {
      return next(action);
    }
    handleMetaNavigation(action.meta);
    if (action.meta.retry) {
      action.meta.queued = true;
    }
    return next(action);
  } catch (error) {
    console.log(error);
    next(action);
  }
};

const createOfflineMiddleware = ({ actionTypes }) => {
  return {
    handleOfflineActionsMiddleware: handleOfflineActionsMiddleware(actionTypes),
    networkMiddleware: createNetworkMiddleware({ actionTypes }),
  };
};

export default createOfflineMiddleware;
