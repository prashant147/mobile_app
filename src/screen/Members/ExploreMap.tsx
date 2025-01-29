import React, { useState, useEffect, useRef, useMemo, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Keyboard,
  ActivityIndicator,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import MapView, { Marker, Callout,Polyline,} from 'react-native-maps';
import { normalize } from '../../styles/utilities/dimentions';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import SearchComponent from '../../components/SearchComponent';
import { getAllMemberBoats,getBoatByMMSI,getMemberBoatView } from '../../services/api/auth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MapDetails from './MapDetails';
import MembersContext from './MembersContext';
import ModalNative from "react-native-modal";
import GetLocation from 'react-native-get-location';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import { formatCoordinates } from '../../styles/utilities/variables';

const ExploreMap = ({boatsData,setBoatsData,marker}:any) => {
  const mapRef = useRef(null);
  const navigation = useNavigation()
  const { accessToken } = useContext(MembersContext);
  const [ coords, setcoords] =useState({})
  const [polylineCoords, setPolylineCoords] = useState([]);
  const [search, setSearch] = useState<string>('');
  const [isFilter,setIsFilter] = useState(false)
  const [boatsList, setBoatsList] = useState([]);
  const [boatsListLoading, setBoatsListLoading] = useState(true);
  const [filterText, setFilterText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [shipDetails, setShipDetails] = useState([]);
  const [shipDetailsSuccess, setShipDetailsSuccess] = useState(false);
  const [boatModal, setBoatModal] = useState(false);
  const [boatModalMsg, setBoatModalMsg] = useState('');
  const [selectedBoat, setSelectedBoat] = useState(null);
  const markerRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [mapType, setMapType] = useState('satellite');
  const [searchDropdown,setSearchDropdown] = useState(false)
  const [callOutPrevCoordinates,setCallOutPrevCoordinates] = useState(null)

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
        console.log('locationlocation Location permission granted');
        // Fetch current location when permission is granted
        fetchCurrentLocation('');
      } else {
        console.log('locationlocation Location permission denied');
        // Handle the case when permission is denied
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if(Platform.OS === 'android'){
        requestLocationPermission();
      }
      fetchCurrentLocation('');
    }, [])
  );

  const fetchCurrentLocation = async (type)=>{

    
    setSearch("")
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 60000,
    })
      .then((location) => {
          if (location && mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta:type === 'button' ? 0.01 :15,
                longitudeDelta:type === 'button' ? 0.01 :15,
              },
              500
            );
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
    }, [])
  );

  useFocusEffect(React.useCallback(() => {
    const fetchLocation = async () => {
      setSearch("")
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 60000,
        });
        
        if (location) {
          const newRegion = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 15,
            longitudeDelta: 15,
          };
          setRegion(newRegion);
        }
      } catch (error) {
        const { code, message } = error;
        console.warn(code, message);
      }
    };
    fetchLocation();
    },[]))

  useFocusEffect(React.useCallback(() => {
    if (marker) {
      const timeoutId = setTimeout(() => {
        handleSuggestionClick(marker);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [marker]))

  useFocusEffect(React.useCallback(() => {
    setPolylineCoords([])
  },[]))

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === 'satellite' ? 'standard' : 'satellite'));
  };

   // Function to handle marker click
   const onMarkerClick = async(marker,type) => {
    setPolylineCoords([])
    try {
        const response = await getMemberBoatView(marker.MMSI);      
        if (response.status === 200) {
          const coordinates = response.data.map(point => ({
            latitude: parseFloat(point.lat),
            longitude: parseFloat(point.lon),
          }));   
          let coords = {
            latitude: marker?.position?.lat,
            longitude: marker?.position?.lon,
          };            
          setCallOutPrevCoordinates(coords)
           setPolylineCoords(coordinates);
           setSelectedBoat(marker); 
           if(type === 'call'){
            setTimeout(() => {
              markerRef.current?.showCallout();
            }, 100);
           }
        }
      } catch (error) {
        console.log(error);
      }
};

const getBoatDetails = async (marker)=>{
  try {
    const response = await getBoatByMMSI(marker?.MMSI,accessToken)
    if(response.status === 200){
      if(response?.data?.message === 'Boat not found!'){
        setBoatModalMsg("Unable to retrieve member details, MMSI ID is not updated.")
        setBoatModal(true)
        setTimeout(() => {
          setBoatModal(false)
        }, 3000);
      }else if(response?.data?.boatOwner){
        navigation.navigate("MemberDetails", {id: response?.data?.boatOwner,path: 'MemberMap',tabIndex:'Map',marker:marker});
        setSearch("")
      }else{
        setBoatModalMsg('Unable to retrieve member details, MMSI ID is not updated.')
        setBoatModal(true)
        setTimeout(() => {
          setBoatModal(false)
        }, 3000);
        
      }
      
    }
  } catch (error) {
    setBoatModalMsg('Unable to retrieve member details, MMSI ID is not updated.')
        setBoatModal(true)
        setTimeout(() => {
          setBoatModal(false)
        }, 3000);
  }
}

  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        setLoading(true)
        try {
          setBoatsListLoading(true)
          const response = await getAllMemberBoats();
          if (response.status === 200) {
            setBoatsData(response.data);
            setLoading(false); 
            setBoatsListLoading(false);
            setSearch("");
          }
        } catch (error) {
          setBoatsListLoading(false)
          console.log(error);
        }
      };
      getData();
    }, [])
  );

  const fetchShipDetails = async (marker:any) => {
    
    setShipDetailsSuccess(false)
    try {
      const response = await getMemberBoatView(marker.MMSI);      
      if (response.status === 200) {
        setShipDetails(response.data);
        setShipDetailsSuccess(true);
       
      }
    } catch (error) {
      console.log(error);
      setShipDetailsSuccess(false)
    }
  };

  const InfoModal = ({ marker }: any) => {
  
    return (
      <Callout 
      onPress={()=>fetchShipDetails(marker)}
      >
        <View style={{ padding: 5, borderRadius: 10 }}>
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
      </Callout>
    );
  };
  

  
  const getBoatLocation = (coords) => {
    if (coords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.4,
          longitudeDelta: 0.4,
        },
        500
      );
    }
  }; 

  const handleSearch = () => {
    if(search !== ""){
    setSearchDropdown(false)
    Keyboard.dismiss();
    const searchList = boatsData?.filter((boat) =>
      `${boat.boatname?.toLowerCase()} ${boat.LastName?.toLowerCase()}`.includes(search?.toLowerCase())
    );
    if (Array.isArray(searchList) && searchList.length === 0) {
      Alert.alert('No Boat found !!!');
      
    }
    let coords = {
      latitude: searchList[0]?.position?.lat,
      longitude: searchList[0]?.position?.lon,
    };   
    setcoords(coords)
    getBoatLocation(coords);
    onMarkerClick(searchList[0],'call');
  }
  };

  useEffect(() => {
    const timeOutSearch = setTimeout(() => {
      if (search !== '') {
        setcoords({})
      } else {
        setcoords({})
      }
    }, 1000);
    return () => clearTimeout(timeOutSearch);
  }, [search]);

  const zoomOut = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta + 0.1,
      longitudeDelta: region.longitudeDelta + 0.1,
    };
    mapRef?.current?.animateToRegion(newRegion, 1000);
  };

  useEffect(() => {
    const filterBoats =
      boatsData &&
      boatsData.length > 0 &&
      boatsData.filter((e) => {
        const qualificationMatches = e.Model.toLowerCase().includes(filterText.toLowerCase());
        return qualificationMatches;
      });
    setBoatsList(filterBoats); 
    setSearch("");   
  }, [filterText, boatsData]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No data available';
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC' };
    const formattedDate = date.toLocaleString('en-US', options).replace(',', ''); // Remove extra comma
    return formattedDate + ' GMT'; // Append GMT
  };



  const unixToHours = (unixTimestamp)=>{
    if(moment(unixTimestamp).isValid()){
      return moment.unix(unixTimestamp).fromNow();
    }else{
      return 'None'
    }
  }


