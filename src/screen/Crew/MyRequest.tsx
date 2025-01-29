import React, { useEffect, useState,useRef, useContext } from 'react'
import { View,TouchableOpacity,Text,StyleSheet,Image,Modal, FlatList } from "react-native";
import style from '../../styles/style';
import Header from '../../components/Header';
import DeviceInfo from 'react-native-device-info';
import Menu from '../../routes/Menu';
import Icon from "react-native-vector-icons/Feather";
import COLORS from '../../styles/theme/color';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getMyRequest,getInvitations, acceptBecomeCrew, rejectBecomeCrew } from '../../services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '../../styles/utilities/dimentions';
import { ActivityIndicator } from 'react-native-paper';
import { BackHandler } from 'react-native';
import TabBox from '../../components/TabBox';

const MyRequest = ({route}:any) => {
    const isTablet = DeviceInfo.isTablet();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const token = AsyncStorage.getItem('accessToken');
    const [invitationData, setInvitationData] = useState()
    const [requestData,setRequestData] = useState();
    const [selectedTab, setSelectedTab] = useState('Requests sent');
    const [isRejected, setIsRejected] = useState(false);
    const [updatedSuccess, setUpdateSuccess] = useState(false);
    let tabData = ["Requests sent","Requests received"]

    useEffect(()=>{
      if(route?.params){
        setSelectedTab(route?.params?.tabIndex)
      }else{
        setSelectedTab('Requests sent')
      }
        },[route])

    useEffect(() => {
      const backAction = () => {
        navigation.navigate("Crew")
        return true;
      };
    
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
    
      return () => backHandler.remove();
    }, []);

    useEffect(() => {
      getRequestData();
    },[selectedTab])

    useFocusEffect(
      React.useCallback(()=>{
        getRequestData();
      },[])
    )


    const getRequestData = async() => {
      try {
        setLoader(true)
          const response = await getMyRequest(token);
          if(response.status === 200){
            
              if(response.data[0]?.message === "No Records Found"){
                  setRequestData([])
                  setLoader(false)
              }
              else{
               
          setRequestData(response.data)
          setLoader(false)
          }
      }
      } catch (error) {
          console.error(error)
          setLoader(false)
      }
   }

  

  const getInvites = async () => {
    try {
        setLoader(true)
        const response = await getInvitations(token);        
        if (response.status === 200) {
          console.log(response.data)
            if (response.data[0]?.message === "No Records Found") {
                setInvitationData([])
                setLoader(false)
            } else {
                setInvitationData(response.data)
                setLoader(false)
            }
        }
    } catch (error) {
        console.error(error)
        setLoader(false)
    }
}


useEffect(() => {
  getInvites();
}, [isRejected,updatedSuccess, selectedTab])

  const acceptBecomeCrewMembers = async(item:any) => {
    try {
      setUpdateSuccess(false)
      const response = await acceptBecomeCrew(item.id,token);
      if(response.status === 200){
      setUpdateSuccess(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const rejectBecomeCrewMembers = async(item:any) => {
    try {
      setIsRejected(false)
      const response = await rejectBecomeCrew(item.id,token)
      if(response.status === 200){
        setIsRejected(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

    const renderRequestData =({item, index}:any)=>{
     
        return (
          <View style={style.mb10}>
            <View>
              <View style={[style.contant]}>
                <View style={[styles.line, style.contentAround]}>
                  <View style={[style.row]}>
                    {item?.members?.profileUrl ? (
                      <Image
                        style={[styles.profileImg, style.mt10]}
                        source={{ uri: `${item?.members?.profileUrl}` }}
                        alt="img"
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        style={[styles.profileImg, style.mt10]}
                        source={require("../../assets/avatarImage.png")}
                        alt="img"
                        resizeMode="cover"
                      />
                    )}
                    <View style={[style.contentBetween]}>
                      <View style={[style.mt10]}>
                        <Text style={styles.memberSubText}>MEMBER NAME</Text>
                        <TouchableOpacity
                          style={style.row}
                          onPress={() =>
                            navigation.navigate("MemberDetails", {
                              id: item?.members?.id,
                              path: "MyRequest",
                            })
                          }
                        >
                          <Text style={styles.nameTitleTextStyle}>
                            {item?.becomeCrewMemberId?.firstName}
                          </Text>
                          <Text style={[styles.nameTitleTextStyle, style.mH5]}>
                            {item?.becomeCrewMemberId?.lastName}
                          </Text>
                        </TouchableOpacity>
                        <View style={style.contentBetween}>
                          <View>
                            <Text style={styles.memberSubText}>
                              Invited to{" "}
                            </Text>
                            <Text style={styles.nameTitleTextStyle}>
                              {item?.members?.boatName
                                ? item?.members?.boatName
                                : "N/A"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={[style.mt30]}>
                    <Text style={[styles.memberSubText, style.alignSelfEnd]}>
                      Status
                    </Text>
                    {item?.status === "INVITED" ? (
                      <Text style={[style.font14, { color: COLORS.YELLOW }]}>
                        {item?.status
                          ? item.status.charAt(0).toUpperCase() +
                            item.status.slice(1).toLowerCase()
                          : ""}
                      </Text>
                    ) : item?.status === "ACCEPTED" ? (
                      <Text style={[style.font14, { color: COLORS.GREEN }]}>
                        {item?.status
                          ? item.status.charAt(0).toUpperCase() +
                            item.status.slice(1).toLowerCase()
                          : ""}
                      </Text>
                    ) : item?.status === "REJECTED" ? (
                      <Text style={[style.font14, { color: COLORS.RED }]}>
                        {item?.status
                          ? item.status.charAt(0).toUpperCase() +
                            item.status.slice(1).toLowerCase()
                          : ""}
                      </Text>
                    ) : (
                      <Text style={[style.font14, { color: COLORS.BLACK }]}>
                        {item?.status
                          ? item.status.charAt(0).toUpperCase() +
                            item.status.slice(1).toLowerCase()
                          : ""}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              style={styles.modelUser}
              visible={modalVisible}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  {/* <TouchableOpacity style={styles.closeButton} onPress={toggleModalClose}>
                  <Icon name="x" size={24} color="black" />
                </TouchableOpacity> */}
                  <Text style={styles.modalText}>
                    Thanks for requesting crew members info!
                  </Text>
                  {/* <Text style={styles.modalText}>Members in crew : 7 members</Text> */}
                </View>
              </View>
            </Modal>
          </View>
        );
    }

    const renderInvitationdata = ({item,index}:any) => {
      return (
        <View style={style.mb10}>
          <View style={style.mt5}>
            <View style={[styles.line, style.row]}>
              {item?.members?.profileUrl ? (
                <Image
                  style={[styles.profileImage, style.mt10]}
                  source={{ uri: item?.members?.profileUrl }}
                  alt="img"
                />
              ) : (
                <Image
                  style={[styles.profileImage, style.mt10]}
                  source={require("../../assets/avatarImage.png")}
                  alt="img"
                />
              )}
              <View style={[style.contentBetween]}>
                <View style={[style.mt10]}>
                  <Text style={styles.nameTitleStyle}>MEMBER NAME</Text>
                  <Text
                    style={styles.nameTitleTextStyle}
                    onPress={() =>
                      navigation.navigate("MemberDetails", {
                        id: item?.members?.id,
                        path: "MyRequest",
                      })
                    }
                  >
                    {`${item?.members.firstName} ${item?.members.lastName}`
                      .length > 20
                      ? `${item?.members.firstName.substring(0, 20)}...`
                      : `${item?.members.firstName} ${item?.members.lastName}`}
                  </Text>
                  <Text style={[styles.nameTitleStyle, style.mt5]}>QUALIFICATION</Text>
                  <Text style={styles.nameTitleTextStyle}>
                    {`${item?.qualification ? item?.qualification : "N/A"}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <View style={[style.contentBetween, style.mt10]}>
              {item?.status !== "ACCEPTED" && (
                <TouchableOpacity
                  style={[styles.rejectBtn]}
                  onPress={() => rejectBecomeCrewMembers(item)}
                >
                  <Text style={[style.textCenter, { color: COLORS.RED }]}>
                    Reject
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[style.primaryLayout, styles.button]}
                onPress={() => acceptBecomeCrewMembers(item)}
              >
                <Text style={[style.whiteText, style.textCenter]}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return(
        <View style={[style.contant]}>
      
          
        <View style={[style.row]}>
            <View style={[{flex: 2}]}>
              {/* <Header></Header> */}
            {!isTablet && <View style={style.sidepanelcolor}>
              <Menu selectIndex={7} />
            </View>}
            </View>
            </View>
             
            <View
        style={[
          style.contant,
          style.pH20,
          style.mtb20
        ]}>
        <View>
        <TouchableOpacity style={[style.row,style.centerBox]} onPress={() => navigation.navigate(route?.params?.path ? route?.params?.path : "Crew")}>
              <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} />
              <Text
                style={[
                  styles.memberTitleText,style.font16,style.boldTxt,style.primaryText
                ]}>
                {`Back to ${route?.params?.path ? route?.params?.path : "Crew"}`}
              </Text>
            </TouchableOpacity>
            
        </View>
        <View style={[style.mH10,style.mtb10]}>
          <TabBox data={tabData} selectedTab={selectedTab} onTab={(tab)=>setSelectedTab(tab)}></TabBox>
            </View>
            <View style={style.contant}>
            { selectedTab == "Requests sent" && 
            <View>
                     { loader ? <View style={[style.contant,style.row,style.centerItem,style.centerItem,style.mt40]}> 
            <ActivityIndicator style={style.mt40} theme={{ colors: { primary: COLORS.PRIMARY } }}/> 
            </View>:
            <View>
            {requestData  && requestData.length > 0 ? (
             <FlatList
             data={requestData}
             renderItem={renderRequestData}
             showsVerticalScrollIndicator={false}
             />
            ):(
              <View style={[style.centerItem,style.centerBox,style.mt40]}>
                <Text style={[style.font14,style.mt40]}>No Request Found</Text>
                </View>
            )}
            </View>
            }
            </View>
            }
            {selectedTab == "Requests received" && 
            <View>
              { loader ? <View style={[style.contant,style.row,style.centerItem,style.centerItem,style.mt40]}> 
            <ActivityIndicator style={style.mt40} theme={{ colors: { primary: COLORS.PRIMARY } }}/> 
            </View>:
            <View>
            {invitationData && invitationData.length > 0 ? (
            <FlatList
            data={invitationData}
            renderItem={renderInvitationdata}
            showsVerticalScrollIndicator={false}
            />
            )
            :
            <View style={[style.centerItem,style.centerBox,style.mt40]}>
                <Text style={[style.font14,style.mt40]}>No Request Found</Text>
                </View>
            }
              </View>
              }
            </View>
            }
            </View>
    </View>
    </View>
    )
}
export default MyRequest;
const styles = StyleSheet.create({
    memberTitleText:{
        color:COLORS.LIGHT_BLACK,
        fontSize:normalize(12),
        lineHeight:25
      },
      profileImg:{
        width:normalize(65),
        height:normalize(65),
        borderRadius: 8,
        marginRight: 10,
        resizeMode:'contain',
        borderWidth:0.50,
      },
      profileImage: {
        width: normalize(65),
        height: normalize(65),
        borderRadius: 8,
        marginRight: 10,
        resizeMode: 'contain',
        borderColor:COLORS.LIGHTGREY,
        borderWidth:0.50,
    },
      line: {
        borderTopWidth: 1,
        borderColor: COLORS.LINE
      },
      nameTitleStyle:{
        color:COLORS.GREY,
        fontSize:normalize(10),
      },
      nameTitleTextStyle:{
        color:COLORS.BLACK,
        fontSize:normalize(14),
        fontWeight:"600",
        lineHeight:25,
        maxWidth: 200
      },
      button: {
        width: "48%",
        height: normalize(30),
        borderRadius:8,
        justifyContent: "center",
        borderWidth: 0.2,
        borderColor: COLORS.PRIMARY
    },
     btnTextStyless: {
        color:COLORS.PRIMARY,
        fontSize:normalize(14),
        fontWeight:'600'
      },
      modelUser: {
        width: 300,
        height: 500
      },
      modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust opacity here
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
      },
      modalText: {
        color:COLORS.BLACK,
        fontSize:normalize(14),
        fontWeight:"600",
        lineHeight:30,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10
      },
      tabContainer:{
        alignItems:'center',
        justifyContent:'space-between'
      },
      acceptBtn: {
        width: "100%",
        height: normalize(30),
        justifyContent: "center",
        borderWidth: 0.2,
        borderRadius:8,
        borderColor: COLORS.PRIMARY
      },
      memberSubText: {
        color: COLORS.GREY,
        fontSize: normalize(11),
        lineHeight: 20,
      },
      rejectBtn: {
        width: "48%",
        height: normalize(30),
        justifyContent: "center",
        borderWidth: 0.2,
        borderRadius:8,
        backgroundColor:COLORS.WHITE,
        borderColor: COLORS.RED
    },
})