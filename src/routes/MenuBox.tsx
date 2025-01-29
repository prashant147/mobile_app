import React, {useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image as ImageBox,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../styles/theme/color';
import { normalize, scaleHeight, scaleWidth } from '../styles/utilities/dimentions';

import style from '../styles/style';
const MenuBox = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigation = useNavigation();
  const menuItems = [
    {name: 'Home',link:"Home", image: require('../assets/menu/Home.png') },
    {name: 'News',link:"News", image: require('../assets/menu/News.png') },
    {name: 'Members',link:"Members", image: require('../assets/menu/Members.png') },
    {name: 'Volunteer',link:"Volunteer", image: require('../assets/menu/Volunteer.png') }, 
    {name: 'Rallies & Events',link:"RalliesEvents", image: require('../assets/menu/RalliesEvents.png') },
    {name: 'Message Center',link:"MessageCenter", image: require('../assets/menu/message.png') },
    {name: 'Ship Store',link:"ShipStore", image: require('../assets/menu/ShipStore.png') },
    {name: 'Crew',link:"Crew", image: require('../assets/menu/Crew.png') },
    {name: 'Awards',link:"Awards", image: require('../assets/menu/Rewards.png') },
    {name: 'Sponsers',link:"Sponsers", image: require('../assets/menu/Sponsors.png') },
    {name: 'Regulation',link:"Regulation", image: require('../assets/menu/Regulation.png') },
  ];

  const handleTabPress = (text:string)=>{
    setActiveTab(text)
    navigation.navigate(text);
  }
  return (
  
   <View style={styles.navBox}>
     <View style={styles.profileImageContainer}>
        <ImageBox resizeMode='contain' style={{width:scaleWidth(75),height:scaleHeight(75)}}  source={require("../assets/logo.png")}></ImageBox>
     </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === item.link && style.whiteLayout]}
            onPress={() => handleTabPress(item.link)}>
            <View style={styles.menuBut}>
              <Image style={styles.logoSize}  source={item.image}></Image>
            </View>
            <Text style={[style.font12,style.whiteText,activeTab === item.link && style.primaryText]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
   </View>
  );
};

const styles = StyleSheet.create({
  logoSize:{
    height:scaleHeight(35),
    resizeMode:'contain',
    width:scaleHeight(40),
  },
  menuBut:{
    backgroundColor:COLORS.WHITE,
    borderColor:COLORS.BLACK,
    borderRadius:8,
    shadowColor: "#000",
    paddingHorizontal:normalize(8),
    paddingVertical:normalize(8),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  navBox:{
    height:"100%", 
    backgroundColor:COLORS.LIGHT_PRIMARY,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5
  },
  profileImageContainer: {
    alignItems: 'center',
    width:scaleWidth(90),
    justifyContent:'center',
    alignContent:'center',
    alignSelf:'center',
    marginVertical:20,
    marginHorizontal:15
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 7,
  },
});

export default MenuBox;
