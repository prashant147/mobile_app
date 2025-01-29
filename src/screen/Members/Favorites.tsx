import React,{useState,useEffect} from 'react'
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
    TextInput
  } from 'react-native';
  import Icon from 'react-native-vector-icons/Feather';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import MapView, { Marker, Callout} from 'react-native-maps';
import { memberTravelHistory, membersData } from '../../styles/utilities/constants';
import { getBoatList } from '../../services/api/getBoatList';
import COLORS from '../../styles/theme/color';
import { normalize } from '../../styles/utilities/dimentions';
import style from '../../styles/style';


const Favorites = ({}) => {

    const [zoom, setZoom] = useState<number>(5)
    const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2)
    const { width, height } = Dimensions.get('window')
    const aspectRatio = width / height;
    const [searchInput, setSearchInput] = useState("");
    const [membersList, setMembersList]=useState<any[]>([]);
    const [boatList, setBoatList]=useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState({});
    const [locateMap, setLocateMap] = useState(false);




  useEffect(()=>{
    getMapData();
    getMembersData();
  },[])

    const getMembersData =async()=>{
        setSelectedMember({})
        setLocateMap(false);
        try {
          // const response = await getMemberList();
          // console.log("getMemberList",response);    
          setMembersList(membersData)
        } catch (error) {
          console.log("error",error);
        }
      }
    
    const getMapData =async()=>{
      try {
        const response = await getBoatList();
        // console.log("getBoatList",response);
        setBoatList(response)
      } catch (error) {
        console.log("error",error);
        
      }
    }


    const onChangeText=()=>{
    }

    const renderMembersItem =({item,index}:any)=>{
        return (
          <View style={[styles.memberListContainer, styles.pageContainer]}>
            <View >
              <View >
                <Image
                  source={{
                    uri: `https://sdsa.memberclicks.net${item?.avatar_url}`,
                  }}
                  style={styles.profileImage}
                />
                <View>
                  <Text style={styles.memberSubText}>MEMBER NAME</Text>
                  <Text style={[styles.memberTitleText, {fontSize: normalize(16)}]}>
                    {item?.title}
                  </Text>
                  <Text style={[styles.memberSubText, {marginTop: 10}]}>
                    BOAT NAME
                  </Text>
                  <Text style={[styles.memberTitleText]}>{item?.left[2].html.split("</strong> ")[1]}</Text>
                </View>
                <View >
                  <TouchableOpacity>
                    <AntDesign name={"heart"} size={normalize(20)} color={COLORS.GREEN} />
                    {/* <AntDesign name={item?.isFavorite?"heart":"hearto"} size={normalize(20)} color={COLORS.GREEN} /> */}
                  </TouchableOpacity>
                </View>
              </View>
              <View >
                <View >
                  <Text style={styles.memberSubText}>STATUS</Text>
                  <Text style={[styles.memberTitleText]}>{'Inactive'}</Text>
                </View>
                <View >
                  <Text
                    style={styles.memberSubText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    923 hrs since last report.
                  </Text>
                </View>
                <View >
                  <Text
                    style={styles.memberSubText}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    0 kn/46T last reported.
                  </Text>
                </View>
              </View>
    
              <View >
                <View >
                  <Text style={styles.memberSubText}>HEADING</Text>
                  <Text style={[styles.memberTitleText]}>Nil</Text>
                </View>
                <View >
                  <Text style={styles.memberSubText}>SPEED</Text>
                  <Text style={[styles.memberTitleText]}>{10} knotes</Text>
                </View>
                <View >
                  <Text style={styles.memberSubText}>MMSI</Text>
                  <Text style={[styles.memberTitleText]}>338330468</Text>
                </View>
              </View>
    
              <View >
                <TouchableOpacity style={styles.viewBtnStyle} onPress={()=>setSelectedMember(item)}>
                  <Text style={[styles.memberTitleText, {fontSize: normalize(16)}]}>
                    View
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }

      const renderTravelhistory =({item,index}:any)=>{
        return(
          <View >
            <View >
            <Text style={styles.memberTitleText}>{item?.portName}</Text>
            <Text style={styles.memberSubText}>{item?.datetime}</Text>
            </View>
            <Image source={require('../../assets/boatHistory.png')} style={{width:'100%', height:50}}/>
          </View>
        )
      }

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

  return (
           <View >
              <View >
                <Text style={styles.textTitleHeading}>
                  Find a Member near me 
                </Text>
                <View >
                  <View  style={styles.inputContainer}>
                    <Icon name="search" size={20} color={COLORS.GREY} />
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={onChangeText}
                      value={searchInput}
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.btnStyle}>
                    <Text style={styles.btnTextStyle}>Find Member</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{flex: 1,height: '100%',width:'100%',}}>
                  {/* members list and view */}
                  <View
                    style={{flex: 1, flexDirection: 'row'}}>
                    <View >
                      {locateMap ? (
                        <View style={style.contant}>
                          <View style={style.row}>
                            <TouchableOpacity onPress={()=>{
                              setLocateMap(false);
                              setSelectedMember({})
                            }}
                            style={[style.button,{ flexDirection:'row', alignItems:'center', marginBottom:10}]}>
                              <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY}/>
                              <Text style={[styles.memberTitleText, {fontSize: normalize(14),color:COLORS.PRIMARY}]}>Back to Members List</Text>
                            </TouchableOpacity>
                          </View>
                          <MapView
                            // provider={
                            //   Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                            // }
                            initialRegion={{
                              latitude: 34.62846067258543,
                              longitude: -74.15490453765402,
                              latitudeDelta: distanceDelta * aspectRatio,
                              longitudeDelta: distanceDelta,
                            }}
                            // zoomEnabled={true}
                            // maxZoomLevel={5}
                            clusterColor={'#1f28ff'}
                            style={{
                              width: '100%',
                              height: '60%',
                              borderRadius: 20,
                            }}>
                            {boatList.map(renderItem)}
                          </MapView>

                            <View >
                              <FlatList
                              data={memberTravelHistory}
                              renderItem={renderTravelhistory}
                              keyExtractor={item => item.id && item.id.toString()}
                              />
                          </View>
                        </View>
                      ) : (
                        <FlatList
                          data={membersList}
                          renderItem={renderMembersItem}
                          numColumns={2}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={item => item.id && item.id.toString()}
                          style={{paddingBottom: 20}}
                        />
                      )}
                    </View>

                    <View style={[styles.viewInfoContainer, {height: '100%'}]}>
                      {selectedMember !== null ? (
                        <View
                          style={[
                            styles.memberListContainer,
                            {backgroundColor: COLORS.WHITE, width: '100%',padding:normalize(8)},
                          ]}>
                          <View >
                            <View >
                              <Image
                                source={{
                                  uri: `https://sdsa.memberclicks.net${selectedMember?.avatar_url}`,
                                }}
                                style={[styles.profileImage,{width:normalize(45),height:normalize(50)}]}
                              />
                              <View>
                                <Text style={styles.memberSubText}>
                                  MEMBER NAME
                                </Text>
                                <Text
                                  style={[
                                    styles.memberTitleText,
                                    {fontSize: normalize(16)},
                                  ]}>
                                  {selectedMember?.title}
                                </Text>
                                <Text
                                  style={[
                                    styles.memberSubText,
                                    {marginTop: 10},
                                  ]}>
                                  BOAT NAME
                                </Text>
                                <Text style={[styles.memberTitleText]}>
                                  {selectedMember.length &&
                                    selectedMember?.left[2]?.html?.split(
                                      '</strong> ',
                                    )[1]}
                                </Text>
                              </View>
                              <View >
                                <TouchableOpacity>
                                  <Icon
                                    name="heart"
                                    size={normalize(20)}
                                    color={COLORS.GREEN}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View >
                              <View >
                                <Text style={styles.memberSubText}>STATUS</Text>
                                <Text style={[styles.memberTitleText]}>{'Inactive'}</Text>
                              </View>
                              <View >
                                <Text
                                  style={styles.memberSubText}
                                  numberOfLines={2}
                                  ellipsizeMode="tail">
                                  923 hrs since last report.
                                </Text>
                              </View>
                              <View >
                                <Text
                                  style={styles.memberSubText}
                                  numberOfLines={2}
                                  ellipsizeMode="tail">
                                  0 kn/46T last reported.
                                </Text>
                              </View>
                            </View>

                            <View  >
                              <View >
                                <Text style={styles.memberSubText}>
                                  HEADING
                                </Text>
                                <Text style={[styles.memberTitleText]}>Nil</Text>
                              </View>
                              <View >
                                <Text style={styles.memberSubText}>SPEED</Text>
                                <Text style={[styles.memberTitleText]}>{10} knotes</Text>
                              </View>
                              <View >
                                <Text style={styles.memberSubText}>MMSI</Text>
                                <Text style={[styles.memberTitleText]}>338330468</Text>
                              </View>
                            </View>

                            <View >
                              <Image
                                source={require('../../assets/lineSeprator.png')}
                                style={{width: '100%', height: 50}}
                                resizeMode='contain'
                              />
                              <View >
                                {[
                                  'Silver Port',
                                  'Maroni Port',
                                  'Silver Port',
                                ].map(item => {
                                  return (
                                    <Text style={[styles.memberSubtitleText,{fontSize:normalize(10)}]}>
                                      {item}
                                    </Text>
                                  );
                                })}
                              </View>
                              <View style={styles.breakLine} />
                              <View >
                                <View >
                                  <Text style={styles.memberSubText}>
                                    BOAT OWNER
                                  </Text>
                                  <Text style={[styles.memberSubtitleText]}>
                                    Tony Lame
                                  </Text>
                                </View>
                                <View >
                                  <Text style={styles.memberSubText}>
                                    CO-OWNER
                                  </Text>
                                  <Text style={[styles.memberSubtitleText]}>
                                    Drake Lume
                                  </Text>
                                </View>
                              </View>
                              <View  >
                                <View>
                                  <Text style={styles.memberSubText}>
                                    MODEL
                                  </Text>
                                  <Text style={[styles.memberSubtitleText]}>
                                    328JKF3
                                  </Text>
                                </View>
                                <View >
                                  <Text style={styles.memberSubText}>
                                    HOME PORT
                                  </Text>
                                  <Text style={[styles.memberSubtitleText]}>
                                    Vessel Home Port
                                  </Text>
                                </View>
                              </View>
                              <View  >
                                <View>
                                  <Text style={styles.memberSubText}>YEAR</Text>
                                  <Text style={[styles.memberSubtitleText]}>
                                    2017
                                  </Text>
                                </View>
                                <View >
                                  <Text style={styles.memberSubText}>MAKE</Text>
                                  <Text style={[styles.memberSubtitleText]}>
                                    Vessel Manufar Deo
                                  </Text>
                                </View>
                              </View>
                              <View >
                                <View >
                                  <Text style={styles.memberSubText}>
                                    LENGTH
                                  </Text>
                                  <Text style={[styles.memberSubtitleText]}>
                                    3244
                                  </Text>
                                </View>
                                <View >
                                  <Text style={styles.memberSubText}>
                                    COLOR
                                  </Text>
                                  <Text style={[styles.memberSubtitleText]}>
                                    RED, GREEN, YELLOW
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.breakLine} />

                              <View>
                                <View >
                                  {[
                                    require('../../assets/ship1.png'),
                                    require('../../assets/ship2.png'),
                                    require('../../assets/ship3.png'),
                                  ].map(item => {
                                    return (
                                      <Image
                                        source={item}
                                        style={{
                                          width:'30%', 
                                          height: normalize(55),
                                          marginHorizontal: 5,
                                          borderRadius:4
                                        }}
                                      />
                                    );
                                  })}
                                </View>

                                <View style={styles.bottomBtnContainer}>
                                  <TouchableOpacity
                                    onPress={() =>{ setSelectedMember({}); setLocateMap(false);}}
                                    style={[
                                      styles.viewBtnStyle,
                                      {minWidth: normalize(55),  width:"30%",},
                                    ]}>
                                    <Text style={[styles.btnTextStyle,{fontSize:normalize(8),color:COLORS.BLACK}]}>Close</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => setLocateMap(true)}
                                    style={[
                                      styles.viewBtnStyle,
                                      {
                                        minWidth: normalize(60),
                                        width:"35%",
                                        backgroundColor: COLORS.ORANGE,
                                        marginLeft: 10,
                                        marginRight: 5,
                                        paddingHorizontal:normalize(5)
                                      },
                                    ]}>
                                    <Text style={[styles.btnTextStyle,{fontSize:normalize(8),color:COLORS.BLACK}]}>Locate Boat</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      Linking.openURL('1234512345')
                                    }
                                    style={[
                                      styles.viewBtnStyle,
                                      {
                                        minWidth: 60,
                                        width:"30%",
                                        backgroundColor: COLORS.PRIMARY,
                                        paddingRight: 10,
                                      },
                                    ]}>
                                    <Icon
                                      name={'phone'}
                                      size={normalize(15)}
                                      color={COLORS.WHITE}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
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
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
  )
}

