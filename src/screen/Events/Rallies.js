import { View, Text, Alert, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList, SafeAreaView, Linking, Touchable, TouchableHighlight, PermissionsAndroid,Platform,Keyboard, } from 'react-native'
import React, { useContext, useEffect, useState,useMemo,useRef } from 'react'
import style from '../../styles/style'
import Menu from '../../routes/Menu'
import DeviceInfo from 'react-native-device-info';
import BackIcon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { normalize } from '../../styles/utilities/dimentions';
import COLORS from '../../styles/theme/color';
import { BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import { Dimensions } from 'react-native';
import MembersContext from '../Members/MembersContext';
import { getAllEvents, getRallyLocation,getBoatByMMSI,getMemberBoatView, getBoatRallyTrack, } from '../../services/api/auth';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import ModalNative from "react-native-modal";
import TabBox from '../../components/TabBox';
import GetLocation from 'react-native-get-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatCoordinates, TimeZoneDateHandler, TimeZoneTimeHandler } from '../../styles/utilities/variables';
import MapView, { Marker,Callout,Polyline } from 'react-native-maps';
import RenderDropdown from '../BecomeMember/RenderDropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

export default function Rallies({route}) {
  const {setChatData, setHideChatbotMember, setHideChatbot, accessToken, loggedInUser,userTimeZone,setSelectedMenu } = useContext(MembersContext);
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation();
  const [getRally, setGetRally] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [loader, setLoader] = useState(false)
  const [getAllRalliesData, setGetAllRalliesData] = useState([])
  const [showModal,setShowModal] = useState(false)
  const [selected,setSelected] = useState('Description')

  const Links = [
    {
      name: 'Passage Discussion', link: 'https://sdsa.memberclicks.net/east-coast-rally-passage-discussion', type: "link"
    },
    {
      name: 'Crew Service', link: 'https://sdsa.memberclicks.net/about-crew', type: 'link'
    },
    {
      name: 'Required Equipment', link: 'https://sdsa.memberclicks.net/what-is-needed-for-a-rally', type: 'link'
    },
    {
      name: 'Rally FAQs', link: 'https://sdsa.memberclicks.net/rally-faqs', type: 'link'
    },

  ]
  useEffect(() => {
    const backAction = () => {
      if (openMenu) {
        setOpenMenu(false)
      } else if (getRally) {
        setGetRally(null)
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [openMenu, getRally]);

  const rallyClickHandler = (item) => {
    setGetRally(item)
    setSelected('Description')
  }

  useFocusEffect(
    React.useCallback(() => {
      setSelectedMenu(14)
      if (getRally) {
        setHideChatbot(true)
        setHideChatbotMember(true)
      } else {
        setHideChatbot(false)
        setHideChatbotMember(false)

      }
    }, [getRally])
  )
  useFocusEffect(
    React.useCallback(() => {
      if(!route?.params?.item){
        setGetRally(null)
        }
      setOpenMenu(false)
      getAllEventsDataHandler()
    }, [route])
  )

  useEffect(()=>{
    if(route?.params?.item && getAllRalliesData){
      const filterEventId = getAllRalliesData.find((item) => item?.id === route?.params?.item)
      route.params = null
      setGetRally(filterEventId)
    }
  },[route,getAllRalliesData])

  const handlePressBack = () => {
      navigation.navigate('Rallies',{item:route?.params?.item})
      setGetRally(null);
      setOpenMenu(false);
  }
    
  

  const getAllEventsDataHandler = async () => {
    setLoader(true)
    try {
      const response = await getAllEvents(accessToken)
      if (response.status === 200) {
        const sorted = response.data.sort((a, b) => {
          const dateA = new Date(a.startDateTime);
          const dateB = new Date(b.startDateTime);
          return dateA - dateB;
        })
        const filterRallyes = sorted.filter(item => item.type === 'RALLY' && moment(item.endDateTime).isAfter(moment()))
        setGetAllRalliesData(filterRallyes)
        setLoader(false)
      }
    } catch (error) {
      console.error(error);
      setLoader(false)
    }
  }
  
  const renderRallyCard = ({ item }) => (
    <TouchableOpacity style={[style.row, styles.card]} onPress={() => rallyClickHandler(item)}>
      <View>

        {item.eventsMediasUrl ? <Image source={{ uri: item.eventsMediasUrl }} style={[styles.image]} /> :
          <Image style={[styles.image]} source={require('../../assets/dataImage/rally_placeholder.png')} />}
      </View>
      <View style={[style.row,style.centerBox]}>
        <Text style={[style.font16, style.boldTxt,style.centerBox,style.whiteText,style.mH10]}>{item.name}</Text>

      </View>
    </TouchableOpacity>
  );


  const linkingHandler = (item) => {
    if (item.type === 'link') {
      navigation.navigate('Webview',{link:item.link,path:'Rallies',id:getRally?.id})
    } else if(item.type === 'mail'){
      Linking.openURL(item.link)
    } else {
      navigation.navigate(item.link)
    }
    setOpenMenu(false)
  }
  const wrappedHtml = `
  <html>
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
      <style>
          body { font-size: ${14}px; }
      </style>
  </head>
  <body>
      ${getRally?.description}
  </body>
  </html>
`;
const isRegistered = getRally?.participants?.find(item => item.id === loggedInUser.id)
const msgClickHandler =()=>{
  if(isRegistered?.paymentReferenceId || isRegistered?.isVolunteer ){
    // setChatData({id:getRally?.memberGroups[0]?.id,type:'group'});
    setChatData({id:getRally?.id,type:'group'});
    navigation.navigate("WebChat")
  }else{

    setShowModal(true)
  }
}
let tabData = ['Description']


  return (

    <View style={style.contant}>
      <View style={[style.row]}>
        <View style={[{ flex: 2 }]}>
         <View style={style.sidepanelcolor}>
          <Menu selectIndex={14} />
          </View>
        </View>

      </View>
      <View
        style={[
          style.contant,
          style.pt10
        ]}>
        <View>
          <View style={[style.row, style.pH20]}>
            {getRally && <TouchableOpacity style={[style.row]}
              onPress={handlePressBack}>
              <BackIcon name="chevron-left" size={normalize(15)} style={[style.mr10,style.mt3]} color={COLORS.PRIMARY} />
              <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
            </TouchableOpacity>}
          </View>
        </View>

        {loader ?
          <View style={[style.contant, style.row, style.centerItem, style.centerBox]}>
            <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'} /></View> : 
            <View style={style.contant}>
            {
              getRally ?

                <ScrollView style={[style.pH20]} showsVerticalScrollIndicator={false}>
                  <View style={[style.row, style.mtb20, style.between]}>
                    <View style={[style.row]}>
                      <View onTouchStart={() => setOpenMenu(false)} style={[style.mr10]}>
                        {getRally.eventsMediasUrl ? <Image source={{ uri: getRally.eventsMediasUrl }} style={[styles.image]} /> :
                          <Image style={[styles.image]} source={require('../../assets/dataImage/rally_placeholder.png')} />}
                      </View>
                      <View style={[style.mH10]} onTouchStart={() => setOpenMenu(false)}>
                        <Text style={[style.font16, style.boldTxt,styles.rallyNameStyle]}>{getRally.name}</Text>
                        <View style={[style.row,style.centerBox]}>
                            <View style={[style.mr10]}>
                              <Text style={[style.font12]}>{TimeZoneDateHandler(getRally?.startDateTime,userTimeZone)}</Text>
                              <Text style={[style.font12]}>{TimeZoneTimeHandler(getRally?.startDateTime,userTimeZone)}</Text>
                            </View>
                            <View>
                              <Text style={[style.font12]}>{TimeZoneDateHandler(getRally?.endDateTime,userTimeZone)}</Text>
                              <Text style={[style.font12]}>{TimeZoneTimeHandler(getRally?.endDateTime,userTimeZone)}</Text>
                            </View>
                          </View>
                       
                      </View>
                    </View>
                    <View >
                      <View style={[style.column,style.centerBox,style.centerItem]}>
                      <TouchableOpacity onPress={() => setOpenMenu(!openMenu)} onBlur={() => setOpenMenu(false)}>
                        <Entypo name="dots-three-vertical" size={normalize(18)} style={style.p410} color={COLORS.PRIMARY} />
                      </TouchableOpacity>
                     
                      </View>
                      
                      
                    </View>
                  </View>

                  <View style={[style.row,style.centerBox,(getRally?.name.toLowerCase().includes("downeast") || getRally?.name.toLowerCase().includes("caribbean") ||  getRally?.name.toLowerCase().includes("january jump") ||  getRally?.name.toLowerCase().includes("azores")) ? style.between :{columnGap:5}]}>
                  {moment(getRally.endDateTime).isSameOrAfter(moment()) ?  <View style={[style.mt5,style.row,style.centerBox]}>
                          {getRally?.participants?.find(item => item.id === loggedInUser.id) === undefined ?
                            <TouchableOpacity style={[styles.linkBtn]} 
                            onPress={() => navigation.navigate("RalliesWebview",{ id: getRally.id, path: 'Rallies'})}        
                            //  onPress={() => navigation.navigate('RallyForm', { id: getRally.id, category: 'RALLY', path: 'Rallies',isPaid:getRally?.isPaidEvent ? getRally?.isPaidEvent: false })}
                             >
                              <Text style={[styles.linkBtnText]}>Register</Text>
                            </TouchableOpacity> :
                            (getRally?.participants?.find(item => item.id === loggedInUser.id)?.approved ?
                            ((getRally?.participants?.find(item => item.id === loggedInUser.id)?.paymentReferenceId) || getRally?.participants?.find(item => item.id === loggedInUser.id)?.isVolunteer ?
                            <TouchableOpacity style={[styles.linkBtnRegistered]} disabled={true}>
                              <Text style={[styles.linkBtnTextRegistered]}>Registered</Text>
                            </TouchableOpacity>
                            :<TouchableOpacity style={[styles.linkBtnComplete]} onPress={() => navigation.navigate('RallyForm', { id: getRally.id, category: 'RALLY', path: 'Rallies',isPaid:getRally?.isPaidEvent ? getRally?.isPaidEvent: false ,boatForm:true,eventParticipantId:getRally?.participants?.find(item => item.id === loggedInUser.id)?.eventParticipantId})}>
                            <Text style={[styles.linkBtnText]}>Complete Registration</Text>
                          </TouchableOpacity>) : 
                            <TouchableOpacity style={[styles.linkBtnRegistered]} disabled={true}>
                              <Text style={[styles.linkBtnTextRegistered]}>Pending</Text>
                            </TouchableOpacity>)}

                          
                        </View>:
                        <View style={[style.mt5,style.row,style.centerBox]}>
                        <TouchableOpacity style={[styles.linkBtnRegistered]} disabled={true}>
                        <Text style={[styles.linkBtnTextRegistered]}>Rally Completed</Text>
                        </TouchableOpacity>
                        </View>
                        }
                        {(getRally?.name.toLowerCase().includes("downeast") || getRally?.name.toLowerCase().includes("caribbean") ||  getRally?.name.toLowerCase().includes("january jump") ||  getRally?.name.toLowerCase().includes("azores")) && 
                        <TouchableOpacity style={[{
                          height: normalize(35),
                          borderWidth: 1.2,
                          alignItems: "center",
                          display: 'flex',
                          justifyContent: "center",
                          borderRadius: 5,
                          borderColor: COLORS.PRIMARY ,
                          paddingHorizontal:20,
                        },style.mt5]} onPress={()=>navigation.navigate('RallyMap',{rallyName:getRally?.name,path:'Rallies',item:getRally?.id,reload:true})}>
                          <Text style={[style.font16,style.primaryText]}>View Rally Map</Text>
                        </TouchableOpacity>}
                  <TouchableOpacity style={[styles.userIcons, styles.msgIcon]} onPress={msgClickHandler}>
                            <Icon name='message-square' size={25} color={COLORS.PRIMARY} />
                          </TouchableOpacity>
                  </View>

                  <View style={styles.descContainer}> 
                  <TabBox data={tabData} selectedTab={selected} onTab={(tab) => {setSelected(tab)}} ></TabBox>
                  {selected === 'Description' && (
                    getRally?.description ? 
                  <WebView
                      source={{ html: wrappedHtml }}
                      javaScriptEnabled={true} // Enable JavaScript for iframe interactions
                      domStorageEnabled={true} // Enable DOM storage for iframe functionality (if needed)
                      style={[{ height: Dimensions.get('screen').height * 0.52 ,backgroundColor:'transparent', }]}
                      onScroll={() => setOpenMenu(false)}
                      onTouchStart={() => setOpenMenu(false)} 
                      showsVerticalScrollIndicator={false}
                      allowsZoom={false}
                      onNavigationStateChange={(event) => {
                        const { url } = event;
                        if (url && url.startsWith('http')) {
                          Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
                          return false;
                        }
                        return true;
                      }}
                    /> :
                      <Text style={[style.font14,style.textCenter,style.mt40]}>
                        No Description Found
                      </Text>
                    ) }
                  
                    {/* {selected === 'Participants' &&
                    <View style={style.mtb10}>
                    <Text style={[style.font16, style.boldTxt]}>Event Participants ({getRally?.participants?.filter(item => item?.approved === true).length}) </Text>
                    {getRally?.participants?.filter(item => item?.approved === true).map((item,index) =>{
                      return(
      
                         <Text style={[style.font14, style.mt5]}>{index + 1}. {item.firstName + ' ' + item.lastName}</Text>
                      )
                    })}
                  </View>
                    } */}
                  </View>
                  {openMenu && <View
                        style={[style.mB10, styles.menuContainer, style.mt40, style.pV20, style.pH10, style.shadowBox,]}

                      >
                        {Links.map((item) => {
                          return (
                            <TouchableOpacity key={item.name} style={[styles.nextBtn,]} onPress={() => { linkingHandler(item) }}>
                              <Text style={[styles.ResFont]}>{item.name}</Text>
                            </TouchableOpacity>
                          );
                        })}
                           {getRally?.isVolunteer && <TouchableOpacity  style={[styles.nextBtn,]} onPress={() => { navigation.navigate('Volunteer',{item:getRally?.id}) }}>
                              <Text style={[styles.ResFont]}>Volunteer to Help</Text>
                            </TouchableOpacity>}
                      </View>}
                </ScrollView>
                :
                (getAllRalliesData && getAllRalliesData?.length > 0 ?
                  <FlatList
                    data={getAllRalliesData}
                    renderItem={renderRallyCard}
                    keyExtractor={(item, index) => index.toString()}
                    style={[style.mt20,style.mB10]}
                    contentContainerStyle={[style.pb80]}

                  /> :
                  <View style={[style.row, style.centerBox, style.centerItem, style.mt40]}>
                    <Text style={[style.font20, style.textCenter]}>No Rallies Found </Text>
                  </View>
                )
            }
          </View>}

      </View>
      <ModalNative
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            isVisible={showModal}
            onBackdropPress={()=>setShowModal(false)}
            backdropColor='rgba(0, 0, 0, 0.3)'>  
              <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
                <Text style={[style.font14,style.boldTxt,style.textCenter]}>
                If you aren't registered, you will be directed to the organizer's chat, registered redirects to the group chat
                </Text>
                <View style={[style.row,style.centerItem,style.centerBox,style.mt20]}>
                <TouchableOpacity style={[style.primaryLayout,style.button,{width:'50%'}]} onPress={()=>{
                  setChatData({id:getRally?.organizerId,type:'user'});
                  setShowModal(false);
                  navigation.navigate("WebChat")
                }}>
                 <Text style={[style.whiteText]}>Message</Text>
                </TouchableOpacity>
                </View>
              </View>
          </ModalNative>
          
    </View>

  )
}

const styles = StyleSheet.create({
  msgIcon:{
    borderColor: COLORS.PRIMARY ,
    marginTop:5
  },
  ResFont:{
    fontSize:Dimensions.get('screen').width*0.035,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
  },
  userIcons: {
    width: normalize(35),
    height: normalize(35),
    borderWidth: 1.2,
    marginRight:normalize(15),
    alignItems: "center",
    display: 'flex',
    justifyContent: "center",
    borderRadius: 5,
  },
  menuContainerCard: {
    flex: 2,
  },
  table: {
    borderColor: COLORS.BLACK,
    borderWidth: 0.5,
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(10),
  },
  image: {
    height: normalize(60),
    width: normalize(80),
    borderRadius:8
  },
  mb50: {
    marginBottom: normalize(50)
  },
  card: {
    backgroundColor: '#2952A7',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    marginVertical: normalize(5),
    marginHorizontal:normalize(10),
    borderRadius:8

  },
  linkBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    paddingHorizontal: normalize(5),
    paddingVertical: normalize(6),
    borderRadius: 4,
    marginVertical: normalize(5),
    width: normalize(100),
    height:normalize(35)
  },
  linkBtnComplete: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(6),
    borderRadius: 4,
    marginVertical: normalize(5),
    // width: normalize(120),
    height:normalize(35)
  },
   linkBtnRegistered: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
    paddingHorizontal: normalize(5),
    paddingVertical: normalize(5),
    borderRadius: 4,
    marginVertical: normalize(5),
    width: normalize(100),
    height:normalize(35)
  },
  linkBtnText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  linkBtnTextRegistered: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  root: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  editor: {
    flex: 1,
    height: Dimensions.get('screen').height * 0.5,

  },
  nextBtn: {
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(8),
    marginVertical: normalize(3),
    margin: normalize(3)
  },
  WebView: {
    height: 50, backgroundColor: '#2952A7'
  },
  descContainer:{
    // top:100, 
    // position:'absolute',
    // zIndex:0, 
    // width:'100%'
  },
  menuContainer:{
    position:'absolute', 
    right: Dimensions.get('screen').width * 0.02, 
    width: Dimensions.get('screen').width * 0.5,  
    backgroundColor: 'white',zIndex: 999, 
  },
  mapView: {
    width: '100%',
    height: Dimensions.get('screen').height / 2.3,
    borderRadius: 20,
    marginBottom:10
  },
  map: {
    width: '100%',
    height: Dimensions.get('screen').height / 1.8,
    borderRadius: 20,
 },
  customView: {
    padding: 5, 
    borderRadius: 10,
    backgroundColor: 'white',
 },
 currentLocation:{
  position:'absolute',
  bottom:normalize(20),
  right:normalize(15),
  backgroundColor:COLORS.WHITE,
  padding:normalize(10),
  borderRadius:10
},
satilliteLocation:{
  position:'absolute',
  bottom:normalize(65),
  right:normalize(15),
  backgroundColor:COLORS.WHITE,
  padding:normalize(10),
  borderRadius:10
},
valueCell: {
  flex: 2,
  textAlign: 'left',
  paddingHorizontal: 8,
  fontWeight: '600',
  color: COLORS.DARK_PRIMARY,
},
valueCellName: {
  flex: 2,
  textAlign: 'left',
  paddingHorizontal: 8,
  color: COLORS.BLACK_50,
},
rallyNameStyle:{
  width:Dimensions.get("screen").width*0.3

}
});