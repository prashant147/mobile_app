import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Dimensions, FlatList, Alert, TouchableHighlight,PermissionsAndroid,Platform } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { addMembersAsFavorite, getAllMemberBoats, getMemberById,getMemberBoatView } from '../../services/api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../../styles/style';
import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, normalize } from '../../styles/utilities/dimentions';
import COLORS from '../../styles/theme/color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';
import Header from '../../components/Header';
import Menu from '../../routes/Menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { BackHandler } from 'react-native';
import { dateFormat } from '../../styles/utilities/variables';
import MapView, { Marker, Callout, Polyline } from 'react-native-maps';
import MembersContext from './MembersContext';
import TabBox from '../../components/TabBox';
import { ImageBackground } from 'react-native';
import GetLocation from 'react-native-get-location';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

export default function MemberDetails({ route }) {
  const { setHideChatbotMember, setHideChatbot,setChatData } = useContext(MembersContext)
  const navigation = useNavigation()
  const mapRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loader, setLoader] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const token = AsyncStorage.getItem('accessToken');
  const isTablet = DeviceInfo.isTablet();
  const [locateMap, setLocateMap] = useState(false)
  const [zoom, setZoom] = useState(5)
  const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2)
  const { width, height } = Dimensions.get('window')
  const aspectRatio = width / height
  const [boatsList, setBoatsList] = useState([]);
  const [boats, setBoats] = useState([]);
  const [boatsListLoading, setBoatsListLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Boats');
  const [selectedMemberShow, setSelectedMemberShow] = useState(false);
  const [polylineCoords, setPolylineCoords] = useState([]);
  let tabData = ["Boats","Badges"]
  const [mapType, setMapType] = useState('satellite');
  const [selectedBoat, setSelectedBoat] = useState(null);
  const markerRef = useRef(null);

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === 'satellite' ? 'standard' : 'satellite'));
  };

  const [region, setRegion] = useState({
    latitude: 38.8933398,
    longitude: -77.3264126,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        fetchCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchCurrentLocation = async ()=>{
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 60000,
    })
      .then((location) => {
        if(location){
          getLocation(location)
        }
        
        })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
  }

  useFocusEffect(
    React.useCallback(() => {
      if(Platform.OS === 'android'){
        requestLocationPermission();   
      }
      fetchCurrentLocation();
    }, [])
  );



 useEffect(() => {
  getData();
 }, [])
 
 const getData = async () => {
  try {
    setBoatsListLoading(true)
    const response = await getAllMemberBoats();
    if (response.status === 200) {
      setBoatsList(response.data);
      setBoatsListLoading(false)
    }
  } catch (error) {
    setBoatsListLoading(false)
    console.log(error);
  }
}

const getLocation = (coords) => {
  if (coords && mapRef.current) {
    mapRef.current.animateToRegion(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0010,
        longitudeDelta: 0.0010,
      },
      1000
    );
  }
}; 

const getBoatLocation =async(mmsi:any)=>{
  setPolylineCoords([])
  const filterBoat = boatsList.filter((item)=>item?.MMSI == mmsi )
  
  if(filterBoat.length){
    setBoatsListLoading(false)
    let coords = {
      latitude: filterBoat[0]?.position?.lat,
      longitude: filterBoat[0]?.position?.lon,
    };   
       mapRef.current.animateToRegion(
          {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta:  0.4,
            longitudeDelta:  0.4,
          },
          1000
        );
  }else{
    Alert.alert('Could not fetch Boat Location Invalid MMSI !!!');
    setBoatsListLoading(false);
    setLocateMap(false)
  }
  onMarkerClick(filterBoat[0]);
}  