const closeCallout = () => {
  setPolylineCoords([])
    if (callOutPrevCoordinates && mapRef.current) {
      console.log('Animating to region:', callOutPrevCoordinates);
      mapRef.current.animateToRegion(
        {
          latitude: callOutPrevCoordinates.latitude,
          longitude: callOutPrevCoordinates.longitude,
          latitudeDelta: 15,
          longitudeDelta: 15,
        },
        500
      );
    }
    setCallOutPrevCoordinates(null)
  };

  const memoizedCard = useMemo(() => {
    
    if (loading) {
      return(<View style={[style.mt40,style.contant]}>
         <ActivityIndicator color={COLORS.PRIMARY} size={'large'} style={[style.centerBox,style.mt40]}/>
      </View>);
    } else if(boatsList && boatsList.length > 0) {{
      return (
        // <TouchableWithoutFeedback onPress={()=>closeCallout()}>
        <View >
        <MapView
          ref={mapRef}
          region={region}
          style={styles.mapView}
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

            const boatsWithSameName = boatsList.filter( (boat) => boat.YachtName.toLowerCase() === marker.YachtName.toLowerCase() );
  
         return(
            <Marker key={index} 
                ref={selectedBoat?.MMSI === marker?.MMSI ? markerRef : null}
                image={boatImage}
                zIndex={selectedBoat?.MMSI === marker?.MMSI ? 1 : 0}
                coordinate={{
                    latitude: marker?.position.lat,
                    longitude: marker?.position.lon,
                }} onPress={() =>{
                    onMarkerClick(marker,'click');
                    
                }}
                // onDeselect={() => {closeCallout()}}
                >

            {<Callout onPress={()=>getBoatDetails(marker)}>
                <TouchableHighlight  underlayColor='#dddddd'>
                    <View style={styles.customView}>
                    <Text style={[styles.valueCell, { fontSize: normalize(16) }]}> 
                    {boatsWithSameName.length > 1 ? `${marker.YachtName} ${marker.LastName}` : `${marker.YachtName}`} 
                    </Text>

                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                           {formatCoordinates(marker.position.lat,marker.position.lon)} 
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
                       {"Last Update:" + (marker?.position?.t ? unixToHours(marker?.position?.t) : 'Data not available')}
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
        {!loading && <TouchableOpacity onPress={toggleMapType} style={[styles.satilliteLocation]}>
          {mapType === 'satellite' ?
          <Entypo style={[style.positionRel]}  name="globe" size={25} color={COLORS.LIGHTGREY} />
           : <FontAwesome6Icon style={[style.positionRel]}  name="satellite" size={25} color={COLORS.LIGHTGREY} />}
          </TouchableOpacity>}
        </View>   
        //</TouchableWithoutFeedback>
      );
    }
    }
  }, [loading, boatsList,selectedBoat, shipDetailsSuccess,polylineCoords,mapType]);
  
  const handleSuggestionClick = (boat) => {
    setPolylineCoords([])
    const boatsWithSameName = boatsList.filter(
      (b) => b.boatname.toLowerCase() === boat.boatname.toLowerCase()
    );
    
    const searchValue = boatsWithSameName.length > 1
      ? `${boat.boatname} ${boat.LastName || ''}`
      : boat.boatname;
      setSearch(searchValue);
    setSearchDropdown(false)
    let coords = {
      latitude: boat?.position?.lat,
      longitude: boat?.position?.lon,
      latitudeDelta: 0.4,
      longitudeDelta: 0.4, 
    };
    setcoords(coords);
    getBoatLocation(coords);
    onMarkerClick(boat,'call');
  };

  return (
    <View style={[style.contant]}>
      <View style={[style.pH20]}>
        
      <SearchComponent
        clearButton={true}
        isButtion={false}
        searchInput={search}
        onSearchClear={() => {setSearch("");Keyboard.dismiss()}}
        onChangeText={(txt: string) => {setSearch(txt);setSearchDropdown(txt.length > 3)}}
        Buttonholder={'Find Boat'}
        placeholder={'Find a boat by name'}
        onSearchBut={() => handleSearch()}
        filter={false}
        showFilter={isFilter}
        setShowFilter={()=>setIsFilter(!isFilter)}
        membersFilter={''}
        setMembersFilter={() => {}}
        onSubmitEditing={() =>handleSearch()}
      />
      <View style={[style.mH20,styles.searchdWrapper]}>
      {searchDropdown && search.length > 3 && (
  <ScrollView style={styles.dropdownContainer}>
    {boatsData && boatsData.filter((boat) =>
      `${boat?.boatname} ${boat?.LastName}`.toLowerCase().includes(search.toLowerCase())
    ).length > 0 ? (
      boatsData
        .filter((boat) =>
          `${boat?.boatname} ${boat?.LastName}`.toLowerCase().includes(search.toLowerCase())
        )
        .map((item) => {
          const boatsWithSameName = boatsData.filter(
            (boat) => boat.boatname.toLowerCase() === item.boatname.toLowerCase()
          );
          return (
            <TouchableOpacity
              key={item?.id}
              style={styles.dropdownItem}
              onPress={() => handleSuggestionClick(item)}
            >
              <Text style={[style.font14]}>
                {boatsWithSameName.length > 1
                  ? `${item?.boatname} ${item?.LastName}`
                  : `${item?.boatname}`}
              </Text>
            </TouchableOpacity>
          );
        })
    ) : (
      <View style={[styles.dropdownItem, styles.noResultContainer]}>
        <Text style={{ fontSize: 14, textAlign: 'center' }}>
          No results found
        </Text>
      </View>
    )}
  </ScrollView>
)}
</View>
    </View>

      <View style={[style.contant, style.row,style.pH10,{paddingBottom:10}]}>
        <ScrollView style={[style.contant]} showsVerticalScrollIndicator={false}>
            <View style={[style.contant, styles.mapViewSection]}>
              <View style={[styles.mapViewContainer,style.mt5]}>
                {memoizedCard}
                {Platform.OS !== 'ios' && !loading &&
            <TouchableOpacity style={[styles.currentLocation]} onPress={()=> fetchCurrentLocation('button')}>
            <MaterialIcons style={style.positionRel} name='my-location' size={25} color={COLORS.LIGHTGREY}/>
            </TouchableOpacity>
          }
                {Platform.OS !== 'android' && !loading &&
            <TouchableOpacity style={[styles.currentLocation]} onPress={()=> fetchCurrentLocation('button')}>
            <Ionicons style={style.positionRel} name='navigate-outline' size={25} color={COLORS.LIGHT_PRIMARY}/>
            </TouchableOpacity>
          }
                {/* <MapDetails region={region} boatsList={boatsList} coords={coords} search={search} loading={boatsListLoading}/> */}
              </View>
            </View>
        </ScrollView>
      </View>
      <ModalNative
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            isVisible={boatModal}
            backdropColor='rgba(0, 0, 0, 0.3)'>  
              <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
                <Text style={[style.font14,style.boldTxt,style.textCenter]}>
                  {boatModalMsg}
                </Text>
              </View>
          </ModalNative>
    </View>
  );
};

export default ExploreMap;

const styles = StyleSheet.create({
  currentLocation:{
    position:'absolute',
    bottom:normalize(30),
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
  mapView: {
    width: '100%',
    height: Dimensions.get('screen').height / 1.6,
    borderRadius: 20,
  },
  mapViewSection: {
    // marginRight: 10, 
    // marginBottom: 10
  },
  mapViewContainer: {
   margin: 0,
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
 satilliteLocation:{
  position:'absolute',
  bottom:normalize(75),
  right:normalize(15),
  backgroundColor:COLORS.WHITE,
  padding:normalize(10),
  borderRadius:10
},
dropdownContainer: {
  backgroundColor: '#fff',
  borderRadius: 4,
  borderColor: '#ccc',
  borderWidth: 1,
  marginTop: 3,
  marginBottom:3,
  maxHeight: 200,
  overflow: 'hidden',
},
dropdownItem: {
  paddingVertical: 7,
  paddingHorizontal: 10,
  borderBottomColor: '#eee',
  borderBottomWidth: 1,
},
noResultContainer: {
  paddingVertical: 7,
  paddingHorizontal: 10,
  alignItems: 'center',
},
searchdWrapper: {
  ...Platform.select({
    ios: {
      justifyContent: "center",
      marginHorizontal:5
    },
    android: {
      position: "absolute",
      zIndex: 999,
      right: 0,
      left: 0,
      top: 55,
      justifyContent: "center",
    }
  }),
},
});