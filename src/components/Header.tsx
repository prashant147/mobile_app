import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { isTablet } from 'react-native-device-info';
import style from '../styles/style';
import { normalize, scaleHeight, scaleWidth } from '../styles/utilities/dimentions';
import COLORS from '../styles/theme/color';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MembersContext from '../screen/Members/MembersContext';
import GetLocation from 'react-native-get-location'
import { getMember } from '../services/api/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import crashlytics from '@react-native-firebase/crashlytics';

interface HeaderProps {} 
const Header: React.FC<HeaderProps> = () => {
  const {loggedInUser} = useContext(MembersContext);
  const navigation = useNavigation();
  const [temperature, setTemperature] = useState(null);
  const token = AsyncStorage.getItem('accessToken');

  // useFocusEffect(React.useCallback(() => {
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 60000,
  // })
  // .then(location => {
  //     loadmyProfile(location);
  // })
  // .catch(error => {
  //     const { code, message } = error;
  //     console.warn(code, message);
  //     crashlytics().log(error );
  // })

   
  // }, []));
  // const loadmyProfile = async(location:any)=>{
  //   let res = await getMember('',token)
  //   if(res.status ==200 ){
  //     fetchWeather(location,res.data.metadata.temperature=="Celsius"?2:1);
  //   }else{
  //     fetchWeather(location,1);
  //   }
  // }
  // const fetchWeather = async (location:any,IsTemperature:number) => {
  //     try {
  //       const response = await axios.get(
  //         `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=53b9fd2fec0e7254fe2eadde0fc8ab5c&units=metric`
  //       );
        
  //       const { main } = response.data;

  //       if(IsTemperature==2){  setTemperature(`${main.temp} °C`); }
  //       else{
  //         let metric = (main.temp * 9/5) + 32
  //         setTemperature(`${metric.toFixed(2)} °F`);
  //       } 
  //     } catch (error) {
  //       console.error('Error fetching weather data:', error);
  //       crashlytics().log(error );
  //     }
  //   };
  const openProfile = ()=>{
    if(!isTablet()){
      navigation.navigate('MemberCard')
    }
  }
  return (
    <View style={[!isTablet() &&  style.primaryLayout,style.tableLayout] }>
      <View style={[style.shadowBox]}>
        <ImageBackground resizeMode='stretch' imageStyle={{ borderRadius: isTablet()?3:10}} source={require('../assets/headerImg.png')} >
            <TouchableOpacity style={[style.row,{marginVertical:scaleHeight(15)},style.centerBox]} onPress={()=>openProfile()}>
                <Image resizeMode='cover' style={[styles.userImg]} source={loggedInUser?.profileUrl ? {uri : loggedInUser.profileUrl} : require("../assets/human.png")}></Image>
                <View style={[style.contant,{justifyContent:'center'}]}>
                  <View style={[style.row,style.centerBox]}>
                    <View style={style.contant}>
                    <Text style={[styles.UserName]}>Hello, {loggedInUser?.firstName}</Text>
                    <Text style={[styles.welcomeTxt]}>Welcome to Salty Dawg</Text>
                    </View>
                    {
                      !isTablet() && <View style={[styles.WeatherImg]}>
                        <Image style={[styles.tempIcon,{marginVertical:7}]} resizeMode='contain' source={require("../assets/icon/temp.png")}></Image>
                          <Text style={[styles.temp1]}>{temperature}</Text>
                    </View>
                    }
                  </View>
                    
                </View>
                {
                  isTablet() && <View style={styles.WeatherImg}>
                      <Image style={styles.tempIcon}  resizeMode='contain' source={require("../assets/icon/temp.png")}></Image>
                      <Text style={[styles.temp]}> {temperature} °C</Text>
                </View>
                }
                
                
            </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  tempIcon:{
    height:scaleHeight(30),
    width:scaleWidth(30),
  },
  WeatherImg:{
    flexDirection:'row',
    alignContent:'center',
    alignItems:'center',
    justifyContent:'space-around', 
    backgroundColor: '#000000a6',
    borderWidth:0.1, borderRadius:30,
    paddingHorizontal:normalize(10),
    marginRight:scaleWidth(isTablet()? 30:5),
    flex:0.7
  },
  temp:{
    color:COLORS.WHITE,
    fontSize:scaleWidth(24) ,
    fontFamily:'Roboto-Regular',
    fontWeight:'bold'
  },
  temp1:{
    color:COLORS.WHITE,
    fontSize:scaleWidth(16),
    fontWeight:'bold',
    fontFamily:'Roboto-Regular',
  },
  userImg:{
    width:normalize(isTablet()?76:45),
    height:normalize(isTablet()?76:45),
    marginHorizontal:10,
    borderRadius:30
  },
  UserName:{
    color:COLORS.WHITE,
    fontSize:scaleWidth(isTablet()?24:16),
    fontFamily:'Roboto-Regular',
    fontWeight:'bold',
    textTransform:'capitalize'
  },
  welcomeTxt:{
    color:COLORS.WHITE,
    fontSize:scaleWidth(isTablet()?14:12),
    fontFamily:'Roboto-Regular',
  },
});
