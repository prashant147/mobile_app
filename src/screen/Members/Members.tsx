import React, { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { normalize } from '../../styles/utilities/dimentions';
// @ts-ignore
import ExploreMap from './ExploreMap';
import COLORS from '../../styles/theme/color';
import DeviceInfo from 'react-native-device-info';
import style from '../../styles/style';
import MembersListPage from './MembersList';
import Menu from '../../routes/Menu';
import {getAllMembersFav} from '../../services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MembersContext from './MembersContext';
import Entypo from "react-native-vector-icons/Entypo";

interface MembersPageProps {}


const MembersPage: React.FC<MembersPageProps> = ({navigation,route}:any) => {
  const {setHideChatbot,setHideChatbotMember,setSelectedMenu}= useContext(MembersContext)
  const [selectedTab, setSelectedTab] = useState('Members');
  const token =  AsyncStorage.getItem('accessToken')
  const [memberfromBirthday, setMemberfromBirthday] = useState<any[]>();
  const [isLoader, setisLoader]=useState(true);
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [isBack, setIsBack]=useState<number>(0);
  const [membersList, setMembersList]=useState<any[]>([]);
  const [boatsData,setBoatsData] = useState([])


  useFocusEffect(React.useCallback(()=>{
    setSelectedMenu(2)
if(selectedTab === 'Map'){
  setHideChatbot(true)
  setHideChatbotMember(true)
}else{
  setHideChatbot(false)
  setHideChatbotMember(false)
  
}
  },[selectedTab]))
  useEffect(()=>{
    if(route?.params){
      setSelectedTab(route?.params?.tabIndex)
    }else{
      setSelectedTab('Members')
    }
      },[route])
  useFocusEffect(React.useCallback(() => {
    const getData = async() => {
      setisLoader(true)
      try {
        const response = await getAllMembersFav(token);
        if(response.status === 200){
          setMembersList(response.data)
          setTimeout(() => {
            setisLoader(false)
          }, 2000);
          if(route && route.params){
            const { id } = route.params;
            setMemberfromBirthday(id)
          }
        }
      } catch (error) {
        console.error(error)
      }

    }
  getData();
  },[updateSuccess,route]))


  return (
    <View style={[style.contant]}>
         <View style={style.sidepanelcolor}>
          <Menu selectIndex={2} />
          </View>
      <View
        style={[
          style.contant,selectedTab !=='Map' && style.pH20,style.pt20
        ]}>
          <View style={[selectedTab ==='Map' && style.pH20,]}>
        </View>
        
       <View style={[style.contant]}>
          {
            selectedTab=="Members" && <MembersListPage setIsBack={setIsBack} IsBack={isBack} members={membersList} isLoader={isLoader} setIsLoader={setisLoader} memberfromBirthday={memberfromBirthday} setMemberfromBirthday={setMemberfromBirthday} setUpdateSuccess={setUpdateSuccess} />
          }
          {
            selectedTab=="Map" && <ExploreMap boatsData={boatsData} setBoatsData={setBoatsData} />
          }
        </View>
      </View>
    </View>
  );
};

export default MembersPage;