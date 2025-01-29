import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import style from '../../styles/style';
import EducationScreen from '../News&Education/Education';
import Menu from '../../routes/Menu';
import Header from '../../components/Header';
import DeviceInfo from 'react-native-device-info';
import { scaleHeight,normalize } from '../../styles/utilities/dimentions';
import { useFocusEffect,useNavigation } from '@react-navigation/native';
import MembersContext from '../Members/MembersContext';
import AntDesign from 'react-native-vector-icons/FontAwesome';
import COLORS from '../../styles/theme/color';



export default function Education({route}) {
    const [selectedEduIndex, setSelectedEduIndex] = useState(0);
    const [selectedEdu, setSelectedEdu] = useState("About Education");
    const [webinarId, setWebinarId] = useState(null);
    const [webinarBackPath, setwebinarBackPath] = useState(null);
    const isTablet = DeviceInfo.isTablet()
    const navigation = useNavigation()
    const {setSelectedMenu}=useContext(MembersContext)

    useFocusEffect(useCallback(()=>{
      setSelectedMenu(13)
      if(route?.params?.data){
        setWebinarId(route?.params?.data) 
        setwebinarBackPath(route?.params?.path) 
        route.params = null
      }else{
        setWebinarId(null)
      }
    },[route]))


    return (
        <View style={style.contant}>
            {/* <Header></Header> */}
          <View style={style.sidepanelcolor}>
          <Menu selectIndex={13} />
          </View>
          <View style={[style.contant,style.pH20,style.mtb10]}>
            <EducationScreen selectedIndex={selectedEduIndex} onSelect={setSelectedEdu} selected={selectedEdu} webinarId={webinarId} webinarBackPath={webinarBackPath} setwebinarBackPath={setwebinarBackPath} setWebinarId={setWebinarId}></EducationScreen>
            
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
  iconLogo:{
    height:scaleHeight(30),
    resizeMode:'contain',
    width:scaleHeight(35),
    marginRight:10
  }
})