export default Favorites

const styles = StyleSheet.create({
    map: {
        // flex:1
        ...StyleSheet.absoluteFillObject,
      },
      pageContainer:{
        // borderRadius:1,
        borderWidth:.9,
        borderColor:COLORS.LINE,
        shadowColor:COLORS.GREY,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
      },
      textHeading: {
        color: COLORS.BLACK,
        fontSize: normalize(21),
        fontWeight: '600',
      },
      tabBarContainer:{
        marginTop: 10,
      },
      line: {
        height: 4,
        width: '100%',
        backgroundColor: COLORS.LINE,
        marginVertical: 5,
        borderRadius:8
      },
      textSubheading: {
        color: COLORS.GREY,
        fontSize: normalize(15),
        fontWeight: '500',
        paddingHorizontal:20,
        // lineHeight: 20, 
        
      },
    
      inputStyle: {
        height: 40,
        paddingHorizontal:10,
        borderWidth:0,
        fontSize:normalize(18),
        width:"95%"
      },
      inputContainer:{
        borderWidth:1,
        paddingHorizontal:15,
        paddingVertical:2,
        borderRadius:30,
        borderColor:COLORS.LINE,
        marginVertical:10,
        // justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
      },
      btnStyle:{
        backgroundColor:COLORS.PRIMARY,
        borderRadius:8,
        padding:10,
        minWidth:50,
        marginRight:10,
        justifyContent:'center',
        alignItems:'center',
        height:40
      },
      btnTextStyle:{
        color:COLORS.WHITE,
        fontSize:12,
        fontWeight:'500',
        lineHeight:20
      },
    
      memberListContainer:{
        padding:normalize(12),
        width:'48%',
        // borderRadius:1,
        marginRight:10,
        marginBottom:10,
        borderWidth:.9,
        borderColor:COLORS.LINE,
        // backgroundColor:COLORS.WHITE
      },
      favBtn:{
        padding:5,
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        borderRadius:4
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
     
      textTitleHeading: {
        color: COLORS.LIGHT_PRIMARY,
        fontSize: normalize(18),
        fontWeight: '600',
        lineHeight: 30,
      },
      
      memberSubText:{
        color:COLORS.GREY,
        fontSize:normalize(11),
        lineHeight:20
      },
      memberTitleText:{
        color:COLORS.LIGHT_BLACK,
        fontSize:normalize(12),
        lineHeight:25
      },
      viewInfoContainer:{
        backgroundColor: COLORS.PRIMARY,
        width: '30%',
        padding:normalize(8),
        marginLeft:2,
        // marginRight:-25
      },
    
      memberSubtitleText:{
        color:COLORS.BLACK,
        fontSize:normalize(12),
        lineHeight:25
      },
    
      breakLine :{
        height:2,
        maxWidth:'100%',
        backgroundColor: COLORS.SECONDARY,
        marginVertical:20
      },
    
      bottomBtnContainer:{
        flexDirection:'row',
        alignItems:'center',
        
      },
      viewFavStyle:{
        color:COLORS.PRIMARY,
        fontSize: 14,
           fontWeight: '600',
           lineHeight: 30,
       },
       labelNoSelect: {
         color:COLORS.WHITE,
         fontSize:normalize(12),
         lineHeight:20,
         textAlign:'center',
         marginTop:10,
         width:'80%'
       },
       emptyMember:{
         borderWidth:1,
         borderColor:COLORS.WHITE,
         borderRadius:8,
         marginTop:25,
       },
       profileImage: {
        width: normalize(65),
        height:normalize(70),
        borderRadius: 8,
        marginRight: 10,
        resizeMode: 'cover',
      },
      noMemberSelectImg:{
        width: 80,
        height: 80,
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
})