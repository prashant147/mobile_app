import React, {useState,useEffect,useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  BackHandler
} from 'react-native';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import DeviceInfo from 'react-native-device-info';
import UserInfo from '../../components/UserInfo';
import Menu from '../../routes/Menu';
import MembersContext from '../Members/MembersContext';
import { clearAllNotificationByMemberId, clearNotificationById, getNotificationsByMemberId, readAllNotificationsByMemberId, readNotificationById } from '../../services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { normalize } from '../../styles/utilities/dimentions';
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { dateFormat } from '../../styles/utilities/variables';
import { useFocusEffect } from '@react-navigation/native';

const Notification = ({route}) => {
    const isTablet = DeviceInfo.isTablet();
    const token = AsyncStorage.getItem('accessToken');
    const {loggedInUser,setNotUpdate } = useContext(MembersContext);
    const [notificationData, setNotificationData] =  useState([]);
    const [loader, setLoader] = useState(false);
    const [updateSuccess,setUpdateSuccess] = useState(false);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const navigate = useNavigation();
    
    useFocusEffect(
      React.useCallback(() => {
        const getData = async() => {
            try {
                setLoader(true)
                setNotUpdate(false)
                setIsPopoverVisible(false)
                const response = await getNotificationsByMemberId(loggedInUser?.id,token)
                if(response.status === 200){
                  if (response.data[0]?.message === "No Records Found") {
                    setLoader(false)
                    setNotificationData([])
                  } else {
                    setNotificationData(response.data)
                    setNotUpdate(true)
                    setLoader(false)
                }
              }
            } catch (error) {
                console.log(error)
                setLoader(false)
            }
        }
       if(loggedInUser?.id){ getData();}
    },[updateSuccess]))

    
    const hasNotifications = notificationData && notificationData.length > 0 ? notificationData.filter(item => !item.isRead) :[];

    const readNotificationHandler = async (item) => {
      try {
        setIsPopoverVisible(false)
        setUpdateSuccess(false);
        setNotUpdate(false);
        const response = await readNotificationById(item.id, token);
        if (response.status === 200) {
          const updatedNotificationData = notificationData.map((item1) => {
            if (item1.id === item.id) {
              return { ...item1, isRead: true };
            }
            return item1; 
          });
          if(item.type === "News" && item.newsId){
            navigate.navigate("SelectedNews",{data:item.newsId,path:'Notifications'})
          } else if(item.type === "Webinar" && item.webinarId){
            navigate.navigate("Education",{data:item.webinarId,path:'Notifications'})
          } else if(item.type === "RALLY" && item.eventId){
            navigate.navigate("Rallies",{item:item.eventId,path:'Notifications'})
          } else if(item.type === "EVENT" && item.eventId){
            navigate.navigate("RalliesEvents",{item:item.eventId,path:'Notifications'}) 
          } else if(item.type === "AdvertiseBoat" && item.advertiseCrewId){
            navigate.navigate("Crew",{tabIndex:1,item:item.advertiseCrewId,path:'Notifications'}) 
          } else if(item.type === "RequestToJoinBoat" && item.applicationId && item.advertiseCrewId){
            navigate.navigate("ApplicationDetails",{advertisementId:item.advertiseCrewId,applicationId:item.applicationId,path:'Notifications'}) 
          } else if(item.type === "RequestMemberInfo" && item.requestId){
            navigate.navigate("MyRequest",{tabIndex:"Requests received",path:'Notifications'}) 
          } else if(item.type === "CrewInvite" && item.crewRequestId){
            navigate.navigate("Profile",{tabIndex:"Invitations",index:"Invitations received",path:'Notifications'}) 
          }  else if(item.type === "BecomeMember" && item.becomeMemberId){
            navigate.navigate("Crew",{tabIndex:0,item:item.becomeMemberId,path:'Notifications'}) 
          } else if(item.type === "InviteApplicant" && item.applicationId){
            navigate.navigate("MyApplicationsTabs",{tabIndex:"Invitations",path:'Notifications'}) 
          } else if(item.postId){
            navigate.navigate("postsDetails",{id:item.postId,path:'Notifications'})
          }
          setNotificationData(updatedNotificationData);
          setNotUpdate(true)
        }
      } catch (error) {
        console.log(error);
      }
    };
    

    const readAllNotificationsHandler = async () => {
      try {
        setNotUpdate(false)
        const response = await readAllNotificationsByMemberId(loggedInUser.id, token);
        if (response.status === 200) {
          const updatedNotificationData = notificationData.map((item) => ({
            ...item,
            isRead: true,
          }));
          setNotificationData(updatedNotificationData);
          setNotUpdate(true)
          setIsPopoverVisible(false)
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    

    const togglePopover = async() => {
      setIsPopoverVisible(!isPopoverVisible);
    };

    const clearNotificationsHandler = async(item) => {
      try {
        setNotUpdate(false)
        setUpdateSuccess(false)
        const response = await clearNotificationById(item.id, token);
        if(response.status === 200){
          setUpdateSuccess(true)
          setNotUpdate(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const clearAllNotificationHandler = async() => {
      try {
        setNotUpdate(false)
        setUpdateSuccess(false)
        setLoader(true)
        const response = await clearAllNotificationByMemberId(loggedInUser.id,token);
        if(response.status === 200){
          setDeleteModal(false)
          setIsPopoverVisible(false)
          setLoader(false)
          setUpdateSuccess(true)
          setNotUpdate(true)
        }
      } catch (error) {
        console.error(error)
        setLoader(false)
      }
    } 

    const onClickBack = () => {
        navigate.navigate('Home')

    }

    return(
      <TouchableWithoutFeedback onPress={() => setIsPopoverVisible(false)}>
        <View style={style.contant}  onPress={()=> setIsPopoverVisible(false)}>
         <View style={[style.sidepanelcolor]}>
          <Menu/>
         </View>
        <View style={[
          style.contant,
          style.pH20,
          style.pt20
        ]}>
            <View style={[style.contentBetween]}>
            <Text style={[isTablet ? style.font24 : style.font16,style.boldTxt,style.mt5]}>Notifications</Text>
            <View style={[style.row,style.centerBox]}>
              <TouchableOpacity style={[style.mH10]} onPress={onClickBack}>
                <AntDesign name='close' size={25}color={COLORS.BLACK}/>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => togglePopover()}>
                    <MaterialIconCommunity
                      name="dots-vertical"
                      size={28}
                      color={COLORS.DARK_PRIMARY}
                    />
                  </TouchableOpacity>
            </View>
            </View>
            <View style={[styles.line,style.mtb10]}></View>
            <ScrollView  style={[style.contant]}>
            {loader ?
            <View style={[style.contant, style.row, style.centerItem,style.mt40]}>
            <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} />
            </View> :
            <View style={style.mB30}>
            {notificationData && notificationData.length > 0 ? notificationData.map((item) => (
            <TouchableOpacity style={[style.mtb5,styles.notificationContainer]} onPress={() => readNotificationHandler(item)}>
            {item?.isRead ? <View></View> : <View style={[style.notificationRead,style.mH5]}></View>}
            <View style={[style.mt5]}>
            <Text style={[style.font14]}>{item?.description}</Text>
            <Text style={[style.font12,style.grayText]}>{dateFormat(item?.creationTimestamp)}</Text>
            </View>
            </TouchableOpacity>
               )) : (
                <View style={[style.mt40,style.centerItem,style.centerBox]}>
                    <Text style={[style.mt40,style.font14]}>No Notifications</Text>
                </View>
               )} 
            </View>
            }
                </ScrollView>
                {isPopoverVisible && (
                  <View style={styles.popoverContainer}>
                    <View style={styles.arrow} />
                    <View style={[styles.popoverContent]}>
                    <TouchableOpacity onPress={readAllNotificationsHandler} disabled={hasNotifications.length === 0}>
                        <Text style={[style.font16,style.primaryText,style.mt5,hasNotifications.length === 0 && {color:COLORS.LIGHTGREY}]}>Mark all read</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDeleteModal(true)} disabled={notificationData && notificationData.length === 0}>
                        <Text style={[style.font16,style.primaryText, style.mt7,notificationData && notificationData.length === 0 && {color:COLORS.LIGHTGREY}]}>Clear all</Text>
                    </TouchableOpacity>
                      </View>
                      </View>
                      )}
                      <Modal isVisible={deleteModal} animationIn={'zoomIn'} animationOut={'zoomOut'} onBackdropPress={()=>setDeleteModal(false)}>
            <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
                    <TouchableOpacity onPress={()=>setDeleteModal(false)} style={{alignSelf:'flex-end'}}>
                    <Icon name="close" size={25} color="#000" />
                    </TouchableOpacity >
                    <View>
                        
                        <Text style={[style.textCenter,style.font20,style.mtb10,{color:COLORS.PRIMARY},style.boldTxt]}>Are you sure want to clear notifications ?</Text>
                        <View style={[style.contentBetween,styles.mH]}>
                        <TouchableOpacity style={[style.button,style.whiteLayout,styles.widthScreen]} onPress={() => setDeleteModal(false)}>
                        <Text style={[style.buttonTxt,style.boldTxt,style.font16,style.primaryText,]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.button,style.primaryLayout,,styles.widthScreen]} onPress={clearAllNotificationHandler}>
                            {loader ? <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> :
                        <Text style={[style.buttonTxt,style.boldTxt,style.font16,style.whiteText,]}>Yes</Text>}
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                </View>
        </Modal>
        </View>
        </View>
        </TouchableWithoutFeedback>
    )
}
export default Notification;

const styles = StyleSheet.create({
    imageHeader: {
        width: 65,
        height: 65,
        borderRadius: 30,
      },
      imageShadow:{   
        shadowColor: '#000',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
      },
      image: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 40,
      },
      line:{
        borderBottomWidth:1,
        borderColor:COLORS.BORDERGREY
      },
      notificationContainer:{
        backgroundColor:COLORS.BORDERGREY,
        padding:10,
        borderRadius:8,

      },
      popoverContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'white',
        width: normalize(120),
        borderRadius: 8,
        padding: 10,
        zIndex: 999,
        height:normalize(65)
      },
      popContainer: {
        position: 'relative',
      },
      arrow: {
        position: 'absolute',
        borderTopWidth: 10,
        borderTopColor: 'white',
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: 'transparent',
      },
      popoverContent: {
         color: COLORS.BLACK
      },
      mH:{
        marginHorizontal:Dimensions.get('screen').width * 0.07
      },
      widthScreen:{
        width:Dimensions.get('screen').width * 0.25
      }
})