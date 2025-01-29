import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image,Dimensions } from "react-native";
import DeviceInfo from 'react-native-device-info';
import Menu from "../../routes/Menu";
import style from "../../styles/style";
import { normalize } from "../../styles/utilities/dimentions";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../../styles/theme/color";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addCrewMembersByBoatId, getAllMemberStatus, inviteCrewMembers } from "../../services/api/auth";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from 'react-native-paper';
import moment from "moment";
import RenderInput from "../BecomeMember/RenderInput";
import CheckBox from 'react-native-check-box';
import SearchComponent from "../../components/SearchComponent";
import ModalNative from "react-native-modal";
import FilterComponent from "../../components/FilterComponent";

const AddCrew = ({ isAddCrew, setAddCrew, boatId }) => {
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation();
  const [isLoader, setisLoader] = useState(false);
  const [noCrewText, setNoCrewText] = useState("No Member Found");
  const token = AsyncStorage.getItem('accessToken');
  const [membersList, setMembersList] = useState([]);
  const [addnewCrew, setAddNewCrew] = useState(false)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [searchTxt, setsearchTxt] = useState("");
  const [loader, setLoader] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [membersFilter, setMembersFilter] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const data = [
    { label: 'Name', value: 'name' },
    { label: 'Boat', value: 'boat' }
  ];
  const [value, setValue] = useState(data[0].value);

  useFocusEffect(
    React.useCallback(() => {
      getCrewAdvertisemnts();
    }, [])
  );
  
  useEffect(() => {
    let timeout;
    if (modalVisible) {
      timeout = setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [modalVisible]);


  const getCrewAdvertisemnts = async () => {
    setisLoader(true);
    try {
      const response = await getAllMemberStatus(boatId, token)
      if (response.status === 200) {
        setMembersList(response.data);
        setisLoader(false);
      }
    } catch (error) {
      console.error(error)
      setMembersList([])
    }
  }

  const handleSaveCrew = async (item) => {
    const payload = [
      {
        boatId: boatId,
        memberId: item.id
      }
    ]
    
    try {
      setisLoader(true)
      const response = await addCrewMembersByBoatId(payload, token);
     
      if (response.status === 200) {
        setisLoader(false)
      let member = membersList.map(item1 => {
       
        if (item1.id==item.id) {
       if(item1.isInvited == true){
        item1.isInvited = false
       }
       else{
        item1.isInvited = true
       }
        
        }
       
        return item1;
    });
        setMembersList(member)
      }
    } catch (error) {
      console.error(error)
      setisLoader(false)
    }
  }



  const inviteCrewMembersHandler = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setFirstNameError('')
    setLastNameError('')
    setEmailError('')
    setBackendError('')
    const payload = {
        boatId: boatId,
        firstName: firstName,
        lastName: lastName,
        email: email
      }
      let isValid = true
      if(firstName === ''){
        isValid = false
        setFirstNameError('First name is required')
      }if(lastName === ''){
        isValid = false
        setLastNameError('Last name is required')
      }if(email === ''){
        setEmailError('Email is required')
        isValid = false
      }else if(!emailRegex.test(email)){
        setEmailError('Enter valid email')
        isValid = false
      }
      if(isValid){
    try {
      setLoader(true)
      const response = await inviteCrewMembers(payload, token)
      if (response.status === 200) {
        setFirstName("")
        setLastName("")
        setEmail("")
        setModalVisible(true)
        setLoader(false)
        setAddNewCrew(false)
      }
    } catch (error) {
      console.error(error)
      setLoader(false)
      setBackendError("User already exists")
    }
  }
  }

let filteredList = [];
const filteredMember = membersList && membersList.filter(
  (item) => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    const searchLower = search.toLowerCase();
    return fullName.includes(searchLower) ||
        item.firstName?.toLowerCase().includes(searchLower) ||
        item.lastName?.toLowerCase().includes(searchLower);
}
);
filteredList = filteredMember || []



  const renderPhomeCrewList = ({ item, index }) => {
    return (
      <View style={[style.contant]}>
          <View>
            <View style={[style.contentBetween,style.mt7]}>
              <View style={[style.row]}>
                <View>
                  {item?.profileUrl ?
                    <Image style={[styles.profileImg]} source={{ uri: `${item?.profileUrl}` }} alt='img' /> :
                    <Image style={[styles.profileImg]} source={require("../../assets/avatarImage.png")} alt='img' />}
                </View>
                <View>
                  <Text style={styles.nameTitleStyle}>MEMBER NAME</Text>
                  <Text style={[styles.memberTitleText, {fontSize: normalize(15)}]}>{(item?.firstName || item?.lastName) ? `${((item?.firstName || 'N/A') + ' ' + (item?.lastName || 'N/A')).substring(0, 18)}${(((item?.firstName || 'N/A') + ' ' + (item?.lastName || 'N/A')).length > 18 ? '...' : '')}` :'N/A'}</Text>
                  <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                  <Text style={[styles.memberTitleText]}>{item?.boatName ? item?.boatName : "N/A"}</Text>
                </View>
              </View>
              <View>
                {item?.isInvited ?
                  <TouchableOpacity style={[style.row, style.mt10, style.centerItem, style.centerBox, styles.button, style.whiteLayout]} key={item.id}  onPress={() => handleSaveCrew(item)}>
                    <Text style={[style.font14, style.primaryText, styles.w100, style.centerItem, style.centerBox,]}>Undo</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={[style.row, style.mt10, style.centerItem, style.centerBox, style.primaryLayout, styles.button]} key={item.id} onPress={() => handleSaveCrew(item)}>
                    <Text style={[style.font14, style.whiteText, styles.w100]}>Invite</Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity style={[style.row, style.mt15, style.centerItem, style.centerBox]} onPress={() => navigation.navigate('MemberDetails', { id: item?.id, path: 'Profile' })}>
                  <Text style={[style.font14, style.primaryText]}>View more</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.line}></View>
          </View>
      </View>
    )
  }

  return (
    <View style={[style.contant]}>
      {!isTablet &&
        <View
          style={[style.mtb10,style.contant
          ]}>
          {!addnewCrew ?
            <View>  
                <TouchableOpacity style={[style.row, style.centerBox]} onPress={() => setAddCrew(false)}>
                  <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} />
                  <Text
                    style={[
                      styles.memberTitleText, style.font16, style.boldTxt, style.primaryText
                    ]}>
                    Back to my boats
                  </Text>
                </TouchableOpacity>    
              <View style={[style.mt5, style.contentBetween]}>
                <Text style={[style.font16, style.boldTxt, style.mt7]}>Add Crew Member</Text>
                <TouchableOpacity onPress={() => setAddNewCrew(true)}style={[style.primaryLayout, style.p10,{borderRadius:8}]} >
                  <Text style={[ style.whiteText]}>Add new crew +</Text>
                </TouchableOpacity>
              </View>
             
              <FilterComponent
              searchInput={search}
              onSearchBut={() => setsearchTxt(search)}
              onChangeText={(txt) => {
                setSearch(txt)
              }}
              placeholder={'Find member by name'}
              Buttonholder={'Search'}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              filter={false}
              departureDate={false}
              location={false}
              qualification={false}
              experience={false}
              data={membersList}
            />
             
                {isLoader ? (
                <View style={[style.mt40, style.contant]}>
                  <ActivityIndicator style={[style.mt40, style.centerBox]} color={COLORS.PRIMARY} />
                  </View>
                  ) : (

                   
                    <View style={[style.mB30]}>
                      {filteredList && filteredList.length > 0 ?
                      <FlatList
                      data={filteredList}
                      renderItem={renderPhomeCrewList}
                      keyExtractor={item => item.id.toString()}
                      style={[{height: Dimensions.get('screen').height*0.56}]}
                      />
                      :
                      <View style={[style.centerItem, style.centerBox,style.mt40]}>
                      <Text style={[style.font14,style.centerItem,style.mt40]}>{noCrewText}</Text>
                      </View>
                      }
                   </View>
                )}
              
              

            </View> :
            <View style={style.contant}>
              <View>
                <TouchableOpacity style={[style.row, style.centerBox]} onPress={() => setAddNewCrew(false)}>
                  <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} />
                  <Text
                    style={[
                      styles.memberTitleText, style.font16, style.boldTxt, style.primaryText
                    ]}>
                    Back to crew members
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={style.mH5}>
                <Text style={[style.font16, style.boldTxt, style.mt10]}>Add New Crew Member</Text>
              </View>
              <View style={styles.breakeLine} />
              <ScrollView style={style.contant}>
              <RenderInput
                name={"FIRST NAME"}
                placeholder={"Enter First Name"}
                required={true}
                value={firstName}
                setValue={setFirstName} 
                valueError={firstNameError} 
                setValueError={setFirstNameError} />
              <RenderInput
                name={"LAST NAME"}
                placeholder={"Enter Last Name"}
                required={true}
                value={lastName}
                setValue={setLastName}  
                valueError={lastNameError} 
                setValueError={setLastNameError}/>
              <RenderInput
                name={"EMAIL"}
                placeholder={"Enter Email"}
                required={true}
                value={email}
                setValue={setEmail} 
                valueError={emailError} 
                setValueError={setEmailError}/>
                {backendError && <Text style={style.textDanger}>{backendError}</Text>}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btnStyleOutline, styles.submitBtn, style.mt20]} onPress={inviteCrewMembersHandler}>
                {loader ? <ActivityIndicator theme={{ colors: COLORS.WHITE }} />
                  :
                  <Text style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>
                    Submit
                  </Text>
                }
              </TouchableOpacity>
              </ScrollView>
            </View>}
        </View>
      }
      <ModalNative 
               animationIn={'zoomIn'}
               animationOut={'zoomOut'}
               isVisible={modalVisible}
               backdropColor='rgba(0, 0, 0, 0.3)'>  
               <View style={[style.p20,style.whiteLayout]}>
                <Text style={styles.modalText}>
                  Invitation request sent
                </Text>
               </View>
              </ModalNative>
    </View>
  )
}
export default AddCrew;

