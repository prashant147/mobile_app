import { StyleSheet, Text, View,FlatList,Image, TouchableOpacity,Modal, ScrollView, Dimensions, TouchableHighlight } from 'react-native'
import React, { useEffect, useState,useRef, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import SearchComponent from '../../components/SearchComponent';
import COLORS from '../../styles/theme/color';
import { SCREEN_HEIGHT, normalize, scaleWidth } from '../../styles/utilities/dimentions';
import { boatList,boatsLocation } from '../../styles/utilities/constants';
import fs from 'react-native-fs';
import {decode} from 'base64-arraybuffer';
//@ts-ignore

import Icon from "react-native-vector-icons/Feather";
import style from '../../styles/style';
import DeviceInfo, { isTablet } from 'react-native-device-info';
import MapView, { Marker, Callout} from 'react-native-maps';
import FilterComponent from '../../components/FilterComponent';
import { useNavigation} from '@react-navigation/native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabBox from '../../components/TabBox';
import { getAllCaptainCrewAdvertisements,getMember, becomeCrew,deleteAdvertisedCrew,updateBecomeCrew, advertiseCrewCloseVacancy, darftCloseAdvertiseCrew, findBoatFilters } from '../../services/api/auth';
import RenderInput from '../BecomeMember/RenderInput';
import RenderDropdown from '../BecomeMember/RenderDropdown';
import MembersContext from '../Members/MembersContext';
import { ActivityIndicator } from 'react-native-paper';
import Config from 'react-native-config';
import s3 from '../../services/aws-config';
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ModalNative from "react-native-modal";
import DateTimePickerBox from '../../components/dateTimeBox';
import DocumentPicker from 'react-native-document-picker'
import { dateFormat } from '../../styles/utilities/variables';

const FindBoat = ({isAddBoat,setIsAddBoat,editCrew,setEditboat,setActiveTab,setEditCrew,isDarft,setIsDraft}:any) => {
  const isTablet = DeviceInfo.isTablet();
  const {loggedInUser,setChatData } = useContext(MembersContext); 
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState<number>(5);
  const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2);
  const { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  const [searchTxt, setsearchTxt]=useState<string>("");
  const [locationTxt, setLocationTxt]=useState<string>("");
  const [dateTxt, setDateTxt]=useState('');
  const [dateTxtFrom, setDateTxtFrom]=useState('');
  const [dateTxtTo, setDateTxtTo]=useState('');
  const [qualificationTxt, setQualificationTxt]=useState<string>("");
  const [experienceTxt, setExperinceTxt]=useState<string>("");
  const [search, setSearch]=useState<string>("");
  const [boat, setBoat]=useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleForError, setmodalVisibleForError] = useState(false);
  
  const [locateMap, setLocateMap] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState({});
  const [showFilter,setShowFilter]=useState(false)
  const navigation = useNavigation();
  const [doc, setDoc] = useState(null);
  const [description,setDescription] = useState('');
  const [myAdv, setMyAdv] = useState<any>();
  const token = AsyncStorage.getItem('accessToken');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [overview, setOverView] = useState('');
  const [rallyDateFrom, setRallyDateFrom] = useState<any>('');
  const [rallyDateTo, setRallyDateTo] = useState<any>('');
  const [rallyDateError, setrallyDateError] = useState("");
  const [sailingExperience, setSailingExperience] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [smokingPreferences, setSmokingPreferences] = useState(false);
  const [isLoader, setisLoader] = useState(false);
  const [noBoatsText, setNoBoatsText] = useState("");
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [sailingExperienceError, setSailingExperienceError] = useState('');
  const [phoneNoError, setPhoneNoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [beError, setBeError] = useState("");
  const [becomeCrewLoader, setbecomeCrewLoader] = useState(false);
  const [loading, setLoading] = useState('');
  const [becomeCrewId,setBecomeCrewId] = useState('')
  const smokingPrefData = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  const [deleteAdvCrew, setDeleteAdvCrew]= useState(false);
  const [deleteModal, setDeleteModal]= useState(false);
  const [advToBeDeleted, setAdvToBoDeleted] = useState<any>();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const [draftList, setDarftList] = useState([]);
  const [closeList, setCloseList] = useState([]);

  const [selectedTab, setSelectedTab] = useState('Advertisements');
  let tabData = ["Advertisements","Draft Vacancy","Closed Vacancy"]
 const [loader, setLoader] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
 
  const [isSelectList,setIsSelectList ] = useState();

  const [errorMsg,setErrorMsg ] = useState()
  // Function to toggle modal visibility
  const toggleCloseVaccancyModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(!isModalVisible);
    togglePopover(item);
  };


    

    const getBoatDetailsHandler =()=>{
      setFirstName(loggedInUser?.firstName)
      setLastName(loggedInUser?.lastName)
      setEmail(loggedInUser?.username)
      setPhoneNo(loggedInUser?.phoneNumbers[0]?.phoneNumber ? loggedInUser?.phoneNumbers[0]?.phoneNumber : " ")
      setDoc(loggedInUser?.attachments ? loggedInUser?.attachments : "")
    }

    const pickFile = async () => {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.doc,DocumentPicker.types.pdf,DocumentPicker.types.docx],
        });
    
        const file = res[0]; // Take only the first file if multiple are picked
    
        // Prepare content disposition header
        const contentDisposition = 'inline; filename="' + file.name + '"';
    
        // Read file data and convert to ArrayBuffer
        const base64 = await fs.readFile(file.uri, 'base64');
        const arrayBuffer = await decode(base64);
    
        // Prepare S3 upload parameters
        const params = {
          Bucket: Config.BUCKET_NAME,
          Key: `${Config.DIRECTORY_NAME}/${loggedInUser.id}/${file.name}`,
          Body: arrayBuffer,
          ContentDisposition: contentDisposition,
          ContentType: file.type,
        };
    
        // Perform S3 upload
        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading file:", err);
          } else {
            console.log("File uploaded successfully:", data);
            // You can save the file URL in your database or use it as needed.
          }
        });
    
        // Update document state with the uploaded file
        const uploadedFile = {
          fileName: file.name,
          uploadUrl: `${Config.DIRECTORY_URL}/${Config.DIRECTORY_NAME}/${loggedInUser.id}/${file.name}`,
          uploaded: true,
        };
        setDoc([uploadedFile]); // Set doc as an array with the uploaded file
    
      } catch (error) {
        console.error("Error picking/uploading file:", error);
        // Handle error
      }
    };

    const removeDocument = (index) => {
      const updatedDocuments = [...doc];
      updatedDocuments.splice(index, 1);
      setDoc(updatedDocuments);
    };

  const renderModal = () => (
    <ModalNative
    animationIn={'zoomIn'} 
    animationOut={'zoomOut'}
    backdropColor='rgba(0, 0, 0, 0.2)'
    isVisible={isModalVisible}
    style={{borderRadius:8}}
    >
      <View style={{padding:15,backgroundColor:COLORS.WHITE,borderRadius:8}}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={style.alignSelfEnd}>
              <AntIcon name="close" size={25} color="#000" />
            </TouchableOpacity>
      <View>
        <Text style={[style.textCenter, style.font20, style.mtb10,{color:COLORS.PRIMARY},style.mb30, style.boldTxt]}>Are you sure you want to close vaccancy for <Text style={{color:COLORS.ORANGE}}>{selectedItem?.boatName}</Text>  advertisement?</Text>
        <View style={[style.mH20, style.contentBetween,{marginHorizontal: 60},style.mt10]}>
                <TouchableOpacity style={[style.button, style.whiteLayout,style.width100, style.mH10]} onPress={() => setIsModalVisible(false)}>
                <Text style={[style.buttonTxt,style.PRIMARY,style.boldTxt,{fontSize:normalize(16),}]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.button,style.primaryLayout,style.width100]} onPress={closeBoatVaccancy}>
                 <Text style={[style.buttonTxt, style.borderRadius8, style.whiteText,style.boldTxt,{fontSize:normalize(16)}]}>Yes</Text>
                </TouchableOpacity>
              </View>
      </View>
      </View>
    </ModalNative>
  );

  const closeBoatVaccancy =async(data:any)=>{
    const request ={
      id: selectedItem?.id,
      isClosed: true
    }
    
    try {
      const response = await advertiseCrewCloseVacancy(request, token);
      if(response.status === 200){
        setDeleteAdvCrew(true);
        setIsModalVisible(false);
        getAllClosedList();
      }
    } catch (error) {
      console.error(error);
      setIsModalVisible(false);
    }
   }
  const postBoatVaccancy =async(itemId:any)=>{
    const request ={
      id: itemId,
      isDraft: false
    }
    try {
      const response = await advertiseCrewCloseVacancy(request, token);
            
      if(response.status === 200){
        getAllDraftList();
        getAllCrewAds()
        setSelectedTab("Advertisements");
      }
    } catch (error) {
      console.error(error);
      setIsModalVisible(false);
    }
   }

   const getAllDraftList =async()=>{
    try {
      const response = await darftCloseAdvertiseCrew('Draft',token);
      if(response.status === 200){
        if(response.data[0]?.message === "No Records Found"){
          setDarftList([])
        }
        else{
        setDarftList(response.data);
      }
    }
    } catch (error) {
      console.log('error sdfs',error);
    }
   }


   const getAllClosedList =async()=>{
    try {
      const response = await darftCloseAdvertiseCrew('Closed',token);
      if(response.status === 200){
        if(response.data[0]?.message === "No Records Found"){
          setCloseList([])
        }
        else{
        setCloseList(response.data);
      }
    }
    } catch (error) {
      console.log('error sdfs',error);
      
    }
   }
  
  const togglePopover = async(item:any) => {
    setIsPopoverVisible(!isPopoverVisible);
    await setIsSelectList(item);
    
  };




  useEffect(() => {
   
  if(editCrew){    
    
    setBecomeCrewId(editCrew.id)
    setFirstName(editCrew.firstName)
    setLastName(editCrew.lastName)
    setOverView(editCrew.overview)
    setSailingExperience(editCrew.sailingExperience) 
    setDietaryRequirements(editCrew.dietryRequirements)
    setPhoneNo(editCrew.phoneNumber)
    setEmail(editCrew.email)
    setSmokingPreferences(editCrew.smokingPreferences)
    setDoc(editCrew?.attachments)
    const dates = editCrew?.availableDates.split(',')
    const date1 = dates[0]
    const date2 = dates[1]
    setRallyDateFrom(new Date(date1));
    setRallyDateTo( dates.length > 1 ? new Date(date2) :'');

    
  }
  },[editCrew])
  const toggleModal = (index) => {
    setModalVisible(!modalVisible);
    setmodalVisibleForError(!modalVisibleForError)
    setIsRequestSent({
      ...isRequestSent,
      [index]: true,
    });
  };



  useEffect(() => {
    let timeout;
    if (modalVisible || modalVisibleForError) {
      timeout = setTimeout(() => {
        setModalVisible(false);
        setmodalVisibleForError(false);
        setIsAddBoat(false)
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [modalVisible, modalVisibleForError]);


  useEffect(() => {
  getAllCrewAds();
  getAllDraftList();
 },[deleteAdvCrew,dateTxtFrom,dateTxtTo]);

 useFocusEffect(
  React.useCallback(()=>{
    getAllCrewAds();
  },[])
)

const loadCrewAd = async () => {
  try {
    const response = await getAllCaptainCrewAdvertisements(token);
    setisLoader(false);
    if(response.status === 200){
      if(response.data[0]?.message === "You have no Advertisements"){
        setBoat([]);
        setNoBoatsText("No advertisements");
        setMyAdv([]);
      }
      else{ 
        const modifiedData = response.data.filter(item => {
          const rallyDates = item.rallyDate.split(',');
          const secondRallyDate = moment(rallyDates[1]);
          const isSecondDatePast = secondRallyDate.isSameOrAfter(moment());
    
          return isSecondDatePast ;
        });
        setBoat(response.data);
        setMyAdv(modifiedData);
        setisLoader(false);
      }
    }
  }catch (error) {
    setMyAdv([]);
    console.error(error);
  }
}


 const getAllCrewAds = async () => {
  setisLoader(true);
  if(dateTxtFrom && dateTxtTo ){
    const payload = {
      "departureDateFrom": !isNaN(new Date(dateTxtFrom)) ? moment(dateTxtTo).format('YYYY-MM-DD') :'',
    "departureDateTo": !isNaN(new Date(dateTxtTo)) ? moment(dateTxtTo).format('YYYY-MM-DD') :''
     
    }
    try {
      const response = await findBoatFilters(payload,token)
      
    if(response.status === 200){
      if(response.data[0]?.message === "No Records Found"){
        setBoat([]);
        setNoBoatsText("No advertisements");
        setMyAdv([]);
        setisLoader(false);
      }
      else{
      
        setBoat(response.data);
        setMyAdv(response.data);
        setisLoader(false);
      }
    }
  }catch (error) {
    setMyAdv([]);
    console.error(error);
  }
  }
  
  else{
    loadCrewAd();
}
};
useEffect(() => {
  getAllDraftList();
  getAllClosedList();
  getAllCrewAds();
 

},[])

  const navigationHandlerWithParam = (path, id) => {
    navigation.navigate(path, { id });
  }
  const renderBoatList =({item,index}:any)=>{
    const isSent = isRequestSent[index];
      return (
        <View style={[styles.line, style.row]}>
          <Image source={item?.image} style={styles.profileImg} resizeMode='cover'/>
          <View style={[style.contant, {paddingHorizontal: 20}]}>
            <View style={[style.row, {flexDirection: 'row', flexWrap: 'wrap'}]}>
              <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.boatName}</Text>
              </View>
              <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.captain}</Text>
              </View>
              <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                <Text style={styles.nameTitleStyle}>CO-OWNER</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.coOwner}</Text>
              </View>
              <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                <Text style={styles.nameTitleStyle}>BOAT OWNER</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.boatOwner}</Text>
              </View>
              <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                <Text style={styles.nameTitleStyle}>HOME PORT</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.homePort}</Text>
              </View>
            </View>
            <View
              style={[
                style.row,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>MODEL NO.</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.modelNo}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>MAKE YEAR</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.makeYear}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>MAKE</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.make}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>LENGTH</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.length}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>WIDTH</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.width}</Text>
              </View>
            </View>
          </View>

          <View style={{justifyContent: 'center',}}>
            <TouchableOpacity
              style={[
                style.button,
                style.borderRadius8,
                {width:150}
              ]}
              onPress={() => toggleModal(index)}
              disabled={isSent}>
              <Text style={styles.btnTextStyle}>
                {isSent ? 'Requested' : 'Request'}
              </Text>
            </TouchableOpacity>
           
            
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            style={styles.modelUser}
            visible={modalVisible}
            onRequestClose={toggleModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Request has been sent successfully
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      );
  }
 const deleteBoatAdv = async(data:any) => {
  try {
    setDeleteAdvCrew(false);
    const response = await deleteAdvertisedCrew(data.id, token)
    if(response.status === 200){
      setDeleteAdvCrew(true);
      setDeleteModal(!deleteModal);
    }
  }catch (error){
    console.error(error);
  }

 }

 const renderDraftPhoneList =({item,index}:any)=>{
  // const isSent = isRequestSent[index];
    return(
      <View style={[{justifyContent:'space-between'},style.mB10]}>
        <View  style={[styles.line, style.contentBetween]}>
          <View style={style.row}>
          {item?.imageUrl ? 
          <Image source={{uri :item?.imageUrl}} style={[styles.profileImg,style.mt10]} resizeMode='cover'/> :
          <Image style={[styles.profileImg,style.mt10]} source={require("../../assets/blue_sailboat.png")} alt='img' resizeMode='cover'/>
            }
            <View>
                <View style={style.mt10}>
                      <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                      <Text style={styles.nameTitleTextStyle}>{item?.boatName?.length > 18 ? item?.boatName.slice(0,18) + "..." : item?.boatName}</Text>
                  </View>
                  <View>
                      <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                      <Text style={styles.nameTitleTextStyle}>{item?.boats?.captain ? item?.boats?.captain : "N/A"}</Text>
                  </View>
            </View>
            </View>
          <View>
             {loggedInUser?.id === item?.member?.id && !item.isClosed && (
              <View style={[styles.popContainer,style.mt10,style.row]}>
                <TouchableOpacity onPress={() => {setEditboat(item); setIsDraft(true)}} style={[style.mr10]}>
                  <Icon name="edit" color={COLORS.PRIMARY} size={25}/>
                </TouchableOpacity>

                <TouchableOpacity style={style.pH10} onPress={() =>{setDeleteModal(true); setAdvToBoDeleted(item)}}>
                <Icon name="trash-2" color={COLORS.RED} size={25}/>
                </TouchableOpacity>
            
              </View>)}

             {/* {loggedInUser?.id === item?.member?.id && isPopoverVisible && (
              <View style={styles.popoverContainer}>
               <View style={styles.arrow} />
                <View style={styles.popoverContent}>
                 <TouchableOpacity onPress={() => {setEditboat(item); setIsDraft(true)}}>
                  <Text style={{color:COLORS.GREY}}>Edit Post</Text>
                  <Icon name="edit" color={COLORS.PRIMARY} size={25}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAdvToBoDeleted(item)}>
                 <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
            )} */}
         </View>
            </View>
        <View style={[style.contentBetween]}>
            <View>
              <Text style={styles.nameTitleStyle}>OWNER</Text>
              <Text style={styles.nameTitleTextStyle}>{item?.owner ? item?.owner : "N/A"}</Text>
            </View>
            <View>
              <Text style={styles.nameTitlePhoneStyle}>CO-OWNER</Text>
              <Text style={styles.nameTitlePhoneTextStyle}>{item?.boats?.coOwner ? item?.boats?.coOwner : "N/A"}</Text>
            </View>
        </View>
        <View style={[style.contentBetween,style.mt10]}>
              <View>
                <Text style={styles.nameTitleStyle}>HOME PORT</Text>
                <Text style={[styles.nameTitleTextStyle]}>
                {item?.boats?.homePort ? item?.boats?.homePort : "N/A"}
                </Text>
              </View>
              <View>
              <Text style={styles.nameTitlePhoneStyle}>POSITION</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>
                  {item?.position ? item?.position : "N/A"}
                </Text>
              </View>
        </View>
        <View style={[style.contentBetween,style.mt10]}>
            <View>
                <Text style={styles.nameTitleStyle}>ROUTE FROM</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.routeFrom}</Text>
            </View>
            <View >
                <Text style={styles.nameTitlePhoneStyle}>ROUTE TO</Text>
                <Text style={[styles.nameTitlePhoneTextStyle]}>{item?.routeTo}</Text>
            </View>
        </View>
        <View style={[style.row,style.mt10,{justifyContent:'space-between'}]}>
            <View>
              <Text style={styles.nameTitleStyle}>CREW VACANCY</Text>
              <Text style={styles.nameTitleTextStyle}>{item?.crewVacancy}</Text>
            </View>
            <View>
              <Text style={styles.nameTitlePhoneStyle}>CREW SOLICITED</Text>
              <Text style={styles.nameTitlePhoneTextStyle}>{item?.crewsSolicited ? item?.crewsSolicited : "N/A"}</Text>
             </View>
        </View>
        <View style={[style.contentBetween,style.mt10]}>
            <View >
                <Text style={styles.nameTitleStyle}>RALLY DATES</Text>
                <Text style={styles.nameTitleTextStyle}>{dateFormat(item?.rallyDate?.split(',')[0])+ ' to ' + dateFormat(item?.rallyDate?.split(',')[1])} </Text>
            </View>
            <View>
                <Text style={styles.nameTitlePhoneStyle}>DIETRY RESTRICTION</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>{item?.restrictions ? item?.restrictions : "N/A"}</Text>
            </View>
        </View>
        <View style={[style.contentBetween,style.mt10]}>
            <View>
                <Text style={styles.nameTitleStyle}>EXPENSE</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.costOfCrewMember}</Text>
            </View>
            <View>
                <Text style={styles.nameTitlePhoneStyle}>PHONE NO</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>{item?.phoneNumber}</Text>
            </View>
        </View>
        <View style={[style.mt10]}>
            <View >
                <Text style={styles.nameTitleStyle}>EMAIL</Text>
                <Text style={[styles.descriptionTextStyle]}>{item?.email?.length > 25 ? item?.email?.substring(0,25).concat('...') : item?.email}</Text>
            </View>
        </View>
        <View style={[style.mt10, style.mB10]}>
          <Text style={styles.nameTitleStyle}>DESCRIPTION</Text>
          <View style={style.row}>
            <Text style={[style.font16]}>{item?.description ? item.description :'N/A'}</Text>
          </View>
        </View>
        {loggedInUser?.id === item?.member?.id && !item.isClosed &&  (
           <View style={[{ justifyContent: 'center' }, style.mB10 ]}>
            <TouchableOpacity style={styles.btnStyless} onPress={()=>postBoatVaccancy(item?.id)}>
             <Text style={[styles.btnTextStyle, { color: COLORS.WHITE }]}>Post Vacancy</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <Modal
      animationType="fade"
      transparent={true}
      style={styles.modelUser}
      visible={modalVisible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          {/* <TouchableOpacity style={styles.closeButton} onPress={toggleModalClose}>
            <Icon name="x" size={24} color="black" />
          </TouchableOpacity> */}
          <Text style={styles.modalText}>Request has been sent successfully</Text>
        </View>
      </View>
    </Modal>
    <ModalNative
     animationIn={'zoomIn'} 
     animationOut={'zoomOut'}
      isVisible={deleteModal}
      backdropColor='rgba(0, 0, 0, 0.2)'
      style={{borderRadius:8}}
      >
                        <View style={{paddingHorizontal:20,backgroundColor:COLORS.WHITE,borderRadius:8,paddingVertical:10}}>
          <TouchableOpacity onPress={() => setDeleteModal(false)} style={style.alignSelfEnd}>
            <AntIcon name="close" size={25} color="#000" />
          </TouchableOpacity>
          <View>
            <Text style={[style.textCenter, style.font20, style.mtb10,{color:COLORS.PRIMARY},style.mb30, style.boldTxt]}>Are you sure want to delete {advToBeDeleted?.boatName.length > 17 ? advToBeDeleted?.boatName.slice(0,15) + "..." : advToBeDeleted?.boatName} advertisement ?</Text>
            <View style={[style.mH20, style.contentBetween,{marginHorizontal: 60}]}>
              <TouchableOpacity style={[style.button, style.whiteLayout,style.width100, style.mH10]} onPress={() => setDeleteModal(false)}>
              <Text style={[style.buttonTxt,style.PRIMARY,style.boldTxt,{fontSize:normalize(16),}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[style.button, style.primaryLayout,style.width100]} onPress={() => deleteBoatAdv(advToBeDeleted)}>
               <Text style={[style.buttonTxt, style.borderRadius8, style.whiteText,style.boldTxt,{fontSize:normalize(16)}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ModalNative>
      {isModalVisible && renderModal()}
      </View>
    )
}
 
const navMsg = (item:any) => {
  setChatData({id:item.member.id,type:'user'})
  navigation.navigate("WebChat")
}
  const renderBoatPhoneList =({item,index}:any)=>{
    const isSent = isRequestSent[index];
  
      return (
        <TouchableHighlight
          underlayColor="none"
          onPressIn={() => setIsPopoverVisible(false)}
        >
          <View style={{ justifyContent: "space-between" }}>
            <View style={[styles.line, style.contentBetween]}>
              <View style={style.row}>
                {item?.imageUrl ? (
                  <Image
                    source={{ uri: item?.imageUrl }}
                    style={[styles.profileImg, style.mt10]}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    style={[styles.profileImg, style.mt10]}
                    source={require("../../assets/blue_sailboat.png")}
                    alt="img"
                    resizeMode="cover"
                  />
                )}
                <View>
                  <View style={style.mt10}>
                    <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                    <Text style={styles.nameTitleTextStyle}>
                      {item?.boatName?.length > 18
                        ? item?.boatName.slice(0, 18) + "..."
                        : item?.boatName}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                    <Text style={styles.nameTitleTextStyle}>
                      {item?.boats?.captain ? item?.boats?.captain : "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                {loggedInUser?.id === item?.member?.id && (
                  <View style={[styles.popContainer, style.mt10]}>
                    <TouchableOpacity onPress={() => togglePopover(item)}>
                      <MaterialIconCommunity
                        name="dots-vertical"
                        size={28}
                        color={COLORS.DARK_PRIMARY}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                <View>
                  <View style={[styles.btnsAlignment, style.mt10]}>
                    <TouchableOpacity
                      onPress={() => navMsg(item)}
                      style={[
                        styles.userIcons,
                        { borderColor: COLORS.PRIMARY },
                      ]}
                    >
                      <Icon
                        name="message-square"
                        size={25}
                        color={COLORS.PRIMARY}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {loggedInUser?.id === item?.member?.id &&
                  item?.boatName == isSelectList?.boatName &&
                  isPopoverVisible && (
                    <View style={styles.popoverContainer}>
                      <View style={styles.arrow} />
                      <View style={styles.popoverContent}>
                        <TouchableOpacity
                          onPress={() => {
                            setEditboat(item);
                            setIsDraft(false);
                          }}
                        >
                          <Text style={{ color: COLORS.GREY }}>Edit Post</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => toggleCloseVaccancyModal(item)}
                          style={[style.mtb10]}
                        >
                          <Text style={{ color: COLORS.GREY }}>
                            Close Vacancy
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setDeleteModal(true);
                            setAdvToBoDeleted(item);
                          }}
                        >
                          <Text style={{ color: COLORS.GREY }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
              </View>
            </View>
            <View style={[style.contentBetween]}>
              <View>
                <Text style={styles.nameTitleStyle}>OWNER</Text>
                <Text style={styles.nameTitleTextStyle}>
                {item?.owner ? item?.owner : "N/A"}  
                </Text>
              </View>
              <View>
                <Text style={styles.nameTitlePhoneStyle}>CO-OWNER</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>
                {item?.boats?.coOwner ? item?.boats?.coOwner : "N/A"}
                </Text>
              </View>
            </View>
            <View
              style={[
                style.contentBetween,
                style.mt10,
              ]}
            >
              <View>
                <Text style={styles.nameTitleStyle}>HOME PORT</Text>
                <Text style={[styles.nameTitleTextStyle]}>
                {item?.boats?.homePort ? item?.boats?.homePort : "N/A"}
                </Text>
              </View>
              <View>
              <Text style={styles.nameTitlePhoneStyle}>POSITION</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>
                  {item?.position ? item?.position : "N/A"}
                </Text>
              </View>
            </View>
            <View style={[style.contentBetween,style.mt10]}>
            <View>
                <Text style={styles.nameTitleStyle}>ROUTE FROM</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.routeFrom}</Text>
            </View>
            <View >
                <Text style={styles.nameTitlePhoneStyle}>ROUTE TO</Text>
                <Text style={[styles.nameTitlePhoneTextStyle]}>{item?.routeTo}</Text>
            </View>
        </View>
            <View
              style={[
                style.contentBetween,
                style.mt10,
              ]}
            >
              <View>
                <Text style={styles.nameTitleStyle}>CREW VACANCY</Text>
                <Text style={styles.nameTitleTextStyle}>
                  {item?.crewVacancy}
                </Text>
              </View>
              <View>
              <Text style={styles.nameTitlePhoneStyle}>CREW SOLICITED</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>
                  {item?.crewsSolicited ? item?.crewsSolicited : "N/A"}
                </Text>
              </View>
            </View>
            <View
              style={[
                style.contentBetween,
                style.mt10
              ]}
            >
              <View>
                <Text style={styles.nameTitleStyle}>RALLY DATES</Text>
                <Text style={styles.nameTitleTextStyle}>
                  {dateFormat(item?.rallyDate?.split(",")[0]) +
                    " to " +
                    dateFormat(item?.rallyDate?.split(",")[1])}
                </Text>
              </View>
              <View>
                <Text style={styles.nameTitlePhoneStyle}>
                  DIETRY RESTRICTION
                </Text>
                <Text style={styles.nameTitlePhoneTextStyle}>
                  {item?.restrictions ? item?.restrictions : "N/A"}
                </Text>
              </View>
            </View>
            <View
              style={[
                style.contentBetween,
                style.mt10,
              ]}
            >
              <View>
                <Text style={styles.nameTitleStyle}>EXPENSE</Text>
                <Text style={styles.nameTitleTextStyle}>
                  {item?.costOfCrewMember ? item?.costOfCrewMember : "N/A"}
                </Text>
              </View>
              <View>
                <Text style={styles.nameTitlePhoneStyle}>
                 PHONE NO
                </Text>
                <Text style={styles.nameTitlePhoneTextStyle}>
                  {item?.phoneNumber}
                </Text>
              </View>
            </View>
              <View style={[style.mt10]}>
                <Text style={styles.nameTitleStyle}>EMAIL</Text>
                <Text style={styles.descriptionTextStyle}>{item?.email} </Text>
              </View>
            <View style={[style.mt10, style.mB10]}>
              <Text style={styles.nameTitleStyle}>DESCRIPTION</Text>
              <View style={style.row}>
              <Text style={[styles.descriptionTextStyle]}>{item?.description ? item?.description : "N/A"}</Text>
              </View>
              {/* {
            item.isView && <View><Text style={[style.font16]}>{item?.description}</Text>
            <TouchableOpacity onPress={()=>onMoreView(item,false,index)}><Text style={[style.font14,style.primaryText]}>View Less</Text></TouchableOpacity></View>
          } */}
            </View>
            {loggedInUser?.id === item?.member?.id && (
              <View style={[{ justifyContent: "center" }, style.mB10]}>
                <TouchableOpacity
                  style={styles.btnStylessMobile}
                  onPress={() =>
                    navigationHandlerWithParam("MyApplications", item.id)
                  }
                >
                  <Text
                    style={[styles.btnTextStyle, { color: COLORS.PRIMARY }]}
                  >
                    View Applications
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {loggedInUser?.id !== item?.member?.id &&
            item.isRequested === false ? (
              <View style={[{ justifyContent: "center" }, style.mB15]}>
                <TouchableOpacity
                  style={styles.btnStylessMobile}
                  onPress={() =>
                    navigationHandlerWithParam("Registercrew", item.id)
                  }
                  disabled={item.isSecondDatePast}
                >
                  <Text
                    style={[
                      styles.btnTextStyle,
                      {
                        color: item.isSecondDatePast ? "#999" : COLORS.PRIMARY,
                      },
                    ]}
                  >
                    Request to Crew
                  </Text>
                </TouchableOpacity>
              </View>
            ) : loggedInUser?.id &&
              loggedInUser?.id !== item?.member?.id &&
              item.isRequested === true ? (
              <View style={[{ justifyContent: "center" }, style.mB10]}>
                <TouchableOpacity style={styles.btnStylessMobileRegister}>
                  {loader && (
                    <View
                      style={[
                        style.contant,
                        style.row,
                        style.centerItem,
                        style.centerItem,
                      ]}
                    >
                      <ActivityIndicator
                        theme={{ colors: { primary: COLORS.WHITE } }}
                      />
                    </View>
                  )}
                  {!loader && (
                    <Text
                      style={[
                        styles.btnTextStyle,
                        {
                          color: COLORS.WHITE,
                          backgroundColor: COLORS.PRIMARY,
                        },
                      ]}
                    >
                      Registered
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
          

            <Modal
              animationType="fade"
              transparent={true}
              style={styles.modelUser}
              visible={modalVisible}
              onRequestClose={toggleModal}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  {/* <TouchableOpacity style={styles.closeButton} onPress={toggleModalClose}>
              <Icon name="x" size={24} color="black" />
            </TouchableOpacity> */}
                  <Text style={styles.modalText}>
                    Request has been sent successfully
                  </Text>
                </View>
              </View>
            </Modal>
            <ModalNative
              animationIn={"zoomIn"}
              animationOut={"zoomOut"}
              isVisible={deleteModal}
              backdropColor="rgba(0, 0, 0, 0.3)"
              style={{ borderRadius: 8 }}
            >
              <View
                style={{
                  padding: 20,
                  backgroundColor: COLORS.WHITE,
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => setDeleteModal(false)}
                  style={style.alignSelfEnd}
                >
                  <AntIcon name="close" size={25} color="#000" />
                </TouchableOpacity>
                <View>
                  <Text
                    style={[
                      style.textCenter,
                      style.font20,
                      style.mtb10,
                      { color: COLORS.PRIMARY },
                      style.mb30,
                      style.boldTxt,
                    ]}
                  >
                    Are you sure want to delete{" "}
                    {advToBeDeleted?.boatName.length > 17
                      ? advToBeDeleted?.boatName.slice(0, 15) + "..."
                      : advToBeDeleted?.boatName}{" "}
                    advertisement ?
                  </Text>
                  <View
                    style={[
                      style.mH20,
                      style.contentBetween,
                      { marginHorizontal: 60 },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        style.button,
                        style.whiteLayout,
                        style.width100,
                        style.mH10,
                      ]}
                      onPress={() => setDeleteModal(false)}
                    >
                      <Text
                        style={[
                          style.buttonTxt,
                          style.PRIMARY,
                          style.boldTxt,
                          { fontSize: normalize(16) },
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        style.button,
                        style.primaryLayout,
                        style.width100,
                      ]}
                      onPress={() => deleteBoatAdv(advToBeDeleted)}
                    >
                      <Text
                        style={[
                          style.buttonTxt,
                          style.borderRadius8,
                          style.whiteText,
                          style.boldTxt,
                          { fontSize: normalize(16) },
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ModalNative>
            {isModalVisible && renderModal()}
          </View>
        </TouchableHighlight>
      );
  }
  const LocationMap = () => {
    return (
      <View style={style.contant}>
         <View style={style.row}>
            <TouchableOpacity
              onPress={() => {
                setLocateMap(false);
              }}
              style={[
                style.button,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                },
              ]}>
              <Icon name="chevron-left" size={normalize(15)} color={COLORS.PRIMARY} />
              <Text
                style={[
                  styles.memberTitleText,
                  {fontSize: normalize(14), color: COLORS.PRIMARY},
                ]}>
                Back to Members List
              </Text>
            </TouchableOpacity>
         </View>

        <ScrollView style={[style.contant, {marginRight: 10, marginBottom: 10}]}>
          <MapView
            ref={mapRef}
            initialRegion={{
              latitude: 34.62846067258543,
              longitude: -74.15490453765402,
              latitudeDelta: distanceDelta * aspectRatio,
              longitudeDelta: distanceDelta,
            }}
            // clusterColor={'#1f28ff'}
            style={{
              width: '100%',
              height: SCREEN_HEIGHT / 1.8,
              borderRadius: 20,
            }}>
            {boatsLocation.map(renderItem)}
          </MapView>
        </ScrollView>
      </View>
    );
  };
  
  const renderItem = (marker: any) => {
    if (marker?.distance > 0) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          // title={marker.YachtName}
          image={require('../../assets/GreenBoat.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
    if (marker.last > 12 && marker.last < 13) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          // title={marker.YachtName+""+marker.last}
          style={{width: 50, height: 50}}
          image={require('../../assets/YellowBoat.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
    if (marker.last > 24) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          // title={marker.YachtName}
          image={require('../../assets/RedBoat.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
    if (marker.Watch == 1) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
            
          }}
          // title={marker.YachtName}
          image={require('../../assets/blue_sailboat.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
    if (marker?.distance == 0) {
      return (
        <Marker
          key={marker.MMSI}
          coordinate={{
            latitude: marker?.position.lat,
            longitude: marker?.position.lon,
          }}
          // title={marker.YachtName}
          image={require('../../assets/Grey.png')}>
          <InfoModal marker={marker} />
        </Marker>
      );
    }
  };
  const InfoModal =({marker}:any)=>{
    return(
      <Callout>
        <View style={{padding:5,borderRadius:10}}>
          <Text style={[styles.valueCell,{fontSize:normalize(16)}]}>{marker.YachtName}</Text>
          <Text style={[styles.valueCellName,{color:COLORS.BLACK}]}>{marker.last} hrs since last report</Text>
          <Text style={[styles.valueCellName,{color:COLORS.BLACK}]}>{marker.speed} kn / {marker.bearing} {'\u00B0T'} last reported</Text>
          <Text style={[styles.valueCellName,{color:COLORS.BLACK}]}>{marker.Length + "' " + marker.Model}</Text>
          <Text style={[styles.valueCellName,{color:COLORS.BLACK}]}>{"MMSI:" + marker.MMSI}</Text>
        </View>
      </Callout>
    )
  }

   useEffect(()=>{
    
     try {
       // let f = boatList.filter(e=>e.boatName.toLowerCase().indexOf(searchTxt.toLowerCase())>=0);
       // setBoat(searchTxt=="" ? boatList : f)

       const filteredBoats = boat?.filter((e) => {
         const nameMatches = e.boatName?.toLowerCase().includes(searchTxt?.toLowerCase());
         const locationMatches = e.homePort?.toLowerCase().includes(locationTxt?.toLowerCase());
         const qualificationMatches = e.qualification?.toLowerCase().includes(qualificationTxt?.toLowerCase());
  
         const dateWithoutTime = moment(dateTxt, 'DD-MM-YYYY').toDate(); // Convert to Date object
         const convertedJoinDate = moment(e.makeYear, 'DD-MM-YYYY').toDate(); // Convert to Date object
        
         const joinDateMatches = dateWithoutTime
           ? convertedJoinDate <= dateWithoutTime
           : true;
  
         return nameMatches || locationMatches || qualificationMatches  || joinDateMatches;
       });

       setMyAdv(filteredBoats)
     
     } catch (error) {
       console.log("error",error);
     }
   },[searchTxt,qualificationTxt,locationTxt,dateTxt])



  if(locateMap){
    return(
      <View style={[style.contant,style.mt40]}>
         <LocationMap/>
      </View>
    )
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10}$/;
  const becomeCrewHandler = async () => {
    setFirstNameError('')
    setLastNameError('')
    setEmailError('')
    setrallyDateError('')
    setSailingExperienceError('')
    setBeError('')
    setPhoneNoError('')
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
    }if(phoneNo === ''){
      setPhoneNoError('Phone number is required')
      isValid =false
    }else if (!phoneRegex.test(phoneNo)){
      setPhoneNoError('Enter valid phone number')
      isValid = false
    }if(rallyDateFrom === ''){
      setrallyDateError('Rally dates / dates needed is required ')
      isValid = false
    }if(rallyDateTo === ''){
      setrallyDateError('Rally dates / dates needed is required ')
      isValid = false
    }if (rallyDateFrom && rallyDateTo && moment(rallyDateTo).isBefore(moment(rallyDateFrom))) {
      setrallyDateError('Please select To date after the From date.');
      isValid = false;
    }
    if(isValid){
    if(editCrew){
      const payload_data = {
        "id": becomeCrewId,
        "firstName": firstName,
        "lastName": lastName,
        "overview": overview,
        "availableDates": moment(rallyDateFrom).format("YYYY-MM-DD")+',' + moment(rallyDateTo).format("YYYY-MM-DD"),
        "sailingExperience": sailingExperience,
        "smokingPreferences": smokingPreferences,
        "dietryRequirements": dietaryRequirements,
        "phoneNumber": phoneNo,
        "email": email,
        "attachments": doc ? doc :[]
      };
      
      try {
        setbecomeCrewLoader(true)
        const response = await updateBecomeCrew(payload_data,token)
        if (response.status === 200) {
          setIsAddBoat(false)
          setActiveTab(0)
          setFirstName('')
          setLastName('')
          setEmail('')
          setPhoneNo('')
          setOverView('')
          setRallyDateFrom('')
          setRallyDateTo('')
          setSmokingPreferences(false)
          setSailingExperience('')
          setDietaryRequirements('')
          setDescription('')
          setDoc('')
          setbecomeCrewLoader(false)
        }
      } catch (error) {
        console.error(error);
        setbecomeCrewLoader(false)
      }
    }
    else {
      const payload_data = {
        "firstName": firstName,
        "lastName": lastName,
        "memberId": loggedInUser.id,
        "overview": overview,
        "availableDates": moment(rallyDateFrom).format("YYYY-MM-DD")+',' + moment(rallyDateTo).format("YYYY-MM-DD"),
        "sailingExperience": sailingExperience,
        "smokingPreferences": smokingPreferences,
        "dietryRequirements": dietaryRequirements,
        "phoneNumber": phoneNo,
        "email": email,
        "attachments": doc ? doc :[]
      };

    try {
      setbecomeCrewLoader(true)
      const response = await becomeCrew(payload_data, token);
      if (response.status === 200) {    
          setFirstName('')
          setLastName('')
          setEmail('')
          setPhoneNo('')
          setOverView('')
          setRallyDateFrom('')
          setRallyDateTo('')
          setSmokingPreferences(false)
          setSailingExperience('')
          setDietaryRequirements('')
          setDescription('')
          setDoc('')
          setbecomeCrewLoader(false) 
   

          if(response.data["message"] != null){
            setIsAddBoat(true)
            setmodalVisibleForError(true)
            setErrorMsg(response.data["message"])
          }
          else{
            setIsAddBoat(false)
          }
      }
    } catch (error) {
      console.error(error);
      setbecomeCrewLoader(false)
    }
  }
}
  };

  const becomeCrewBtn =()=>{
    setEditCrew(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhoneNo('')
    setOverView('')
    setRallyDateFrom('')
    setRallyDateTo('')
    setSmokingPreferences(false)
    setSailingExperience('')
    setDietaryRequirements('')
    setDescription('')
    setDoc('')
    setbecomeCrewLoader(false)
    setFirstNameError('')
    setLastNameError('')
    setEmailError('')
    setrallyDateError('')
    setSailingExperienceError('')
    setBeError('')
    setPhoneNoError('')
    setIsAddBoat(true);
    getBoatDetailsHandler();
  }
  return (
    <View style={styles.container}>
      {!isAddBoat ? (
        <View style={styles.container}
         showsVerticalScrollIndicator={false}>
          <View style={[style.row]}>
            <View style={style.contant}>
              <Text
                style={[
                  isTablet ? (style.font20) : (style.font16, style.mt30, style.boldTxt),
                  style.primaryText,style.mt15
                ]}>
                Find boat on the search bar
              </Text> 
            </View>
            {!isTablet && (
              <TouchableOpacity
                onPress={becomeCrewBtn}
                style={[
                  style.button,
                  style.primaryLayout,
                  style.borderRadius5,
                  style.row,
                  {
                    marginTop: 5,
                  },
                ]}>
                <Text style={[style.font12, style.whiteText, style.mr10]}>
                  {' '}
                  Become Crew
                </Text>
                <Icon
                  name="plus"
                  size={isTablet ? 20 : 16}
                  color={COLORS.WHITE}></Icon>
              </TouchableOpacity>
            )}
          </View>
          <FilterComponent
            searchInput={search}
            onSearchBut={() => setsearchTxt(search)}
            onChangeText={(txt: string) => {
              setSearch(txt);
              setsearchTxt(txt)
              if (txt === '') {
                setsearchTxt('');
                setBoat(boat);
              }
            }}
            placeholder={'Find Boat'}
            Buttonholder={'Find Boat'}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            filter={true}
            departureDateRange={true}
            // location={true}
            // qualification={true}
            // experience={true}
            experienceTxt={experienceTxt}
            setExperinceTxt={setExperinceTxt}
            qualificationTxt={qualificationTxt}
            setQualificationTxt={setQualificationTxt}
            setDateTxtFrom={setDateTxtFrom}
            dateTxtFrom={dateTxtFrom}
            setDateTxtTo={setDateTxtTo}
            dateTxtTo={dateTxtTo}
            locationInput={locationTxt}
            onLocationTxt={setLocationTxt}
          />
          <TabBox data={tabData} selectedTab={selectedTab} onTab={(tab:string)=>setSelectedTab(tab)}></TabBox>
          {isLoader ? 
          <View style={[style.mt40,style.contant]}>
          <ActivityIndicator style={[style.mt40,style.centerBox]} color={COLORS.PRIMARY} />
         </View>
        :
          <View style={styles.container}>
            {
              selectedTab=="Advertisements" &&  <>
                {myAdv && myAdv.length > 0 ? (
                  <FlatList
                  data={myAdv}
                  renderItem={isTablet ? renderBoatList : renderBoatPhoneList}
                  showsVerticalScrollIndicator={false}
                  />
                  ) : (
                  <View style={[style.centerBox,style.contant,style.mt40]}>
                    <Text style={[style.mt40,style.centerBox,style.centerItem,style.font14,style.mt40]}>
                      {noBoatsText}
                  </Text>
                  </View>
                  ) 
                }
                </>
            }
            {
              selectedTab=="Draft Vacancy" && <>
               {draftList && draftList.length > 0 ? (
               <FlatList
                  data={draftList}
                  renderItem={isTablet ? renderBoatList : renderDraftPhoneList}
                  showsVerticalScrollIndicator={false}
                  />
                  ) : (
                  <View style={[style.centerBox,style.contant,style.mt40]}>
                    <Text style={[style.mt40,style.centerBox,style.centerItem,style.font14,style.mt40]}>
                    {'No drafts found'}
                    </Text>
                  </View>
                  ) 
                }
              </>
            }
            {
              selectedTab=="Closed Vacancy" && <>
               {closeList && closeList.length > 0 ? (
               <FlatList
                  data={closeList}
                  renderItem={isTablet ? renderBoatList : renderDraftPhoneList}
                  showsVerticalScrollIndicator={false}
                  />
                  ) : (
                  <View style={[style.centerBox,style.contant,style.mt40]}>
                    <Text style={[style.mt40,style.centerBox,style.centerItem,style.font14,style.mt40]}>
                    {'No closed advertisements '}
                    </Text>
                  </View>
                  ) 
                }
              </>
            }
           
           
            </View>
}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={[style.contentCenter,style.mt10, ]}>
            <Text style={[ style.font20, style.boldTxt, style.primaryText, ]}>
              Become Crew
            </Text>
          </View>
          <View style={[isTablet && style.row]}>
      <View style={[style.contant,style.mt10]}>
      <View style={[style.row,style.between]}>
          <RenderInput
            name="FIRST NAME"
            placeholder="Enter first name"
            value={firstName}
            setValue={setFirstName}
            stylesProp={{width:"48%"}}
            valueError={firstNameError}
            setValueError={setFirstNameError}
            required={true}
            
          />
          <RenderInput
            name="LAST NAME"
            placeholder="Enter last name"
            value={lastName}
            setValue={setLastName}
            stylesProp={{width:"48%"}}
            valueError={lastNameError}
            setValueError={setLastNameError}
            required={true}
            
          />
         
        </View>
        <View style={[isTablet  &&style.row,style.between]}>
          <RenderInput
            name="PHONE NUMBER"
            placeholder="Enter phone number"
            value={phoneNo}
            setValue={setPhoneNo}
            stylesProp={isTablet ? {width:"48%"} :undefined}
            valueError={phoneNoError}
            setValueError={setPhoneNoError}
            keyboardType={'numeric'}
            required={true}
            maxLength={10}
            
          />
          <RenderInput
            name="EMAIL"
            placeholder="Enter email"
            value={email}
            setValue={setEmail}
            stylesProp={isTablet ? {width:'48%'} :undefined}
            valueError={emailError}
            setValueError={setEmailError}
            required={true}
          />
        </View>
       
        <View style={[isTablet  &&style.row,style.between]}>
        <View style={[style.row,style.between]}>
        <DateTimePickerBox
                      onChangeText={(value)=>{setRallyDateFrom(value);setrallyDateError('')}} 
                      value={rallyDateFrom} 
                      placeholder={'From'} 
                      labelName="Available dates" 
                      modal={'date'} 
                      minDate={new Date()}
                      required={true}
                      stylesProp={ {width:"48%"}}
                      />
        <DateTimePickerBox
                      onChangeText={(value)=>{setRallyDateTo(value);setrallyDateError('')}} 
                      value={rallyDateTo} 
                      placeholder={'To'} 
                      modal={'date'} 
                      minDate={rallyDateFrom}
                      stylesProp={ {width:"48%"}}
                      disabled={!rallyDateFrom}
                      />
                      </View>
                      {rallyDateError&& <Text style={[style.textDanger]}>{rallyDateError} </Text>}
          <RenderInput
            name="SAILING EXPERIENCE"
            placeholder="Enter Experience"
            value={sailingExperience}
            setValue={setSailingExperience}
            stylesProp={isTablet ? {width:'48%'} :undefined}
            valueError={sailingExperienceError}
            setValueError={setSailingExperienceError}
          />
        </View>
        <View style={[isTablet  &&style.row,style.between]}>
        <RenderDropdown
            value={smokingPreferences}
            onChange={item => {
              setSmokingPreferences(item.value);
            }}
            name={'SMOKER'}
            stylesProp={isTablet ? {width:"48%"} :undefined}
            data={smokingPrefData}
            placeholder={'Select'}
            
            />
        <RenderInput
            name="ANY DIETARY REQUIREMENTS"
            placeholder="Enter requirements"
            value={dietaryRequirements}
            setValue={setDietaryRequirements}
            stylesProp={isTablet ? {width:"48%"} :undefined}
          />
        </View>
        <RenderInput
            name="OVERVIEW"
            placeholder="Enter overview"
            value={overview}
            setValue={setOverView}
            multiline={true}
            numberOfLines={3}
            inputStyle={{height:normalize(70), textAlignVertical:'top'}}
          />
       
        {!isTablet && (
          <TouchableOpacity onPress={pickFile}
            style={styles.resumeContainer}>
            {loading  ? <View  style={{position: 'absolute', zIndex: 10}}><ActivityIndicator theme={{ colors: { primary: COLORS.WHITE } }} /></View> :
             <View style={[style.centerBox,style.contentBetween,style.mH20]}>
             <Icon
                onPress={pickFile}
                name="upload"
                size={30}
                color={COLORS.WHITE}
                style={[{position: 'absolute', zIndex: 10}]}
              />
              <Text style={[style.boldTxt,style.font16,style.mH40,{color:COLORS.WHITE}]}>Upload Resume (.doc,.pdf)</Text>
             </View>
            }
          </TouchableOpacity>
        )}
        {beError && <Text style={style.textDanger}>{beError} </Text>}
        <View>
        {doc && doc.length > 0 && doc.map((document,index) => (
              <View style={style.mt10}>
                <View style={[styles.resumeUpload,style.contentBetween]}>
              <Text style={[style.font14,style.mt2]}>{document.fileName}</Text>
              <TouchableOpacity style={style.pH10} onPress={() => removeDocument(index)}>
                <Icon name="trash-2" color={COLORS.RED} size={25}/>
                </TouchableOpacity>
              </View>
              </View>
            ))}
        </View>
        <ModalNative
                  animationIn={"zoomIn"}
                  animationOut={"zoomOut"}
                  isVisible={modalVisibleForError}
                  backdropColor="rgba(0, 0, 0, 0.3)"
                >
                  <View
                    style={[style.p20, style.whiteLayout, style.borderRadius8]}
                  >
                    <Text style={styles.modalText}>
                   {errorMsg}
                    </Text>
                  </View>
                </ModalNative>
        <View
          style={
            isTablet ? style.row && style.mtb10 : !isTablet && style.mtb10
          }>
            {editCrew ?
            <TouchableOpacity activeOpacity={0.8} style={styles.btnStyle} onPress={becomeCrewHandler}>
            {becomeCrewLoader ? <ActivityIndicator theme={{ colors: { primary: COLORS.WHITE } }} />
            :
            <Text style={styles.btnTextStyle}>Update</Text>

            }
          </TouchableOpacity>
          :
          <TouchableOpacity activeOpacity={0.8} style={styles.btnStyle} onPress={becomeCrewHandler}>
            {becomeCrewLoader ? <ActivityIndicator theme={{ colors: { primary: COLORS.WHITE } }} />
            :
            <Text style={styles.btnTextStyle}>Apply</Text>

            }
          </TouchableOpacity>
          }
        </View>
      </View>
      {isTablet && (
        <View style={[{flex: 0.5},style.row,style.centerItem]}>
          <View
            style={{
              backgroundColor: 'rgba(52, 52, 52, 0.3)',
              width: 200,
              height: 150,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              marginTop: 40,
            }}>
            <Image source={require('../../assets/boat1.png')} style={styles.profileImg} resizeMode='cover'/>
            <Icon
              onPress={pickFile}
              name="upload"
              size={30}
              color={COLORS.WHITE}
            />
          </View>
        </View>
      )}
    </View>
        </ScrollView>
      )}
    </View>
  );
}

export default FindBoat

const styles = StyleSheet.create({
  userIcons: {
    width: 40,
    height: 40,
    borderWidth: 1.2,
    alignItems: "center",
    display: 'flex',
    justifyContent: "center",
    borderRadius: 5,
    marginBottom:normalize(5)
  },
  btnsAlignment: {
    flexDirection: "column", alignItems: 'center'
  },
  nameTitlePhoneStyle:{
    color:COLORS.GREY,
    fontSize:normalize(10),
    textAlign:'right'
  },
  nameTitlePhoneTextStyle:{
    color:COLORS.BLACK,
    fontSize:normalize(14),
    fontWeight:"600",
    lineHeight:30,
    textAlign:'right'
  },
    container:{
        flex:1,
        marginTop:normalize(5)
    },
    textTitleHeading: {
        color: COLORS.BLACK,
        fontSize: normalize(14),
        fontWeight: '400',
        lineHeight: 30,
      },
      profileImg:{
        width:normalize(65),
        height:normalize(65),
        borderRadius: 8,
        marginRight: 10,
        borderWidth:1,
      },
      nameTitleStyle:{
        color:COLORS.GREY,
        fontSize:normalize(10),
      },
      nameTitleTextStyle: {
        color: COLORS.BLACK,
        fontSize: normalize(14),
        fontWeight: "600",
        lineHeight: 30,
        maxWidth: 200
      },
      descriptionTextStyle: {
        color: COLORS.BLACK,
        fontSize: normalize(14),
        fontWeight: "600",
        lineHeight: 30,
        width: "100%"
      },
      
      line: {
        borderTopWidth: 1,
        // borderBottomWidth:1,
        // width: '100%',
        borderColor: COLORS.BORDERGREY,
        paddingVertical: normalize(10),
        // borderRadius:8
      },
      btnStyle:{
        backgroundColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        borderRadius:8,
        height: normalize(40),
        width:"100%",
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
      },
      btnTextStyle:{
        color:COLORS.WHITE,
        fontSize:normalize(14),
        fontWeight:'600'
      },
      btnStylessMobileRegister:{
        borderWidth:1,
        backgroundColor:COLORS.PRIMARY,
        borderColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        margin:normalize(5),
        borderRadius:normalize(8),
        height:normalize(35),
        justifyContent:'center',
        alignItems:'center',
        width:'95%'
      },
      btnStyleOutline:{
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(8),
        // paddingVertical:normalize(2),
        marginBottom:normalize(5),
        borderRadius:normalize(8),
        marginRight:'auto',
        height:normalize(30),
        justifyContent:'center',
        alignItems:'center'
        
      },
      cancelBtn:{
       width:"100%",
       height:normalize(40),
       marginBottom:normalize(20)
      },
      uploadImgBtn:{
        backgroundColor: 'rgba(52, 52, 52, 0.3)',
        width: 200,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 40,
      },
      btnOutlineTextStyle:{
        color:COLORS.PRIMARY,
        fontSize:normalize(13),
      },
      formContainer:{
        // flex:1,
        width:'50%'
      },

      containerPage:{
        flex:1,
        flexDirection:'row',
        alignItems:'flex-start',
        paddingBottom:normalize(10)
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
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      // btnStyle:{
      //   backgroundColor:COLORS.PRIMARY,
      //   paddingHorizontal:normalize(10),
      //   paddingVertical:normalize(5),
      //   borderRadius:4,
      //   maxWidth:normalize(200),
      //   justifyContent:'center',
      //   alignItems:'center',
      //   height:normalize(30),
      // },
      btnStyless:{
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        backgroundColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        margin:normalize(5),
        borderRadius:normalize(8),
        // marginLeft:'auto',
        height:normalize(35),
        justifyContent:'center',
        alignItems:'center',
        // marginLeft:40
        width:'95%'
      },
      btnStylessMobile:{
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        margin:normalize(5),
        borderRadius:normalize(8),
        // marginLeft:'auto',
        height:normalize(35),
        justifyContent:'center',
        alignItems:'center',
        // marginLeft:40
        width:'95%'
      },
      btnTextStyless: {
        color:COLORS.PRIMARY,
        fontSize:normalize(14),
        fontWeight:'600'
      },
      viewBtnStyle:{
        paddingHorizontal:15,
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        borderRadius:8,
        paddingVertical:5,
        width:'100%',
        height:40,
        minWidth:200,
        justifyContent:'center',
        alignItems:'center',
      },
      memberTitleText:{
        color:COLORS.LIGHT_BLACK,
        fontSize:normalize(12),
        lineHeight:25
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
    item: {
      padding: 10
    },
    input: {
      color: '#000'
    },
    textItem: {
      flex: 1,
      fontSize: 16,
      color: COLORS.GREY
    },
    dropdown: {
      height:Platform.OS =='ios'?45: 50,
      // backgroundColor: '#F3F4F6',
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.GREY,
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(0),
      borderRadius: 4,
      backgroundColor: "#F3F4F6",
      width:"100%",
      marginTop: 5,
      color:COLORS.BLACK
    },
    placeholderStyle: {
      fontSize: 16,
      color: COLORS.BLACK
    },
    selectedTextStyle: {
      fontSize: 16,
      color: COLORS.BLACK,
    },
    iconStyle: {
      width: 30,
      height: 30,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    labelStyle:{
      fontSize:normalize(14),
      fontFamily:'Roboto-Regular',
      color:COLORS.BLACK,
      marginTop:normalize(10),
      fontWeight:'600'
  },
  inputBorderStyle:{
    borderWidth:.9,
    borderColor:COLORS.GREY,
    paddingHorizontal:normalize(10),
    paddingVertical:normalize(5),
    borderRadius:8,
    paddingBottom:50,
    marginVertical:normalize(5),
    backgroundColor:'#f2f4f6',
    width:"100%",
    height:normalize(70)
  },
  uploadBtn:{
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    width:"100%",
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 15,
  },
  editWidth: {
    width:"54%"
  },
  popoverContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'white',
    width: 120,
    height:normalize(80),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    zIndex: 999,
  },
  popContainer: {
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    top: -10,
    right: 20,
    borderTopWidth: 10,
    borderTopColor: 'white',
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
  popoverContent: {
     color: COLORS.BLACK
  },
  resumeUpload:{
    backgroundColor:"#E0EAFF",
    padding:10,
    color:COLORS.BLACK,
    borderRadius:8
  },
  resumeContainer:{
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  }
})
