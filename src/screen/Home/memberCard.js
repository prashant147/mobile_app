import React,{useState,useContext, useEffect} from "react";
import { View,Text,Image, StyleSheet,Linking,TouchableOpacity, Dimensions } from "react-native";
import { isTablet } from 'react-native-device-info';
import style from "../../styles/style";
import Menu from "../../routes/Menu";
import { normalize } from "../../styles/utilities/dimentions";
import COLORS from "../../styles/theme/color";
import { ScrollView } from "react-native-gesture-handler";
import { dateFormat } from "../../styles/utilities/variables";
import MembersContext from "../Members/MembersContext";
import Info from "react-native-vector-icons/Entypo"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getMemberById,getNotificationsByMemberId,deleteMember } from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageBackground } from "react-native";
import NotificationIcon from 'react-native-vector-icons/FontAwesome5';
import { ActivityIndicator } from "react-native-paper";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ModalNative from "react-native-modal";

const Membercard = () => {
  const {setHideChatbot,setHideChatbotMember,loggedInUser,notificationCount,setNotificationCount,loggedInUserUpdate,notUpdate,setLoggedInUser } = useContext(MembersContext);
  const navigation = useNavigation();
  const [memberData,setMemberData] = useState(null)
  const token = AsyncStorage.getItem("accessToken");
  const [loader, setLoader] = useState(false);
  const [deleteUserModal,setDeleteUserModal] = useState(false);

  useFocusEffect(React.useCallback(()=>{
    setHideChatbot(false)
    setHideChatbotMember(false)
    },[]))

    useFocusEffect(React.useCallback(()=>{
      getData()
    },[loggedInUser]))

  const getData = async() => {
    try {
      setLoader(true)
      const response = await getMemberById(loggedInUser?.id,token);
      if(response.status === 200){
        setMemberData(response.data)
        setLoader(false)
      }
    } catch (error) {
      console.error(error)
      setLoader(false)
    }
  }
  useFocusEffect(
    React.useCallback(() => {
    const getNotifications = async() => {
        try {
            const response = await getNotificationsByMemberId(loggedInUser?.id,token);
            if(response.status === 200){
                if (response.data[0]?.message === "No Records Found") {
                    setNotificationCount(null)
                }else {
                const getUnread = response.data.filter((item) => !item.isRead)
                setNotificationCount(getUnread && getUnread.length)
            }
        }
        } catch (error) {
            console.error(error); 
        }
    }
        if(loggedInUser?.id){getNotifications()}

},[loggedInUserUpdate,notUpdate]))

const handleDeleteUser = async ()=>{
  try {
   setLoader(true)
   const response = await deleteMember(loggedInUser?.id,token)
   if (!response.errors) {
    try {
     await AsyncStorage.removeItem('accessToken');
     await AsyncStorage.removeItem('userStatus');
    setLoggedInUser([])
    } catch (error) {
     console.log(error);
    }
       setDeleteUserModal(false)
       setLoader(false);
       setTimeout(() => {
         navigation.navigate("authStack")
       }, 200);
   }
  } catch (error) {
   console.error(error)
  }
}

  const vesselName =  memberData?.boats?.filter(item => item.isPrimary)[0]?.boatName
    return (
        <View style={[style.contant,style.whiteLayout]}>
        <View style={[style.sidepanelcolor]}> 
            <Menu  selectIndex={0}></Menu>
        </View>
     {loader ? 
     <View style={[style.contant,style.centerItem,style.centerBox]}>
      <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'}/>
      </View> :
        <ScrollView>
          <View style={[style.mH20,style.mtb20,{borderWidth:0,borderColor:COLORS.GREY,paddingHorizontal:0,borderRadius:8,paddingBottom:15,paddingTop:10},style.shadowBoxNews]}>
        <View style={[style.centerBox]}>
      <Image source={require("../../assets/saltyDawgLogo.png")} alt="" style={[{height:normalize(60),width:'100%'},style.mtb10]} resizeMode='contain'/>
    </View>
    <View style={[style.mH10,style.mt15,style.row,style.contant]}>
      <Image resizeMode='cover' style={[styles.userImg]} source={memberData?.profileUrl ? {uri : memberData.profileUrl} : require("../../assets/human.png")} ></Image>
      <View>
      <Text style={[style.boldTxt,style.mt10,styles.memberNameText]}>{memberData?.firstName} {memberData?.lastName}</Text>
      </View>
    
    </View>
    <View style={[style.row,style.centerBox,style.between]}>
    <View style={[style.mH20,style.mt15]}>
      <Text style={[style.primaryText,styles.memberName]}>Membership level  </Text>
      <Text style={[style.font16,style.boldTxt,style.mt0,style.primaryText]}>{memberData?.membershipLevel ? memberData?.membershipLevel :'N/A' }</Text>
    </View>
    <View style={[style.mH20,style.mt15]}>
      <Text style={[style.primaryText,styles.memberName]}>Expiration  </Text>
      <Text style={[style.font16,style.boldTxt,style.mt0,style.primaryText]}>{memberData?.membershipExpiry ? dateFormat(memberData?.membershipExpiry) :'N/A'}</Text>
    </View>
    </View>
    <View style={[style.mH20,style.mt15]}>
      <Text style={[style.primaryText,styles.memberName]}>Vessel Name  </Text>
      <Text style={[style.font16,style.boldTxt,style.mt0,{justifyContent:"flex-end",color:COLORS.PRIMARY}]}> {vesselName ? vesselName :'N/A'}</Text>
    </View>
   <View style={[style.contentBetween,style.mt15]}>
    <View style={[style.mH20]}>
      <Text style={[style.primaryText,style.font14]}>Access Your Benefits at  </Text>
      <Text style={[style.BlackbuttonTxt,style.font12,style.primaryText,{justifyContent:"flex-end"}]} onPress={() =>Linking.openURL("https://www.saltydawgsailing.org")}> www.saltydawgsailing.org</Text>
    </View>
    <View style={[style.mH20,style.contentBetween]}>
    <TouchableOpacity style={[style.row,style.mH10]} onPress={() => {navigation.navigate("Notifications");setHideChatbot(false);setHideChatbotMember(false)}}>
    <NotificationIcon name="bell" size={29} color={COLORS.PRIMARY} style={[style.mH15,styles.mr2]}/>
    {notificationCount && notificationCount > 0 ?
                <View style={[styles.notificationCount]}>
                <Text style={[style.textCenter,{color:COLORS.WHITE}]}>{notificationCount}</Text>          
                </View>
                : null}
    </TouchableOpacity>
   
      <Info name="info-with-circle" size={30} color={COLORS.PRIMARY} onPress={() => navigation.navigate("Profile", { path: "MemberCard" })}/>
    </View>
    </View>
    <View style={[style.mH15]}>
            <TouchableOpacity style={[style.row,style.mt10,style.centerBox,style.mH5]} onPress={() => setDeleteUserModal(true)}>
              <FontAwesome6 name="user-xmark" color={COLORS.PRIMARY} size={23}/>
              <Text style={[style.font16,style.boldTxt,style.mH10]}>Delete Account</Text>
            </TouchableOpacity>
    </View>
</View>
<Text style={[style.mH40,style.font16,style.boldTxt,style.mB10,style.mt15]}>Awards & Badges</Text>
<View style={[styles.badgesWrapper,style.pH20,style.pV10,style.contant,memberData?.awardDtoList?.length > 0 &&style.flexWrap]}>
  {memberData?.awardDtoList?.length > 0 ? memberData?.awardDtoList?.map((item)=>{

    return(
      <View style={[styles.badgesWrap]} >
        <ImageBackground 
        style={[styles.badgesBgWrapper,style.row]} resizeMode='cover' source={require("../../assets/badges_top.png")}>
      
          <Image source={{uri:item?.imageUrl}} style={[styles.badgesImg]} resizeMode="contain"/>
        
          <Image source={require('../../assets/badges_bottom.png')} style={[styles.badgesBgImg]} resizeMode="contain"/>
        </ImageBackground>
          {item?.awardedMembers?.length > 0 &&<Text style={[style.textCenter,style.font16,style.boldTxt]}>{item?.awardedMembers[0]?.awardedTo?.firstName + " " + item?.awardedMembers[0]?.awardedTo?.lastName}</Text>}
          <Text style={[style.textCenter,style.font16,style.primaryText]}>{item?.name}</Text>
          {item?.eventName &&<Text style={[style.textCenter,style.font12]}>Earned for {item?.eventName}</Text>}
          {item?.awardedMembers?.length > 0 && <Text style={[style.textCenter,style.font14,style.grayText]}>{dateFormat(item?.awardedMembers[0]?.dateAssigned)}</Text>}
      </View>
    )
    })
    :
      <View style={[style.contant,style.row,style.centerBox,style.centerItem,style.mt30]}>
        <Text style={[style.font18]}>No Badges Found</Text>
      </View>
  }
</View>
          </ScrollView>
        }
        <ModalNative
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        isVisible={deleteUserModal}
        backdropColor='rgba(0, 0, 0, 0.3)'>
        <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
          <Text style={styles.modalText}>
            Are you sure want to delete your account ?
          </Text>
          <View style={[style.contentBetween,styles.mH]}>
            <TouchableOpacity style={[style.button,style.whiteLayout,styles.widthScreen]} onPress={() => setDeleteUserModal(false)}>
              <Text style={[style.buttonTxt,style.font16,style.primaryText,style.boldTxt]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.button,style.primaryLayout,styles.widthScreen]} onPress={handleDeleteUser}>
              {loader ? <ActivityIndicator theme={{ colors: { primary: COLORS.WHITE } }} /> :
                <Text style={[style.buttonTxt,style.font16,style.boldTxt,style.whiteText]}>Yes</Text>}
            </TouchableOpacity>
          </View>
        </View>
        </ModalNative>
                
      </View>
    
    );
  };
  export default Membercard;
  const styles = StyleSheet.create({
    badgesBgImg:{
      position:"absolute",
      height:Dimensions.get('screen').width*0.2,
      width:Dimensions.get('screen').width*0.2,
      top:normalize(20)
    },
    badgesImg:{ 
      height:Dimensions.get('screen').width*0.15,
      width:Dimensions.get('screen').width*0.15,
      borderRadius:Dimensions.get('screen').width*0.4
    },
    badgesBgWrapper:{ 
      height:Dimensions.get('screen').width*0.2,
      width:Dimensions.get('screen').width*0.2,
      justifyContent:"center",
      alignItems:'center'
    },
    badgesWrap:{
      width:Dimensions.get('screen').width*0.26,
      flexDirection:'column',
      alignItems:'center'
    },
    badgesWrapper:{
      flexDirection:'row',
      gap:15
    },
    userImg:{
      width:normalize(isTablet()?76:70),
      height:normalize(isTablet()?76:70),
      marginHorizontal:10,
      borderRadius:8
    },
   memberName : {
    fontSize:normalize(15),
    color:COLORS.BLACK_50,
    fontWeight:"500"
   },
   userIcons:{
    width:45,
    height:45,
    borderWidth:1.2,
    borderColor:COLORS.PRIMARY,
    alignItems:"center",
    display:'flex',
    justifyContent:"center",
    borderRadius:5,
  },
  userAwardIcons:{
    width:45,
    height:45,
    alignItems:"center",
    display:'flex',
    justifyContent:"center",
  },
  memerLayout:{
    justifyContent:'space-between',marginBottom:10
  },
  btnsAlignment :{
    flexDirection:"column",alignItems:'center'
  },
  favIcon:{
    borderColor:COLORS.GREY,borderWidth: 1,borderRadius:10, 
    height:50, paddingHorizontal:15,justifyContent:'center',
    alignContent:'center',alignItems:'center'
  },
  favIconMobile:{ 
    height:50, paddingHorizontal:15,justifyContent:'center',
    alignContent:'center',alignItems:'center'
  },
  favIconTxt:{
    fontSize:12,textAlign:'center'
  },
  memberNameText:{
    color:COLORS.PRIMARY,
    fontSize:isTablet() ? Dimensions.get('screen').width*0.036 : Dimensions.get('screen').width*0.05,
    width:Dimensions.get("screen").width *0.6,
  },
  notificationCount:{
    backgroundColor:COLORS.YELLOW,
    color:COLORS.WHITE,
    borderRadius:50,
    paddingVertical:normalize(1),
    paddingHorizontal:normalize(5),
    fontWeight:"bold",
    fontSize:normalize(12),
    display:"flex",
    marginBottom:35,
    marginTop:-10,
    marginLeft:-10,
    alignItems:"center",
    justifyContent:"center"
},
mr2:{
  marginRight:normalize(2)
},
mH:{
  marginHorizontal:Dimensions.get('screen').width * 0.07
},
widthScreen:{
  width:Dimensions.get('screen').width * 0.25
},
modalText: {
  color:COLORS.BLACK,
  fontSize:normalize(14),
  fontWeight:"600",
  lineHeight:30,
  textAlign: 'center',
  marginBottom: 10,
  marginTop: 10
},
  })