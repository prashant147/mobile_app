import { StyleSheet, TouchableOpacity, View } from "react-native";
import style from "../../styles/style";
import { Text,Image } from "react-native";
import TabBox from "../../components/TabBox";
import React, { useEffect, useState,useContext } from "react";
import DeviceInfo, { isTablet } from "react-native-device-info";
import COLORS from "../../styles/theme/color";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import MyAccount from "./MyAccount";
import Outstanding from "./Outstanding";
import MyBoats from "./MyBoats";
import Header from "../../components/Header";
import EventLeft from "../Home/EventLeft";
import MyLogs from "./MyLogs";
import { normalize, scaleHeight, scaleWidth } from "../../styles/utilities/dimentions";
import Menu from "../../routes/Menu";
import { BackHandler } from "react-native";
import MyInvitations from "./MyInvitations";
import MembersContext from "../Members/MembersContext";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BackIcon from 'react-native-vector-icons/FontAwesome';

const ProfilePage = ({setProfile,route}:any) => { 
    const [selectedTab, setSelectedTab] = useState('Account');
    const [isToggle, setIsToggle] = useState(false)
    const {loggedInUser,setHideChatbotMember, setHideChatbot} = useContext(MembersContext);
    let tabData = ["Account","Boats","Invitations"]
    let moreItems = ["My Boats","My Logs"]
    const navigation = useNavigation();
    const [isBack, setIsBack]=useState<boolean>(false);

    useFocusEffect(
      React.useCallback(()=>{
        setIsBack(false)
        setHideChatbot(true)
        setHideChatbotMember(true)
      },[])
    )
    useEffect(() => {
      const backAction = () => {
        setIsBack(false)
        return true;
      };
    
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
    
      return () => backHandler.remove();
    }, []);

    const openProfile = ()=>{
      navigation.navigate('MemberCard')
    }

    const onClickBack = () => {
      if (route) {
         navigation.navigate(route.params.path)
     }
   }
   
   useEffect(()=>{
    if(route?.params?.tabIndex){
      setSelectedTab(route?.params?.tabIndex)
    }else{
      setSelectedTab('Account')
    }
      },[route])

    return <View style={[style.contant]}>
            <View style={[style.contant ]}>
              <View style={[style.contant,style.row]}>
                <View style={{flex:2}}>
                  <View style={[style.mB10,style.sidepanelcolor]} >
                  <Menu selectIndex={11}/>
                  </View>
                  <View style={[style.contant,style.pH20,style.pV20,style.mB10]}>
                      <View style={[style.contentBetween]}>
                      <View style={style.row}>
                        {
                          isBack && <TouchableOpacity style={style.row} 
                          onPress={()=>setIsBack(false)}>
                             <Icon name="chevron-left" size={normalize(15)} style={[style.mt3,style.mr10]} color={COLORS.PRIMARY} />
                             <Text style={[style.font16, style.boldTxt,style.primaryText]}>Back</Text>
                          </TouchableOpacity>
                        }
                        </View>
                      </View>
                      <View style={[style.contant,style.mt0]}>
                      <View style={[style.row, style.mt10]}>
                      {route?.params?.path  && !isBack && 
                       <TouchableOpacity style={style.row} onPress={onClickBack}>
                        <BackIcon name="chevron-left" size={normalize(15)} style={[style.mr10,style.mt3]} color={COLORS.PRIMARY} />
                        <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
                       </TouchableOpacity>
                      }
                        </View>
                        <View style={[style.row,styles.tabContainer]}>
                        <TabBox data={tabData} selectedTab={selectedTab} onTab={(tab:string)=>{setSelectedTab(tab);setIsBack(false)}}/>

                        {/* <TouchableOpacity 
                        onPress={()=>setIsToggle(!isToggle)}
                        activeOpacity={.6} style={styles.menuStyles}>
                        <IconFeather name="menu" color={COLORS.WHITE} size={isTablet()?28:25} style={styles.buttonStyle} />

                        </TouchableOpacity> */}
                        </View>


                        <View style={style.contant}>
                          {
                            selectedTab =="Account" && <MyAccount isEdit={isBack} setIsEdit={setIsBack}></MyAccount>
                          }
                          {
                            selectedTab =="Invoices" && <Outstanding ></Outstanding>
                          }
                          {
                            selectedTab =="Boats" && <MyBoats isAddBoat={isBack} isAddCrew={isBack} setIsAddCrew={setIsBack} setIsAddBoat={setIsBack}></MyBoats>
                          }
                          {
                            selectedTab =="Logs" && <MyLogs isAddBoat={isBack} setIsAddBoat={setIsBack}></MyLogs>
                          }
                          {
                            selectedTab =="Invitations" && <MyInvitations isAddBoat={isBack} setIsAddBoat={setIsBack} tabIndex={route?.params?.index}/>
                          }
                        </View>
                          
                          {isToggle && <View style={styles.moreBox}>
                          {moreItems.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[styles.footerMoreMenu,selectedTab==item?styles.activeMenu:null]}
                              onPress={() =>{ setSelectedTab(item);setIsToggle(!isToggle)}}>
                      
                              <Text style={[styles.footeTxt,selectedTab==item?styles.activeText:null]}>{item}</Text>
                            </TouchableOpacity>
                             ))}
                          </View>}

                      </View>
                  </View>
                </View>
              </View>
  
            </View>
    </View>
}
export default ProfilePage;

const styles = StyleSheet.create({
  tabContainer:{
    alignItems:'center',
    justifyContent:'space-between'
  },
  buttonStyle:{
    height:scaleHeight(20),
    width:scaleHeight(25),
    alignSelf:'center',
    marginBottom:4
  },
  menuStyles:{
    backgroundColor:COLORS.LIGHT_PRIMARY,
    padding:normalize(3),
    borderRadius:normalize(5),
    justifyContent:'center',
    alignItems:'center',

    width:scaleWidth(40)
  },
  moreBox:{
    paddingVertical:10,
    backgroundColor:COLORS.LIGHT_PRIMARY,
    width:scaleWidth(120),
    position:'absolute',
    top:normalize(40),
    right:5,
    borderRadius:normalize(6),
    zIndex:99,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    
    elevation: 2,
  },
  activeMenu:{
    backgroundColor:COLORS.WHITE,
    borderRadius:normalize(0),
  },
  activeText:{
    color:COLORS.LIGHT_PRIMARY
  },
  footerMoreMenu:{
    height:scaleHeight(80),
    justifyContent:'center',
    alignItems:'center',
    borderBottomColor:COLORS.LINE,
    borderBottomWidth:1
  },
  menuBut:{
    backgroundColor:COLORS.WHITE,
    borderColor:COLORS.BLACK,
    borderRadius:8,
    shadowColor: "#000",
    width:40,
    height:40,
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  footerBox:{
    height:scaleHeight(90),
    backgroundColor:COLORS.LIGHT_PRIMARY
  },
  footeTxt:{
    fontSize:normalize(12),
    fontFamily:'Roboto-Regular',
    color:COLORS.WHITE
  },
  userImg:{
    width:normalize(isTablet()?76:30),
    height:normalize(isTablet()?76:30),
    borderRadius:30
  },
  iconLogo:{
    height:scaleHeight(isTablet()?35:30),
    resizeMode:'contain',
    width:scaleHeight(isTablet()?40:35),
  },
})