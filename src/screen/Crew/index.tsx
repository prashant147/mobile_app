import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  SafeAreaView,
  Image
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../../components/Header';
import COLORS from '../../styles/theme/color';
import { normalize, scaleWidth } from '../../styles/utilities/dimentions';
import { crewTabMenu } from '../../styles/utilities/constants';
import FindBoat from './FindBoat';
import FindCrew from './FindCrew';
import BecomeCrew from './BecomeCrew';
import style from '../../styles/style';
import Icon from 'react-native-vector-icons/Feather';
import DeviceInfo from 'react-native-device-info';
import UserInfo from '../../components/UserInfo';
import Menu from '../../routes/Menu';
import AntDesign from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BackHandler } from 'react-native';
import MembersContext from '../Members/MembersContext';

const CrewScreen = ({route}:any) => {
  const {setHideChatbotMember, setHideChatbot } = useContext(MembersContext);  
  const isTablet = DeviceInfo.isTablet();
  const [activeTab, setActiveTab] = useState(0);
  const [isAddCrew, setIsAddCrew] =useState(false);
  const [isAddBoat, setIsAddBoat] =useState(false);
  const [editCrew,setEditCrew] = useState(null);
  const [editboat,setEditboat] = useState(null);
  const [isDarft,setIsDraft] = useState(false);
  const navigation = useNavigation();
   
  useFocusEffect(
    React.useCallback(() => {
    if(route?.params?.tabIndex){
      setActiveTab(route?.params?.tabIndex)
    }else {
      setActiveTab(0)
    }
  },[route]))
  
  useFocusEffect(
    React.useCallback(() => {
      if (isAddCrew || isAddBoat) {
        setHideChatbot(true);
        setHideChatbotMember(true);
      } else {
        setHideChatbot(false);
        setHideChatbotMember(false);
      }
    }, [isAddCrew,isAddBoat])
  );

  useEffect(() => {
    const backAction = () => {
        setIsAddBoat(false)
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if(editCrew){
      setActiveTab(1)
      setIsAddBoat(true)
    }
  },[editCrew])

  useEffect(() => {
    if(editboat){
      setActiveTab(0)
      setIsAddCrew(true)
    }
  },[editboat])

  const renderTabView =(activeTab:number)=>{
    switch (activeTab) {
      case 0:
        return <FindCrew setActiveTab={setActiveTab} isAddCrew={isAddCrew} setIdAddCrew={setIsAddCrew}  editCrew={editCrew} setEditCrew={setEditCrew}  editboat={editboat} setEditboat={setEditboat} setIsAddCrew={setIsAddCrew}  isDarft={isDarft} setIsDraft={setIsDraft}  />
      break;
      case 1:
        return <FindBoat setActiveTab={setActiveTab} isAddBoat={isAddBoat} setIsAddBoat={setIsAddBoat} editCrew={editCrew} setEditCrew={setEditCrew} editboat={editboat} setEditboat={setEditboat} isDarft={isDarft} setIsDraft={setIsDraft}/>
      break;
      case 2:
        return <BecomeCrew/>
      break;
      default:
        break;
    }
  }
  return (
    <View style={[style.contant]}>
      <View style={[style.row]}>
          <View style={[{flex: 2}]}>
          <View style={style.sidepanelcolor}>
          <Menu selectIndex={7} />
          </View>
          </View>
      </View>

      <View
        style={[
          style.contant,
          style.centerBox,
          style.centerItem,
          style.pH20
        ]}>
          <Text style={[style.font20]}>Coming Soon</Text>
        {/* <View style={[style.row]}>
        {(isAddCrew || isAddBoat) && <TouchableOpacity
          style={[style.row,style.mr10,style.mt3]}
          onPress={() => isAddCrew ? setIsAddCrew(!isAddCrew) : isAddBoat ?setIsAddBoat(!isAddBoat) : null }>
               <AntDesign name="chevron-left" size={normalize(15)} style={[style.mr10,style.mt3]} color={COLORS.PRIMARY} />
               <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
            </TouchableOpacity>}
        </View>
        <View style={[style.contant,style.mt15,]}>
          <View style={[style.row,style.between,style.centerBox]}>
      
            <View style={[{backgroundColor:COLORS.PRIMARY,borderRadius:8},style.row]}>
              {
              crewTabMenu.map((item,index) =>{
                return(
                  <TouchableOpacity 
                  onPress={()=>{setActiveTab(item?.id),setIsAddBoat(false),setIsAddCrew(false)}}
                  style={[style.button,activeTab !==item?.id ?style.primaryLayout:style.whiteLayout,style.borderRadius5,]}
                   key={index}>
                  <Text style={[isTablet?style.font14:style.font12,style.buttonTxt,
                  activeTab !==item?.id ? style.whiteText:style.primaryText]}>{item.name}</Text>
                </TouchableOpacity>
                )
              })
            }
            </View>
            {
              isTablet && <View>
                {
                activeTab !=2 && <TouchableOpacity
                    onPress={() => { activeTab == 0 ?setIsAddCrew(true):setIsAddBoat(true) }}
                    style={[
                      style.button,
                      {
                        backgroundColor: COLORS.PRIMARY,
                        flexDirection:'row',
                        marginTop:5
                      },
                    ]}>
                    <Text style={[ style.buttonTxt, style.whiteText]}> 
                        {activeTab ==0 && 'Advertise Crew'} {activeTab ==1 && 'Advertise Boat'} 
                    </Text>
                    <Icon name="plus" size={20} color={COLORS.WHITE}/>
                  </TouchableOpacity>
                }
              </View>
            }
             <TouchableOpacity style={[style.mt10]}>
              {activeTab == 1 ? <Text onPress={() => navigation.navigate("MyApplicationsTabs")} style={[style.primaryText,style.mt7]}>My Applications</Text>
              :<Text onPress={() => navigation.navigate("MyRequest")} style={[style.primaryText,style.mt7]}>My Request</Text>}
              
            </TouchableOpacity>
          </View>
          {renderTabView(activeTab)}
        </View> */}
      </View>
    </View>
  )
}

export default CrewScreen

const styles = StyleSheet.create({

})
