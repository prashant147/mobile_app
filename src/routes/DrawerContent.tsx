// components/DrawerContent.js

import React, { useContext, useEffect, useState } from 'react';
import { View,StyleSheet, ScrollView, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import style from '../styles/style';
import COLORS from '../styles/theme/color';
import { normalize, scaleHeight, scaleWidth } from '../styles/utilities/dimentions';
import { useNavigation } from '@react-navigation/native';
import MembersContext from '../screen/Members/MembersContext';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogOut, getMember, readPostNotificationBymemberId, updateToken } from '../services/api/auth';
import { ActivityIndicator } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import Menu from './Menu';
import { isTablet } from 'react-native-device-info';
import GetLocation from 'react-native-get-location';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { CometChat } from '@cometchat/chat-sdk-react-native';

const DrawerContent = ({route}:any) => {

  const {setMessageCenter,setHideChatbot,selectedMenu, setSelectedMenu,setChatData,loggedInUser, setMsgUnreadCountUpdate,setLoggedInUser,setMsgUnreadCount,msgUnreadCount,setChatMessage,accessToken,setPostsCount,postsCount} = useContext(MembersContext);
  const [temperature, setTemperature] = useState(null);
  const token = AsyncStorage.getItem('accessToken');
  const [isDisabled, setIsDisabled] = useState(false);
  const buildNumber = DeviceInfo.getVersion();

  // useFocusEffect(React.useCallback(() => {
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 60000,
  // })
  // .then(location => {
  //     loadmyProfile(location);
  // })
  // .catch(error => {
  //     const { code, message } = error;
  //     console.warn(code, message);
  // })

   
  // }, [selectedMenu]));

  // const loadmyProfile = async(location:any)=>{
  //   let res = await getMember('',token)
  //   if(res.status ==200 ){
  //     fetchWeather(location,res.data.metadata.temperature=="Celsius"?2:1);
  //   }else{
  //     fetchWeather(location,1);
  //   }
  // }
  // const fetchWeather = async (location:any,IsTemperature:number) => {
  //     try {
  //       const response = await axios.get(
  //         `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=53b9fd2fec0e7254fe2eadde0fc8ab5c&units=metric`
  //       );
        
  //       const { main } = response.data;

  //       if(IsTemperature==2){  setTemperature(`${main.temp} °C`); }
  //       else{
  //         let metric = (main.temp * 9/5) + 32
  //         setTemperature(`${metric.toFixed(2)} °F`);
  //       } 
  //     } catch (error) {
  //       console.error('Error fetching weather data:', error);
  //     }
  //   };

  useEffect(() => {
    setMsgUnreadCountUpdate(false)
      // Handle incoming messages
      messaging().onMessage((remoteMessage) => {
        console.log('FCM Message Data:', remoteMessage);
        if(remoteMessage && remoteMessage.data && remoteMessage.data.badge){
          setMsgUnreadCount(Number(remoteMessage.data.badge))
        }
        setMsgUnreadCountUpdate(true)
      });
  
      // Handle background message (Android only)
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('FCM Background Message Data:', remoteMessage);
      });
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log('FCM onNotificationOpenedApp Message Data:', remoteMessage);
        setChatMessage(remoteMessage.data)
        // setChatData({id:remoteMessage.data.id,type:remoteMessage.data.type})
        navigation.navigate("WebChat");
      });
      // Check if the app was opened from a notification (cold start)
      messaging().getInitialNotification().then((remoteMessage) => {
        if (remoteMessage) {
          console.log('FCM getInitialNotification Message Data:', remoteMessage);
          setChatMessage(remoteMessage.data)
          // setChatData({ id: remoteMessage.data.id, type: remoteMessage.data.type });
          navigation.navigate("WebChat");
        }
      });
    }, []);


  const [logoutModal, setLogoutModal] = useState(false);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  
  const navigationHandler=(path,index,route)=>{
    setChatData(null)
    setChatMessage(null)
    setSelectedMenu(index)
    if(route){
      navigation.navigate(path, {resetPost: true});
    }else {
    navigation.navigate(path);
    }
  }
  
  const removeTokenHandler = async ()=>{
    try {
      setLoader(true)
      setIsDisabled(true);
      const response = await updateToken(loggedInUser?.id,token,'')
      if(response.status === 200){
      handleModalLogout()
      }
    } catch (error) {
      console.error(error) 
      handleModalLogout()
    }
  }
  const clearAsyncStorageExcept = async () => {
    const keysToKeep = ['password', 'username', 'applicationRole'];
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));
      await AsyncStorage.multiRemove(keysToRemove);
      console.log('Storage cleared except for:', keysToKeep);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };
  const handleModalLogout = async ()=>{
    const token = AsyncStorage.getItem('accessToken')
   try {
    setLoader(true)
    const response = await LogOut(token)
    if (!response.errors) {
     try {
      await messaging().deleteToken();
      clearAsyncStorageExcept()
      setMsgUnreadCount(null)
      setLoggedInUser([])
      CometChat.logout().then(
        () => {
          console.log('Logout successful');
          // Redirect to login screen or perform other actions after logout
        },
        error => {
          console.log('Logout failed with error:', error);
          // Handle the error
        }
      );
     } catch (error) {
      console.log(error);
     }
        // await AsyncStorage.clear()
        setLogoutModal(false)
        setLoader(false);
        setTimeout(() => {
          navigation.navigate("authStack")
        }, 200);
    }
   } catch (error) {
    console.error(error)
    try {
      await messaging().deleteToken();
      clearAsyncStorageExcept()
      setMsgUnreadCount(null)
      setLoggedInUser([])
     } catch (error) {
      console.log(error);
     }
    // await AsyncStorage.clear()
    setLogoutModal(false)
    setLoader(false)
    setTimeout(() => {
      navigation.navigate("authStack")
    }, 200);
   }
}
const postHandler = async() => {
  
  try {
    const response = await readPostNotificationBymemberId(loggedInUser?.id,accessToken);
    if(response.status === 200){
     setPostsCount("")        
   }
 } catch (error) {
   console.error(error)
 }
} 
  return (
    <View style={[style.contant]}>
        <Menu selectIndex={selectedMenu} hideNot={true}/>
        <ScrollView style={[styles.bgBlue]}>
            <TouchableOpacity style={[style.row,style.centerBox,selectedMenu == 0 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("Home",0),setMessageCenter(false),setHideChatbot(false)}}>
              <Image style={[styles.homeImg]} source={require('../assets/HomeS.png')} resizeMode={'contain'}/> 
              <Text style={[styles.sidebarText,selectedMenu === 0 ? style.primaryText : style.whiteText]}>Home</Text>
            </TouchableOpacity >

            <TouchableOpacity style={[style.mt10,style.centerBox,style.row,selectedMenu == 1 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("News",1),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/newS.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,selectedMenu === 1 ? style.primaryText : style.whiteText]}>News</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 13 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("Education",13),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/menu/Education.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,selectedMenu === 13 ? style.primaryText : style.whiteText]}>Education</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 2 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("Members",2),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/MembersS.png')} resizeMode={'contain'}/>
            <Text style={[styles.sidebarText,selectedMenu === 2 ? style.primaryText : style.whiteText]}>Members</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,{backgroundColor:selectedMenu == 15 ?'#D9D9D9':'transparent'},styles.sidebarItem]} onPress={() => {navigationHandler("Posts",15,{resetPost:true}),setMessageCenter(true),setHideChatbot(false);postHandler()}}>
            <View style={[style.row,style.centerBox]}>
            <Image style={[ styles.sidebarpostimg]} source={require('../assets/Post_icon.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,{color: selectedMenu === 15? "#0D2C6C": "#fff"}]}>Posts</Text>
            </View>
            {postsCount && postsCount > 0 ?
                        <View style={[styles.notificationCount,style.centerItem,style.centerBox,!isTablet() ? style.mt5 : style.mt10]}>
                        <Text style={[style.textCenter,{color:COLORS.WHITE}]}>{postsCount}</Text>          
                        </View>
                        : null}
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,{backgroundColor:selectedMenu == 5 ?'#D9D9D9':'transparent'},styles.sidebarItem]} onPress={() => {navigationHandler("WebChat",5),setMessageCenter(true),setHideChatbot(true)}}>
            <View style={[style.row,style.centerBox]}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/messageS.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,{color: selectedMenu === 5? "#0D2C6C": "#fff"}]}>Messages</Text>
            </View>
            {msgUnreadCount && msgUnreadCount > 0 ?
                        <View style={[styles.notificationCount,style.centerItem,style.centerBox,!isTablet() ? style.mt5 : style.mt10]}>
                        <Text style={[style.textCenter,{color:COLORS.WHITE}]}>{msgUnreadCount}</Text>          
                        </View>
                        : null}
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 4 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("RalliesEvents",4),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/rallies&events.png')} resizeMode={'contain'}/>
            <Text style={[styles.sidebarText,selectedMenu === 4 ? style.primaryText : style.whiteText]}>Events</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 14 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("Rallies",14),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/menu/Rallies.png')} resizeMode={'contain'}/>
            <Text style={[styles.sidebarText,selectedMenu === 14 ? style.primaryText : style.whiteText]}>Rallies</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 6 ? style.menuTextBg : style.transparentBg,,styles.sidebarItem]} onPress={() => {navigationHandler("ShipStore",6),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/ShopStore.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,selectedMenu === 6 ? style.primaryText : style.whiteText]}>Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 3 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("Volunteer",3),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/VolunteerS.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,selectedMenu === 3 ? style.primaryText : style.whiteText]}>Volunteer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 7 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("CrewWebview",7),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/crewS.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,selectedMenu === 7 ? style.primaryText : style.whiteText]}>Crew</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 8 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("Awards",8),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/rewardS.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,selectedMenu === 8 ? style.primaryText : style.whiteText]}>Awards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 9 ? style.menuTextBg : style.transparentBg,styles.sidebarItem] } onPress={() => {navigationHandler("Sponsers",9),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/SponsorsS.png')} resizeMode={'contain'}/> 
            <Text style={[styles.sidebarText,selectedMenu === 9 ? style.primaryText : style.whiteText]}>Sponsors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 10 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("Regulation",10),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarItemDim]} source={require('../assets/regulationS.png')} resizeMode={'contain'}/>
            <Text style={[styles.sidebarText,selectedMenu === 10 ? style.primaryText : style.whiteText]}>Privacy Policy</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={[style.mt10,style.row,style.centerBox,selectedMenu == 16 ? style.menuTextBg : style.transparentBg,styles.sidebarItem]} onPress={() => {navigationHandler("Feedback",16),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[ styles.sidebarpostimg]} source={require('../assets/Feedback.png')} resizeMode={'contain'}/>
            <Text style={[styles.sidebarText,selectedMenu === 16 ? style.primaryText : style.whiteText]}>Feedback</Text> 
            </TouchableOpacity>
            {/* <TouchableOpacity style={[style.mt10,style.row,{backgroundColor:selectedMenu == 11 ?'#D9D9D9':'transparent'},styles.sidebarItem]} onPress={() => {navigationHandler("Profile",11),setMessageCenter(false),setHideChatbot(false)}}>
            <Image style={[styles.sidebarItemDim]} source={require('../assets/profile.png')} resizeMode={'contain'}/>
            <Text style={[styles.sidebarText,{color: selectedMenu === 11 ? "#0D2C6C": "#fff"}]}>My Profile</Text> 
            </TouchableOpacity> */}
            <TouchableOpacity style={[style.row,style.centerBox,isTablet() ? style.mt0 : style.mt10]} onPress={() => setLogoutModal(true)}>
            <Image style={[styles.logout]} source={require('../assets/Logout.png')} resizeMode={'contain'}/>
            <Text style={[styles.logoutText]}>Log out</Text> 
            </TouchableOpacity>
            {/* <View style={[style.mH20,!isTablet() ? style.mt5 : style.mt10]}>
            {temperature && 
            <View style={[styles.WeatherImg]}>
              <Image style={[styles.tempIcon]} resizeMode='contain' source={require("../assets/icon/temp.png")}></Image>
              <Text style={[styles.temp1]}>{temperature}</Text>
            </View>
            }
            </View> */}
            <TouchableOpacity style={[style.centerBox,style.mt20]} onPress={() => navigation.navigate("ReleaseNotes")}>
              <Text style={[style.mt10,style.font14,style.boldTxt,style.whiteText]}>App version 2.0.5(41)</Text>
            </TouchableOpacity>
            <View style={style.mB30} />
        </ScrollView>

        <Modal isVisible={logoutModal} animationIn={'zoomIn'} animationOut={'zoomOut'}>
            <View style={{padding:20,backgroundColor:COLORS.WHITE,borderRadius:8}}>
                    <TouchableOpacity onPress={()=>setLogoutModal(false)} disabled={isDisabled} style={{alignSelf:'flex-end'}}>
                    <Icon name="close" size={25} color="#000" />
                    </TouchableOpacity >
                    <View>
                        
                        <Text style={[style.textCenter,style.font20,style.mtb10,{color:COLORS.PRIMARY,marginBottom:30},style.boldTxt]}>Are you sure want to Logout ?</Text>
                        <View style={[style.contentBetween,{marginHorizontal:Dimensions.get('screen').width * 0.07}]}>
                        <TouchableOpacity style={[style.button,style.whiteLayout,{width:Dimensions.get('screen').width * 0.25}]} disabled={isDisabled} onPress={() => setLogoutModal(false)}>
                        <Text style={[style.buttonTxt,style.primaryText,style.boldTxt,{fontSize:normalize(16),}]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.button,style.primaryLayout,{width:Dimensions.get('screen').width * 0.25}]} onPress={removeTokenHandler}>
                            {loader ? <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> :
                        <Text style={[style.buttonTxt,style.whiteText,style.boldTxt,{fontSize:normalize(16),}]}>Yes</Text>}
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                </View>
        </Modal>
    </View>
  );
};

