import React, { useState, useEffect, useRef,useContext, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  Dimensions,
  FlatList,
  TextInput,
  Switch,
  BackHandler,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MapView, { Marker,Callout} from 'react-native-maps';
import { SCREEN_HEIGHT, normalize } from '../../styles/utilities/dimentions';
// @ts-ignore
import { memberTravelHistory } from '../../styles/utilities/constants';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import SearchComponent from '../../components/SearchComponent';
import DeviceInfo, { isTablet } from 'react-native-device-info';
import {  boatsLocation } from '../../styles/utilities/constants';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import MembersContext  from './MembersContext'
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { addMembersAsFavorite, getAllMemberBoats, getMemberBoatView, getMemberById } from '../../services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { ActivityIndicator } from 'react-native-paper';
import moment from 'moment';
import { dateFormat } from '../../styles/utilities/variables';
import { TouchableHighlight } from 'react-native';

interface MembersPageProps {
  members:any
  IsBack:any,
  setIsBack:any
}

const MembersListPage: React.FC<MembersPageProps> = ({setIsBack,IsBack,members,navigation,memberfromBirthday,setMemberfromBirthday,setUpdateSuccess,isLoader,setIsLoader}:any) => {
  const { membersData, addMember,setChatData } = useContext(MembersContext);
  const navigate = useNavigation();
  const mapRef = useRef(null);
  const isTablet = DeviceInfo.isTablet();
  const [search,setSearch] = useState<string>("");
  const [locateMap, setLocateMap] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [zoom, setZoom] = useState<number>(5)
  const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2)
  const { width, height } = Dimensions.get('window')
  const aspectRatio = width / height
  const [membersList, setMembersList]=useState<any[]>([]);
  // const [boatList, setBoatList]=useState<any[]>(boatsLocation);
  const [boatsList, setBoatsList] = useState([]);
  const [boatsListLoading, setBoatsListLoading] = useState(true);

  const [isRefresh, setIsRefresh]=useState(false);
  const [searchTxt, setsearchTxt]=useState<string>("");
  const [checkedMentors, setCheckedMentors] = useState([]);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [grpName, setGrpName] = useState('');
  const [grpNameSuccess, setGrpNameSuccess] = useState(false);
  const [membersFavSwitch, setMembersFavSwitch] = useState(false);
  const [selection, setSelection] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
	const [membersFilter, setMembersFilter] = useState('');
  const token =  AsyncStorage.getItem('accessToken');
  const [favorite,setIsFavorite] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isLoading,setIsLoading] = useState(false)

  const [region, setRegion] = useState({
    latitude: 38.8933398,
    longitude: -77.3264126,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  useFocusEffect(React.useCallback(()=>{
    setsearchTxt('')
    setSearch('')
  },[]))
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false); 
    }, 3000);

    return () => clearTimeout(timer); 

  }, []);
  
 const data = [
  { label: 'Name', value: 'name' },
  { label: 'Boat', value: 'boat' }
];
const [value, setValue] = useState(data[0].value);


useEffect(() => {
    setMembersList(members)
  if(members.length > 0 && memberfromBirthday){
    const getUser = members.filter((item:any)=>item.id === memberfromBirthday)  
    handlePress(getUser[0])
    if(getUser.length > 0){
      setMemberfromBirthday()
    }
  }
}, [members,memberfromBirthday])
  
