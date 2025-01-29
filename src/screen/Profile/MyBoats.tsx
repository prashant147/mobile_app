import { Dimensions, FlatList, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import style from "../../styles/style";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconBack from "react-native-vector-icons/Feather";
import { isTablet } from "react-native-device-info";
import COLORS from "../../styles/theme/color";
import AddBoat from "./AddBoats";
import moment from 'moment';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React, { useContext, useEffect, useState } from "react";
import { normalize } from "../../styles/utilities/dimentions";
import { launchImageLibrary } from "react-native-image-picker";
import { deleteBoat, deleteCrewMember, getAllMyCrewMembersByboatId, getMyBoats, setPrimaryBoat,getAllMemberStatus, getJointsBoat } from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from 'react-native-paper';
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import AddCrew from "./AddCrew";
import MembersContext from "../Members/MembersContext";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import TabBox from "../../components/TabBox";
import { dateFormat } from "../../styles/utilities/variables";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import Config from "react-native-config";

const MyBoats = ({isAddBoat, setIsAddBoat,setIsAddCrew,isAddCrew}:any) => { 
  const token = AsyncStorage.getItem("accessToken");
  const { setHideChatbotMember, setHideChatbot,loggedInUser } = useContext(MembersContext);
    const [boat, setBoat]=useState<any>([]);
    const[boatsData,setBoatsData] = useState(null)
    const [selBoat, setSelBoat]=useState({boatName:''});
    const [updateSuccess,setUpdateSuccess] = useState(false);
    const [isLodering, setIsLodering] = useState(false);
    const [selectMember, setSelectMember] = useState<any>(null);
    const [crewData,setCrewData] = useState(null)
    const [isVisible, setIsVisible] = useState("");
    const [boatModal,setboatModal] = useState(false);
    const [crewdeleteModal,setcrewdeleteModal] = useState(false);
    const [advToBeDeleted, setAdvToBoDeleted] = useState<any>();
    const [memberList, setMemberList] = useState([]);
    const navigation = useNavigation();
    const [addCrew,setAddCrew] = useState(false);
    const [jointsBoatList, setJointBoatList]=useState([])
    const [selectedTab, setSelectedTab] = useState('My Boats');
    let tabData = ["My Boats","Crewed on"]

    // const loadMemberList = async(item:any)=>{
    //   try{
    //   const response = await getAllMemberStatus(item.item.id,token);
    //   if(response.status === 200){
    //   setMemberList(response.data);
    //   }
    //   }catch(error){
    //   console.error(error);
    //   }
    // }


    const getJointsBoatList =async()=>{
      try {
        const response = await getJointsBoat(token);
        setJointBoatList(response.data);
        
      } catch (error) {
        console.log("error getJointsBoatList", error);
        
      }
    }

    const image = [
        "https://images.pexels.com/photos/244517/pexels-photo-244517.jpeg?cs=srgb&dl=pexels-photoklickr-244517.jpg&fm=jpg",
        "https://images.pexels.com/photos/2536643/pexels-photo-2536643.jpeg?cs=srgb&dl=pexels-hakan-tahmaz-2536643.jpg&fm=jpg",
        "https://images.unsplash.com/photo-1580698543091-88c76b323ff1?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlnJTIwc2hpcHxlbnwwfHwwfHx8MA%3D%3D",
        "https://media.istockphoto.com/id/666245096/photo/luxury-motor-yacht-at-sea.jpg?s=612x612&w=0&k=20&c=ZIpp3HaYL37GvfD1tHivmTe24cHdAl2181Tg95qd9bM="
    ]
    useEffect(() => {
     getBoatsData();
     getJointsBoatList()
    },[updateSuccess,isAddBoat])

    // useEffect(() => {
    //   loadMemberList();
    // },[updateSuccess,isAddBoat])
    
    const getBoatsData = async() => {
      try {
        setIsLodering(true)
        const response = await getMyBoats(token);
        if(response.status === 200){
          if(response.data[0]?.message === "No Boats Found For this user"){
            setIsLodering(false)
          }else{
          setBoatsData(response.data?.map((e:any)=>{return { ...e,isView:false,membersData:[]}}))
          setIsLodering(false)
          }
        }
      } catch (error) {
        console.error(error)
        setIsLodering(false)
      }
     }
     const setPrimaryBoatOnSelect = async(id:string) => {
      try {
        setIsLodering(true)
        const response = await setPrimaryBoat(id.id,token);
        if(response.status === 200){
          try {
            let user = new CometChat.User(loggedInUser.id);
            const name = `${loggedInUser?.firstName || ""} ${loggedInUser?.lastName || ""}${id?.boatName ? ` - ${id.boatName}` : ""}`;
            user.setName(name);
    
            CometChat.updateUser(user, Config.AUTH_KEY).then(
              (user) => {
                console.log("user updated", user);
              },
              (error) => {
                console.log("error", error);
              }
            );    
           } catch (error) {
            
           }
          getBoatsData();
          setIsLodering(false)
        }
      } catch (error) {
        console.error(error)
        setIsLodering(false)
      }
     }
     
    const handleModalboat = async(item:any) => {
      try {
        setIsLodering(true)
        setUpdateSuccess(false)
        const response = await deleteBoat(item.item.id,token);
        if(response.status === 200){
         if(item.item.isPrimary){
          try {
            let user = new CometChat.User(loggedInUser.id);
            const name = `${loggedInUser?.firstName || ""} ${loggedInUser?.lastName || ""}`;
            user.setName(name);
    
            CometChat.updateUser(user, Config.AUTH_KEY).then(
              (user) => {
                console.log("user updated", user);
              },
              (error) => {
                console.log("error", error);
              }
            );    
           } catch (error) {
            
           }
         }
         setIsLodering(false) 
         setboatModal(false)
         setUpdateSuccess(true)
        }
      } catch (error) {
        console.error(error)
        setIsLodering(false) 
      }
    }


    const editBoatInfo =(item)=>{
      const editInfo = {
        ...item,
        captain : item.captainId,
        coOwner: item.boatCoOwnerId,
        boatOwner : item.boatOwnerId
      }
      setSelBoat(editInfo);
      setIsAddBoat(true);
    }

    const onClickView = async (item:any)=>{
      try {
            if(isVisible === item.item.id) {
             setIsVisible(null)
            } else {
            const response = await getAllMyCrewMembersByboatId(item.item.id,token);
            if(response.status === 200){
              if(response.data[0].message === "No Records Found"){
              setCrewData(null)
              }else{
              setCrewData(response.data)
             
            } 
            setIsVisible(item.item.id)
          }
          }
          } catch (error) {
            console.error(error)
          } 
       }
    const deleteCrewMemberHandler = async({e,item}:any) => {
      try {
        const response = await deleteCrewMember(e.id,item.item.id,token)
        if(response.status === 200){
          const updatedResponse = await getAllMyCrewMembersByboatId(item.item.id, token);
        if (updatedResponse.status === 200) {
        setCrewData(updatedResponse.data);
        setUpdateSuccess(true);
      }
        }
      } catch (error) {
      }
    }

    const renderCrewList = (item:any)=>{
        return  <View style={styles.line}>
                    <View  style={[style.row]}>
                        <Image source={require('../../assets/boat1.png')} style={styles.profileImg} resizeMode='cover'/>
                        <View style={[style.contant,style.mt20,{marginLeft:20}]}>
                            <View style={[style.contant,style.row]}>
                                <View style={style.contant}>
                                    <View style={[style.row,style.contant,style.mt10]}>
                                        <View style={style.contant}>
                                            <Text style={[style.font12,style.grayText]}>BOAT NAME</Text>
                                            <Text style={[style.font14]}>{item?.item.boatName}</Text>
                                        </View>
                                        <View style={style.contant}>
                                            <Text style={[style.font12,style.grayText]}>CAPTAIN</Text>
                                            <Text style={[style.font14]}>{item?.item.captain}</Text>
                                        </View>
                                        <View style={style.contant}>
                                            <Text style={[style.font12,style.grayText]}>CO-OWNER</Text>
                                            <Text style={[style.font14]}>{item?.item.coOwner}</Text>
                                        </View>
                                    </View>
                                    <View style={[style.row,style.contant,style.mt10]}>
                                        <View style={style.contant}>
                                            <Text style={[style.font12,style.grayText]}>HOME PORT</Text>
                                            <Text style={[style.font14]}>{item?.item.homePort}</Text>
                                        </View>
                                        <View style={style.contant}>
                                            <Text style={[style.font12,style.grayText]}>MODEL</Text>
                                            <Text style={[style.font14]}>{item?.item.modelNo}</Text>
                                        </View>
                                        <View style={style.contant}>
                                            <Text style={[style.font12,style.grayText]}>MAKE</Text>
                                            <Text style={[style.font14]}>{item?.item.make}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View>
                                    {
                                        item.item.isView && <TouchableOpacity  onPress={()=>{
                                            setSelBoat(item.item);
                                            setIsAddBoat(true);}} style={[style.button,style.mtb10]}>
                                        <Text style={[style.font14,style.buttonTxt]}>Edit Boat Info</Text>
                                    </TouchableOpacity>
                                    }
                                    <TouchableOpacity style={[style.button,style.primaryLayout]} onPress={()=>Linking.openURL(`tel:${item.item.phone}`)}>
                                        <Icon name="phone" style={style.pH20} size={20} color={COLORS.WHITE} />
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                            <View style={[style.contant,style.row,style.mt10]}>
                                <View style={style.contant}>
                                    <Text style={[style.font12,style.grayText]}>MMSI</Text>
                                    <Text style={[style.font14]}>{item?.item.position}</Text>
                                </View>
                                <View style={style.contant}>
                                    <Text style={[style.font12,style.grayText]}>LENGTH</Text>
                                    <Text style={[style.font14]}>{item?.item.length}</Text>
                                </View>
                                <View style={style.contant}>
                                    <Text style={[style.font12,style.grayText]}>YEAR</Text>
                                    <Text style={[style.font14]}>{item?.item.makeYear}</Text>
                                </View>
                                <View style={style.contant}>
                                    <Text style={[style.font12,style.grayText]}>COLOR</Text>
                                    <Text style={[style.font14]}>{item?.item.make}</Text>
                                </View>
                            </View>
                        </View>
                    </View> 
                    <View style={!item.item.isView && style.row}>
                        {
                            !item.item.isView && <TouchableOpacity  onPress={()=> {
                              setSelBoat(item.item);
                                    setIsAddBoat(true);
                                }} style={[style.button]}>
                                <Text style={[style.font14,style.buttonTxt]}>Edit Boat Info</Text>
                            </TouchableOpacity>
                        }
                           
                        <TouchableOpacity style={[style.contant,{alignContent:'center',alignItems:'center'}]} onPress={()=>onClickView(item)}>
                            {
                                isVisible && <Icon name="chevron-down" style={style.pH20} size={20} color={COLORS.LIGHT_PRIMARY} />
                            }
                            {
                                isVisible && <Icon name="chevron-up" style={style.pH20} size={20} color={COLORS.LIGHT_PRIMARY} />
                            }
                        </TouchableOpacity>   
                        
                           
                    </View>
            </View> 
    }

    const renderPhoneBoatList = (item:any,index:any)=>{
      
      return (
        <ScrollView style={styles.line} showsVerticalScrollIndicator={false}>
                      <View style={[style.row,style.mt10]}>
                    {item?.item?.image ? (
                      <Image source={{uri:item?.item.image}} style={styles.profileImg} resizeMode='cover'/>
                    ) : (
                      <Image source={require('../../assets/no-image-icon-6-bg.png')} style={styles.profileImg} resizeMode='cover'/>
                    )}
                     
                     <View style={[style.contant,style.row]}>
                        <View style={[style.contant,style.mH20,style.mt10]}>
                            <Text style={[style.font12,style.grayText]}>BOAT NAME</Text>
                            <Text style={[style.font14,style.primaryText,style.boldTxt]}>{item?.item.boatName}</Text>
                        </View>
                        {loggedInUser?.id == item.item.boatOwnerId && <View style={[style.row]}>
                        <TouchableOpacity
                        style={[style.mH12]}
                           onPress={()=>editBoatInfo(item.item)}>
                            <MaterialIconCommunity 
                             name='square-edit-outline'
                            size={25}
                            color={COLORS.DARK_PRIMARY}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setboatModal(true),setAdvToBoDeleted(item)}}>
                    <MaterialIcon 
                     name='delete'
                     size={25}
                     color={COLORS.DARK_PRIMARY}
                     />
                     </TouchableOpacity>
                        </View>}
                       
                     </View>
                   </View>
                   {/* <View style={[style.row,style.mt10]}>
                        <View style={style.contant}>
                            <Text style={[style.font12,style.grayText]}>CAPTAIN</Text>
                            <Text style={[style.font14]}>{item?.item.captain ? item?.item.captain : "N/A" }</Text>
                        </View>
                        <View style={[style.contant,styles.flexEnd]}>
                            <Text style={[style.font12,style.grayText]}>CO-OWNER</Text>
                            <Text style={[style.font14]}>{item?.item.coOwner ? item?.item.coOwner : "N/A" }</Text>
                        </View>
                   </View> */}
                   <View style={[style.row,style.mt10]}>
                      <View style={style.contant}>
                        <Text style={[style.font12,style.grayText]}>MAKE AND MODEL</Text>
                        <Text style={[style.font14]}>{item?.item.make ? item?.item.make : "N/A"}</Text>
                      </View>
                      <View style={[style.contant,styles.flexEnd]}>
                        <Text style={[style.font12,style.grayText]}>LENGTH</Text>
                        <Text style={[style.font14]}>{item?.item.length ? item?.item.length : "N/A"}</Text>
                      </View>
                   </View>
                   <View style={[style.row,style.mt10]}>
                        <View style={style.contant}>
                        <Text style={[style.font12,style.grayText]}>HAILING PORT</Text>
                            <Text style={[style.font14]}>{item?.item.homePort ? item?.item.homePort : "N/A"}</Text>
                        </View>
                        <View style={[style.contant,styles.flexEnd]}>
                        <Text style={[style.font12,style.grayText]}>PROMINENT FEATURES</Text>
                            <Text style={[style.font14]}>{item?.item.colour ? item?.item.colour : "N/A"}</Text>
                        </View>
                   </View>
                   <View style={[style.row,style.mt10]}>
                        <View style={style.contant}>
                        <Text style={[style.font12,style.grayText]}>MMSI</Text>
                            <Text style={[style.font14]}>{item?.item.mmsi ? item?.item.mmsi : "N/A"}</Text>
                        </View>
                        <View style={[style.contant,styles.flexEnd]}>
                        <Text style={[style.font12,style.grayText]}>OFFSHORE EMAIL ADDRESS</Text>
                            <Text style={[style.font14]}>{item?.item.offShoreEmailAddress ? item?.item.offShoreEmailAddress : "N/A"}</Text>
                        </View>
                   </View>
                    <View style={[style.row,style.mt10]}>
                        <View style={[style.contant]}>
                        <Text style={[style.font12,style.grayText]}>DRAFT</Text>
                            <Text style={[style.font14]}>{item?.item.draft ? item?.item.draft : "N/A"}</Text>
                        </View>
                        <View style={[style.contant,styles.flexEnd]}>
                        <Text style={[style.font12,style.grayText]}>BEAM</Text>
                            <Text style={[style.font14]}>{item?.item.beam ? item?.item.beam : "N/A"}</Text>
                        </View>
                    </View>
                    <View style={[style.row,style.mt10]}>
                        <View style={[style.contant]}>
                        <Text style={[style.font12,style.grayText]}>CAPTAIN</Text>
                            <Text style={[style.font14]}>{item?.item.captain ? item?.item.captain : "N/A" }</Text>
                            
                        </View>
                        <View style={[style.contant,styles.flexEnd]}>
                        <Text style={[style.font12,style.grayText]}>FACEBOOK WEBSITE</Text>
                            <Text style={[style.font14]}>{item?.item.facebookUrl ? item?.item.facebookUrl : "N/A"}</Text>
                        </View>
                        </View>
                        <View style={[style.row,style.mt10]}>
                        <View style={[style.contant]}>
                        <Text style={[style.font12,style.grayText]}>BOAT WEBSITE</Text>
                            <Text style={[style.font14]}>{item?.item.boatWebsiteUrl ? item?.item.boatWebsiteUrl : "N/A"}</Text>
                        </View>
                        <View style={[style.contant,style.flexEnd]}>
                        <Text style={[style.font12,style.grayText]}>INSTAGRAM WEBSITE</Text>
                            <Text style={[style.font14]}>{item?.item.instagramUrl ? item?.item.instagramUrl : "N/A"}</Text>  
                        </View>
                        </View>

                    <View style={[style.mt20,style.centerBox]}>
                       
                        {loggedInUser?.id == item.item.boatOwnerId &&  item?.item.isPrimary ?
                         <TouchableOpacity style={[styles.primarybuttonSet]}>
                         <Text style={[style.whiteText,{padding:3}]}>Primary Boat</Text>
                     </TouchableOpacity> :loggedInUser?.id == item.item.boatOwnerId &&  <TouchableOpacity style={[styles.primarybutton]} onPress={()=>setPrimaryBoatOnSelect(item?.item)}>
                            <Text style={[style.whiteText,{padding:3}]}>Set as Primary cruising boat</Text>
                        </TouchableOpacity> }


                        </View>
                        <TouchableOpacity style={[style.contant,style.centerBox,style.centerItem,style.mt10]} onPress={() => onClickView(item)}>
                        {isVisible === item.item.id ? (
                         <Icon name="chevron-up" style={style.pH20} size={20} color={COLORS.LIGHT_PRIMARY} />
                          ) : (
                        <Icon name="chevron-down" style={style.pH20} size={20} color={COLORS.LIGHT_PRIMARY} />
                          )}
                        </TouchableOpacity>
                    <View>
        {isVisible === item.item.id ? 
        <View style={style.contant}>
             <View style={[style.contentBetween,styles.line,style.mt20]}>
                <Text style={[style.contant,style.font16,style.primaryText,style.centerBox,style.mt5]}>Crew Members</Text>
                
                {loggedInUser?.id == item.item.boatOwnerId && <TouchableOpacity style={[style.button,style.primaryLayout,style.row]} onPress={() => setAddCrew(true)}>
                        <Text style={[style.font14,style.whiteText,style.mr30,isTablet() && style.pV20]}>Add Crew</Text>
                        <Icon name='plus' size={isTablet()?20:16} color={COLORS.WHITE} ></Icon>
                    </TouchableOpacity>}
            </View>
            {crewData && crewData.length > 0 ? ( 
             crewData.map((e:any)=>
             <View style={styles.line}>
                <View style={[style.row,style.mt10]}>
                {e?.member?.profileUrl ? 
               <Image source={{uri:e?.member?.profileUrl}} alt="" style={styles.profileImage} resizeMode='cover'/> :
              <Image
              source={require("../../assets/avatarImage.png")}
              alt="img"
              style={[styles.profileImage]}
              resizeMode="cover"
            />
            
              }
                    <View style={[style.contant]}>
                            <Text style={[style.font14,style.grayText]}>MEMBER NAME</Text>
                            <Text style={[style.font16]}>{e?.member?.firstName} {e?.member?.lastName}</Text>

                            <Text style={[style.font14,style.grayText,style.mt5]}>POSITION</Text>
                            <Text style={[style.font16]}>{ e?.position?.replace(/_/g, ' ')}</Text>
                    </View>
                    {loggedInUser?.id == item.item.boatOwnerId && <TouchableOpacity
                     onPress={() => deleteCrewMemberHandler({e, item})}
                     >
                      <MaterialIcon 
                      name='delete'
                      size={25}
                      color={COLORS.DARK_PRIMARY}
                      />
                    </TouchableOpacity>}
                    </View>
                {
                    !isTablet() &&  <View style={[style.row,style.mt15]}>
                        <View style={style.contant}>
                            <Text style={[style.font14,style.grayText]}>EMAIL ADDRESS</Text>
                            <Text style={[style.font16]}>{e?.email}</Text>
                        </View>
                        <View style={{justifyContent:'center'}}>
                        <TouchableOpacity style={[style.button]} onPress={()=>setSelectMember(e)}>
                            <Text style={style.buttonTxt}>View Profile</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                }
             </View>
             )
            ):(
              <View style={[style.centerItem,style.centerBox,style.mtb20]}>
              <Text style={style.font16}>No crew members available</Text>
              </View>
            )
            } 
        </View> : null}
        </View>
                  
            </ScrollView> )
    }


    const selectImage = async() => {
        const result = await launchImageLibrary({mediaType:'photo'});
    };

    return <View style={style.contant}>
      {!addCrew ? <View style={style.contant}>
        {
          !isAddBoat &&  !selectMember && <View style={style.contant}>
                <View style={[style.contentBetween,styles.bottomBar]}>
                  
                <TabBox data={tabData} selectedTab={selectedTab} onTab={(tab:string)=>{setSelectedTab(tab);}}/>

                    {/* <Text style={[isTablet()?style.font24:style.font16,style.primaryText,style.boldTxt,style.contant,style.mt10]}>My Boats</Text>

                    <Text style={[isTablet()?style.font24:style.font16,style.primaryText,style.boldTxt,style.contant,style.mt10]}>Crewed on</Text> */}
               

                    <TouchableOpacity onPress={()=>{
                         setSelBoat(null);
                         setIsAddBoat(true);
                         }} style={[style.button,style.primaryLayout,style.row]}>
                        <Text style={[style.font14,style.whiteText,style.mr30]}>Add Boat</Text>
                        <Icon name='plus' size={isTablet()?20:16} color={COLORS.WHITE} ></Icon>
                    </TouchableOpacity>
                </View>
                {isLodering ? 
                <View style={[style.centerBox,style.mt40]}>
                <ActivityIndicator style={style.centerItem} color={COLORS.PRIMARY} />
                </View> :
                 selectedTab == "My Boats" ?
                  <ScrollView showsVerticalScrollIndicator={false}>
                {boatsData && boatsData.length > 0 ?
                <FlatList
                data={boatsData}
                renderItem={renderPhoneBoatList}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
                /> : 
                <View style={[style.centerItem,style.centerBox,style.mt40]}>
                  <Text style={style.font16}>No Boats Found</Text>
                  </View>}
                  
                </ScrollView>:
                selectedTab ==  "Crewed on" && 
                <ScrollView showsVerticalScrollIndicator={false}>
                  {jointsBoatList && jointsBoatList.length > 0 ?
                  <FlatList
                  data={jointsBoatList}
                  renderItem={renderPhoneBoatList}
                  removeClippedSubviews={false}
                  showsVerticalScrollIndicator={false}
                  /> : 
              <View style={[style.centerItem,style.centerBox,style.mt40]}>
                <Text style={style.font16}>No Records Found</Text>
                </View>}
                
              </ScrollView>
                }
            </View>
       } 
       {
         isAddBoat && <AddBoat selBoat={selBoat} setSelBoat={setSelBoat} updateSuccess={updateSuccess} setUpdateSuccess={setUpdateSuccess} setIsAddBoat={setIsAddBoat} isAddBoat={isAddBoat}></AddBoat>
       }
      {
        selectMember && <ScrollView showsVerticalScrollIndicator={false}>
              <View style={style.row}>
             <TouchableOpacity  
            onPress={()=>setSelectMember(null)}
            style={[style.row,style.mtb10,style.centerBox]} >
              <IconBack name="chevron-left" size={25} color={COLORS.PRIMARY} />
              <Text style={[style.font14,style.primaryText]}>{selectedTab ==  "Crewed on" ? "Back to Crewed on" :"Back to my boats"}</Text>
            </TouchableOpacity>
            </View>
            <View style={[style.row]} >
              {selectMember?.member.profileUrl ? 
               <Image source={{uri:selectMember?.member.profileUrl}} alt="" style={styles.profileImage} resizeMode='cover'/> :
              <Image
              source={require("../../assets/avatarImage.png")}
              alt="img"
              style={[styles.profileImage]}
              resizeMode='cover'
            />  
              }
            <View style={style.contant}>
              <Text style={styles.memberSubText}>
                MEMBER NAME
              </Text>
              <Text
                style={[
                  styles.memberTitleText,style.font14,
                ]}>
                {selectMember?.member.firstName} {selectMember?.member.lastName}
              </Text>
              <Text
                style={[
                  styles.memberSubText
                ]}>
                DOB
              </Text>
              <Text style={[styles.memberTitleText]}>
                {selectMember?.member.dob ? dateFormat(selectMember?.member.dob) : "N/A"}
              </Text>
            </View>
          </View>
          <View style={[style.mtb10]} >
            <View>
              <Text style={styles.memberSubText}>Email</Text>
              <Text style={[styles.memberTitleText]}>{selectMember?.email ? selectMember?.email : "N/A"}</Text>
            </View>
            <View style={style.mt10}>
              <Text
                style={[styles.memberSubText]}>
                Membershiplevel
              </Text>
              <Text style={[styles.memberTitleText]}>{selectMember?.member.membershipLevel ? selectMember?.member.membershipLevel : "N/A"}</Text>
            </View>
          </View>

          {/* <View>
            <View style={styles.breakLine} />
            <View style={[style.row,{justifyContent:'space-between',marginBottom:20}]}>
              <View >
                <Text style={styles.memberSubText}>
                  BOAT OWNER
                </Text>
                <Text style={[styles.memberSubtitleText]}>
                  Tony Lame
                </Text>
              </View>
              <View >
                <Text style={[styles.memberSubText,styles.textRight]}>
                  CO-OWNER
                </Text>
                <Text style={[styles.memberSubtitleText,styles.textRight]}>
                  Drake Lume
                </Text>
              </View>
            </View>
            <View  style={[style.row,{justifyContent:'space-between',marginBottom:20}]}>
              <View>
                <Text style={styles.memberSubText}>
                  MODEL
                </Text>
                <Text style={[styles.memberSubtitleText]}>
                  328JKF3
                </Text>
              </View>
              <View >
                <Text style={[styles.memberSubText,styles.textRight]}>
                  HOME PORT
                </Text>
                <Text style={[styles.memberSubtitleText,styles.textRight]}>
                  Vessel Home Port
                </Text>
              </View>
            </View>
            <View style={[style.row,{justifyContent:'space-between',marginBottom:20}]}>
              <View>
                <Text style={styles.memberSubText}>YEAR</Text>
                <Text style={[styles.memberSubtitleText]}>
                  2017
                </Text>
              </View>
              <View >
                <Text style={[styles.memberSubText,styles.textRight]}>MAKE</Text>
                <Text style={[styles.memberSubtitleText,styles.textRight]}>
                  Vessel Manufar Deo
                </Text>
              </View>
            </View>
            <View style={[style.row,{justifyContent:'space-between',marginBottom:20}]}>
              <View >
                <Text style={styles.memberSubText}>
                  LENGTH
                </Text>
                <Text style={[styles.memberSubtitleText]}>
                  3244
                </Text>
              </View>
              <View >
                <Text style={[styles.memberSubText,styles.textRight]}>
                  COLOR
                </Text>
                <Text style={[[styles.memberSubtitleText,styles.textRight]]}>
                  RED, GREEN, YELLOW
                </Text>
              </View>
            </View>
          </View> */}
        </ScrollView>
      }
     
      <View>
      
        </View>
        <Modal isVisible={boatModal} animationIn={'zoomIn'} animationOut={'zoomOut'} onBackdropPress={()=>setboatModal(false)}>
            <View style={{padding:20,backgroundColor:COLORS.WHITE}}>
                    <TouchableOpacity onPress={()=>setboatModal(false)} style={{alignSelf:'flex-end'}}>
                    <Icon name="close" size={25} color="#000" />
                    </TouchableOpacity >
                    <View>
                        
                        <Text style={[style.textCenter,style.font20,style.mtb10,style.primaryText,style.boldTxt,style.mB30]}>Are you sure want to delete boat ?</Text>
                        <View style={[style.contentBetween,styles.mH]}>
                        <TouchableOpacity style={[style.button,style.borderRadius8,style.whiteLayout,styles.widthScreen]} onPress={() => setboatModal(false)}>
                        <Text style={[style.buttonTxt,style.PRIMARY,style.boldTxt,{fontSize:normalize(16),}]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.button,style.borderRadius8,style.primaryLayout,styles.widthScreen]} onPress={() => handleModalboat(advToBeDeleted)}>
                            {isLodering ? <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> :
                        <Text style={[style.buttonTxt,style.whiteText,style.boldTxt,{fontSize:normalize(16),}]}>Yes</Text>}
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                </View>
            </Modal>
    </View> :
    <View style={style.contant}>
       <AddCrew boatId={isVisible} addCrew={addCrew} setAddCrew={setAddCrew}/>
      </View>
    }
    </View>
    
}
export default MyBoats;
const styles = StyleSheet.create({ 
    textRight:{
        textAlign:'right'
      },
    memerLayout:{
        justifyContent:'space-between',marginBottom:10
      },
    favIcon:{
        borderColor:COLORS.GREY,borderWidth:1,borderRadius:10, 
        height:50, paddingHorizontal:15,justifyContent:'center',
        alignContent:'center',alignItems:'center'
      },
      favIconTxt:{
        fontSize:12,textAlign:'center'
      },
    breakLine :{
        height:2,
        maxWidth:'100%',
        backgroundColor: COLORS.SECONDARY,
        marginVertical:20
      },
      memberSubtitleText:{
        color:COLORS.BLACK,
        fontSize:normalize(12),
        lineHeight:25
      },
    botPick:{
        width:150,
        height:120,
        marginRight:10,
        resizeMode:'cover',
        borderRadius: 20,
        overflow: "hidden",
        marginTop:20
    },
    nameTitleTextStyle:{

    },

    line:{
        borderColor:COLORS.GREEN,
        borderBottomWidth:1,
        paddingBottom:15,
        paddingTop:10
    },
    profileImg:{
        width:normalize(isTablet()?100:50),
        height:normalize(isTablet()?80:40),
        resizeMode:'cover'
    },
    bottomBar:{
        borderColor:COLORS.GREEN,
        borderBottomWidth:1,
        paddingBottom:10
    },
    profileImage: {
        width: normalize(65),
        height:normalize(65),
        borderRadius: 8,
        marginRight: 10,
        resizeMode: 'center',
        borderWidth:1
      },
      memberSubText:{
        color:COLORS.GREY,
        fontSize:normalize(11),
        lineHeight:20,
      },  memberTitleText:{
        color:COLORS.LIGHT_BLACK,
        fontSize:normalize(12),
        lineHeight:20
      },
      valueCell: {
        flex: 2,
        textAlign: 'left',
        paddingHorizontal: 8,
        fontWeight:'600',
        color:COLORS.DARK_PRIMARY
      },
      valueCellName: {
        flex: 2,
        textAlign: 'left',
        paddingHorizontal: 8,
        color:COLORS.BLACK_50
      },
      primarybutton:{
        color:"#fff",
        backgroundColor:COLORS.GREY,
        justifyContent:"center",
        padding:4,
        borderRadius:4
        
      },
      primarybuttonSet: {
        color:"#fff",
        backgroundColor:COLORS.PRIMARY,
        justifyContent:"center",
        padding:4,
        borderRadius:4
      },
      mH:{
        marginHorizontal:Dimensions.get('screen').width * 0.07
      },
      widthScreen:{
        width:Dimensions.get('screen').width * 0.25
      },
      flexEnd:{
        alignContent:"flex-end",
        alignItems:"flex-end"
      }

})
