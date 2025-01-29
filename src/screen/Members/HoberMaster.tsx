import React,{useState,useEffect,useRef} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions,
    FlatList,
    TextInput
  } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, Callout} from 'react-native-maps';
import { getBoatList } from '../../services/api/getBoatList';
import { boatsLocation, membersData } from '../../styles/utilities/constants';
import { SCREEN_HEIGHT, SCREEN_WIDTH, normalize } from '../../styles/utilities/dimentions';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import SearchComponent from '../../components/SearchComponent';
import DeviceInfo from 'react-native-device-info';

const HoberMaster = () => {
  const isTablet = DeviceInfo.isTablet();
  const mapRef = useRef(null);


  const [zoom, setZoom] = useState<number>(5);
  const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2);
  const { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  const [search,setSearch] = React.useState<string>("");
  const [locateMap, setLocateMap] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [membersList, setMembersList]=useState<any[]>([]);
  const [boatList, setBoatList]=useState<any[]>([]);
  const [searchTxt, setsearchTxt]=useState<string>("");
  const data = [
    { label: 'Name', value: 'name' },
    { label: 'Boat', value: 'boat' },
  ];
  const [value, setValue] = useState(data[0].value);

  useEffect(()=>{
    getMapData();
    getMembersData();
  },[])

  useEffect(()=>{
    try {
      // let f = membersData.filter(e=>e.title.toLowerCase().indexOf(searchTxt.toLowerCase())>=0 || e.left[2].html.toLowerCase().indexOf(searchTxt.toLowerCase())>=0 );
      // setMembersList(searchTxt=="" ? membersData : f)
      if(value === 'name'){
        let f1 = membersData.filter((e:any)=>e.title.toLowerCase().indexOf(searchTxt.toLowerCase())>=0 )
        setMembersList(searchTxt=="" ? membersData : f1)
      }else if(value ==='boat') {
        let f2 = membersData.filter((e:any)=>e.left[2].html.toLowerCase().indexOf(searchTxt.toLowerCase())>=0 )
  
        setMembersList(searchTxt=="" ? membersData : f2)
       }
    } catch (error) {
      console.log("error",error);
    }
  },[searchTxt,value])
  
    const getMembersData =async()=>{
        setSelectedMember(null)
        // setLocateMap(false);
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
        setBoatList(boatsLocation)
      } catch (error) {
        console.log("error",error);
        
      }
    }

   

    const getBoatLocation =(coords:any)=>{
      // mapRef.current.fitToSuppliedMarkers([boat],false)
      if(coords){
        // console.log("coords",JSON.stringify(coords));
        try{
          mapRef?.current.fitToCoordinates([coords], {
            edgePadding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            },
          });
        }catch(e){
          
        }
      
      }
    }

 
    

    const renderMembersItem =({item,index}:any)=>{
      return (
        <View style={[style.contant,styles.layoutbox,isTablet?style.shadowBox:styles.phoneLayoutbox,{flex:isTablet?.5:1}]}>
            <View style={style.row}>
            <Image
                source={{
                  uri: `${item?.avatar_url}`,
                }}
                style={styles.profileImage}
              />
              <View style={style.contant}>
                <Text style={styles.memberSubText}>MEMBER NAME</Text>
                <Text style={[styles.memberTitleText, {fontSize: normalize(15)}]}>
                  {item?.title}
                </Text>
                <Text style={[styles.memberSubText, {marginTop: 10}]}>
                  BOAT NAME
                </Text>
                <Text style={[styles.memberTitleText]}>{item?.left[2]?.html?.split("</strong> ")[1]}</Text>
              </View>
              <View style={styles.favIcon}>
                <TouchableOpacity  onPress={()=>{
                  setLocateMap(true);
                  setTimeout(() => {
                    getBoatLocation(item?.coordinates)
                  }, 2000);
                }}>
                    <MaterialIcons name={"gps-fixed"} size={normalize(20)} color={COLORS.PRIMARY} />
                </TouchableOpacity>
                <Text style={[styles.favIconTxt,{color:COLORS.GREY}]}>Location</Text>
              </View>
  
            </View>
            <View style={[style.row,style.mt10]}>
              <View style={[style.contant]}>
                <Text style={styles.memberSubText}>STATUS</Text>
                <Text style={[styles.memberTitleText]}>{'Inactive'}</Text>
              </View>
              <View style={[style.contant,{paddingRight:10}]}>
                <Text
                  style={styles.memberSubText}
                  numberOfLines={2}>
                  923 hrs since last report.
                </Text>
              </View>
              <View style={[style.contant,{paddingLeft:10}]}>
                <Text
                  style={styles.memberSubText}
                  numberOfLines={2}>
                  0 kn/46T last reported.
                </Text>
              </View>
            </View>
            <View style={[style.row,style.mt10]}>
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
            </View>
            <TouchableOpacity style={[style.button,style.mH20,style.mt20]} onPress={()=>setSelectedMember(item)}>
              <Text style={[style.font16, style.buttonTxt]}>
                View
              </Text>
            </TouchableOpacity>
  
        </View>
      );
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
    const LocationMap =()=>{
      return    <View style={style.contant}>  
                 <View style={style.row}>
                 <TouchableOpacity onPress={()=>{
                  setLocateMap(false);
                }}
                  style={[style.button,{flexDirection:'row', alignItems:'center', marginBottom:10}]}>
                  <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY}/>
                  <Text style={[styles.memberTitleText, {fontSize: normalize(14),color:COLORS.PRIMARY}]}>Back to Members List</Text>
                </TouchableOpacity>
                 </View>
               
                <ScrollView style={[style.contant,{marginRight:10,marginBottom:10}]}>
                <MapView
                  ref={mapRef}
                  initialRegion={{
                    latitude: 34.62846067258543,
                    longitude: -74.15490453765402,
                    latitudeDelta: distanceDelta * aspectRatio,
                    longitudeDelta: distanceDelta,
                  }}
                  clusterColor={'#1f28ff'}
                  style={{
                    width: '100%',
                    height: SCREEN_HEIGHT/2,
                    borderRadius: 20,
                  }}>
                  {boatList.map(renderItem)}
                </MapView>

                </ScrollView>
          </View>
    }
    const SelectMemberInfo = ()=>{
      return    <View >
        {selectedMember !== null ? (
         <ScrollView
         style={[
           styles.memberListContainer,
           {backgroundColor: COLORS.WHITE, width:"100%",padding:normalize(8),},
         ]}>
              <View style={[style.row,{marginBottom:10}]} >
               <Image
                 source={{
                   uri: `${selectedMember?.avatar_url}`,
                 }}
                 style={[styles.profileImage,{width:normalize(45),height:normalize(50)}]}
               />
               <View style={style.contant}>
                 <Text style={styles.memberSubText}>
                   MEMBER NAME
                 </Text>
                 <Text
                   style={[
                     styles.memberTitleText,
                     {fontSize: normalize(15)},
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
                   {selectedMember?.left[2]?.html?.split(
                       '</strong> ',
                     )[1]}
                 </Text>
               </View>
               <View style={styles.favIcon}>
                 <TouchableOpacity onPress={()=>{
                  setLocateMap(true);
                  setTimeout(() => {
                    getBoatLocation(selectedMember?.coordinates)
                  }, 2000);
                 }}>
                     <MaterialIcons name={"gps-fixed"} size={normalize(20)} color={COLORS.PRIMARY} />
                 </TouchableOpacity>
                 <Text  style={[styles.favIconTxt,{color:COLORS.GREY}]}>Location</Text>
             </View>
             </View>
             <View style={[style.row,styles.memerLayout]} >
               <View style={[style.contant]}>
                 <Text style={styles.memberSubText}>STATUS</Text>
                 <Text style={[styles.memberTitleText]}>{'Inactive'}</Text>
               </View>
               <View style={[style.contant]}>
                 <Text
                   style={[styles.memberSubText,{paddingRight:10}]}
                   numberOfLines={2}>
                   923 hrs since last report.
                 </Text>
               </View>
               <View style={[[style.contant,{paddingLeft:10}]]}>
                 <Text
                   style={styles.memberSubText}
                   numberOfLines={2}>
                   0 kn/46T last reported.
                 </Text>
               </View>
             </View>

             <View  style={style.row} >
               <View style={[style.contant]}>
                 <Text style={styles.memberSubText}>
                   HEADING
                 </Text>
                 <Text style={[styles.memberTitleText]}>Nil</Text>
               </View>
               <View style={[style.contant]}>
                 <Text style={styles.memberSubText}>SPEED</Text>
                 <Text style={[styles.memberTitleText]}>0knotes</Text>
               </View>
               <View style={[style.contant]}>
                 <Text style={styles.memberSubText}>MMSI</Text>
                 <Text style={[styles.memberTitleText]}>338330468</Text>
               </View>
             </View>

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
  return (
    <View style={style.contant}>
      {isTablet && (
        <View style={style.contant}>
          <Text
            style={[
              isTablet ? style.font20 : style.font14,
              style.boldTxt,
              style.primaryText,
            ]}>
            Find a Member near me
          </Text>
          <SearchComponent
            searchInput={search}
            onChangeText={(txt: string) => setSearch(txt)}
            Buttonholder={'Find Member'}
            placeholder={'Find a member by name, boat name'}
            onSearchBut={() => setsearchTxt(search)}></SearchComponent>
          <View style={[style.contant, style.row]}>
            <View style={{flex: 2}}>
              {locateMap && <LocationMap></LocationMap>}
              {!locateMap && (
                <FlatList
                  data={membersList}
                  renderItem={renderMembersItem}
                  numColumns={2}
                  keyExtractor={item => item.id && item.id.toString()}
                />
              )}
            </View>
            <View
              style={[
                style.contant,
                style.primaryLayout,
                style.pH10,
                style.pt20,
              ]}>
              <SelectMemberInfo></SelectMemberInfo>
            </View>
          </View>
        </View>
      )}
      {!isTablet && (
        <View style={style.contant}>
          {selectedMember == null && (
            <View style={style.contant}>
              <Text
                style={[
                  isTablet ? style.font20 : style.font14,
                  style.boldTxt,
                  style.primaryText,
                ]}>
                Find a Member near me
              </Text>
              <SearchComponent
                isButtion={isTablet ? true : false}
                searchInput={search}
                onChangeText={(txt: string) => {
                  setSearch(txt);
                  setsearchTxt(txt);
                }}
                Buttonholder={'Find Member'}
                placeholder={'Find a member by name'}></SearchComponent>
              {!locateMap && (
                <FlatList
                  data={membersList}
                  renderItem={renderMembersItem}
                  keyExtractor={item => item.id && item.id.toString()}
                />
              )}
              {locateMap == true && <LocationMap></LocationMap>}
            </View>
          )}

          {selectedMember != null && locateMap == false && (
            <View style={style.contant}>
              <View style={style.row}>
                <TouchableOpacity
                  style={[style.row, style.button, style.borderRadius8]}
                  onPress={() => setSelectedMember(null)}>
                  <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  style.font14,
                  style.boldTxt,
                  style.primaryText,
                  style.mtb10,
                ]}>
                Member Information
              </Text>
              <View style={style.contant}>
                <SelectMemberInfo></SelectMemberInfo>
              </View>
            </View>
          )}

            {
              selectedMember != null && locateMap==true && <LocationMap></LocationMap>
            }
        </View>
      )}
    </View>
  );
}

export default HoberMaster

const styles = StyleSheet.create({ 
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
    marginVertical:20
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
  favIcon:{
    borderColor:COLORS.GREY,borderWidth:1,borderRadius:10, 
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
    width: normalize(65),
    height:normalize(70),
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'cover',
  },
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
  memberSubText:{
    color:COLORS.GREY,
    fontSize:normalize(11),
    lineHeight:20,
  },
  viewInfoContainer:{
    backgroundColor: COLORS.PRIMARY,
    width: '30%',
    padding:normalize(8),
    marginLeft:2,
    // marginRight:-25
  },
});