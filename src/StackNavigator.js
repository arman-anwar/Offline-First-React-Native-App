import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import {
  PostScreen,
  PostListScreen,
} from './screens';
import { HeaderButtons } from './library';
import { COLORS } from './constants';
import { logoutUser } from './store/actions';


const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.PRIMARY },
  headerBackTitleStyle: { color: 'white' },
  headerTitleStyle: { color: 'white' },
  headerPressColorAndroid: COLORS.DARK,
  headerTintColor: 'white',
};

const StackNavigator = () => {
  const dispatch = useDispatch();


  return (
    <Stack.Navigator
      initialRouteName="Posts"
      screenOptions={screenOptions}>

      <Stack.Screen
        name="Posts"
        component={PostListScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <HeaderButtons
              onLogoutPress={() => dispatch(logoutUser())}
              onAddPress={() => navigation.navigate('Post')}
            />
          ),
        })}
      />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );

};

export default StackNavigator;
