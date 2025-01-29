import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import style from "../../styles/style";
import {
  scaleHeight,
  scaleWidth,
  normalize,
} from "../../styles/utilities/dimentions";
import COLORS from "../../styles/theme/color";
import DeviceInfo from "react-native-device-info";
import { useCallback, useContext, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAwardByType } from "../../services/api/auth";
import MembersContext from "../Members/MembersContext";
import Menu from "../../routes/Menu";
import UserInfo from "../../components/UserInfo";
import { ActivityIndicator } from "react-native-paper";
import { dateFormat } from "../../styles/utilities/variables";

interface AwardsUserInfoProps {
  openInfo: any;
}
const isTablet = DeviceInfo.isTablet();

const AwardsUserInfo: React.FC<AwardsUserInfoProps> = ({ openInfo, route }) => {
  const navigation = useNavigation()
  const { accessToken,setHideChatbotMember, setHideChatbot } = useContext(MembersContext);
  const [selectAward, setSelectAward] = useState(null);
  const [selectAwardLoader, setSelectAwardLoader] = useState(true);
  const [currentHolder, setCurrentHolder] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.AwardId) {
        getAwardByIdHandler(route?.params?.AwardId);
      }
      setHideChatbot(true)
      setHideChatbotMember(true)
    }, [route])
  );

  const getAwardByIdHandler = async (id) => {
    try {
      setSelectAwardLoader(true)
      const response = await getAwardByType(id, accessToken);
      if (response.status === 200) {
        setSelectAward(response.data);
        const currentHolder = response.data?.awardedMembers?.find(item => item.currentHolder)
        setCurrentHolder(currentHolder)
        
        setSelectAwardLoader(false)
      }
    } catch (error) {
      setSelectAwardLoader(false)
      console.error(error);
    }
  };
  const backBtnHandler =()=>{
    setHideChatbot(false)
    setHideChatbotMember(false)
    navigation.navigate('Awards')
    setSelectAward(null)
  }

  return (
    <View style={[style.contant]}>
      <View style={[style.row]}>
        <View style={[style.flexTwo]}>
            <View style={[style.sidepanelcolor]}>
              <Menu selectIndex={8} />
            </View>
        </View>
      </View>
      <View style={[style.contant, style.pH20, style.pt20]}>
        <TouchableOpacity style={[style.row,style.width50]} onPress={backBtnHandler}>
          <FontAwesome
            name="chevron-left"
            size={normalize(15)}
            style={[style.mr10, style.mt3]}
            color={COLORS.PRIMARY}
          />
          <Text style={[style.font16, style.boldTxt, style.primaryText]}>
            Back
          </Text>
        </TouchableOpacity>
        {selectAwardLoader ?
        <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
        <ActivityIndicator
          theme={{ colors: { primary: COLORS.PRIMARY } }}
          size={'small'}
        />
      </View>
      :
          <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={[style.column,style.centerBox,style.centerItem]}>
          {route?.params?.type ==='badges' ? <ImageBackground 
                    style={[styles.badgesBgWrapper,style.row]} resizeMode='cover' source={require("../../assets/badges_top.png")}>
                  
                      <Image source={{uri:selectAward?.imageUrl}} style={[styles.badgesImg]} resizeMode="contain"/>
                    
                      <Image source={require('../../assets/badges_bottom.png')} style={[styles.badgesBgImg]} resizeMode="contain"/>
                    </ImageBackground>
                    :
          <ImageBackground
            style={[styles.honorsImageWrapper,style.row,style.centerBox,style.centerItem,]}
            resizeMode="cover"
            source={require("../../assets/honors_frame.png")}
          >
            <View style={[styles.honorsImage]}>
              <Image
                source={{ uri: selectAward?.imageUrl }}
                style={[styles.honorsImageImg]}
                resizeMode="contain"
              />
            </View>
          </ImageBackground>}
          {currentHolder &&route?.params?.type !=='badges' &&<Text style={[style.textCenter,style.font16,style.boldTxt]}>{currentHolder?.awardedTo?.firstName + " " + currentHolder?.awardedTo?.lastName}</Text>}
          <Text style={[style.font18,style.primaryText]}>{selectAward?.name}</Text>
          </View>
         
          {selectAward?.frequency &&<Text style={[style.font16,style.mt10,style.row]}><Text style={[style.boldTxt]}>Frequency :</Text> {selectAward?.frequency}</Text>}
          <Text style={[style.font16,style.boldTxt,style.mtb10]}>Description</Text>
          <Text style={[style.font14]}>{selectAward?.description}</Text>
          {route?.params?.type !=='badges' &&<Text style={[style.font16,style.boldTxt,style.mtb10]}>History</Text>}
          {route?.params?.type !=='badges' &&<Text style={[style.font14]}>{selectAward?.history}</Text>}
          <Text style={[style.font16,style.boldTxt,style.mtb10]}>Recipients</Text>
          {selectAward?.awardedMembers?.length > 0 && selectAward?.awardedMembers?.map((item,index)=>{
           return(
            <Text style={[style.font16,style.mtb5,style.row]}>{index+1}. <Text style={[style.boldTxt]}>{item.awardedTo?.firstName + " " + item.awardedTo?.lastName }</Text> awarded on {dateFormat(item?.dateAssigned)} {item?.eventName && route?.params?.type ==='badges' && ('for'+' ' + item?.eventName)}</Text>
           )
          })}
        </ScrollView>}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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
  honorsImageWrapper:{
    height: Dimensions.get("screen").width * 0.4,
    width: Dimensions.get("screen").width * 0.4,
  },
  honorsImage: {
    height: Dimensions.get("screen").width * 0.3,
    width: Dimensions.get("screen").width * 0.3,
  },
  honorsImageImg: {
    height: "100%",
    width: "100%",
    borderRadius: Dimensions.get("screen").width * 0.4,
  },
  details: {
    fontSize: normalize(13),
    color: COLORS.BLACK,
  },
});
export default AwardsUserInfo;