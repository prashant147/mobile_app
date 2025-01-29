import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { View } from "react-native";
import style from "../../styles/style";
import DeviceInfo, { isTablet } from 'react-native-device-info';
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import COLORS from "../../styles/theme/color";
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { normalize } from "../../styles/utilities/dimentions";
import moment from "moment";
import { getMyCrewAdvertisement } from "../../services/api/auth";
import Menu from "../../routes/Menu";
import UserInfo from "../../components/UserInfo";
import Icon from "react-native-vector-icons/Feather";
import { dateFormat } from "../../styles/utilities/variables";

const MyApplicationDetail = () => { 
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [myAdv, setMyAdv] = useState<any>();
    const navigation = useNavigation();  

    const navigationHandlerWithParam = (path:string, id:any) => {
        navigation.navigate(path, { id });
      }
    useFocusEffect(
        React.useCallback(() => {
            loadMyApplication();
        }, [])
      );
      const loadMyApplication =async ()=>{
          try {
      const response = await getMyCrewAdvertisement();
      if(response.status === 200){
      
        if(response.data[0]?.message === "You have no Advertisements"){
          setMyAdv([])
        }
        else{
        setMyAdv(response.data);
        }
      }
    }catch (error) {
      setMyAdv([])
     console.log(error);
   }
      }
      const togglePopover = () => {
        setIsPopoverVisible(!isPopoverVisible);
      };
      const renderBoatList =({item,index}:any)=>{

          return (
            <View style={[styles.line, style.row]}>
              <Image source={item?.image} style={styles.profileImg} />
              <View style={[style.contant, {paddingHorizontal: 20}]}>
                <View style={[style.row, {flexDirection: 'row', flexWrap: 'wrap'}]}>
                  <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                    <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.boatName}</Text>
                  </View>
                  <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                    <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.captain}</Text>
                  </View>
                  <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                    <Text style={styles.nameTitleStyle}>CO-OWNER</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.coOwner}</Text>
                  </View>
                  <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                    <Text style={styles.nameTitleStyle}>BOAT OWNER</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.boatOwner}</Text>
                  </View>
                  <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                    <Text style={styles.nameTitleStyle}>HOME PORT</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.homePort}</Text>
                  </View>
                </View>
                <View
                  style={[
                    style.row,
                    {flexDirection: 'row', justifyContent: 'space-between'},
                  ]}>
                  <View style={{flex: 1}}>
                    <Text style={styles.nameTitleStyle}>MODEL NO.</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.modelNo}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.nameTitleStyle}>MAKE YEAR</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.makeYear}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.nameTitleStyle}>MAKE</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.make}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.nameTitleStyle}>LENGTH</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.length}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.nameTitleStyle}>WIDTH</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.width}</Text>
                  </View>
                </View>
              </View>
    
            </View>
          );
      }

      const renderBoatPhoneList =({item,index}:any)=>{

          return(
            <View style={style.between}>
              <View  style={[styles.line, style.contentBetween]}>
                <View style={style.row}>
                {item?.imageUrl ? 
                <Image source={{uri :item?.imageUrl}} style={[styles.profileImg,style.mt20]} /> :
                <Image style={[styles.profileImg,style.mt10]} source={require("../../assets/blue_sailboat.png")} alt='img'/>
                  }
                  <View>
                      <View style={style.mt10}>
                            <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                            <Text style={styles.nameTitleTextStyle}>{item?.boatName.length > 18 ? item?.boatName.slice(0,18) + "..." : item?.boatName}</Text>
                        </View>
                        <View>
                            <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                            <Text style={styles.nameTitleTextStyle}>{item?.boats?.captain ? item?.boats?.captain : "N/A"}</Text>
                        </View>
                  </View>
                  </View>
                  </View>
              <View style={[style.row,style.between]}>
                  <View >
                      <Text style={styles.nameTitleStyle}>CO-OWNER</Text>
                      <Text style={styles.nameTitleTextStyle}>{item?.boats?.coOwner ? item?.boats?.coOwner : "N/A"}</Text>
                  </View>
                  <View>
                      <Text style={styles.nameTitleStyle}>HOME PORT</Text>
                      <Text style={styles.nameTitlePhoneTextStyle}>{item?.boats?.homePort}</Text>
                  </View>

              </View>
              <View style={[style.row,style.mt10,style.between]}>
                  <View>
                      <Text style={styles.nameTitleStyle}>PHONE NO</Text>
                      <Text style={styles.nameTitleTextStyle}>{item?.phoneNumber}</Text>
                  </View>
                  <View >
                      <Text style={styles.nameTitlePhoneStyle}>EMAIL</Text>
                      <Text style={[styles.nameTitlePhoneTextStyle]}>{item?.email.length > 25 ? item?.email.substring(0,25).concat('...') : item?.email}</Text>
                  </View>
              </View>
              <View style={[style.row,style.mt10,style.between]}>
                  <View>
                      <Text style={styles.nameTitleStyle}>CREW VACANCY</Text>
                      <Text style={styles.nameTitleTextStyle}>{item?.crewVacancy}</Text>
                  </View>
                  <View>
                      <Text style={styles.nameTitlePhoneStyle}>POSITION</Text>
                      <Text style={styles.nameTitlePhoneTextStyle}>{item?.position}</Text>
                  </View>
              </View>
              <View style={[style.row,style.mt10,style.between]}>
                  <View >
                      <Text style={styles.nameTitleStyle}>RALLY DATES</Text>
                      <Text style={styles.nameTitleTextStyle}>{dateFormat(item?.rallyDate.split(',')[0])+ ',' + dateFormat(item?.rallyDate.split(',')[1])} </Text>
                  </View>
                  <View>
                      <Text style={styles.nameTitlePhoneStyle}>DIETRY RESTRICTION</Text>
                      <Text style={styles.nameTitlePhoneTextStyle}>{item?.restrictions}</Text>
                  </View>
              </View>
              <View style={[style.row,style.mt10,style.between]}>
                  <View >
                      <Text style={styles.nameTitleStyle}>EXPENSE</Text>
                      <Text style={styles.nameTitleTextStyle}>{item?.costOfCrewMember}</Text>
                  </View>
                
              </View>
              <View style={[style.mt10, style.mB10]}>
    
                      <Text style={styles.nameTitleStyle}>DESCRIPTION</Text>
                      <View style={style.row}>
                      <Text numberOfLines={2} style={[style.font16,{width:'80%'}]}>{item?.description}</Text>
                      </View>
      
                
              </View>

                 <View style={[style.centerItem, style.mB10 ]}>
                  <TouchableOpacity style={styles.btnStylessMobile} onPress={() => navigationHandlerWithParam('MyApplications', item.id)}>
                   <Text style={[styles.btnTextStyle, { color: COLORS.PRIMARY }]}>View Applications</Text>
                  </TouchableOpacity>
                </View>

            </View>
          )
      }
      return <View style={style.contant}>
             <View style={[style.row]}>
          <View style={[{flex: 2}]}>
          {!isTablet() && 
          <View style={style.sidepanelcolor}>
            <Menu selectIndex={7} />
          </View>}
          </View>
          {isTablet() && (
            <View style={[{flex: 1}, [style.mt20, style.mH10]]}>
              <UserInfo isDark={true}></UserInfo>
            </View>
          )}
      </View>
      <View
        style={[
        style.mH10,
        style.mtb20
        ]}>
        <View>
        <TouchableOpacity style={[style.row,style.centerBox,style.mH10,style.mtb10]} onPress={() => navigation.navigate("Crew")}>
              <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} />
              <Text
                style={[
                  styles.memberTitleText,style.font16,style.boldTxt,style.primaryText
                ]}>
                Back to Crew
              </Text>
            </TouchableOpacity>
            
        </View>
      <View style={style.pH20}>
            <FlatList
                data={myAdv}
                renderItem={isTablet() ? renderBoatList : renderBoatPhoneList}
                showsVerticalScrollIndicator={false}
                />
      </View>
          </View>      
      </View>
}

