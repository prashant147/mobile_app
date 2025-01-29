// Navigation.tsx
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../screen/Login/login';
import Signup from '../screen/Signup/signup';
import Forgotpassword from '../screen/Login/forgotPassword';
import Resetpassword from '../screen/Login/resetPassword';

import BecomeMember from '../screen/BecomeMember/BecomeMember';
import MainNavigation from './MainNavigation';
import UpdatePassword from '../screen/Login/UpdatePassword';
import ChatWidget from '../components/chatbot/Ui';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screen/Login/splashScreen';
import InternetInfo from '../components/InternetInfo/InternetInfo';
import { navigationRef } from './NavigationRef';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AuthStack = createStackNavigator();
const mainStack = createStackNavigator();


const CreateAuthStack = () => (
  <AuthStack.Navigator initialRouteName="SplashScreen">
    <AuthStack.Screen
      name="SplashScreen"
      component={SplashScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Signup"
      component={Signup}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="ForgotPassword"
      component={Forgotpassword}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Resetpassword"
      component={Resetpassword}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="BecomeMember"
      component={BecomeMember}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="UpdatePassword"
      component={UpdatePassword}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);
const Navigation = ({isKeyboardOpen}:any) => {

  return (
    <NavigationContainer ref={navigationRef}>
       <Stack.Navigator initialRouteName="authStack">
           <Stack.Screen
            name='authStack'
            component={CreateAuthStack}
            options={{headerShown: false,gestureEnabled:false}}
            />
            <Stack.Screen
              name='Main'
              component={MainNavigation}
              options={{headerShown: false}}
            />
       </Stack.Navigator>
      
      {!isKeyboardOpen &&<ChatWidget />}
      <InternetInfo/>
    </NavigationContainer>
  );
};

export default Navigation;
