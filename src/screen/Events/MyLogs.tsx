import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../../styles/theme/color';
import {normalize,scaleWidth} from '../../styles/utilities/dimentions';
import style from '../../styles/style';
import DropdownSelector from '../../components/DropdownSelector';
import {vesselList} from '../../styles/utilities/constants';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Callout,
} from 'react-native-maps';
import {getBoatList} from '../../services/api/getBoatList';
import DeviceInfo from 'react-native-device-info';
const eventList =[
  {
      id:0,
      isWinner:false,
      isStartLog:true
  }
]
const MyLogs = ({setActiveTab}:any) => {
  const [zoom, setZoom] = useState<number>(5);
  const isTablet = DeviceInfo.isTablet();
  const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2);
  const {width, height} = Dimensions.get('window');
  const aspectRatio = width / height;
  const [boatList, setBoatList] = useState<any[]>([]);
  const [initialMap, setInitialMap] = useState({
    latitude: 34.62846067258543,
    longitude: -74.15490453765402,
  });

  const [startLog, setStartLog] = useState(false);
  const [selectedBoat, setSelectedBoat] = useState();
  const [selectedBoatObj, setSelectedBoatObj] = useState({});
  const deviceWidth = width;
  const deviceHeight = height;

  useEffect(() => {
    getMapData();
  }, []);

  const onSelectedItemsChange = (selectedItems: any) => {
    setSelectedBoat(selectedItems)

    // setSelectedBoat(Number(selectedItems))
  };

  const onSelectedItemObjectsChange = (selectedItemsObj: any) => {
    // setSelectedBoatObj(selectedItemsObj[0]);
  };
  const separator = () => {
    return <View style={styles.line} />;
  };
  const getMapData = async () => {
    try {
      const response = await getBoatList();
      //   console.log("getBoatList",response);
      setBoatList(response);
    } catch (error) {
      console.log('error', error);
    }
  };

  const renderItem = (marker: any) => {
    if (marker?.distance > 0) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          // title={marker.YachtName}

          image={require('../../assets/GreenBoat.png')}>
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

  const InfoModal = ({marker}: any) => {
    return (
      <Callout>
        <View style={{padding: 5, borderRadius: 10}}>
          <Text style={[styles.valueCell, {fontSize: normalize(16)}]}>
            {marker.YachtName}
          </Text>
          <Text style={[styles.valueCellName, {color: COLORS.BLACK}]}>
            {marker.last} hrs since last report
          </Text>
          <Text style={[styles.valueCellName, {color: COLORS.BLACK}]}>
            {marker.speed} kn / {marker.bearing} {'\u00B0T'} last reported
          </Text>
          <Text style={[styles.valueCellName, {color: COLORS.BLACK}]}>
            {marker.Length + "' " + marker.Model}
          </Text>
          <Text style={[styles.valueCellName, {color: COLORS.BLACK}]}>
            {'MMSI:' + marker.MMSI}
          </Text>
        </View>
      </Callout>
    );
  };
  
  const renderEventItem =({item,index}:any)=>{
    return(
      <View style={{ flexDirection: isTablet ? 'row' : 'column', marginBottom: normalize(20) }}>
                <Image
                source={require('../../assets/tempImg/mylogImg.png')}
                style={styles.profileImg}
                resizeMode='contain'
                />

            <View  style={{marginLeft: isTablet?  normalize(15) : 0}}>
              <View style={styles.firstLineContainer}>
              <View style={style.contant}>
                <View style={isTablet ? style.row : style.contant}>
                    <View>
                        <Text style={styles.nameTitleStyle}>RALLY NAME</Text>
                        <Text style={styles.nameTitleTextStyle}>
                            {'Dum Dum Rally to Heaven'}
                        </Text>
                    </View>
                    <View style={[isTablet ? { marginLeft: 10 } : null]}>
                        <Text style={styles.nameTitleStyle}>DATE/TIME</Text>
                        <Text style={styles.nameTitleTextStyle}>
                            {'Nov 22, 09:00 AM - 12:00 PM'}
                        </Text>
                    </View>
                </View>
                <View style={[isTablet ? style.row : style.contant, {marginTop: normalize(15)}]}>
                    <View>
                        <Text style={styles.nameTitleStyle}>POSITION</Text>
                        <Text style={styles.nameTitleTextStyle}>{'Helmsman'}</Text>
                    </View>
                    <View style={[isTablet ? { marginLeft: 20 } : null]}>
                        <Text style={styles.nameTitleStyle}>LOCATION</Text>
                        <Text style={[styles.nameTitleTextStyle]}>
                            {'California Port'}
                        </Text>
                    </View>
                    <View style={[isTablet ? { marginLeft: 20 } : null]}>


                        <Text style={styles.nameTitleStyle}>ORGANISER</Text>
                        <Text style={[styles.nameTitleTextStyle]}>
                            {'Jack Sparrow'}
                        </Text>
                    </View>
                </View>
            </View>
            {isTablet &&  
                <View style={styles.winnerAnnounsedContainer}>
                    <Image
                        source={require('../../assets/profilecrew.png')}
                        style={styles.profileImg}
                    />
                    <Text
                        style={[
                        style.contant,
                        styles.nameTitleTextStyle,
                        {marginHorizontal: 10},
                        ]}>
                        Winner Yet to announced
                    </Text>
                    <Image
                        source={require('../../assets/boatSymbol.png')}
                        style={styles.profileImg}
                    />
                </View>
            }
      </View>

            { !isTablet &&  <View style={[styles.mobileWinnerContainer,{marginTop:5}]}>
              {item?.isWinner?  
              <Image
              source={require('../../assets/profilecrew.png')}
              style={styles.profileImgMob}
          />
              :<View/>}
               <Image
              source={require('../../assets/profilecrew.png')}
              style={styles.profileImgMob}
          />
                <Text
                    style={[
                    styles.nameTitleTextStyle,
                    ]}>
                    Winner {"\n"}Yet to announced
                </Text>
                <Image
                    source={require('../../assets/boatSymbol.png')}
                    style={styles.profileImgMob}
                />
                </View>}
       {item?.isStartLog && <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <View style={{width: isTablet ? "100%" :scaleWidth(150) , marginRight: normalize(10)}}>
          <DropdownSelector
            uniqueKey="id"
            displayKey="boatname"
            items={vesselList}
            onSelectedItemsChange={onSelectedItemsChange}
            onSelectedItemObjectsChange={onSelectedItemObjectsChange}
            selectedItems={selectedBoat}
            placeholder="Select Boat"
          />
        </View>

        <TouchableOpacity activeOpacity={0.8} 
        onPress={() => setStartLog(!startLog)}
        style={[styles.btnStyle,{backgroundColor:startLog ? COLORS.YELLOW:COLORS.PRIMARY}]}>
          <Text style={styles.btnText}>{ startLog ? 'Stop log':'Start log'}</Text>
        </TouchableOpacity>
      </View>}

      <View style={{marginTop: normalize(20)}}>
        <Text style={styles.nameTitleTextStyle}>
          {'Silver Port - Deti Port '}
        </Text>
        <Image
          source={require('../../assets/tempImg/boatmap.png')}
          style={{
            width: '100%',
            height: normalize(50),
            resizeMode: 'contain',
          }}
        />
      </View>

      <View style={{marginTop: normalize(20)}}>
      <Text
        style={[
          isTablet ? style.font16: style.font14,isTablet ? style.mt0 : style.mt10,
          style.boldTxt,
          ,
        ]}>About Event</Text>
        <Text
          numberOfLines={3}
          style={[
            styles.nameTitleTextStyle,
            isTablet ? style.font16: style.font14,
          ]}>
          {
            'From sailing sea to roaring soares the movement of cool bridge makes the sea with clam and vibrant colors...'
          }
        </Text>
      </View>

    </View>
    </View>
        
    )
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        
        <View style={styles.line} />

        <Text style={[ isTablet ? style.font24 : style.font14,isTablet ? style.mt0 : style.mt10, style.mtb10,
              style.boldTxt,      style.primaryText,]}>My Logs</Text>
<View style={[styles.container]}>

    <FlatList
    data={eventList}
    renderItem={renderEventItem}
    keyExtractor={item=>item.id}
    ItemSeparatorComponent={separator}
    showsVerticalScrollIndicator={false}
    />
    <View style={[{marginLeft:isTablet?normalize(80):10},style.mtb10]}>
              <MapView
                initialRegion={{
                  latitude: initialMap.latitude,
                  longitude: initialMap.longitude,
                  latitudeDelta: distanceDelta * aspectRatio,
                  longitudeDelta: distanceDelta,
                }}
                clusterColor={'#1f28ff'}
                style={{
                  width: isTablet?'80%':'100%',
                  height: isTablet?400:300,
                  borderRadius: 20,
                }}>
                {boatList.map(renderItem)}
              </MapView>
            </View>

</View>
      </View>
    </ScrollView>
  );
};