const onMarkerClick = async(marker) => {
  setPolylineCoords([])
  try {
      const response = await getMemberBoatView(marker?.MMSI);      
      if (response.status === 200) {
        const coordinates = response.data.map(point => ({
          latitude: parseFloat(point.lat),
          longitude: parseFloat(point.lon),
        }));               
         setPolylineCoords(coordinates);
         setBoats([marker]);
         setSelectedBoat(marker); 
         setTimeout(() => {
          markerRef.current?.showCallout();
        }, 100);
      }
    } catch (error) {
      console.log(error);
    }
};

  useEffect(() => {
    const backAction = () => {
      onClickBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useFocusEffect(React.useCallback(() => {
    setPolylineCoords([])
    setLocateMap(false);
  },[]))

  useFocusEffect(
    React.useCallback(() => {
      setLoader(true)
      setHideChatbot(true)
      setHideChatbotMember(true)
      setSelectedTab('Boats')
      setSelectedMember(null)
      setLocateMap(false);
    }, [])
  )

  const selectFavMember = async (item) => {
    try {
      setUpdateSuccess(false)
      const response = await addMembersAsFavorite(item.id, token);
      if (response.status === 200) {
        setUpdateSuccess(true)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handlePress = async (item) => {
    try {
      setSelectedMemberShow(false)
      setLoader(true)
      const response = await getMemberById(item, token)
      if (response.status === 200) {
        setSelectedMember(response.data)
        setLoader(false)
        setSelectedMemberShow(true)
      }else{
        setSelectedMember(null)
      }
    } catch (error) {
      console.log(error);
      setLoader(false)
      setSelectedMemberShow(true)
      setSelectedMember(null)
    }

  }
  useEffect(() => {
    if (updateSuccess) {
      handlePress(selectedMember.id)
    }

  }, [updateSuccess])
  useEffect(() => {
    if (route && route.params) {
      handlePress(route.params.id)
    }
  }, [route])


  const SelectMemberInfo = () => {
    return <View >
      {selectedMember !== null ? (
        <ScrollView
         showsVerticalScrollIndicator={false}
          style={[
            styles.memberListContainer,
            { width: "100%", padding: normalize(8) },
          ]}>
          <View style={[style.row, { marginBottom: 10, flexDirection: 'row', alignItems: "center" }]} >
            {selectedMember && selectedMember?.profileUrl ? (
              <Image source={{ uri: `${selectedMember?.profileUrl}` }} style={[styles.profileImage]} resizeMode='cover' />
            ) : (
              <Image style={styles.profileImage} source={require("../../assets/avatarImage.png")} alt='img' resizeMode='cover' />
            )}

            <View style={style.contant}>
              <Text style={styles.memberSubText}>
                MEMBER NAME
              </Text>
              <Text
                style={[
                  styles.memberTitleText,
                  { fontSize: normalize(15) },
                ]}>
                {selectedMember?.firstName + " " + selectedMember?.lastName}
              </Text>


            </View>
            <View>
              {selectedMember?.isPrivate === true && <Text style={[style.font12, { color: COLORS.LIGHTGREY }]}>Private Account</Text>}
              <TouchableOpacity style={styles.favIconMobile} onPress={() => selectFavMember(selectedMember)}>
                <AntDesign name={selectedMember?.favorite ? "heart" : "hearto"} size={normalize(20)} color={COLORS.GREEN} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[style.row, styles.memerLayout]} >
            {selectedMember?.isPrivate === false &&
              <View style={[style.contant]}>
                <Text style={[styles.memberSubText, { marginTop: 10 },]}>D.O.B</Text>
                <Text style={[styles.memberTitleText]}>{selectedMember?.dob ? dateFormat(selectedMember.dob) : "N/A"}</Text>
              </View>
            }
            <View style={[style.contant]}>
              <Text style={[styles.memberSubText, { marginTop: 10 },]}>BOAT NAME</Text>
              <Text style={[styles.memberTitleText]}>{selectedMember.boats?.length > 0 && selectedMember?.boats[0]?.boatName ? selectedMember?.boats[0]?.boatName : "N/A"}</Text>
            </View>




          </View>
          {selectedMember?.isPrivate === false ?
            <View style={[style.row, styles.memerLayout]} >
              <View style={[styles.btnsAlignment]}>
                <TouchableOpacity style={[styles.userIcons]} onPress={() => {
                  setChatData({id:selectedMember.id,type:'user'})
                  navigation.navigate("WebChat")
                  }}>
                  <Image source={require('../../assets/msg-icon.png')} />
                </TouchableOpacity>
                <Text style={[styles.favIconTxt, { color: COLORS.GREY }]}>Message</Text>
              </View>

              <View style={[styles.btnsAlignment]}>
              {selectedMember?.phoneNumbers?.[0]?.phoneNumber ? (
                <TouchableOpacity style={[styles.userIcons]} onPress={() => Linking.openURL(`tel:${selectedMember.phoneNumbers[0].phoneNumber}`)}>
                <Image source={require('../../assets/phone-icon.png')} />
              </TouchableOpacity>
            ) : (
              <View style={[styles.userIcons,style.opacity]}>
                <Image source={require('../../assets/phone-icon.png')} />
              </View>
            )}
            <Text style={[styles.favIconTxt,style.grayText]}>Call</Text>
            </View>

              <View style={[styles.btnsAlignment]}>
                <TouchableOpacity style={[styles.userIcons]} onPress={() => Linking.openURL(`mailto:${selectedMember?.emailAddress[0]?.email}`)}>
                  <Image source={require('../../assets/mail-icon.png')} />
                </TouchableOpacity>
                <Text style={[styles.favIconTxt, { color: COLORS.GREY }]}>Mail</Text>
              </View>
              <View style={[styles.btnsAlignment]}>
                <TouchableOpacity style={[styles.userIcons]} onPress={() =>{ 
                if(!selectedMember?.boats[0]?.mmsi){
                  Alert.alert('No MMSI Found !!!');
                  return;
                }
                setLocateMap(true);
                setBoatsListLoading(true)
                setTimeout(() => {
                  getBoatLocation(selectedMember?.boats[0]?.mmsi);
                }, 2000);
                setTimeout(() => {
                  getBoatLocation(selectedMember?.boats[0]?.mmsi);
                }, 4000);
               }}>
                  <Image source={require('../../assets/location-icon.png')} />
                </TouchableOpacity>
                <Text style={[styles.favIconTxt, { color: COLORS.GREY }]}>Locate Boat</Text>
              </View>

            </View> :
            <View style={[style.row]} >
              <View style={[styles.btnsAlignment]}>
                <TouchableOpacity style={[styles.userIcons]} onPress={() => {
                   setChatData({id:selectedMember.id,type:'user'})
                  navigation.navigate("WebChat")
                }}>
                  <Image source={require('../../assets/msg-icon.png')} />
                </TouchableOpacity>
                <Text style={[styles.favIconTxt, { color: COLORS.GREY }]}>Message</Text>
              </View>

              <View style={[styles.btnsAlignment, style.mH20]}>
                <TouchableOpacity style={[styles.userIcons]} onPress={() =>{ 
                if(!selectedMember?.boats[0]?.mmsi){
                  Alert.alert('No MMSI Found !!!');
                  return;
                }
                setLocateMap(true);
                setBoatsListLoading(true)
                setTimeout(() => {
                  getBoatLocation(selectedMember?.boats[0]?.mmsi);
                }, 2000);
                setTimeout(() => {
                  getBoatLocation(selectedMember?.boats[0]?.mmsi);
                }, 4000);
               }}>
                  <Image source={require('../../assets/location-icon.png')} />
                </TouchableOpacity>
                <Text style={[styles.favIconTxt, { color: COLORS.GREY }]}>Locate Boat</Text>
              </View>

            </View>
          }
          <TabBox
          data={tabData}
          selectedTab={selectedTab}
          onTab={(tab: string) => setSelectedTab(tab)}
        ></TabBox>
        {selectedTab === 'Boats' && <View>
          <Text style={[style.font14,style.boldTxt,style.mtb10]}>Boat Information</Text>

          <FlatList
            data={selectedMember?.boats}
            renderItem={({item})=>{
              return(
                <View  style={[style.mb10,styles.boatContainer,{borderColor:item?.isPrimary ?COLORS.PRIMARY:COLORS.BLACK_50}]} >
                  <View style={[style.row,style.mb10]}> 
                    {item.image ? (
                    <Image source={{uri: `${item.image}`}} style={[styles.profileImage]} resizeMode='cover'/>
                    ) : (
                      <Image style={styles.profileImage} source={require('../../assets/no-image-icon-6-bg.png')} alt='img' resizeMode='cover'/>
                    )}
                    <View  style={style.column} >
                      <View  style={style.row}>
                      <View style={[style.column]}>
                        <Text style={styles.memberSubText}>BOAT NAME</Text>
                        <Text style={[styles.memberTitleText]}>{item.boatName}</Text>
                      </View>
                      </View>
                     
                      <View style={[style.row, style.mt5,]}>
                        <View>
                        <Text style={styles.memberSubText}>MAKE AND MODEL</Text>
                        <Text style={[styles.memberTitleText]}>{item.make?item.make:"NA"}</Text>
                        </View>
                        <View style={style.mL30}>
                        <Text style={styles.memberSubText}>LENGTH</Text>
                        <Text style={[styles.memberTitleText]}>{item.length?item.length:"NA"}</Text> 
                        </View>
                      </View>
                    </View>
                    </View>

                    <View  style={[style.row, style.mt10]} >
                      <View style={[style.contant]}>
                      <Text style={styles.memberSubText}>HAILING PORT</Text>
                        <Text style={[styles.memberTitleText]}>{item.homePort?item.homePort:"NA"}</Text> 
                      </View>
                      <View style={[style.contant]}>
                        <Text style={styles.memberSubText}>PROMINENT FEATURES</Text>
                        <Text style={[styles.memberTitleText]}>{item.colour?item.colour:"NA"}</Text>
                      </View>
                    </View>

                    <View  style={[style.row, style.mt10]} >
                    <View style={[style.contant]}>
                        <Text style={styles.memberSubText}>MMSI</Text>
                        <Text style={[styles.memberTitleText]}>{item.mmsi?item.mmsi:"NA"}</Text>
                      </View> 
                      <View style={[style.contant]}>
                        <Text style={styles.memberSubText}>OFFSHORE EMAIL</Text>
                        <Text style={[styles.memberTitleText]}>{item.offShoreEmailAddress?item.offShoreEmailAddress:"NA"}</Text>
                      </View> 
                    </View>

                </View>
                )
                }}
                />
        </View>}
        {selectedTab ==='Badges' &&
        <View style={[styles.badgesWrapper,style.pV10,style.contant,selectedMember?.awardDtoList?.length > 0 &&style.flexWrap,style.mB30]}>
        {selectedMember?.awardDtoList?.length > 0 ? selectedMember?.awardDtoList?.map((item)=>{
      
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
            <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
              <Text style={[style.font18]}>No Badges Found</Text>
            </View>
        }
      </View>
        }
          <TouchableOpacity style={[style.row, style.button,style.centerItem,style.mt10,style.mB30]} onPress={onClickBack}>
            <Text style={[style.buttonTxt, style.textCenter]}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View
          style={[
            styles.memberListContainer,
            styles.emptyMember,
           
          ]}>
          <Image
            source={require('../../assets/boat.png')}
            style={styles.noMemberSelectImg}
          />
          <Text style={styles.labelNoSelect}>
            Select any member to view information
          </Text>
        </View>
      )
      }
    </View>
  }
  const unixToHours = (unixTimestamp)=>{
    return moment.unix(unixTimestamp).fromNow();
  }
  const memoizedCard = useMemo(() => {
    if (boatsListLoading) {
      return(<View style={[style.mt40,style.contant]}>
         <ActivityIndicator color={COLORS.PRIMARY} size={'small'} style={[style.centerBox,style.mt40]}/>
      </View>);
    } else if(boatsList && boatsList.length > 0) {{
      return (
        <View>
        <MapView
          ref={mapRef}
          style={styles.mapView}
          initialRegion={{
            latitude: 38.8933398,
            longitude: -77.3264126,
            latitudeDelta: distanceDelta * aspectRatio,
            longitudeDelta: distanceDelta,
          }}
          showsMyLocationButton={false}
          showsUserLocation={true}
          mapType={mapType}
          loadingEnabled={true}
          >  
         
          {boatsList.length > 0 && boatsList?.map((marker, index) => 
        {
            let boatImage;
            if (marker?.distance > 0) {
            boatImage = require('../../assets/svg/green_sailboat.png');
            } else if (marker.last > 12 && marker.last < 13) {
            boatImage = require('../../assets/svg/yellow_sailboat.png');
            } else if (marker.last > 24) {
            boatImage = require('../../assets/svg/red_sailboat.png');
            } else if (marker.Watch == 1) {
            boatImage = require('../../assets/svg/blue_sailboat.png');
            } else if (marker?.distance === 0) {
            boatImage = require('../../assets/svg/grey_anchor.png');
            }
  
         return(
            <Marker key={index} 
                ref={selectedBoat?.MMSI === marker?.MMSI ? markerRef : null}
                image={boatImage}
                coordinate={{
                    latitude: marker?.position?.lat,
                    longitude: marker?.position?.lon,
                }} onPress={() =>{
                  setPolylineCoords([])
                    onMarkerClick(marker);
                    
                }}>

            {<Callout>
                <TouchableHighlight  underlayColor='#dddddd'>
                    <View style={styles.customView}>
                        <Text style={[styles.valueCell, { fontSize: normalize(16) }]}>
                            {marker.YachtName}
                        </Text>
                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                            {marker.last} hrs since last report
                        </Text>
                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                            {marker.speed} kn / {marker.bearing} {'\u00B0T'} last reported
                        </Text>
                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                            {marker.Length + "' " + marker.Model}
                        </Text>
                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                            {"MMSI:" + marker.MMSI}
                        </Text>
                        {<Text style={[styles.valueCellName,style.BlackbuttonTxt]}>
                            {"Last Update:" + (marker?.position?.last ? unixToHours(marker?.position?.last) : 'Data not available')}
                        </Text>}
                    </View>
               </TouchableHighlight>
            </Callout>}
          </Marker>
        )})}
        {polylineCoords.length > 0 && (
          <Polyline coordinates={polylineCoords} strokeWidth={3} strokeColor={mapType ==='satellite'?"yellow": "blue"} />
        )}
        </MapView>
        {!boatsListLoading && <TouchableOpacity onPress={toggleMapType} style={[styles.satilliteLocation]}>
          {mapType === 'satellite' ?
          <Entypo style={[style.positionRel]}  name="globe" size={25} color={COLORS.LIGHTGREY} />
           : <FontAwesome6Icon style={[style.positionRel]}  name="satellite" size={25} color={COLORS.LIGHTGREY} />}
          </TouchableOpacity>}
        </View>        
      );
    }
    }
  }, [boatsListLoading, boatsList,selectedBoat,polylineCoords,mapType]);

  const onClickBack = () => {
    if (locateMap) {
      setLocateMap(false)
    } else if (route.params?.path) {
      setHideChatbot(false)
      setHideChatbotMember(false)
        if(route?.params?.rallyTabIndex && route?.params?.item){
          navigation.navigate(route.params.path,{rallyTabIndex:route?.params?.rallyTabIndex,item:route?.params?.item})
        }else if(route?.params?.item && route?.params?.rallyName && route?.params?.marker){
          navigation.navigate(route.params.path,{rallyName:route?.params?.rallyName,item:route?.params?.item,marker:route?.params?.marker})
        }
     else if(route?.params?.tabIndex){
      if(route?.params?.marker){
        navigation.navigate(route.params.path,{tabIndex:route?.params?.tabIndex,marker:route?.params?.marker})
      }else{
        navigation.navigate(route.params.path,{tabIndex:route?.params?.tabIndex})
      }
      }else{
        navigation.navigate(route.params.path)
      }
      setSelectedMember(null)
    } else {
      setHideChatbot(false)
      setHideChatbotMember(false)
      navigation.navigate('Home')
      setSelectedMember(null)
    }
  }
  return (
    <View style={style.contant}>
      <View>
          <View style={style.sidepanelcolor}>
            <Menu selectIndex={2} style={style.sidepanelcolor} />
          </View>
      </View>
      <View
        style={[
          style.contant,
          style.pH20,
          style.pt20
        ]}>
        <View style={[style.row]}>
          {
            <TouchableOpacity style={style.row} onPress={onClickBack}>
              <Icon name="chevron-left" size={normalize(15)} style={[style.mr10,style.mt3]} color={COLORS.PRIMARY} />
              <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
            </TouchableOpacity>
          }
        </View>
        {loader ? <View style={[style.contant, style.contentCenter, style.centerItem]}><ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'} /></View> :
          <View style={style.contant}>
            {(selectedMember != null && locateMap == false && <View style={style.contant}>
              <Text style={[style.font14, style.boldTxt, style.mtb10]}>Member Information</Text>
              <View style={style.contant}>
                <SelectMemberInfo></SelectMemberInfo>
              </View>

            </View>)}


            {(

              selectedMember != null && locateMap == true &&
              <View style={[style.mt10, style.contant]}>
                {memoizedCard}
                {Platform.OS !== 'ios' && !boatsListLoading &&
            <TouchableOpacity style={[styles.currentLocation]} onPress={fetchCurrentLocation}>
            <MaterialIcons style={style.positionRel} name='my-location' size={25} color={COLORS.LIGHTGREY}/>
            </TouchableOpacity>
          }
                {Platform.OS !== 'android' && !boatsListLoading &&
            <TouchableOpacity style={[styles.currentLocation]} onPress={fetchCurrentLocation}>
            <Ionicons style={style.positionRel} name='navigate-outline' size={25} color={COLORS.LIGHT_PRIMARY}/>
            </TouchableOpacity>
          }
              </View>

            )}

            {selectedMember === null && selectedMemberShow &&
            <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
              <Text style={[style.font18]}>No User Found</Text>
            </View>
            }
          </View>

        }
      </View>
    </View>
  )
}

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
    width:Dimensions.get('screen').width*0.25,
    flexDirection:'column',
    alignItems:'center'
  },
  badgesWrapper:{
    flexDirection:'row',
    gap:15
  },
  inputStyle: {
    paddingHorizontal: 10,
    borderWidth: 1,
    fontSize: normalize(14),
    fontFamily: 'Roboto-Regular',
    alignItems: 'center',
    paddingVertical: 5,
    color: COLORS.BLACK,
    borderRadius: 10,
    height: 50,
    marginBottom: 10
  },
  phoneLayoutbox: {
    borderBottomColor: COLORS.GREEN,
    borderBottomWidth: .5,
    paddingBottom: 20
  },
  layoutbox: {
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10
  },
  layoutboxMobile: {
    marginHorizontal: 10,
    marginVertical: 2,
    padding: 10
  },
  btnTextStyle: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20
  },
  textRight: {
    textAlign: 'right'
  },
  bottomBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical:10
  },
  breakLine: {
    height: 2,
    maxWidth: '100%',
    backgroundColor: COLORS.SECONDARY,
    marginVertical: 20
  },
  memberSubtitleText: {
    color: COLORS.BLACK,
    fontSize: normalize(12),
    lineHeight: 25
  },
  memerLayout: {
    justifyContent: 'space-between', marginBottom: 10
  },
  btnsAlignment: {
    flexDirection: "column", alignItems: 'center'
  },
  userIcons: {
    width: 45,
    height: 45,
    borderWidth: 1.2,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
    display: 'flex',
    justifyContent: "center",
    borderRadius: 5,
  },
  userAwardIcons: {
    width: 45,
    height: 45,
    alignItems: "center",
    display: 'flex',
    justifyContent: "center",
  },
  favIcon: {
    borderColor: COLORS.GREY, borderWidth: 1, borderRadius: 10,
    height: 50, paddingHorizontal: 15, justifyContent: 'center',
    alignContent: 'center', alignItems: 'center'
  },
  favIconMobile: {
    height: 50, paddingHorizontal: 15, justifyContent: 'center',
    alignContent: 'center', alignItems: 'center'
  },
  favIconTxt: {
    fontSize: 12, textAlign: 'center',
    marginTop: 5
  },
  labelNoSelect: {
    color: COLORS.WHITE,
    fontSize: normalize(12),
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 10,
    width: '80%'
  },
  noMemberSelectImg: {
    width: 80,
    height: 80,
  },
  emptyMember: {
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    borderRadius: 8,
    marginTop: 25,
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: normalize(65),
    height: normalize(65),
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    resizeMode: 'center',
  },
 
  pageContainer: {
    shadowColor: COLORS.GREY,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  memberListContainer: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(8),
    // width:'48%',
    // borderRadius:1,
    marginRight: 10,
    marginBottom: 10,

    // backgroundColor:COLORS.WHITE
  },
  viewBtnStyle: {
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 4,
    paddingVertical: 5,
    width: '100%',
    height: 40,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberTitleText: {
    color: COLORS.LIGHT_BLACK,
    fontSize: normalize(12),
    lineHeight: 20
  },
  valueCell: {
    flex: 2,
    textAlign: 'left',
    paddingHorizontal: 8,
    fontWeight: '600',
    color: COLORS.DARK_PRIMARY
  },
  valueCellName: {
    flex: 2,
    textAlign: 'left',
    paddingHorizontal: 8,
    color: COLORS.BLACK_50
  },
  memberSubText: {
    color: COLORS.GREY,
    fontSize: normalize(11),
    lineHeight: 20,
  },
  boatContainer:{
    borderWidth:1, 
    borderRadius:4, 
    borderColor:COLORS.BLACK_50,
    padding:10,
  },
  satilliteLocation:{
    position:'absolute',
    bottom:normalize(60),
    right:normalize(15),
    backgroundColor:COLORS.WHITE,
    padding:normalize(10),
    borderRadius:10
  },
  currentLocation:{
    position:'absolute',
    bottom: Platform.OS === "android" ? normalize(130) : normalize(115),
    right:normalize(15),
    backgroundColor:COLORS.WHITE,
    padding:normalize(10),
    borderRadius:10
  },
  mapView: {
    width: '100%',
    height: Dimensions.get('screen').height / 1.6,
    borderRadius: 20,
  },
});
