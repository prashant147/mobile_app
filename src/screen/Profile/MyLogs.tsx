import { Dimensions, FlatList,Image,ScrollView,StyleSheet, Text, TouchableOpacity, View } from "react-native";
import style from "../../styles/style";
import { isTablet } from "react-native-device-info";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/EvilIcons';

import COLORS from "../../styles/theme/color";
import { useMemo, useState,useRef } from "react";
import AddLogs from "./AddLogs";
import DropdownSelector from "../../components/DropdownSelector";
import { boatList, vesselList } from "../../styles/utilities/constants";
import { normalize,scaleHeight } from "../../styles/utilities/dimentions";
import MapView, { Callout, Circle, Marker } from "react-native-maps";



const MyLogs = ({isAddBoat,setIsAddBoat}:any) => { 


  const mapRef = useRef();

    const [selectedBoat, setSelectedBoat] = useState();
    const [myLoadData,setMyLoadData]:any = useState([{
        "ismap":false,
        "isStartLog":false,
        "LOGNAME":"Sailing 1",
        "DATE":"Nov 22, 09:00 AM - 12:00 PM",
        "DISTANCE":"100000m",
        "LOCATION":"California Port - Deti Port",
        "ORGANISER":"Jack Sparrow",
        "CaliforniaPort":"Deti Port",
        "port":["Silver Port","Maroni Port","Silver Port",
        "Miami Port","Sultna Port","Veda Port","Deti Port"],
        "Notes":"From sailing sea to roaring soares the movement of cool bridge makes the sea with clam and vibrant colors."
    },{
        "ismap":false,
        "isStartLog":false,
        "LOGNAME":"Sailing 2",
        "DATE":"Nov 22, 09:00 AM - 12:00 PM",
        "DISTANCE":"300000m",
        "LOCATION":"California Port - Deti Port",
        "ORGANISER":"Jack Sparrow",
        "CaliforniaPort":"Deti Port",
        "port":["Silver Port","Maroni Port","Silver Port",
        "Miami Port","Sultna Port","Veda Port","Deti Port"],
        "Notes":"From sailing sea to roaring soares the movement of cool bridge makes the sea with clam and vibrant colors."
    }])
    const [zoom, setZoom] = useState<number>(5);
    const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2);
    const {width, height} = Dimensions.get('window');
    const aspectRatio = width / height;
    const [initialMap, setInitialMap] = useState({
        latitude: 34.62846067258543,
        longitude: -74.15490453765402,
      });

    const onSelectedItemsChange = (selectedItems:any) => {
         setSelectedBoat(selectedItems)
      };
      const onSelectedItemObjectsChange = (selectedItemsObj: any) => {
        // setSelectedBoatObj(selectedItemsObj[0]);
      };


      const memoizedCard = useMemo(() => {
        return (
          <MapView
           ref={mapRef}
          //  region={region}
          initialRegion={{
            latitude: initialMap.latitude,
                longitude: initialMap.longitude,
                latitudeDelta: distanceDelta * aspectRatio,
                longitudeDelta: distanceDelta,
          }}
          // clusterColor={'#1f28ff'}
          style={{
            width: '100%',
            height: 400,
            borderRadius: 20,
          }}>
          {boatList?.map((marker)=>renderItem)}
        </MapView>
        )
    }, []);


      const renderItem = (marker: any) => {
        if (marker?.distance > 0) {
          return (
            <Marker
              key={marker.id}
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
              key={marker.id}
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
              key={marker.id}
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
              key={marker.id}
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
              key={marker.id}
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
      const onViewMap = (items:any,isLog:boolean,index:number)=>{
            const newArray = [...myLoadData];
            newArray[index].ismap = !items.ismap
            setMyLoadData(newArray)
      }
      const onStartLog = (index:number,isLog:boolean)=>{
        const newArray = [...myLoadData];
        newArray[index].isStartLog = isLog
        setMyLoadData(newArray)
      }
      
    const RenderLogList = ({items,isLog=false,index}:any)=>{
       return <View>
            <View style={style.row}>
    <View style={[{flex: 2}, style.mt30]}>
        <View style={style.contentBetween}>
            <View style={style.contant}>
                <Text style={[style.font14, style.grayText]}>LOG NAME</Text>
                <Text style={[style.font24, style.boldTxt]}>{items.LOGNAME}</Text>
            </View>
            <View style={{flex:2}}>
                <Text style={[style.font14, style.grayText]}>DATE</Text>
                <Text style={[style.font14]}>{items.DATE}</Text>
            </View>
            
            {!isTablet() && 
                <View style={style.contant}>
                    <Image source={require("../../assets/dataImage/WeatherWidget.png")} resizeMode="contain" style={{width: "100%", height: 60}} />
                </View>
            }
        </View>
        <View style={[style.contentBetween, style.mt10]}>
            <View >
                <Text style={[style.font14, style.grayText]}>DISTANCE</Text>
                <Text style={[style.font14]}>{items.DISTANCE}</Text>
            </View>
            <View style={style.mH10}>
    <Text style={[style.font14, style.grayText]}>LOCATION</Text>
    <Text style={[style.font14, style.contentBetween, {marginRight:10}]}>
        <Icons name="location" size={20} color={COLORS.BLACK}/>
        <Text>{items.LOCATION}</Text>
    </Text>
</View>
            <View>
                <Text style={[style.font14, style.grayText]}>ORGANISER </Text>
                <Text style={[style.font14, style.row]}>
                    <Icon name="user-o" size={15} style={{marginRight: 5}} color={COLORS.BLACK}/>
                    &nbsp; {items.ORGANISER}
                </Text>
            </View>
        </View>
    </View>
    {isTablet() && 
        <View style={style.contant}>
            <Image source={require("../../assets/dataImage/WeatherWidget.png")} resizeMode="contain" style={{width: "100%", height: 160}} />
        </View>
    }
</View>

            <View style={style.row}>
                <View style={[isTablet() ? styles.w300 :styles.w200]}>
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
                <View style={style.mH20}>
                {
                    isLog && <TouchableOpacity onPress={()=>onStartLog(index,!items.isStartLog)} style={[style.button,styles.btnStyle,items.isStartLog?{backgroundColor:COLORS.YELLOW}: style.primaryLayout,style.borderRadius8]}>
                        <Text style={[style.font14,style.whiteText]}>{ items.isStartLog ? 'Stop log':'Start log'}</Text>
                    </TouchableOpacity>
                }
                </View>
            </View>   
            <Text style={[style.font16,style.mt20]}>
              California Port - Deti Port 
            </Text>
            <View style={[isTablet()?style.row:style.column,style.mt20]}>
                <View style={style.contant}>
                  <Image
                    source={require('../../assets/boatHistory.png')}
                    style={{width:"100%" , height: 50}}
                    resizeMode='contain'
                  />
                  <View style={[style.row,{justifyContent:'space-between', flexWrap:'wrap'}]}>
                    {items.port.map(item => {
                      return (
                        <Text style={[isTablet()?style.font12:style.font10]}>
                          {item}
                        </Text>
                      );
                    })}
                   
                  </View>
                </View>
                <View style={style.mH10}>
                    <TouchableOpacity style={[style.button,style.mt10]} onPress={()=>onViewMap(items,isLog,index)}>
                      <Text style={[style.font14,style.primaryText]}>View In map</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[style.row,style.mtb10,style.mt30]}>
                <View style={{flex:2}}>
                    <Text style={[style.font14,style.grayText]}>Notes</Text>
                    <Text style={[style.font16,style.mt10]}>From sailing sea to roaring soares the movement of cool bridge makes the sea with clam and vibrant colors.</Text>
                </View>
                <View style={[style.contant,style.mt30,{alignContent:'flex-end',alignItems:'flex-end'}]}>
                    <TouchableOpacity style={[style.row,style.button,{maxWidth:113}]}>
                      <Text style={[style.font14]}>Print Out </Text>
                      <Icon name="print" size={20} color={COLORS.BLACK}/>
                    </TouchableOpacity>
                </View>
            </View>
            {
              items.ismap && memoizedCard
              
            //   <MapView
            //   initialRegion={{
            //     latitude: initialMap.latitude,
            //     longitude: initialMap.longitude,
            //     latitudeDelta: distanceDelta * aspectRatio,
            //     longitudeDelta: distanceDelta,
            //   }}
            //   // zoomEnabled={true}
            //   // maxZoomLevel={5}
            //   clusterColor={'#1f28ff'}
            //   style={{
            //     width: '100%',
            //     height: 400,
            //     borderRadius: 20,
            //   }}>
            //   {boatList.map(renderItem)}
            // </MapView>
            }
       </View>
    }

    return <View style={style.contant}>
        {
            !isAddBoat && <ScrollView style={[style.contant]} showsVerticalScrollIndicator={false}>
                <View style={[style.row,styles.bottomBar,styles.line]}>
                    <Text style={[isTablet()?style.font24:style.font14,style.primaryText,style.boldTxt,style.contant]}>My Logs</Text>

                    <TouchableOpacity onPress={()=>setIsAddBoat(true)} style={[style.button,style.primaryLayout,style.borderRadius8,style.row,style.pH20]}>
                        <Text style={[style.font14,style.whiteText,style.mr30,isTablet() && style.pV20]}>Add Logs</Text>
                        <Icon name='plus' size={isTablet()?20:16} color={COLORS.WHITE} ></Icon>
                    </TouchableOpacity>
                </View>
                <RenderLogList index={0} items={myLoadData[0]} isLog={true}></RenderLogList>

                <View style={[style.row,styles.bottomBar,styles.line]}>
                    <Text style={[isTablet()?style.font24:style.font14,style.primaryText,style.boldTxt,style.contant]}>log History</Text>
                </View>
                  {
                    myLoadData.map((item:any, index:number)=>(
                      <View style={styles.line}>
                        <RenderLogList index={index} items={item} isLog={true}></RenderLogList>
                      </View>
                    ))
                  }

            </ScrollView>
        }
        {
           isAddBoat && <AddLogs setIsAddBoat={setIsAddBoat}></AddLogs>
        }
        
    </View>
}
const styles = StyleSheet.create({  
    line:{
        borderColor:COLORS.GREEN,
        borderBottomWidth:1,
        paddingBottom:10
    },
    bottomBar:{
        borderColor:COLORS.GREEN,
        borderBottomWidth:1,
        paddingBottom:10
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
        marginTop:5
      },
      buttonMap:{
        borderColor:COLORS.LIGHT_PRIMARY,
        borderWidth:1,
        borderRadius:2,
        alignContent:'center',
        alignItems:'center',
        paddingVertical:scaleHeight(5),
        paddingHorizontal:10,
        marginBottom:10,
        marginTop:10
     },
     w300:{
      width:300
     },
     w200:{
      width:200
     }
})
export default MyLogs;