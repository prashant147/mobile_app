import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native';
import style from '../../styles/style';
import Header from '../../components/Header';
import DeviceInfo from 'react-native-device-info';
import SvgUri from 'react-native-svg-uri';
import { normalize, scaleWidth } from '../../styles/utilities/dimentions';
import AwardsInfo from './AwardsInfo';
import AwardsUserInfo from './AwardsUserInfo';
import UserInfo from '../../components/UserInfo';
import Menu from '../../routes/Menu';
import TabBox from '../../components/TabBox';
import COLORS from '../../styles/theme/color';
import Icon from "react-native-vector-icons/Feather";
import AntDesign from 'react-native-vector-icons/FontAwesome';
import { Switch } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllBadges, getAwardByType, getHonorsByType } from '../../services/api/auth';
import MembersContext from '../Members/MembersContext';
import { ActivityIndicator } from 'react-native-paper';
import { dateFormat } from '../../styles/utilities/variables';

const AwardsScreen = () => {
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation()
  const [selectAwardUser,setSelectAwardUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Badges');
  const [awardsSwitch, setAwardsSwitch] = useState(false);
  const [allHonorsData, setAllHonorsData] = useState([]);
  const [honorsLoader, setHonorsLoader] = useState(true);
  const [allBadgesData, setAllBadgesData] = useState([]);
  const [BadgesLoader, setBadgesLoader] = useState(true);
  const {accessToken} = useContext(MembersContext);
  let tabData = ["Badges"]

    useFocusEffect(
      React.useCallback(() => {
        if(selectedTab ==='Honors'){
          getAllHonorsByType();
        }else{
          getAllBadgesByType()
        }
      }, [awardsSwitch,selectedTab])
    );
    const getAllHonorsByType = async () => {
      setHonorsLoader(true)
      try {
        const response = await getHonorsByType(
          awardsSwitch ? "FLOATING" : "PERPETUAL",
          accessToken
        );
        if (response.status === 200) {
          setAllHonorsData(response.data);
          setHonorsLoader(false)
        }
      } catch (error) {
        setHonorsLoader(false)
        console.error(error);
      }
    };
    const getAllBadgesByType = async () => {
      setBadgesLoader(true)
      try {
        const response = await getAllBadges(accessToken);
        if (response.status === 200) {
          setAllBadgesData(response.data);
          setBadgesLoader(false)
        }
      } catch (error) {
        setBadgesLoader(false)
        console.error(error);
      }
    };
    const getAwardByIdHandler =async(id,type)=>{
      navigation.navigate('AwardsUserInfo',{AwardId:id,type})
    }
  return (
    <View style={style.contant}>
      <View style={[style.row]}>
        <View style={[style.flexTwo]}>
            <View style={[style.sidepanelcolor]}>
              <Menu selectIndex={8} />
            </View>
        </View>
      </View>
      <View style={[style.contant, style.pH20, style.pt20]}>
        <TabBox
          data={tabData}
          selectedTab={selectedTab}
          onTab={(tab: string) => setSelectedTab(tab)}
        ></TabBox>
        {selectedTab === "Badges" && (
          <View style={[style.contant]}>

          {BadgesLoader ? 
            <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
            <ActivityIndicator
              theme={{ colors: { primary: COLORS.PRIMARY } }}
              size={'small'}
            />
          </View>
            :
          <ScrollView
            style={[styles.containerStyle,style.contant]}
            showsVerticalScrollIndicator={false}
          >
         <View style={[styles.badgesWrapper,style.pH10,style.pV10,style.contant,allBadgesData?.length > 0 &&style.flexWrap]}>
              {allBadgesData?.length > 0 ? allBadgesData?.map((item)=>{

                return(
                  <TouchableOpacity style={[styles.badgesWrap,style.mB10]} onPress={()=>getAwardByIdHandler(item?.id,'badges')}>
                    <ImageBackground 
                    style={[styles.badgesBgWrapper,style.row]} resizeMode='cover' source={require("../../assets/badges_top.png")}>
                  
                      <Image source={{uri:item?.imageUrl}} style={[styles.badgesImg]} resizeMode="contain"/>
                    
                      <Image source={require('../../assets/badges_bottom.png')} style={[styles.badgesBgImg]} resizeMode="contain"/>
                    </ImageBackground>
                    <Text style={[style.textCenter,style.font16,style.primaryText]}>{item?.name}</Text>
                  </TouchableOpacity>
                )
              })
              
              :
              <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
                <Text style={[style.font18]}>No Badges Found</Text>
              </View>
              }
            </View>
            
            
          </ScrollView>}
          </View>
        )}
        {selectedTab === "Honors" && (
          <View style={style.contant}>
            <View style={[style.row,style.centerBox,style.between]}>
            <Text style={[style.font16,style.mH10,style.boldTxt]}>{awardsSwitch ? 'Floating' :'Perpetual'} Honors</Text>
              <View style={[style.row,style.centerBox]}> 
              <Text style={[style.font16,style.mH10]}>{!awardsSwitch ? 'Floating' :'Perpetual'}</Text>
              <Switch
                onValueChange={() => setAwardsSwitch(!awardsSwitch)}
                value={awardsSwitch}
                trackColor={{ false: "#767577", true: COLORS.PRIMARY }}
                thumbColor={COLORS.WHITE}
              />
              </View>
            </View>

            {honorsLoader ? 
            <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
            <ActivityIndicator
              theme={{ colors: { primary: COLORS.PRIMARY } }}
              size={'small'}
            />
          </View>
            :<View style={[styles.honorsWrapper,style.pH10,style.pV10,style.contant,allHonorsData?.length > 0 &&style.flexWrap]}>
              {allHonorsData?.length > 0 ? allHonorsData?.map((item)=>{

                return(
                  <TouchableOpacity style={[styles.honorsWrap]} onPress={()=>getAwardByIdHandler(item?.id,'honors')}>
                    <ImageBackground 
                    style={[styles.honorsImgWrapper,style.row,style.centerBox,style.centerItem]} resizeMode='cover' source={require("../../assets/honors_frame.png")}>
                    <View style={[styles.honorsImage]}>
                      <Image source={{uri:item?.imageUrl}} style={[styles.honorsImageImg]} resizeMode="contain"/>
                    </View>
                    </ImageBackground>
                    {item?.awardedMembers?.length > 0 &&<Text style={[style.textCenter,style.font16,style.boldTxt]}>{item?.awardedMembers[0]?.awardedTo?.firstName + " " + item?.awardedMembers[0]?.awardedTo?.lastName}</Text>}
                    <Text style={[style.textCenter,style.font16,style.primaryText]}>{item?.name}</Text>
                  </TouchableOpacity>
                )
              })
              
              :
              <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
                <Text style={[style.font18]}>No Honors Found</Text>
              </View>
              }
            </View>
            
            }
          </View>
        )}
      </View>
    </View>
  );
};

export default AwardsScreen;
const styles = StyleSheet.create({ 
  backBtn:{ 
    maxWidth: 150, 
    alignItems: "center" 
  },
  honorsImgWrapper:{ 
    height:Dimensions.get('screen').width*0.4,
    width:Dimensions.get('screen').width*0.4,
  },
  honorsWrap:{
    width:Dimensions.get('screen').width*0.4,
    flexDirection:'column'
  },
  honorsWrapper:{
    flexDirection:'row',
    gap:5,
    justifyContent:"space-between"
  },
  badgesBgImg:{
    position:"absolute",
    height:Dimensions.get('screen').width*0.28,
    width:Dimensions.get('screen').width*0.28,
    top:normalize(20)
  },
  badgesImg:{ 
    height:Dimensions.get('screen').width*0.2,
    width:Dimensions.get('screen').width*0.2,
    borderRadius:Dimensions.get('screen').width*0.4
  },
  badgesBgWrapper:{ 
    height:Dimensions.get('screen').width*0.24,
    width:Dimensions.get('screen').width*0.24,
    justifyContent:"center",
    alignItems:'center'
  },
  badgesWrap:{
    width:Dimensions.get('screen').width*0.38,
    flexDirection:'column',
    alignItems:'center'
  },
  badgesWrapper:{
    flexDirection:'row',
    gap:10
  },
  honorsImage:{
    height:Dimensions.get('screen').width*0.3,
    width:Dimensions.get('screen').width*0.3,
  },
  honorsImageImg:{
    height:'100%',
    width:'100%',
    borderRadius:Dimensions.get('screen').width*0.4
  },
  layoutbox:{
    marginHorizontal:10,
    marginVertical:10,
    padding:10
  },
  
  breakLine :{
    height:2,
    maxWidth:'100%',
    backgroundColor: COLORS.SECONDARY,
    marginVertical:20
  },

  memerLayout:{
    justifyContent:'space-between',marginBottom:10
  },
  btnsAlignment :{
    flexDirection:"column",alignItems:'center'
  },
 
  userAwardIcons:{
    width:60,
    height:60,
    alignItems:"center",
    display:'flex',
    justifyContent:"center",
  },

  favIconTxt:{
    fontSize:12,textAlign:'center'
  },
  valueCell: {
    flex: 2,
    textAlign: 'left',
    paddingHorizontal: 8,
    fontWeight:'600',
    color:COLORS.DARK_PRIMARY
  },
  containerStyle:{
    paddingBottom:50
  }
});