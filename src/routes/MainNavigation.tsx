// Navigation.tsx
import * as React from 'react';
import { useEffect } from 'react';
import { NavigationProp} from '@react-navigation/native';
import {Dimensions, View} from 'react-native';
import HomePage from '../screen/Home/Home';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../styles/style';

import ChatBot from '../screen/chatBot';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import NewsScreen from '../screen/News&Education/News/News';
import NewsIphoneScreen from '../screen/News&Education/News/NewsIphoneScreen';
import Education from "../screen/Education/Education";
import MembersPage from '../screen/Members/Members';
import CrewScreen from '../screen/Crew';
import Volunteer from '../screen/Volunteer';
import AwardsScreen from '../screen/Awards';
import ClassifiedsScreen from '../screen/Classifieds';
import SponsersScreen from '../screen/Sponsers';
import RegulationSceen from '../screen/Regulation';
import Eventform from '../screen/Home/EventForm';

import Membercard from '../screen/Home/memberCard';
import EventsScreen from '../screen/Events';
import MessageCenter from '../screen/MessageCenter/MessageCenter';
// import { MembersProvider } from '../screen/Members/MembersContext';
import MyRequest from '../screen/Crew/MyRequest';
import MyApplications from '../screen/Crew/MyApplications';
import MemberDetails from '../screen/Members/MemberDetails';
import Registercrew from '../screen/Crew/RegisterCrew';
import Rallies from '../screen/Events/Rallies';
import LinkedprofilesForm from '../screen/Profile/LinkedprofilesForm';
import AddCrew from '../screen/Profile/AddCrew';
import ApplicationDetails from '../screen/Crew/ApplicationDetails';
import myApplicationDetail from '../screen/Crew/myApplicationDetail';
import RallyForm from '../screen/Events/RallyForm';
import ProfilePage from '../screen/Profile';
import Webview from '../screen/Webview';
import MyApplicationsTabs from '../screen/Crew/MyApplicationsTabs';
import Notification from '../screen/Notifications/Notification';
import WebChat from '../screen/MessageCenter/WebChat';
import SelectedNews from '../screen/News&Education/News/SelectNews'
import Post from '../screen/Home/Posts';
import PostDetails from '../screen/Home/PostsDetails';
import ReleaseNotes from './ReleaseNotes';
import AwardsUserInfo from '../screen/Awards/AwardsUserInfo';
import EventsWeb from '../screen/Classifieds/EventsWeb';
import RalliesWeb from '../screen/Classifieds/RallyWeb';
import CrewWeb from '../screen/Classifieds/crewWeb';
import MemberMap from '../screen/Members/MemberMap';
import EducationWebview from '../screen/EducationWebview';
import Feedback from '../screen/Feedback/index';
import CometChatScreen from '../screen/MessageCenter/CometChatScreen';
import Likes from '../screen/Home/Likes';
import EditPost from '../screen/Home/EditPost';
import RallyMap from '../screen/Events/RallyMap';

export const Drawer = createDrawerNavigator();