const styles = StyleSheet.create({
  memberTitleText: {
    color: COLORS.LIGHT_BLACK,
    fontSize: normalize(12),
    lineHeight: 25
  },
  contant: {
    flex: 2
  },
  profileImg: {
    width: normalize(65),
    height: normalize(65),
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'contain',
    borderWidth:1,
    borderColor:COLORS.LIGHTGREY
  },
  nameTitleStyle: {
    color: COLORS.GREY,
    fontSize: normalize(11),
  },
  nameTitleTextStyle: {
    color: COLORS.BLACK,
    fontSize: normalize(14),
    fontWeight: "600",
    lineHeight: 25,
    maxWidth: 200
  },
  breakeLine: {
    height: 0.6,
    maxWidth: '100%',
    backgroundColor: COLORS.PRIMARY,
    marginBottom: normalize(10),
    marginTop: normalize(10)
  },
  submitBtn: {
    backgroundColor: COLORS.PRIMARY,
    height: normalize(40),
    width: '100%'
  },
  btnStyleOutline: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(10),
    marginBottom: normalize(5),
    borderRadius: normalize(8),
    marginRight: 'auto',
    height: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexEnd: {
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  button: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 0.4,
    borderRadius: 8,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  container:{
    flex:1,
    marginTop:normalize(5),
    marginBottom:normalize(5),
},
layoutboxMobile:{
  marginHorizontal:10,
  marginVertical:2,
  padding:10
},
line:{
  borderBottomWidth:1,
  marginTop:7,
  borderColor:COLORS.BORDERGREY
}
})