export default DrawerContent;
const styles = StyleSheet.create({ 
  sidebarText: {
    fontSize:normalize(16),
    fontFamily:'Roboto-Regular',
    color:COLORS.WHITE,
    marginLeft:normalize(20),
    fontWeight:'600',   
    marginBottom:normalize(5)
},
logoutText: {
  fontSize:normalize(16),
  fontFamily:'Roboto-Regular',
  color:COLORS.WHITE,
  marginLeft:normalize(isTablet() ? 8 : 15),
  fontWeight:'600'
  
},
profile:{
  width:scaleWidth(24),height:scaleHeight(25)
},
logout:{
  width:normalize(isTablet() ? 60 : 38),
  height:normalize(isTablet() ? 55 : 38),
  marginLeft:normalize(!isTablet() ? 13 : 8)
},
  sidebarItemDim:{
    width:scaleWidth(isTablet() ? 75 : 30),
    height:scaleHeight(isTablet() ? 75 : 30),  
  },
  sidebarpostimg:{
    width:scaleWidth(isTablet() ? 83 :30),
    height:scaleHeight(isTablet() ? 76 :35) 
  },
  sidebarItem:{
    width:"100%",
    height: isTablet() ? normalize(50) : 38,
    paddingLeft:20,
    paddingTop:isTablet() ? normalize(10) : normalize(6),
  },
    menuCls:{
        paddingVertical:20,
        borderBottomColor:COLORS.WHITE,
        borderBottomWidth:1,
        paddingHorizontal:20
    },
    bg:{
        backgroundColor:COLORS.PRIMARY,paddingTop:50
    },  
    bgBlue:{
      backgroundColor:"#0D2C6C",
    },
    tempIcon:{
      height:scaleHeight(30),
      width:scaleWidth(isTablet() ? 50 :30),
      marginVertical:7
    },
    WeatherImg:{
      flexDirection:'row',
      alignContent:'center',
      alignItems:'center',
      justifyContent:'space-around', 
      backgroundColor: '#000000a6',
      borderWidth:0.1, borderRadius:30,
      paddingHorizontal:normalize(5),
      marginRight:scaleWidth(isTablet()? 30:5),
      // flex:0.7
      width:normalize(120)
    },
    temp1:{
      color:COLORS.WHITE,
      fontSize:scaleWidth(isTablet() ? 28 : 16),
      fontWeight:'bold',
      fontFamily:'Roboto-Regular',
    },
    homeImg:{
      width:scaleWidth(isTablet() ? 60 : 28),
      height:scaleHeight(isTablet() ? 57 : 25), 
      marginLeft:normalize(isTablet() ? 5 : 2)
    },
    notificationCount:{
      backgroundColor:COLORS.YELLOW,
      color:COLORS.WHITE,
      borderRadius:10,
      paddingHorizontal:normalize(5),
      fontWeight:"bold",
      fontSize:normalize(10),
      height:normalize(20),
      marginHorizontal:normalize(10)
    },
    sidebarBotimg:{
      width:scaleWidth(isTablet() ? 83 :23),
      borderRadius:5,
      marginLeft:5,
      height:scaleHeight(isTablet() ? 76 :27)
    },
})