const MainNavigation = () => {
  const isTablet = DeviceInfo.isTablet();
  const token =  AsyncStorage.getItem('accessToken')
  return (
        <Drawer.Navigator initialRouteName={"Home"} screenOptions={{drawerStyle:{width:Dimensions.get('screen').width / 1.25,}}}  drawerContent={(props) => <DrawerContent {...props} />}>
          <Drawer.Screen name="Home" component={HomePage} options={{headerShown:false}} />
          <Drawer.Screen name="ChatBot" component={ChatBot} options={{headerShown: false}}  />
          <Drawer.Screen name="MyRequest" component={MyRequest} options={{headerShown: false}}  />
          <Drawer.Screen name="Profile" component={ProfilePage} options={{headerShown: false}}  />
          <Drawer.Screen name="Members" component={MembersPage} options={{headerShown: false}}  />
          <Drawer.Screen name="MemberMap" component={MemberMap} options={{headerShown: false}}  />
          <Drawer.Screen name="Crew" component={CrewScreen} options={{headerShown: false}}  />
          <Drawer.Screen name="Volunteer" component={Volunteer} options={{headerShown: false}}  />
          <Drawer.Screen name="RalliesEvents" component={EventsScreen} options={{headerShown: false}}  />
          <Drawer.Screen name="Rallies" component={Rallies} options={{headerShown: false}}  />
          <Drawer.Screen name="Awards" component={AwardsScreen} options={{headerShown: false}}  />
          <Drawer.Screen name="MessageCenter" component={MessageCenter} options={{headerShown: false}}  />
          <Drawer.Screen name="ShipStore" component={ClassifiedsScreen} options={{headerShown: false}}  />
          <Drawer.Screen name="EventWebview" component={EventsWeb} options={{headerShown: false}}  />
          <Drawer.Screen name="RalliesWebview" component={RalliesWeb} options={{headerShown: false}}  />
          <Drawer.Screen name="CrewWebview" component={CrewWeb} options={{headerShown: false}}  />
          <Drawer.Screen name="Sponsers" component={SponsersScreen} options={{headerShown: false}}  />
          <Drawer.Screen name="Regulation" component={RegulationSceen} options={{headerShown: false}}  />
          <Drawer.Screen name="Eventform" component={Eventform} options={{headerShown: false}}  />
          <Drawer.Screen name="MemberCard" component={Membercard} options={{headerShown: false}}  />
          <Drawer.Screen name="MyApplications" component={MyApplications} options={{headerShown: false}}  />
          <Drawer.Screen name="MemberDetails" component={MemberDetails} options={{headerShown: false}}  />
          <Drawer.Screen name="Registercrew" component={Registercrew} options={{headerShown: false}}  />
          <Drawer.Screen name="Education" component={Education} options={{headerShown: false}}  />
          <Drawer.Screen name="LinkedProfilesForm" component={LinkedprofilesForm} options={{headerShown: false}}  />
          <Drawer.Screen name="Addcrew" component={AddCrew} options={{headerShown: false}}  />
          <Drawer.Screen name="myApplicationDetail" component={myApplicationDetail} options={{headerShown: false}}  />
          <Drawer.Screen name="ApplicationDetails" component={ApplicationDetails} options={{headerShown: false}}  />
          <Drawer.Screen name="MyApplicationsTabs" component={MyApplicationsTabs} options={{headerShown: false}}  />
          <Drawer.Screen name="Webview" component={Webview} options={{headerShown: false}}  />
          <Drawer.Screen name="Notifications" component={Notification} options={{headerShown: false}}  />
          <Drawer.Screen name="RallyForm" component={RallyForm} options={{headerShown: false}}  />
          {/* <Drawer.Screen name="WebChat" component={WebChat} options={{headerShown: false}}  /> */}
          <Drawer.Screen name="WebChat" component={CometChatScreen} options={{headerShown: false}}  />
          <Drawer.Screen name="SelectedNews" component={SelectedNews} options={{headerShown: false}}  />
          <Drawer.Screen name="Posts" component={Post} options={{headerShown: false}}  />
          <Drawer.Screen name="postsDetails" component={PostDetails} options={{headerShown: false}}  />
          <Drawer.Screen name="ReleaseNotes" component={ReleaseNotes} options={{headerShown: false}}  />
          <Drawer.Screen name="AwardsUserInfo" component={AwardsUserInfo} options={{headerShown: false}}  />
          <Drawer.Screen name="News" component={NewsIphoneScreen} options={{headerShown: false}} />
          <Drawer.Screen name="EducationWebview" component={EducationWebview} options={{headerShown: false}}  />
          <Drawer.Screen name="Feedback" component={Feedback} options={{headerShown: false}}  />
          <Drawer.Screen name='Likes' component={Likes} options={{headerShown: false}}/>
          <Drawer.Screen name='EditPost' component={EditPost} options={{headerShown: false}}/>
          <Drawer.Screen name='RallyMap' component={RallyMap} options={{headerShown: false}}/>
        </Drawer.Navigator>
  );
};

export default MainNavigation;