import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {persistor, store} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import StackNavigator from './StackNavigator';
import {COLORS} from './constants';
import {navigationRef} from './services/NavigationService';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <NavigationContainer ref={navigationRef}>
          <StatusBar backgroundColor={COLORS.PRIMARY} />
          <StackNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
