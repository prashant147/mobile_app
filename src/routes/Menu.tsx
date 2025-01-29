import React, { useContext, useEffect, useState } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import { View,Text, StyleSheet,Image } from "react-native";
import COLORS from "../styles/theme/color";

import { scaleHeight, scaleWidth,normalize } from "../styles/utilities/dimentions";
import style from "../styles/style";
import {  useNavigation,useFocusEffect,useRoute } from "@react-navigation/native";
import {  useDrawerStatus } from "@react-navigation/drawer";
import MembersContext from "../screen/Members/MembersContext";
import { connectedUsersChat, getAllLoggedinUserGroups, getMember,getNotificationsByMemberId, getUserUnreadCount } from "../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo, { isTablet } from 'react-native-device-info';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotificationIcon from 'react-native-vector-icons/FontAwesome5';
import { Platform } from "react-native";
import PushNotification from 'react-native-push-notification';
import FastImage from "react-native-fast-image";
import { getLoggedInUserUnreadCount } from "../services/CometUtils";


const Menu = (props:any) => {
    const {setChatData,setLoggedInUser,hideChatbotMember,loggedInUserUpdate,loggedInUser,notUpdate,msgUnreadCount,setMsgUnreadCount,notificationCount,setNotificationCount,msgUnreadCountUpdate,setMsgUnreadCountUpdate,setHideChatbot}=useContext(MembersContext)
    const navigate = useNavigation();
    const activeRoute = useRoute();
    const isDrawerOpen = useDrawerStatus();
    const [loggedInMember, setLoggedInMember] = useState(null);
    const token = AsyncStorage.getItem('accessToken')
    const navigationHandler=(path)=>{
        setChatData(null)
        navigate.navigate(path);
    }
 
    const openProfile = ()=>{ 
        navigate.navigate('MemberCard')
      }    
    useFocusEffect(
     React.useCallback(() => {
        console.log("activeRoute", activeRoute.name);
     }, [activeRoute])
    );
      useFocusEffect(
        React.useCallback(() => {
          const getUnreadChat = async () => {
            try {
                const response = await getUserUnreadCount(token);
                if (response.status === 200) {
                 setMsgUnreadCount(response.data)
                }
            } catch (error) {}
          };
        //   getUnreadChat();
        getLoggedInUserUnreadCount(setMsgUnreadCount,setMsgUnreadCountUpdate)
        }, [msgUnreadCountUpdate])
      );
      useEffect(() => {
        const setBadgeCount = async () => {
            if(Platform.OS === 'ios'){
                if (msgUnreadCount > 0 ) {
                    PushNotificationIOS.setApplicationIconBadgeNumber(msgUnreadCount);
                }else{
                    PushNotificationIOS.setApplicationIconBadgeNumber(0);
    
                }
            }else if (Platform.OS === 'android') {
                const deviceManufacturer = DeviceInfo.getBrand();          
                if(msgUnreadCount > 0 ){
                    if (deviceManufacturer.toLowerCase() !== 'samsung') {
                        PushNotification.setApplicationIconBadgeNumber(msgUnreadCount);
                    }
                    }else{
                    if (deviceManufacturer.toLowerCase() !== 'samsung') {
                        PushNotification.setApplicationIconBadgeNumber(0);
                  }
                }
              }
         
        };
        setBadgeCount();
    }, [msgUnreadCount]);
    
      useEffect(() => {
          const getMemberHandler = async () => {
            try {
              const response = await getMember('',token);
              if (response.status === 200) {
                setLoggedInUser(response.data)
                setLoggedInMember(response.data)
                await AsyncStorage.setItem('userStatus',response.data.status);
              }
            } catch (error) {
              console.error(error);
            }
          };
          if(props.selectIndex !== 5){
              getMemberHandler();
          }
        }, [loggedInUserUpdate,props.selectIndex]);

        useFocusEffect(
            React.useCallback(() => {
            const getNotifications = async() => {
                try {
                    const response = await getNotificationsByMemberId(loggedInUser?.id,token);
                    if(response.status === 200){
                        if (response.data[0]?.message === "No Records Found") {
                            setNotificationCount(null)
                        }else {
                        const getUnread = response.data.filter((item:any) => !item.isRead)
                        setNotificationCount(getUnread && getUnread.length)
                    }
                }
                } catch (error) {
                    console.error(error); 
                }
            }
            if(loggedInUser?.id && props.selectIndex !== 5){
                getNotifications()
            }
        },[loggedInUserUpdate,notUpdate,loggedInUser,props.selectIndex]))
    
      
    return  <View style={[style.contentBetween,style.centerBox,style.pH20,{backgroundColor:props.hideNot ? COLORS.WHITE :COLORS.PRIMARY}]}>
                <View style={[style.row,style.centerBox]}>
                    <TouchableOpacity style={[style.centerBox,{marginRight:10}]} onPress={()=> {
                        Keyboard.dismiss(); 
                        if(isDrawerOpen === 'open'){
                            let pa = "Home";
                            if(props.selectIndex==1){ pa = "News" }
                            else if(props.selectIndex==13){ pa = "Education" }
                            else if(props.selectIndex==2){ pa = "Members" }
                            else if(props.selectIndex==3){ pa = "Volunteer" }
                            else if(props.selectIndex==4){ pa = "RalliesEvents" }
                            else if(props.selectIndex==14){ pa = "Rallies" }
                            else if(props.selectIndex==5){ pa = "WebChat" }
                            else if(props.selectIndex==6){ pa = "ShipStore" }
                            else if(props.selectIndex==7){ pa = "Crew" }
                            else if(props.selectIndex==8){ pa = "Awards" }
                            else if(props.selectIndex==9){ pa = "Sponsers" }
                            else if(props.selectIndex==10){ pa = "Regulation" }
                            else if(props.selectIndex==11){ pa = "Profile" }
                            else if(props.selectIndex==15){ pa = "Posts" }
                            else if(props.selectIndex==16){ pa = "Feedback" }
                            else if(props.selectIndex==17){ pa = "ChatBot" }
                            navigate.navigate(pa);
                        }else{
                            navigate.openDrawer();
                        }
                       
                        }}> 
                        <Image source={require("../assets/menu/hamburger.png")} alt="" style={[styles.humburgerMenuIcon]} tintColor={props.hideNot ? COLORS.PRIMARY :COLORS.WHITE} resizeMode={'contain'}/>
                    </TouchableOpacity>

                    <View style={[style.contentBetween,props.hideNot ? style.contant: null]}>
                    {props.hideNot && <TouchableOpacity style={[style.row,styles.profileIcon,style.centerBox]} onPress={()=>openProfile()}>
                    <Image resizeMode='cover' style={[styles.userImg]} source={loggedInUser?.profileUrl ? {uri : loggedInUser.profileUrl} : require("../assets/human.png")}></Image>
                    </TouchableOpacity>}
                    {props.hideNot && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigate.navigate("Notifications")}>
                     <NotificationIcon name="bell" size={29} color={COLORS.PRIMARY} style={[style.mH15]}/>
                    {notificationCount && notificationCount > 0 ?
                    <View style={[styles.notificationCountmenu]}>
                    <Text style={[style.textCenter,{color:COLORS.BLACK}]}>{notificationCount}</Text>          
                    </View>
                    : null}
                    </TouchableOpacity>
                        }
                        {!props.hideNot && props.selectIndex == 0 &&
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Home")}>
                        <FastImage style={[styles.headerLogo]} source={{uri:'https://admin.qennect.com/media/SaltyDawg-LOGO-wbg.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} resizeMode={FastImage.resizeMode.contain}/>
                        </TouchableOpacity>}
                    </View>
                        {!props.hideNot && props.selectIndex == 1 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("News")}>
                        <Image style={[ style.mtb10,styles.headerActiveIcon]} source={require('../assets/newS.png')} resizeMode={'contain'}/>
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>News</Text> 
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 13 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Education")}>
                        <Image style={[ style.mtb10,styles.headerActiveIcon]} source={require('../assets/menu/Education.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Education</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 2 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Members")}>
                        <Image style={[ style.mtb10,styles.headerActiveIcon]} source={require('../assets/MembersS.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Members</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 3 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Volunteer")}>
                        <Image style={[ style.mtb10,styles.headerActiveIcon]} source={require('../assets/VolunteerS.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Volunteer</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 4 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("RalliesEvents")}>
                        <Image style={[style.mtb10, styles.headerActiveIcon]} source={require('../assets/rallies&events.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font14,style.whiteText,style.boldTxt,styles.SectionBox]}>Events</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 14 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Rallies")}>
                        <Image style={[style.mtb10, styles.headerActiveIcon]} source={require('../assets/menu/Rallies.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Rallies</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 15 && 
                    <TouchableOpacity style={[style.row,style.centerBox]}>
                        <Image style={[style.mtb10,styles.menuSidebarIcon,style.mt15]} source={require('../assets/Post_icon.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Posts</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 5 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("WebChat")}>
                        <Image style={[style.mtb10, styles.headerActiveIcon]} source={require('../assets/messageS.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Messages</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 6 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("ShipStore")}>
                        <Image style={[style.mtb10, styles.headerActiveIcon]} source={require('../assets/ShopStore.png')} resizeMode={'contain'}/>
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Store</Text> 
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 7 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("CrewWebview")}>
                        <Image style={[ style.mtb10,styles.headerActiveIcon]} source={require('../assets/crewS.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Crew</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 8 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Awards")}>
                        <Image style={[ style.mtb10,styles.headerActiveIcon]} source={require('../assets/rewardS.png')} resizeMode={'contain'}/>
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Awards</Text> 
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 9 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Sponsers")}>
                        <Image style={[style.mtb10, styles.headerActiveIcon]} source={require('../assets/SponsorsS.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Sponsors</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 10 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Regulation")}>
                        <Image style={[style.mtb10, styles.headerActiveIcon]} source={require('../assets/regulationS.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Privacy Policy</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 11 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("profile")}>
                        <Image style={[style.mtb10,styles.headerMenuActiveIcon]} source={require('../assets/profile.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>My Profile</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 16 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("Feedback")}>
                        <Image style={[style.mtb10, styles.headerActiveIcon]} source={require('../assets/Feedback.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>Feedback</Text>
                        </TouchableOpacity>}
                        {!props.hideNot && props.selectIndex == 17 && 
                    <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigationHandler("ChatBot")}>
                        <Image style={[style.mtb10, styles.headerActiveIcon]} source={require('../assets/logo.png')} resizeMode={'contain'}/> 
                        <Text style={[isTablet() ? style.font24 : style.font18,style.whiteText,style.boldTxt,styles.SectionBox]}>ChatBot</Text>
                        </TouchableOpacity>}
            </View>
            {!props.hideNot &&<View style={[style.row,style.centerBox,style.mtb5]}>
                        <TouchableOpacity style={[style.mtb5,style.centerBox,style.mH10]} onPress={() => {navigate.navigate("ChatBot");setHideChatbot(true)}}>
                    <Image style={[styles.botImg]} source={require("../assets/logo.png")} resizeMode='cover'/>
                    <Text style={[style.font12,style.whiteText,style.textCenter]}>Dawg Bot</Text>
                    </TouchableOpacity>
               {<TouchableOpacity style={[style.row,style.mtb5]} onPress={()=>openProfile()}>
                    <Image style={[styles.userImg]} source={loggedInUser?.profileUrl ? {uri : loggedInUser.profileUrl} : require("../assets/human.png")}></Image>
                </TouchableOpacity>}
                {notificationCount && notificationCount > 0 ?
                <View style={[style.mB15,styles.notificationCount,style.centerItem,style.centerBox]}>
                <Text style={[style.textCenter,{color:COLORS.YELLOW}]}>{notificationCount}</Text>          
                </View>
                : null}
            </View>}
        </View>
}
const styles = StyleSheet.create({
    becomeMember:{
        borderColor:COLORS.WHITE,
        borderWidth:1,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(8),
        borderRadius:5
    },
    headerLogo:{
        width:normalize(95),
        height:scaleHeight(35)
      },
    sidebarText: {
        fontSize:normalize(16),
        fontFamily:'Roboto-Regular',
        color:COLORS.WHITE,
        // marginTop:normalize(5),
        marginLeft:normalize(20),
        fontWeight:'600'
        
    },
    sidebarBottom:{
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
    },
    sidebarItem:{
        width:"100%",height:38,paddingLeft:20,paddingTop:6     
    }
    ,sidebarItemDim:{
    width:scaleWidth(30),height:scaleHeight(30)    
    },
    profile:{
        width:scaleWidth(24),height:scaleHeight(25)
    },
    logout:{
        width:scaleWidth(50),height:scaleHeight(45)
    },
    bgBlue:{
        backgroundColor:"#0D2C6C"
    },
    sidebarBtn:{
        paddingBottom:normalize(90),
        marginTop:10
    },
    notificationCount:{
        backgroundColor:COLORS.WHITE,
        color:COLORS.WHITE,
        borderRadius:50,
        paddingVertical:normalize(1),
        paddingHorizontal:normalize(5),
        fontWeight:"bold",
        fontSize:normalize(12),
        display:"flex",
        marginBottom:25,
        marginLeft:-14,
        alignItems:"center",
        justifyContent:"center"
    },
    notificationCountmenu:{
        backgroundColor:COLORS.YELLOW,
        color:COLORS.WHITE,
        borderRadius:50,
        paddingVertical:normalize(1),
        paddingHorizontal:normalize(5),
        fontWeight:"bold",
        fontSize:normalize(12),
        display:"flex",
        marginBottom:25,
        marginLeft:-14,
        alignItems:"center",
        justifyContent:"center"
    },
    SectionBox:{
        paddingVertical:scaleHeight(20),
        paddingHorizontal:10
      },
      mapIcon:{
        width: scaleWidth(37),
        height: scaleHeight(39)
    },
    profileImg: {
        width: normalize(30),
        height: normalize(30),
        borderRadius:50 
      },
      botImg:{
        width: normalize(25),
        height: normalize(25),
        backgroundColor:COLORS.WHITE,
        borderRadius:50
      },
      userImg:{
        width:normalize(isTablet() ? 50:30),
        height:normalize(isTablet() ? 50:30),
        marginHorizontal:5,
        borderRadius:30
      },
      profileIcon:{
        marginVertical:scaleHeight(10)
      },
      saltydawgLogo:{
        width:scaleWidth(130),
        height:scaleHeight(50)
      },
      iconSize:{
        width:normalize(26),
        height:normalize(26)
      },
      menuSidebarIcon:{
        width:scaleWidth(isTablet() ? 60:30),
        height:scaleHeight(isTablet() ? 55:38)
    },
    humburgerMenuIcon:{
        width:normalize(isTablet() ? 38 :28),
        height:normalize(isTablet() ? 38 :28)
    },
    headerActiveIcon:{
        width:scaleWidth(isTablet() ? 60:30),
        height:scaleHeight(isTablet() ? 55 :38),
        marginTop:15
    },
    headerMenuActiveIcon:{
        width:scaleWidth(isTablet() ? 60 : 30),
        height:scaleHeight(isTablet() ? 60 : 30),
        marginTop:15
    }
})
export default Menu;