const preferedEmailAddress = selectedMember?.emailAddress.filter(item => item.type === 'PRIMARY')
  useEffect(() => {

    if(selectedMember!=null){
      setIsBack(1)
    }
    if(locateMap){
      setIsBack(2)
    }
  }, [selectedMember,locateMap])
  useEffect(() => {
    if(IsBack==0){
      setSelectedMember(null)
    }else if(IsBack==1){
      setLocateMap(false)
    }
  }, [IsBack])
  
  useEffect(() => {
    try {
      let filterListData = members;
  
      if (membersFilter) {
        filterListData = filterListData.filter((e:any) =>
          e.oceanOrWorldClass?.toLowerCase().includes(membersFilter.toLowerCase())
        );
      }
  
      if (value === 'name') {
        let filteredByName = filterListData.filter(
          (e:any) =>
            e.firstName?.toLowerCase().includes(searchTxt.toLowerCase()) ||
            e.lastName?.toLowerCase().includes(searchTxt.toLowerCase()) ||
            `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTxt.toLowerCase())
        );
        setMembersList(searchTxt === "" ? filterListData : filteredByName);
      } else if (value === 'boat') {
        let filteredByBoat = filterListData.filter((e:any) =>
          e.boatName?.toLowerCase().includes(searchTxt.toLowerCase())
        );
        setMembersList(searchTxt === "" ? filterListData : filteredByBoat);
      } else if (value === 'oceanOrWorldClass') {
        let filteredByOceanOrWorldClass = filterListData.filter((e:any) =>
          e.oceanOrWorldClass?.toLowerCase().includes(searchTxt.toLowerCase())
        );
        setMembersList(searchTxt === "" ? filterListData : filteredByOceanOrWorldClass);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [searchTxt, value, membersFilter]);
  

  useEffect(() => {
    const backAction = () => {
      setSelectedMember(null);
      setSelection(false);
      setCheckedMentors([])
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleCheckboxChange = (mentor:any) => {
    const isChecked = checkedMentors.some((m) => m.id === mentor.id);

    if (isChecked) {
      setCheckedMentors((prevMentors) =>
        prevMentors.filter((m) => m.id !== mentor.id)
      );
    } else {
      setCheckedMentors((prevMentors) => [...prevMentors, mentor]);
    }
  };
  useEffect(()=>{
if(checkedMentors.length === 0){
  setSelection(false)
}
  },[checkedMentors])

  const memberDetailsHandler = (path, id) => {
    navigate.navigate(path, { id});
    
  }
  const handlePress = async(item:any)=>{  
    
    if(selection){
      handleCheckboxChange(item)
    }else{
      navigate.navigate("MemberDetails",{id:item?.id,path:"Members"})
    }
  }
  const handleLongpress =(mentor:any)=>{
    setSelection(true)
    // console.log('selectionInside',selection);
    
   if(!selection){
    setCheckedMentors((prevMentors) => [...prevMentors, mentor])
   }
  }

  const selectFavMember = async (item: any) => {
    try {
      setUpdateSuccess(false);
      const response = await addMembersAsFavorite(item.id, token);
      if (response.status === 200) {
        setIsFavorite(item.favorite === true ? false : true)
        let member = membersList.map((item1) => {
          // If matching item is found, toggle favorite status
          if (item1.id === item.id) {
            item1.favorite = !item1.favorite; // Toggle favorite status
          }
          return item1;
        });
        setMembersList(member);
      }
    } catch (error) {
      console.error(error);
    }
  };


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
  

const getBoatLocation =async(mmsi:any)=>{
  
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
            latitudeDelta: 0.01/ 2,
            longitudeDelta: 0.01/ 2,
          },
          1000
        );
  }else{
    Alert.alert('Could not fetch Boat Location Invalid MMSI !!!');
    setBoatsListLoading(false);
    setLocateMap(false)
  }
    
  
}

const memoizedCard = useMemo(() => {
    
  if (boatsListLoading) {
    return(<View style={[style.mt40,style.contant]}>
       <ActivityIndicator color={COLORS.PRIMARY} size={'large'} style={[style.centerBox,style.mt40]}/>
    </View>);
  } else {
    return (
      <MapView
        ref={mapRef}
        region={region}
        style={styles.mapView}>
        {boatsList.length > 0 && boatsList?.map((marker, index) => 
      {
          let boatImage;
          if (marker?.distance > 0) {
          boatImage = require('../../assets/GreenBoat.png');
          } else if (marker.last > 12 && marker.last < 13) {
          boatImage = require('../../assets/YellowBoat.png');
          } else if (marker.last > 24) {
          boatImage = require('../../assets/RedBoat.png');
          } else if (marker.Watch == 1) {
          boatImage = require('../../assets/blue_sailboat.png');
          } else if (marker?.distance === 0) {
          boatImage = require('../../assets/Grey.png');
          }

       return(
          <Marker key={index} 
              image={boatImage}
              coordinate={{
                  latitude: marker?.position.lat,
                  longitude: marker?.position.lon,
              }} 
              // onPress={() =>{
              //     onMarkerClick(marker);
                  
              // }}
              >

          {<Callout tooltip >
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
                  </View>
             </TouchableHighlight>
          </Callout>}
        </Marker>
      )})}
      </MapView>        
    );
  }
}, [boatsList,boatsListLoading]);



  const renderItem = (marker: any) => {
    if (marker?.distance > 0) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          image={require('../../assets/GreenBoat.png')} >
          <InfoModal marker={marker} />
        </Marker>
      );
    }
    if (marker.last > 12 && marker.last < 13) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          // title={marker.YachtName+""+marker.last}
          style={{width: 50, height: 50}}
          image={require('../../assets/YellowBoat.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
    if (marker.last > 24) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          // title={marker.YachtName}
          image={require('../../assets/RedBoat.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
    if (marker.Watch == 1) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
            
          }}
          // title={marker.YachtName}
          image={require('../../assets/blue_sailboat.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
    if (marker?.distance == 0) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          // title={marker.YachtName}
          image={require('../../assets/Grey.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
  };
  const InfoModal =({marker}:any)=>{
    return(
      <Callout>
        <View style={{padding:5,borderRadius:10}}>
          <Text style={[styles.valueCell,{fontSize:normalize(16)}]}>{marker.YachtName}</Text>
          <Text style={[styles.valueCellName,{color:COLORS.BLACK}]}>{marker.last} hrs since last report</Text>
          <Text style={[styles.valueCellName,{color:COLORS.BLACK}]}>{marker.speed} kn / {marker.bearing} {'\u00B0T'} last reported</Text>
          <Text style={[styles.valueCellName,{color:COLORS.BLACK}]}>{marker.Length + "' " + marker.Model}</Text>
          <Text style={[styles.valueCellName,{color:COLORS.BLACK}]}>{"MMSI:" + marker.MMSI}</Text>
        </View>
      </Callout>
    )
  }
  
  const renderMembersItem =({item,index}:any)=>{
    return (
      <TouchableOpacity style={[style.contant,styles.layoutboxMobile,checkedMentors.some((m) => m.id === item.id) ? {backgroundColor:'#EFEFEF'} : undefined ]} key={item.id} onPress={()=>handlePress(item)} onLongPress={()=>handleLongpress(item)}>
          <View style={[style.row]}>
            {item && item?.profileUrl ? (
              <Image
              source={{
                uri: `${item?.profileUrl}`,
              }}
              style={styles.profileImage}
              resizeMode='cover'
            />
            ) : (
              <Image style={styles.profileImage} source={require("../../assets/avatarImage.png")} alt='img' resizeMode='cover'/>
            )}
            
            <View style={style.contant}>
              <Text style={styles.memberSubText}>MEMBER NAME</Text>
              <Text style={[styles.memberTitleText,styles.memberNameFont]}>
              {(item?.firstName || item?.lastName) ? 
              `${item?.firstName || ''} ${item?.lastName || ''}` : 'N/A'}
              </Text>
              <Text style={[styles.memberSubText,]}>
                BOAT NAME
              </Text>
              <Text style={[styles.memberTitleText]}>{item?.boatName ? item?.boatName : "N/A"}</Text>
              </View>
            <View>
              <TouchableOpacity style={isTablet ?  styles.favIcon : styles.favIconMobile} onPress={()=>selectFavMember(item)}>
                  <AntDesign name={item?.favorite ? "heart":"hearto"} size={normalize(20)} color={COLORS.GREEN} />
              </TouchableOpacity>
            </View>

          </View>
          <View style={[styles.borderLine]}></View>
        {/* { isTablet && <View style={[style.row,style.mt10]}>
            <View style={[style.contant]}>
              <Text style={styles.memberSubText}>HEADING</Text>
              <Text style={[styles.memberTitleText]}>Nil</Text>
            </View>
            <View style={[style.contant,{paddingRight:10}]}>
              <Text style={styles.memberSubText}>SPEED</Text>
              <Text style={[styles.memberTitleText]}>0knotes</Text>
            </View>
            <View style={[style.contant,{paddingLeft:10}]}>
              <Text style={styles.memberSubText}>MMSI</Text>
              <Text style={[styles.memberTitleText]}>338330468</Text>
            </View>
          </View>}
         {isTablet && <TouchableOpacity style={[style.button,style.mH20,style.mt20]} onPress={()=>{setSelectedMember(item);setIsFavorite(item.favorite)}}>
            <Text style={[style.font16, style.buttonTxt]}>
              View
            </Text>
          </TouchableOpacity>} */}

      </TouchableOpacity>
    );
  }
  const RenderTravelhistory =({item,key}:any)=>{
    return(
      <View key={key}>
          <Text style={styles.memberTitleText}>{item?.portName}</Text>
          <Text style={styles.memberSubText}>{item?.datetime}</Text>
        <Image resizeMode='contain' style={{width:"100%"}} source={require('../../assets/boatHistory.png')} />
        <View style={[style.row,{justifyContent:'space-between'}]}>
                {item.portList.map((it:string) => {
                  return (
                    <Text style={[styles.memberSubtitleText,{fontSize:normalize(10)}]}>
                      {it}
                    </Text>
                  );
                })}
        </View>
      </View>
    )
  }
  const SelectMemberInfo = ()=>{
    return    <View >
      {selectedMember !== null ? (
        <ScrollView
         showsVerticalScrollIndicator={false}
        style={[
          styles.memberListContainer,
          { width:"100%",padding:normalize(8)},
        ]}>
          <View style={[style.row,{marginBottom:10,flexDirection:'row',alignItems:"center"}]} >
           {selectedMember && selectedMember?.profileUrl ? (
             <Image source={{uri: `${selectedMember?.profileUrl}`}} style={[styles.profileImage]} resizeMode='cover'/>
             ) : (
              <Image style={styles.profileImage} source={require("../../assets/avatarImage.png")} alt='img' resizeMode='cover'/>
             )}

            <View style={style.contant}>
              <Text style={styles.memberSubText}>
                MEMBER NAME
              </Text>
              <Text
                style={[
                  styles.memberTitleText,
                  {fontSize: normalize(15)},
                ]}>
                {selectedMember?.firstName + " " + selectedMember?.lastName}
              </Text>
              <Text style={styles.memberSubText}>
                MEMBER QUALIFICATION
              </Text>
              <Text
                style={[
                  styles.memberTitleText,
                  {fontSize: normalize(15)},
                ]}>
                {selectedMember?.metadata?.oceanOrWorldClassQualification ? selectedMember?.metadata?.oceanOrWorldClassQualification.replace(/_/g, ' ') : "N/A"}
              </Text>
              {/* <Text style={styles.memberSubText}>
                EMAIL
              </Text>
              <Text
                style={[
                  styles.memberTitleText,
                  {fontSize: normalize(12)},
                ]}>
               jacksparrow@gmail.com
              </Text> */}
             
            </View>
            <View>
            {selectedMember?.isPrivate === true && <Text style={[style.font12,{color:COLORS.LIGHTGREY}]}>Private Account</Text>}
              <TouchableOpacity style={styles.favIconMobile} onPress={()=>selectFavMember(selectedMember)}>
                <AntDesign name={favorite ? "heart":"hearto"} size={normalize(20)} color={COLORS.GREEN} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[style.row,styles.memerLayout]} >
          {selectedMember?.isPrivate === false && 
          <View style={[style.contant]}>
            <Text style={[styles.memberSubText,{marginTop: 10},]}>D.O.B</Text>
              <Text style={[styles.memberTitleText]}>{selectedMember?.dob ? dateFormat(selectedMember.dob): "N/A"}</Text>
            </View>
            }
            <View style={[style.contant]}>
            <Text style={[styles.memberSubText,{marginTop: 10},]}>PRIMARY BOAT NAME</Text>
            <Text style={[styles.memberTitleText]}>{selectedMember.boats?.length > 0 && selectedMember?.boats[0]?.boatName ? selectedMember?.boats[0]?.boatName : "N/A"}</Text>
            </View>
           
            {/* <View style={[style.contant]}>
            <Text style={[styles.memberSubText,{marginTop: 10},]}>PHONE NO</Text>
              <Text style={[styles.memberTitleText]}>9691252394</Text>
            </View> */}
            
       
          </View>
          {selectedMember?.isPrivate === false ?
          <View style={[style.row,styles.memerLayout]} >
            <View style={[styles.btnsAlignment]}>
              <TouchableOpacity style={[styles.userIcons]} onPress={() => {
                 setChatData({id:selectedMember.id,type:'user'})
                navigate.navigate("WebChat")
                }
              }>
                <Image source={require('../../assets/msg-icon.png')} />
              </TouchableOpacity>
              <Text style={[styles.favIconTxt,{color:COLORS.GREY}]}>Message</Text>
            </View>

            <View style={[styles.btnsAlignment]}>
              <TouchableOpacity style={[styles.userIcons]} onPress={() =>Linking.openURL(`tel:${selectedMember?.phoneNumbers[0]?.phoneNumber}`)}>
                <Image source={require('../../assets/phone-icon.png')}/>
              </TouchableOpacity>
              <Text style={[styles.favIconTxt,{color:COLORS.GREY}]}>Call</Text>
            </View>

            <View style={[styles.btnsAlignment]}>
              <TouchableOpacity style={[styles.userIcons]} onPress={() =>Linking.openURL(`mailto:${preferedEmailAddress[0]?.email}`)}>
                <Image source={require('../../assets/mail-icon.png')}/>
              </TouchableOpacity>
              <Text style={[styles.favIconTxt,{color:COLORS.GREY}]}>Mail</Text>
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
               }}>
                <Image source={require('../../assets/location-icon.png')}/>
              </TouchableOpacity>
              <Text style={[styles.favIconTxt,{color:COLORS.GREY}]}>Locate Boat</Text>
            </View>

          </View> :
          <View style={[style.row]} >
          <View style={[styles.btnsAlignment]}>
            <TouchableOpacity style={[styles.userIcons]} onPress={() => {setChatData({id:selectedMember.id,type:'user'});navigate.navigate("WebChat")}}>
              <Image source={require('../../assets/msg-icon.png')} />
            </TouchableOpacity>
            <Text style={[styles.favIconTxt,{color:COLORS.GREY}]}>Message</Text>
          </View>

          <View style={[styles.btnsAlignment,style.mH20]}>
            <TouchableOpacity style={[styles.userIcons]}  onPress={() =>{ 
                if(!selectedMember?.boats[0]?.mmsi){
                  Alert.alert('No MMSI Found !!!');
                  return;
                }
                setLocateMap(true);
                setBoatsListLoading(true)
                setTimeout(() => {
                  getBoatLocation(selectedMember?.boats[0]?.mmsi);
                }, 2000);
               }}>
              <Image source={require('../../assets/location-icon.png')}/>
            </TouchableOpacity>
            <Text style={[styles.favIconTxt,{color:COLORS.GREY}]}>Locate Boat</Text>
          </View>

        </View>
        }
          <View style={styles.breakLine} />

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
                      <Image style={styles.profileImage} source={require('../../assets/boat1.png')} alt='img' resizeMode='cover'/>
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
          
          
          
          
          
          <View  style={style.row} >
          </View>
          <View>
            <View>
              <View style={[styles.bottomBtnContainer]}>
              </View>
            </View>
          </View>

         


{<TouchableOpacity style={[style.row, style.button,{justifyContent:"center"},style.mtb10]} onPress={()=>setSelectedMember(null)}>
                      <Text style={[style.buttonTxt,style.textCenter]}>Back</Text>
                  </TouchableOpacity>}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.memberListContainer,
              styles.emptyMember,
              {
                width: '100%',
                height: 250,
                justifyContent: 'center',
                alignItems: 'center',
              },
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
  const LocationMap =()=>{
    return    <View style={style.contant}> 

              <ScrollView style={[style.contant]}>
                {memoizedCard}
                {/* <MapView
                  ref={mapRef}
                  initialRegion={{
                    latitude: 34.62846067258543,
                    longitude: -74.15490453765402,
                    latitudeDelta: 5,
                    longitudeDelta: 5,
                  }}
                  style={styles.mapView}>
                  {boatsList.map(renderItem)}
                </MapView> */}
              </ScrollView>
        </View>
  }
  const createHandler =()=>{
    setPopoverVisible(true)
    setGrpNameSuccess(false)
  }
  const grpNameChangeHandler =(e:string)=>{
    setGrpName(e)
  }
  
  const createGrpHandler =()=>{
    setGrpNameSuccess(false)
    const payload = {
      id:uuid.v4(),
      firstName:grpName,
      members:checkedMentors,
      time_stamp:new Date()
    }
    addMember(payload)
    setGrpName('')
    setCheckedMentors([])
    navigationHandlerWithParam("MessageCenter",payload.id)
    

  }
  const navigationHandlerWithParam = (path, id) => {
    navigate.navigate(path, { id });
  }
  return (
    <View style={style.contant}>
       {
         <View style={style.contant}> 
            {
              selectedMember==null &&  <View style={style.contant}>   
                    <View style={[style.row,{justifyContent:'space-between',alignItems:"center"}]}>
                    <Text style={[style.font14,style.boldTxt,style.primaryText]}>
                    </Text>
                    <View style={[style.row,{alignItems:'center'}]}>
                      <Text style={[{color:COLORS.PRIMARY},style.mH10]}>Fav</Text>
                      <Switch
                        onValueChange={() => setMembersFavSwitch(!membersFavSwitch)}
                        value={membersFavSwitch}
                        trackColor={{ false: '#767577', true: COLORS.PRIMARY }}
                        thumbColor={COLORS.WHITE}
                        
                      />
                    </View>
                    </View>
                    <SearchComponent isButtion={false} searchInput={search} clearButton={false} onChangeText={(txt:string)=>{setSearch(txt);setsearchTxt(txt)}} Buttonholder={"Find Member"} placeholder={`Find a member`} value={value} setValue={setValue} data={data} filter={true} showFilter={showFilter} setShowFilter={setShowFilter} membersFilter={membersFilter} setMembersFilter={setMembersFilter}></SearchComponent>
                    {isLoader ? 
                    <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
                    <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'} />
                   </View> :
                   <View>
                    {((!membersFavSwitch && membersList && membersList.length > 0) || (membersFavSwitch && membersList.filter(e=>e.favorite)?.length > 0)) ?    
                    <FlatList
                        data={membersFavSwitch ? membersList.filter(e=>e.favorite) : membersList}
                        renderItem={renderMembersItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={[style.pb80]}
                        style={[{height:checkedMentors?.length > 1 ? Dimensions.get('screen').height*0.48: Dimensions.get('screen').height*0.70}]}
                      />  :
                      <View style={[style.centerItem, style.centerBox, style.mt40]}>
                      <Text style={[style.font14, style.mt40]}>
                        {membersFilter === 'Port Captains' ? 'No Port Captains Found' : 'No Members Found'}
                      </Text>
                      </View>
                      }
                      </View>
                    }                      
                      {checkedMentors?.length > 1 && <TouchableOpacity style={[style.button,style.borderRadius8,style.primaryLayout,{justifyContent:'center',margin:10}]} onPress={createHandler}>
              <Text style={[style.buttonTxt,style.whiteText]}>Create Group</Text>
            </TouchableOpacity>}
                </View>
            }
           
            {
              selectedMember != null && locateMap==false  && <View style={style.contant}>  
                <Text style={[style.font14,style.boldTxt,style.mtb10]}>Member Information</Text>
                <View style={style.contant}>
                  <SelectMemberInfo></SelectMemberInfo>
                </View>
                
                </View>

            }
            {
              selectedMember != null && locateMap==true && <LocationMap></LocationMap>
            }
        </View>
       }


<Popover
  isVisible={isPopoverVisible}
  mode={PopoverMode.RN_MODAL}
  popoverStyle={{ width: 400 }}
>
  <View style={{padding:20}}>
    {grpNameSuccess ? <View><Text style={{color:COLORS.GREY}}>Group created..!</Text></View> :<View>
    <TextInput style={styles.inputStyle} placeholder='Group Name' value={grpName} onChangeText={grpNameChangeHandler}/>
 <TouchableOpacity style={[style.button,style.borderRadius8,style.primaryLayout,{justifyContent:'center'}]} onPress={createGrpHandler}>
 <Text style={[style.buttonTxt,style.whiteText]}>Create</Text>
 </TouchableOpacity>
    </View>}
    
 </View>
  </Popover>
    </View>
  );
};

export default MembersListPage;
const styles = StyleSheet.create({ 
  memberNameFont:{
    fontSize:!isTablet() ? Dimensions.get('screen').width*0.038 : Dimensions.get('screen').width*0.02
  },
  inputStyle: {
    paddingHorizontal:10,
    borderWidth:1,
    fontSize:normalize(14),
    fontFamily:'Roboto-Regular',
    alignItems:'center',
    paddingVertical:5,
    color:COLORS.BLACK,
    borderRadius:10,
    height:50,
    marginBottom:10
  },
  phoneLayoutbox:{
    borderBottomColor:COLORS.GREEN,
    borderBottomWidth:.5,
    paddingBottom:20
  },
  layoutbox:{
    marginHorizontal:10,
    marginVertical:10,
    padding:10
  },
  layoutboxMobile:{
    marginVertical:4,
    borderRadius:5
  },
  btnTextStyle:{
    color:COLORS.WHITE,
    fontSize:12,
    fontWeight:'500',
    lineHeight:20
  },
  textRight:{
    textAlign:'right'
  },
  bottomBtnContainer:{
    flexDirection:'row',
    alignItems:'center',
    // marginVertical:10
  },
  breakLine :{
    height:2,
    maxWidth:'100%',
    backgroundColor: COLORS.SECONDARY,
    marginVertical:20
  },
  memberSubtitleText:{
    color:COLORS.BLACK,
    fontSize:normalize(12),
    lineHeight:25
  },
  memerLayout:{
    justifyContent:'space-between',marginBottom:10
  },
  btnsAlignment :{
    flexDirection:"column",alignItems:'center'
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
  labelNoSelect: {
    color:COLORS.WHITE,
    fontSize:normalize(12),
    lineHeight:20,
    textAlign:'center',
    marginTop:10,
    width:'80%'
  },
  noMemberSelectImg:{
    width: 80,
    height: 80,
  },
  emptyMember:{
    borderWidth:1,
    borderColor:COLORS.WHITE,
    borderRadius:8,
    marginTop:25,
  },
  profileImage: {
    width:normalize(65),
    height: normalize(65),
    borderRadius: 8,
    marginRight: 10,
    borderWidth:1,
    resizeMode: 'center',
  },
  // memberImage: {
  //   width: normalize(65),
  //   height:normalize(65),
  //   borderRadius: 8,
  //   marginRight: 10,
  //   display:'flex',
  //  alignContent:"center",
  //  alignItems:"center",
  //  fontSize:normalize(27),
  //   color:COLORS.WHITE,
  //   backgroundColor:COLORS.LIGHTGREY,
  //   borderColor:COLORS.LIGHTGREY,
  //   borderWidth:1,
  //   justifyContent:"center"
  // },
  pageContainer:{
    // borderRadius:1,

    shadowColor:COLORS.GREY,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  memberListContainer:{
    padding:normalize(12),
    width:'48%',
    // borderRadius:1,
    marginRight:10,
    marginBottom:10,

    // backgroundColor:COLORS.WHITE
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
    lineHeight:20
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
  memberSubText:{
    color:COLORS.GREY,
    fontSize:normalize(11),
    lineHeight:20,
  },
  borderLine:{
    borderBottomWidth:1,
    marginTop:7,
    borderColor:COLORS.BORDERGREY
  },
  mapView: {
    width: '100%',
    height: Dimensions.get('screen').height / 1.5,
    borderRadius: 20,
  },
  boatContainer:{
    borderWidth:1, 
    borderRadius:4, 
    borderColor:COLORS.BLACK_50,
    padding:10,
  },
  map: {
    width: '100%',
    height: Dimensions.get('screen').height / 2,
    borderRadius: 20,
 },
  customView: {
    padding: 5, borderRadius: 10,
    backgroundColor: 'white',
 },
});