export default MyApplicationDetail;
const styles = StyleSheet.create({
    nameTitlePhoneStyle:{
      color:COLORS.GREY,
      fontSize:normalize(10),
      textAlign:'right'
    },
    nameTitlePhoneTextStyle:{
      color:COLORS.BLACK,
      fontSize:normalize(14),
      fontWeight:"600",
      lineHeight:30,
      textAlign:'right'
    },
      container:{
          flex:1,
          marginTop:normalize(5)
      },
      textTitleHeading: {
          color: COLORS.BLACK,
          fontSize: normalize(14),
          fontWeight: '400',
          lineHeight: 30,
        },
        profileImg:{
          width:normalize(65),
          height:normalize(65),
          borderRadius: 8,
          marginRight: 10,
          borderWidth:1,
          resizeMode:'contain',
          borderColor:COLORS.LIGHTGREY
        },
        nameTitleStyle:{
          color:COLORS.GREY,
          fontSize:normalize(10),
        },
        nameTitleTextStyle: {
          color: COLORS.BLACK,
          fontSize: normalize(14),
          fontWeight: "600",
          lineHeight: 30,
          maxWidth: 200
        },
        descriptionTextStyle: {
          color: COLORS.BLACK,
          fontSize: normalize(14),
          fontWeight: "600",
          lineHeight: 30,
          width: "100%"
        },
        
        line: {
          borderTopWidth: 1,
          // borderBottomWidth:1,
          // width: '100%',
          borderColor: COLORS.LINE,
          paddingVertical: normalize(5),
          // borderRadius:8
        },
        btnStyle:{
          backgroundColor:COLORS.PRIMARY,
          paddingHorizontal:normalize(10),
          paddingVertical:normalize(5),
          borderRadius:4,
          height: normalize(40),
          width:"100%",
          justifyContent:'center',
          alignItems:'center',
          marginTop:10
        },
        btnTextStyle:{
          color:COLORS.WHITE,
          fontSize:normalize(14),
          fontWeight:'600'
        },
        btnStylessMobileRegister:{
          borderWidth:1,
          backgroundColor:COLORS.PRIMARY,
          borderColor:COLORS.PRIMARY,
          paddingHorizontal:normalize(10),
          paddingVertical:normalize(5),
          margin:normalize(5),
          borderRadius:normalize(4),
          height:normalize(30),
          justifyContent:'center',
          alignItems:'center',
          width:'95%'
        },
        btnStyleOutline:{
          borderWidth:1,
          borderColor:COLORS.PRIMARY,
          paddingHorizontal:normalize(8),
          // paddingVertical:normalize(2),
          marginBottom:normalize(5),
          borderRadius:normalize(4),
          marginRight:'auto',
          height:normalize(30),
          justifyContent:'center',
          alignItems:'center'
          
        },
        cancelBtn:{
         width:"100%",
         height:normalize(40),
         marginBottom:normalize(20)
        },
        uploadImgBtn:{
          backgroundColor: 'rgba(52, 52, 52, 0.3)',
          width: 200,
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          marginTop: 40,
        },
        btnOutlineTextStyle:{
          color:COLORS.PRIMARY,
          fontSize:normalize(13),
        },
        formContainer:{
          // flex:1,
          width:'50%'
        },
  
        containerPage:{
          flex:1,
          flexDirection:'row',
          alignItems:'flex-start',
          paddingBottom:normalize(10)
        },
        modelUser: {
          width: 300,
          height: 500
        },
        modalBackground: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust opacity here
        },
        modalContent: {
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
          elevation: 5,
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
        closeButton: {
          position: 'absolute',
          top: 10,
          right: 10,
        },
  
        btnStyless:{
          borderWidth:1,
          borderColor:COLORS.PRIMARY,
          backgroundColor:COLORS.PRIMARY,
          paddingHorizontal:normalize(10),
          paddingVertical:normalize(5),
          margin:normalize(5),
          borderRadius:normalize(4),
          // marginLeft:'auto',
          height:normalize(30),
          justifyContent:'center',
          alignItems:'center',
          // marginLeft:40
          width:'95%'
        },
        btnStylessMobile:{
          borderWidth:1,
          borderColor:COLORS.PRIMARY,
          paddingHorizontal:normalize(10),
          paddingVertical:normalize(5),
          margin:normalize(5),
          borderRadius:normalize(4),
          // marginLeft:'auto',
          height:normalize(30),
          justifyContent:'center',
          alignItems:'center',
          // marginLeft:40
          width:'95%'
        },
        btnTextStyless: {
          color:COLORS.PRIMARY,
          fontSize:normalize(14),
          fontWeight:'600'
        },
        viewBtnStyle:{
          paddingHorizontal:15,
          borderWidth:1,
          borderColor:COLORS.PRIMARY,
          borderRadius:4,
          paddingVertical:5,
          width:'100%',
          height:40,
          minWidth:200,
          justifyContent:'center',
          alignItems:'center',
        },
        memberTitleText:{
          color:COLORS.LIGHT_BLACK,
          fontSize:normalize(12),
          lineHeight:25
        },
        valueCell: {
          flex: 2,
          textAlign: 'left',
          paddingHorizontal: 8,
          fontWeight:'600',
          color:COLORS.DARK_PRIMARY
        },
        valueCellName: {
          flex: 2,
          textAlign: 'left',
          paddingHorizontal: 8,
          color:COLORS.BLACK_50
        },
      item: {
        padding: 10
      },
      input: {
        color: '#000'
      },
      textItem: {
        flex: 1,
        fontSize: 16,
        color: COLORS.GREY
      },
      dropdown: {
        height:Platform.OS =='ios'?45: 50,
        // backgroundColor: '#F3F4F6',
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.GREY,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(0),
        borderRadius: 4,
        backgroundColor: "#F3F4F6",
        width:"100%",
        marginTop: 5,
        color:COLORS.BLACK
      },
      placeholderStyle: {
        fontSize: 16,
        color: COLORS.BLACK
      },
      selectedTextStyle: {
        fontSize: 16,
        color: COLORS.BLACK,
      },
      iconStyle: {
        width: 30,
        height: 30,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      labelStyle:{
        fontSize:normalize(14),
        fontFamily:'Roboto-Regular',
        color:COLORS.BLACK,
        marginTop:normalize(10),
        fontWeight:'600'
    },
    inputBorderStyle:{
      borderWidth:.9,
      borderColor:COLORS.GREY,
      paddingHorizontal:normalize(10),
      paddingVertical:normalize(5),
      borderRadius:4,
      paddingBottom:50,
      marginVertical:normalize(5),
      backgroundColor:'#f2f4f6',
      width:"100%",
      height:normalize(70)
    },
    uploadBtn:{
      backgroundColor: 'rgba(52, 52, 52, 0.3)',
      width:"100%",
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      marginTop: 15,
    },
    editWidth: {
      width:"54%"
    },
    popoverContainer: {
      position: 'absolute',
      top: 10,
      right: 20,
      backgroundColor: 'white',
      width: 120,
      height: 85,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      zIndex: 999,
    },
    popContainer: {
      position: 'relative',
    },
    arrow: {
      position: 'absolute',
      top: -10,
      right: 20,
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
  })