export default MyLogs;

const styles = StyleSheet.create({
  container: {
    // padding: normalize(10),
  },
  btnStyleOutline: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(8),
    // paddingVertical:normalize(2),
    marginBottom: normalize(5),
    borderRadius: normalize(4),
    marginRight: 'auto',
    marginTop:10,
    height: normalize(25),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnOutlineTextStyle: {
    color: COLORS.PRIMARY,
    fontSize: normalize(13),
    marginHorizontal: normalize(5),
  },
  line: {
    borderTopWidth: 1,
    // borderBottomWidth:1,
    // width: '100%',
    borderColor: COLORS.LINE,
    marginVertical: normalize(10),
    // borderRadius:8
  },
  textTitleHeading: {
    color: COLORS.PRIMARY,
    fontSize: normalize(16),
    fontWeight: '600',
    lineHeight: 30,
  },
  profileImg: {
    width: normalize(90),
    height: normalize(90),
    resizeMode: 'contain',
  },
  nameTitleStyle: {
    color: COLORS.GREY,
  },
  mobileWinnerContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.BLACK_50,
    alignItems: 'center',
    justifyContent:"space-between",
    borderRadius: normalize(4),
    
  },
  nameTitleTextStyle: {
    color: COLORS.BLACK,
    
  },
  winnerAnnounsedContainer: {
    flex:1,
    flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.BLACK_50,
        alignItems: 'center',
        paddingHorizontal: normalize(8),
        borderRadius: normalize(4),
    marginLeft:10
  },
  blankShade: {
    backgroundColor: COLORS.GREY,
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(4),
    marginRight: normalize(10),
  },
  firstLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // flexWrap:'wrap'
  },

  btnStyle: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(15),
    // marginRight:normalize(20),
    paddingVertical: normalize(5),
    flexDirection: 'row',
    borderRadius: normalize(6),
    height: normalize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
    // marginRight:normalize(10),
    textAlign: 'center',
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
  profileImgMob: {
    width: normalize(50),
    height: normalize(50),
    resizeMode: 'contain',
  },
});
