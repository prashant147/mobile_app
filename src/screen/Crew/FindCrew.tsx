import { StyleSheet, Text, View,FlatList, Image, TextInput,TouchableOpacity, Modal, ScrollView, Dimensions, 
  BackHandler, Linking,PermissionsAndroid,Platform  } from 'react-native';
import Share from 'react-native-share';
import React, { useEffect, useState,useRef, useContext, useCallback } from 'react'
import COLORS from '../../styles/theme/color';
import { SCREEN_HEIGHT, normalize, scaleWidth } from '../../styles/utilities/dimentions';
import { boatsLocation, crewList } from '../../styles/utilities/constants';
import Icon from "react-native-vector-icons/Feather";
import style from '../../styles/style';
import AntIcon from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';
import MapView, { Marker, Callout} from 'react-native-maps';
import FilterComponent from '../../components/FilterComponent';
import moment from 'moment';
import RNFetchBlob from "rn-fetch-blob";
import { advertiseCrewVacancy, getBecomeCrewMembers, getMember, getRequestMemberInfo,deleteAdvertisedBecomeCrew,updateAdvertiseCrew, advertiseCrewSaveDraft, getApplicationsUndo, findCrewFilters, getMyBoats } from '../../services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MembersContext from '../Members/MembersContext';
import Config from 'react-native-config';
import s3 from '../../services/aws-config';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import RenderInput from '../BecomeMember/RenderInput';
import RenderDropdown from '../BecomeMember/RenderDropdown';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalNative from "react-native-modal";
import DateTimePickerBox from '../../components/dateTimeBox';

import ImagePicker from 'react-native-image-crop-picker';
import { checkPermissions, dateFormat, permissionAlert } from '../../styles/utilities/variables';
import { useNavigation } from '@react-navigation/native';
interface MembersPageProps {
  members:any
  IsBack:any,
  setIsBack:any
}

const FindCrew: React.FC<MembersPageProps> = ({setIsBack,IsBack,isAddCrew,setIdAddCrew,setIsAddCrew,editboat,setEditCrew,setActiveTab,setEditboat,isDarft,setIsDraft}:any) => {
  const {loggedInUser,setChatData } = useContext(MembersContext);  
  const route = useRoute();
  const isTablet = DeviceInfo.isTablet();
  const navigation= useNavigation()
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState<number>(5);
  const [selectedMember, setSelectedMember] = useState<any>();
  const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2);
  const { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  const [searchTxt, setsearchTxt]=useState<string>("");
  const [locationTxt, setLocationTxt]=useState<string>("");
  const [dateTxt, setDateTxt]=useState('');
  const [dateTxtFrom, setDateTxtFrom]=useState('');
  const [dateTxtTo, setDateTxtTo]=useState('');
  const [experienceTxt, setExperinceTxt]=useState<string>("");
  const [qualificationTxt, setQualificationTxt]=useState<string>("");
  const [search, setSearch]=useState<string>("");
  const [crew, setCrew]=useState<any>();
  const [noCrewText, setNoCrewText]= useState("No Crew Advertisements");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleMsg, setModalVisibleMsg] = useState('');
  const [UndomodalVisible, setUndoModalVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [requestLoader, setRequestLoader] = useState(false);
  const [fileDownloadModal,setFileDownloadModal] = useState(false);
  const [locateMap, setLocateMap] = useState(false)
  const [isRequestSent, setIsRequestSent] = useState({});
  const [showFilter,setShowFilter]=useState(false)
  const [value, setValue] = useState('')
  const [getMemberData, setGetMemberData] = useState([])
  
  const data = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ]; 

  const positiondata = [
    { label: 'Captain', value: 'CAPTAIN' },
    { label: 'Co-Captain', value: 'CO_CAPTAIN' },
    { label: 'First Mate', value: 'FIRSTMATE' },
    { label: 'Crew', value: 'CREW' },
  ];
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [boatName, setBoatName] = useState("");
  const [boatOwner, setBoatOwner] = useState("");
  const [boatCaptain, setBoatCaptain] = useState("");
  const [boatLength, setBoatLength] = useState("");
  const [crewSolicited, setCrewSolicited] = useState("");
  const [boatNameError, setBoatNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [crewVacancy, setCrewVacancy] = useState("");
  const [crewVacancyError, setCrewVacancyError] = useState("");
  const [position, setPosition] = useState("");
  const [positionError, setPositionError] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeFromError, setRouteFromError] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [routeToError, setRouteToError] = useState("");
  const [rallyDateFrom, setRallyDateFrom] = useState<any>('');
  const [rallyDateTo, setRallyDateTo] = useState<any>();
  const [rallyDateError, setRallyDateError] = useState("");
  const [smokingPreferences, setSmokingPreferences] = useState(false);
  const [costOfCrewMember, setCostOfCrewMember] = useState("");
  const [costOfCrewMemberError, setCostOfCrewMemberError] = useState("");
  const [model, setModel] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [description, setDescription] = useState("");
  const [beError, setBeError] = useState("");
  const [boatsId, setBoatsId] = useState('');
  const [loading, setLoading] = useState('');
  const token = AsyncStorage.getItem('accessToken');
  const [crewAdvertiseData,setCrewAdvertiseData] = useState([])
  const [myAdvertiseData,setMyAdvertiseData] = useState<any>()
  const [advertiseCrewLoader, setAdvertiseCrewLoader] = useState(false);
  const [savedraftLoader, setSavedraftLoader] = useState(false);
  const [request,setIsRequest] = useState(false);
  const [requested,setIsRequested] = useState(false);
  const [isLoader, setisLoader] = useState(false);
  const [deleteCrew, setDeleteCrew] = useState(false);
  const [deleteModal, setDeleteModal]= useState(false);
  const [advToBeDeleted, setAdvToBoDeleted] = useState<any>();
  const [advertiseCrewId,setAdvertiseCrewId] = useState('');
  const [primaryBoatId, setPrimaryBoatId] = useState<any>();

  const [status, setStatus] = useState<any>("");
  const [backPath, setBackPath] = useState<any>("");

  const [loader, setLoader] = useState(false)
  const [adCrewSuccessMsg, setAdCrewSuccessMsg] = useState('')
  const [adCrewSuccess, setAdCrewSuccess] = useState(false)

  useEffect(() => {
    const backAction = () => {      
      setSelectedMember(null);
      setIsAddCrew(false)
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, [requested]);

  useFocusEffect(
    React.useCallback(() => {
    if(route?.params?.item && crewAdvertiseData){
      const filteredBecomeCrewId = crewAdvertiseData?.find((item) => item?.id === route?.params?.item)      
      setSelectedMember(filteredBecomeCrewId)
      setStatus(filteredBecomeCrewId?.status)
        if(route?.params?.path){
          setBackPath(route?.params?.path)
        }
      route.params = null
    }
  },[route,crewAdvertiseData]))

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if(!route?.params?.item){ 
        setSelectedMember(null);
        }
      };
    }, [])
  );

  useFocusEffect(React.useCallback(()=>{
    getMemberHandler()
    getMemberBoatsHandler()
  },[requested]))
    const getMemberHandler = async () => {
      try {
          const response = await getMember('',token);
        if (response.status === 200) {
          setGetMemberData(response.data)
        }
      } catch (error) {
        console.error(error);
      }
    };
    const getMemberBoatsHandler = async () => {
      try {
          const response = await getMyBoats(token);
        if (response.status === 200) {
            const primaryboatId = response.data?.find((item)=> item?.isPrimary);
            if(primaryboatId){
              setPrimaryBoatId(primaryboatId?.id)
            }else{
              setPrimaryBoatId(response.data[0]?.id)
            }
        }
      } catch (error) {
        console.error(error);
      }
    };

    useFocusEffect(React.useCallback(() => {
      if (getMemberData?.boats?.length >= 1) {
        setBoatName(getMemberData?.boats[0]?.boatName);
        setBoatOwner(getMemberData?.boats[0]?.boatOwner);
        setBoatCaptain(getMemberData?.boats[0]?.captain);
        setBoatLength(getMemberData?.boats[0]?.length);
        setCrewSolicited(getMemberData?.boats[0]?.crewsSolicited);
        setModel(getMemberData?.boats[0]?.make);
        setEmail(getMemberData?.username);
        setPhoneNumber(getMemberData?.phoneNumbers[0]?.phoneNumber);
        setSelectedImage(getMemberData?.boats[0].image);
      }
    }, [isAddCrew]));
    
  useEffect(() => {
    
  if(editboat){
  setAdvertiseCrewId(editboat.id)
  setBoatName(editboat.boatName)
  setBoatOwner(editboat.owner);
  setBoatCaptain(editboat.boats.captain);
  setBoatLength(editboat.length);
  setCrewSolicited(editboat.crewsSolicited);
  setEmail(editboat.email)
  setPhoneNumber(editboat.phoneNumber)
  setCrewVacancy(editboat.crewVacancy)
  setRouteFrom(editboat.routeFrom)
  setRouteTo(editboat.routeTo)
  setPosition(editboat.position) 
  const dates = editboat?.rallyDate.split(',')
  const date1 = dates[0]
  const date2 = dates[1]
  setRallyDateFrom(new Date(date1));
  setRallyDateTo( dates.length > 1 ? new Date(date2) :'');

  setSmokingPreferences(editboat.smokingPreferences) 
  setCostOfCrewMember(editboat.costOfCrewMember)
  setRestrictions(editboat.restrictions)
  setDescription(editboat.description)
  setSelectedImage(editboat.imageUrl)
  }
  },[editboat])

  const selectImage = async() => {
    const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        permissionAlert()
        return; 
      } 
    ImagePicker.openPicker({
      width: normalize(80),
      height: normalize(80),
      mediaType:'photo',
      cropping: true,
      cropperActiveWidgetColor:"#FFFFFF",
    }).then(async (image)=>{
      const selectedFile = image
      const fileContent = await fetch(selectedFile.path);
      const blob = await fileContent.blob();
   
      if (selectedFile) {
        const fileName = selectedFile.path.split('/').pop();
        setLoading(true);
        const params = {
          Bucket: Config.BUCKET_NAME,
          Key: `${Config.DIRECTORY_NAME}/${loggedInUser.id}/${fileName}`,
          Body: blob,
        };
        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading image:", err);
            setLoading(false);
          } else {
            setSelectedImage(`${Config.DIRECTORY_URL}/${data.key}`)
            setLoading(false);
          }
        });
      }
    })
    
};


const downloadFiles = () => {
  const { dirs } = RNFetchBlob.fs;
  const fileUrl = selectedMember?.attachments?.[0]?.uploadUrl; // Assuming only one file is selected, change as needed

  if (!fileUrl) {
    console.log('No file URL found');
    setFileDownloadModal(true)
    return;
  } 
  const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
  setLoader(true)      
  RNFetchBlob.config({
    fileCache: true,
    appendExt:selectedMember?.attachments[0]?.fileName.split(".")[1], 
    path : `${dirToSave}/${selectedMember?.attachments[0]?.fileName}`,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: selectedMember?.attachments[0]?.fileName,
       // Adjust MIME type according to your file type
     // path: `${dirs.DownloadDir}/${selectedMember?.attachments[0]?.fileName}`, // Adjust file name and extension
    },
  })
    .fetch('GET', fileUrl)
    .then(res => {
      // File was downloaded successfully
      setFileDownloadModal(true)
      console.log('File downloaded to:', res.path());
      setLoader(false) 
      if (Platform.OS === 'ios') { 
        const filePath = res.path();
        let options = {
          type: 'application/pdf',
          url: filePath,
          saveToFiles: true,
        };
        Share.open(options)
          .then((resp) => console.log(resp))
          .catch((err) => console.log(err));
      }else{
        setFileDownloadModal(true)
      }
    })
    .catch(error => {
      // Error handling
      console.error('Error downloading file:', error);
      setLoader(false)   
    });
};


useEffect(() => {
  let timeout;
  if (fileDownloadModal) {
    timeout = setTimeout(() => {
      setFileDownloadModal(false);
    }, 2000);
  }
  return () => clearTimeout(timeout);
}, [fileDownloadModal]);


  useEffect(() => {
    let timeout;
    if (modalVisible || UndomodalVisible) {
      timeout = setTimeout(() => {
        setModalVisible(false);
        setUndoModalVisible(false)
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [modalVisible, UndomodalVisible]);

  const getBoatLocation =(coords:any)=>{
    // mapRef.current.fitToSuppliedMarkers([boat],false)
    if(coords){
      // console.log("coords",JSON.stringify(coords));

      mapRef?.current.fitToCoordinates([coords], {
        edgePadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
      });
    }
  }

  useEffect(() => {
    let timeout;
    if (modal) {
      timeout = setTimeout(() => {
        setModal(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [modal]);

  const renderCrewList =({item,index}:any)=>{
      return (
        <View style={[styles.line, style.row]}>
          <Image source={item?.image} style={styles.profileImg} resizeMode='cover'/>
          <View style={[style.contant, {paddingHorizontal: 20}]}>
            <View style={[style.row, {flexDirection: 'row', flexWrap: 'wrap'}]}>
              <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                <Text style={styles.nameTitleStyle}>CREW NAME</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.crewName}</Text>
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
                <Text style={styles.nameTitleStyle}>HOME PORT</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.homePort}</Text>
              </View>
              <View style={{marginRight: 20, marginBottom: 20, flex: 1}}></View>
            </View>
            <View
              style={[
                style.row,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>POSITION</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.position}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>JOINED DATE</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.joinDate}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.boatName}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.nameTitleStyle}>BOAT NUMBER</Text>
                <Text style={styles.nameTitleTextStyle}>
                  {item?.boatNumber}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.nameTitleStyle]}>HEAD QUARTERS</Text>
                <Text style={styles.nameTitleTextStyle}>
                  {item?.reportingHeadQuater}
                </Text>
              </View>
            </View>
          </View>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity
              style={[styles.button,style.borderRadius8]}
              onPress={() => requestInfoHandler(item)}>
              <Text style={[styles.btnTextStyless]}>
                {selectedMember?.isRequested ? 'Requested' : 'Request member Info'}
              </Text>
            </TouchableOpacity>
            {
              /*
              index === 0 && (
        <TouchableOpacity
          style={[styles.btnStyless, { backgroundColor: COLORS.ORANGE }]}
          onPress={() => {
            setLocateMap(true);
            setTimeout(() => {
              getBoatLocation(item?.coordinates);
            }, 2000);
          }}
        >
          <Text style={styles.btnTextStyless}>Locate Boat</Text>
        </TouchableOpacity>
      )
              */
            }


          </View>
      
        </View>
      );
  };


  const deleteBoatAdv = async(data:any) => {
    try {
      setDeleteCrew(false);
      const response = await deleteAdvertisedBecomeCrew(data.id, token);
      if(response.status === 200){
        setDeleteCrew(true);
        setDeleteModal(!deleteModal);
      }
    }catch (error){
      console.error(error);
    }
   }
  const renderPhomeCrewList =({item, index}:any)=>{
    return(
      <View >
        <View style={[style.row,styles.line]}>
          <View>
            {item?.member?.profileUrl ? 
            <Image style={[styles.profileImg]} source={{uri:`${item?.member?.profileUrl}`}} alt='img' resizeMode='cover'/> :
            <Image style={[styles.profileImg]} source={require("../../assets/avatarImage.png")} alt='img' resizeMode='cover'/>}
          </View>
          <View style={[styles.editIconsWidth]}>
                <Text style={styles.nameTitleStyle}>MEMBER NAME</Text>
                <View style={style.row}>
                <Text style={styles.nameTitleTextStyle}>{item?.firstName}</Text>
                <Text style={[styles.nameTitleTextStyle,style.mH5]}>{item?.lastName}</Text>
                </View>
                <View>
          <Text style={styles.nameTitleStyle}>QUALIFICATION</Text>
          <Text style={styles.nameTitleTextStyle}>{item?.qualification ? item?.qualification.replace(/_/g, ' ')  : "N/A"}</Text>
          </View>
          </View>
          <View>
            {loggedInUser?.id === item?.member?.id ?
                <View style={[style.row,style.alignSelfEnd]}>
                <TouchableOpacity onPress={() => setEditCrew(item)}>
                  <MaterialIconCommunity 
                  name='square-edit-outline'
                  size={25}
                  color={COLORS.DARK_PRIMARY}
                  />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {setAdvToBoDeleted(item),setDeleteModal(true)}}>
                  <MaterialIcon 
                  name='delete'
                  size={25}
                  color={COLORS.DARK_PRIMARY}
                  />
                  </TouchableOpacity>
                </View> : null }
                {loggedInUser?.id !== item?.member?.id ?
              <TouchableOpacity style={[style.borderRadius8,style.mtop40,style.alignSelfEnd,styles.viewButton]} onPress={() => {setSelectedMember(item);setIsRequest(false), setIsRequested(item.isRequested), setStatus(item.status);setRequestLoader(false)}}>
              <Text style={[style.primaryText]}>View more</Text>
              </TouchableOpacity> :
              <TouchableOpacity style={[style.borderRadius8,style.mt15,style.alignSelfEnd,styles.viewButton]} onPress={() => {setSelectedMember(item);setIsRequest(false), setIsRequested(item.isRequested);setRequestLoader(false)}}>
              <Text style={[style.primaryText]}>View more</Text>
              </TouchableOpacity>}
          </View>
          
        </View>      
        <ModalNative
        animationIn={'zoomIn'} 
        animationOut={'zoomOut'}
        isVisible={deleteModal}
        backdropColor='rgba(0, 0, 0, 0.2)'
      >
            <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
                    <TouchableOpacity onPress={()=>setDeleteModal(false)} style={[style.alignSelfEnd]}>
                    <AntIcon name="close" size={25} color={COLORS.BLACK} />
                    </TouchableOpacity >
                    <View>
                        <Text style={[style.textCenter,style.font20,style.mtb10,{color:COLORS.PRIMARY},style.mB30,style.boldTxt]}>Are you sure want to delete ?</Text>
                        <View style={[style.mH20, style.contentBetween, { marginHorizontal: 60 }]}>
                        <TouchableOpacity style={[style.button,style.borderRadius8,style.whiteLayout,style.width100, style.mH10]} onPress={() => setDeleteModal(false)}>
                        <Text style={[style.buttonTxt,style.PRIMARY,style.boldTxt,{fontSize:normalize(16),}]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.button,style.borderRadius8,style.primaryLayout,style.width100]} onPress={() => deleteBoatAdv(advToBeDeleted)}>
                        <Text style={[style.buttonTxt,style.whiteText,style.boldTxt,{fontSize:normalize(16),}]}>Yes</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                </View>
        </ModalNative>
      </View>
    )
}
const renderBoatPhoneList =({item,index}:any)=>{
    return(
      <View style={{justifyContent:'space-between'}}>
        <View  style={[styles.line, style.row]}>
          {item?.imageUrl ?  
        <Image style={[styles.profileImg,style.mt10]} source={{uri:item?.imageUrl}} alt='img'/> :
        <Image style={[styles.profileImg,style.mt10]} source={require("../../assets/blue_sailboat.png")} alt='img'/> }
            <View style={style.mH10}>
                <View style={style.mt10}>
                      <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                      <Text style={styles.nameTitleTextStyle}>{item?.boatName}</Text>
                  </View>
                  <View>
                      <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                      <Text style={styles.nameTitleTextStyle}>{item?.boats?.captain ? item?.boats?.captain : "N/A"}</Text>
                  </View>
            </View>
        </View>
        <View style={[style.row,{justifyContent:'space-between'}]}>
            <View >
                <Text style={styles.nameTitleStyle}>CO-OWNER</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.boats?.coOwner ? item?.boats?.coOwner : "N/A"}</Text>
            </View>
            <View>
                <Text style={styles.nameTitleStyle}>HOME PORT</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>{item?.boats?.homePort}</Text>
            </View>
        </View>
        <View style={[style.row,style.mt10,{justifyContent:'space-between'}]}>
            <View>
                <Text style={styles.nameTitleStyle}>PHONE NO</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.phoneNumber}</Text>
            </View>
            <View >
                <Text style={styles.nameTitlePhoneStyle}>EMAIL</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>{item?.email.length > 25 ? item?.email.substring(0,25).concat('...') : item?.email}</Text>
            </View>
        </View>
        <View style={[style.row,style.mt10,{justifyContent:'space-between'}]}>
            <View>
                <Text style={styles.nameTitleStyle}>CREW VACANCY</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.crewVacancy}</Text>
            </View>
            <View>
                <Text style={styles.nameTitlePhoneStyle}>POSITION</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>{item?.position}</Text>
            </View>
        </View>
        <View style={[style.row,style.mt10,{justifyContent:'space-between'}]}>
            <View >
                <Text style={styles.nameTitleStyle}>AVAILABILITY DATES</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.rallyDate} </Text>
            </View>
            <View>
                <Text style={styles.nameTitlePhoneStyle}>DIETRY RESTRICTION</Text>
                <Text style={styles.nameTitlePhoneTextStyle}>{item?.restrictions}</Text>
            </View>
        </View>
        <View style={[style.row,style.mt10,{justifyContent:'space-between'}]}>
            <View >
                <Text style={styles.nameTitleStyle}>EXPENSE</Text>
                <Text style={styles.nameTitleTextStyle}>{item?.costOfCrewMember}</Text>
            </View>
          
        </View>
        <View style={[style.mt10]}>

                <Text style={styles.nameTitleStyle}>DESCRIPTION</Text>
                {/* {
          !item.isView && <View style={style.row}>
              <Text numberOfLines={2} style={[style.font16,{width:'80%'}]}>{item?.description}</Text>
              <TouchableOpacity onPress={()=>onMoreView(item,true,index)}><Text style={[style.font14,style.primaryText,style.mt20]}>View More</Text></TouchableOpacity>
            </View>
        } */}
        {/* {
          item.isView && <View><Text style={[style.font16]}>{item?.description}</Text>
          <TouchableOpacity onPress={()=>onMoreView(item,false,index)}><Text style={[style.font14,style.primaryText]}>View Less</Text></TouchableOpacity></View>
        } */}
          
        </View>

      </View>
    )
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
          <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} />
          <Text
            style={[
              styles.memberTitleText,
              {fontSize: normalize(14), color: COLORS.PRIMARY},
            ]}>
            Back to Crew List
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



useEffect(() => {
  try {
    const filteredCrew = crew.filter((e:any) => {
      const nameMatches = e?.firstName?.toLowerCase().includes(searchTxt.toLowerCase()) || e.lastName.toLowerCase().includes(searchTxt.toLowerCase());
      const locationMatches = e?.homePort?.toLowerCase().includes(locationTxt.toLowerCase());
      const experienceMatches = e?.experience?.toLowerCase().includes(experienceTxt.toLowerCase());
      const qualificationMatches = e?.qualification?.toLowerCase().includes(qualificationTxt.toLowerCase());

      const dateWithoutTime = moment(dateTxt, 'DD-MM-YYYY').toDate(); // Convert to Date object
      const convertedJoinDate = moment(e.joinDate, 'DD-MM-YYYY').toDate(); // Convert to Date object
      
      const joinDateMatches = dateWithoutTime ? convertedJoinDate <= dateWithoutTime : true;


      return nameMatches && locationMatches && qualificationMatches && experienceMatches && joinDateMatches;
    });
   

    setCrew(filteredCrew);
  } catch (error) {
    console.log("error", error);
  }
  
}, [searchTxt, locationTxt,qualificationTxt,experienceTxt,dateTxt]);

let filteredList = [];
const filteredCrew = crewAdvertiseData && crewAdvertiseData.filter(
    (item:any) => {
        const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
        const searchLower = search.toLowerCase();
        return fullName.includes(searchLower) ||
            item.firstName?.toLowerCase().includes(searchLower) ||
            item.lastName?.toLowerCase().includes(searchLower);
    }
);
filteredList = filteredCrew || [];


useFocusEffect(React.useCallback(() => {
  getCrewAdvertisemnts()
},[requested,deleteCrew,qualificationTxt,experienceTxt,dateTxtFrom,dateTxtTo]))

const getCrewAdvertisemnts = async() => {
  setisLoader(true);
if(qualificationTxt || experienceTxt || (dateTxtFrom  && dateTxtTo) ){
  const from = experienceTxt?.split('-')[0]
  const to = experienceTxt?.split('-')[1]
  const payload = {
    ...(dateTxtFrom && dateTxtTo ? { "departureDateFrom": !isNaN(new Date(dateTxtFrom)) ? moment(dateTxtTo).format('YYYY-MM-DD') :'',
    "departureDateTo": !isNaN(new Date(dateTxtTo)) ? moment(dateTxtTo).format('YYYY-MM-DD') :''} :{}),
    "experienceRangeFrom": from,
    "experienceRangeTo": to,
    "qualification": qualificationTxt
  }
  console.log('payload',payload);
  
  try {
    const response = await findCrewFilters(payload,token)
    if(response.status === 200){
      if(response.data[0]?.message === "No Records Found"){
        setCrewAdvertiseData([]);
        setNoCrewText("No Crew Advertisements");
        setisLoader(false);
      }
      else{
      setCrewAdvertiseData(response.data);
      setisLoader(false);
    }
  }
  } catch (error) {
    console.error(error)
  }
}else{
  try { 
    const response = await getBecomeCrewMembers(token)
    if(response.status === 200){
      if(response.data[0]?.message === "You have no Advertisements"){
        setCrewAdvertiseData([]);
        setNoCrewText("No Crew Advertisements");
        setisLoader(false);
      }
      else{
        const modifiedData = response.data.filter(item => {
          const availableDates = item.availableDates.split(',');
          const secondRallyDate = moment(availableDates[1]);
          const isSecondDatePast = secondRallyDate.isSameOrAfter(moment());
    
          return isSecondDatePast ;
        });
      setCrewAdvertiseData(modifiedData);
      setisLoader(false);
    }
  }
  } catch (error) {
    console.error(error)
  }
}
 

 
}


const requestInfoHandler = async(item:any) => {
  try {
    setIsRequest(false)
    setRequestLoader(true)
    
    if (!primaryBoatId) {
      setModal(true);
    }
    const response = await getRequestMemberInfo(item.id, primaryBoatId, token);
   
    if(response.status === 200){

      if(response.data["message"]== "Mail sent to your email address"){
        setIsRequested(true);
        setModalVisibleMsg('Thanks for requesting crew members info!')
        setModalVisible(true)
        setRequestLoader(false)
      }
      else{
        setUndoModalVisible(true)
        setIsRequested(false);
        setRequestLoader(false)
      }
      
      setIsRequest(true);
     
     
     } 
  } catch (error) {
      setRequestLoader(false)
    console.error(error)
      if(error === 'Member is already part of crew'){
        setModalVisibleMsg(error)
        setModalVisible(true)
      } 
  }
}



if(locateMap){
  return(
    <View style={[style.contant,style.mt40]}>
       <LocationMap/>
    </View>
  )
}
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\d{10}$/;
const advertiseCrewVacancyHandler = async () => {
  setBoatNameError('')
  setPhoneNumberError('')
  setEmailError('')
  setCrewVacancyError('')
  setPositionError('')
  setRouteFromError('')
  setRouteToError('')
  setRallyDateError('')
  setCostOfCrewMemberError('')
  setBeError('')
  let isValid = true
  if(boatName === ''){
    isValid = false
    setBoatNameError('Boat name is required')
  }if(email === ''){
    setEmailError('Email is required')
    isValid = false
  }else if(!emailRegex.test(email)){
    setEmailError('Enter valid email')
    isValid = false
  }if(phoneNumber === ''){
    setPhoneNumberError('Phone number is required')
    isValid =false
  }else if (!phoneRegex.test(phoneNumber)){
    setPhoneNumberError('Enter valid phone number')
    isValid = false
  }if(crewVacancy === ''){
    setCrewVacancyError('Crew vacancy is required')
    isValid = false
  }if(position === ''){
    setPositionError('Position is required')
    isValid = false
  }if(routeFrom === ''){
    setRouteFromError('Route from is required')
    isValid = false
  }if(routeTo === ''){
    setRouteToError('Route to is required')
    isValid = false
  }if(rallyDateFrom === ''){
    setRallyDateError('Rally dates / dates needed is required ')
    isValid = false    
  }if(rallyDateTo === ''){
    setRallyDateError('Rally dates / dates needed is required ')
    isValid = false
  } if (rallyDateFrom && rallyDateTo && moment(rallyDateTo).isBefore(moment(rallyDateFrom))) {
    setRallyDateError('Please select To date after the From date.');
    isValid = false;
  }if(costOfCrewMember === ''){
    setCostOfCrewMemberError('Expense is required')
    isValid = false
  }
  if(!editboat && boatsId === ''){
  setBeError('Please select the boat')
  isValid = false
  }
  setAdCrewSuccessMsg('')
  if(isValid){  
    setAdvertiseCrewLoader(false)
    if(editboat){
      const payload_data = {
        id:advertiseCrewId,
        boatName: boatName,
        imageUrl: selectedImage,
        email: email,
        phoneNumber: phoneNumber,
        crewVacancy: crewVacancy,
        routeFrom,
        routeTo,
        position: position,
        rallyDate: moment(rallyDateFrom).format("YYYY-MM-DD")+',' + moment(rallyDateTo).format("YYYY-MM-DD"),
        smokingPrefrences: smokingPreferences,
        costOfCrewMember: costOfCrewMember,
        restrictions: restrictions,
        description: description,
        ...(isDarft && {isDraft:true}),
        owner: boatOwner,
        captain: boatCaptain,
        length: boatLength,
        crewsSolicited: crewSolicited
      };
      console.log("payload_data",payload_data);
      
      try {
        setAdvertiseCrewLoader(true)
        const response = await updateAdvertiseCrew(payload_data, token);
        if (response.status === 200) {
            if(response.data?.message){
              setAdCrewSuccess(true)
              setAdCrewSuccessMsg(response.data?.message)
              setTimeout(() => {
                setAdCrewSuccess(false)
              }, 3000);
            }
            setIsAddCrew(false)
            setActiveTab(1)
            setBoatName('')
            setEmail('')
            setPhoneNumber('')
            setCrewVacancy('')
            setPosition('')
            setRallyDateFrom('')
            setRallyDateTo('')
            setSmokingPreferences(false)
            setModel('')
            setRestrictions('')
            setDescription('')
            setSelectedImage('')
            setBoatsId('')
            setAdvertiseCrewLoader(false)
            setBeError('')
      
        }
      } catch (error) {
        console.error(error);
        setAdvertiseCrewLoader(false)
      }
    } else {
      const payload_data = {
        boatName: boatName,
        imageUrl: selectedImage,
        email: email,
        phoneNumber: phoneNumber,
        crewVacancy: crewVacancy,
        position: position,
        routeFrom,
        routeTo,
        rallyDate: moment(rallyDateFrom).format("YYYY-MM-DD")+',' + moment(rallyDateTo).format("YYYY-MM-DD"),
        smokingPrefrences: smokingPreferences,
        costOfCrewMember: costOfCrewMember,
        restrictions: restrictions,
        description: description,
        boats: {
          id: boatsId,
          model: model,
        },
        owner: boatOwner,
        captain: boatCaptain,
        length: boatLength,
        crewsSolicited: crewSolicited
      };
      try {
        setAdvertiseCrewLoader(true)
        const response = await advertiseCrewVacancy(payload_data, token);
        if (response.status === 200) {
          if(response.data?.message === 'Crew has been Advertised'){

            setAdCrewSuccess(true)
            setAdCrewSuccessMsg(response.data?.message)
            setTimeout(() => {
              setAdCrewSuccess(false)
            }, 3000);
            setIsAddCrew(false)
            setBoatName('')
            setEmail('')
            setPhoneNumber('')
            setCrewVacancy('')
            setPosition('')
            setRallyDateFrom('')
            setRallyDateTo('')
            setSmokingPreferences(false)
            setModel('')
            setRestrictions('')
            setDescription('')
            setSelectedImage('')
            setBoatsId('')
            setAdvertiseCrewLoader(false)
          }else{
            setBeError(response.data?.message)
            setAdvertiseCrewLoader(false)
          }
        }
      } catch (error) {
        console.error(error);
        setAdvertiseCrewLoader(false)
      }
    }
}
};

const clearFields =()=>{
    setIsAddCrew(false)
    setBoatName('')
    setEmail('')
    setPhoneNumber('')
    setCrewVacancy('')
    setPosition('')
    setRallyDateFrom('')
    setRallyDateTo('')
    setSmokingPreferences(false)
    setModel('')
    setRestrictions('')
    setDescription('')
    setSelectedImage('')
    setBoatsId('')
}

const validate =()=>{
  let isValid = true
  if(boatName === ''){
    isValid = false
    setBoatNameError('Boat name is required')
  }if(email === ''){
    setEmailError('Email is required')
    isValid = false
  }else if(!emailRegex.test(email)){
    setEmailError('Enter valid email')
    isValid = false
  }if(phoneNumber === ''){
    setPhoneNumberError('Phone number is required')
    isValid =false
  }else if (!phoneRegex.test(phoneNumber)){
    setPhoneNumberError('Enter valid phone number')
    isValid = false
  }if(crewVacancy === ''){
    setCrewVacancyError('Crew vacancy is required')
    isValid = false
  }if(position === ''){
    setPositionError('Position is required')
    isValid = false
  }if(routeFrom === ''){
    setRouteFromError('Route from is required')
    isValid = false
  }if(routeTo === ''){
    setRouteToError('Route to is required')
    isValid = false
  }if(rallyDateFrom === ''){
    setRallyDateError('Rally dates / dates needed is required ')
    isValid = false    
  }if(rallyDateTo === ''){
    setRallyDateError('Rally dates / dates needed is required ')
    isValid = false
  }if (rallyDateFrom && rallyDateTo && moment(rallyDateTo).isBefore(moment(rallyDateFrom))) {
    setRallyDateError('Please select To date after the From date.');
    isValid = false;
  }if(costOfCrewMember === ''){
    setCostOfCrewMemberError('Expense is required')
    isValid = false
  }
  if(!editboat && boatsId === ''){
  setBeError('Please select the boat')
  isValid = false
  }

  return isValid;
}
const onDraftCreate =async()=>{

  if(validate()){
  const request = {
      boatName: boatName,
      imageUrl: selectedImage,
      email: email,
      phoneNumber: phoneNumber,
      crewVacancy: crewVacancy,
      position: position,
      rallyDate: moment(rallyDateFrom).format("YYYY-MM-DD")+',' + moment(rallyDateTo).format("YYYY-MM-DD"),
      routeFrom: routeFrom,
      routeTo: routeTo,
      isDraft: true,
      smokingPreferences: smokingPreferences,
      costOfCrewMember: costOfCrewMember,
      restrictions: restrictions,
      description: description,
      boats: {
        id: boatsId,
      },
  };
  
  try {
    setSavedraftLoader(true)
    const response = await advertiseCrewSaveDraft(request,token);
    if (response.status === 200) {
      if(response.data?.message === 'Crew has been Advertised'){
        clearFields();
        setSavedraftLoader(false);
      }else{
        setBeError(response.data?.message)
        setSavedraftLoader(false);
      }
     
    }
  } catch (error) {
    setSavedraftLoader(false);
    console.error(error);
  }
  }
}


const advertiseCrewBtn =()=>{
  setBoatName('')
  setEmail('')
  setPhoneNumber('')
  setCrewVacancy('')
  setPosition('')
  setRallyDateFrom('')
  setRallyDateTo('')
  setSmokingPreferences(false)
  setModel('')
  setRestrictions('')
  setDescription('')
  setSelectedImage('')
  setBoatsId('')
  setAdvertiseCrewLoader(false)
  setBoatNameError('')
  setPhoneNumberError('')
  setEmailError('')
  setCrewVacancyError('')
  setPositionError('')
  setRouteFromError('')
  setRouteToError('')
  setRallyDateError('')
  setCostOfCrewMemberError('')
  setBeError('')
  setIsAddCrew(true)
  setEditboat(false)
  
}

const renderSuggestedBoats = (item: any) => {
  return (
      <TouchableOpacity style={[style.mt10]} onPress={()=>getBoatDetailsHandler(item)}>
        {item?.item.image ?  <Image
          style={[styles.boatImage,style.mH5]}
          source={{uri : item?.item.image}} resizeMode={'contain'}/> :
        <Image style={[styles.boatImage,style.mH5]} source={require('../../assets/blue_sailboat.png')} resizeMode={'contain'}/>}
      <Text style={[style.font14,style.textCenter,style.boldTxt]}>
        {item.item.boatName}
      </Text>
      </TouchableOpacity>
  
  );
};

const getBoatDetailsHandler =(item)=>{
  setSelectedBoat(item)
  setBoatName(item.item.boatName)
  setBoatOwner(item.item.boatOwner);
  setBoatCaptain(item.item.captain);
  setBoatLength(item.item.length);
  setCrewSolicited(item.item.crewsSolicited);
  setBoatsId(item.item.id)
  setModel(item.item.make)
  setEmail(getMemberData?.username)
  setPhoneNumber(getMemberData?.phoneNumbers[0]?.phoneNumber)
  setSelectedImage(item.item.image)
}
  const backBtnHandler =()=>{
    if(backPath){
      navigation.navigate(backPath)
      setBackPath("")
      route.params = null
    }else{
      setSelectedMember(null);
      route.params = null
    }
  }
  return (
    <View style={styles.container}>
      <View style={style.contant}>
        {!isAddCrew ? (
          selectedMember ? (
            <View>
              <TouchableOpacity
                style={[style.row, style.mtb10]}
                  onPress={backBtnHandler}
              >
                <Icon
                  name="chevron-left"
                  size={normalize(20)}
                  color={COLORS.PRIMARY}
                />
                <Text
                  style={[
                    style.font16,
                    style.primaryText,
                    style.centerItem,
                    style.boldTxt,
                  ]}
                >
                    {`Back to ${backPath ? backPath :'Crew'}`}
                </Text>
              </TouchableOpacity>
              <ScrollView scrollEnabled={true}>
                <View style={[style.centerItem,style.centerBox]}>
                  {selectedMember?.member?.profileUrl ? (
                    <Image
                      style={[styles.crewProfile]}
                      source={{ uri: `${selectedMember?.member?.profileUrl}` }}
                      alt="img"
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      style={[styles.crewProfile]}
                      source={require("../../assets/avatarImage.png")}
                      alt="img"
                      resizeMode="cover"
                    />
                  )}
                   <View>
                          <Text style={[styles.nameTitleTextStyle,style.mt5]}>
                            {selectedMember?.firstName +
                              " " +
                              selectedMember?.lastName}
                          </Text>
                        </View>
                </View>
                <View style={[style.mt5, style.row,style.mH10,style.centerItem ]}>
                  <View style={[styles.btnsAlignment,style.mH10]}>
                    <TouchableOpacity
                      style={[styles.userIcons]}
                      onPress={() => {
                        setChatData(null)
                        navigation.navigate("WebChat")}
                      }
                    >
                      <Image source={require("../../assets/msg-icon.png")} />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.favIconTxt,
                        style.mt5,
                        { color: COLORS.GREY },
                      ]}
                    >
                      Message
                    </Text>
                  </View>
                  <View style={[styles.btnsAlignment, style.mH10]}>
                    <TouchableOpacity
                      style={[styles.userIcons]}
                      onPress={() =>
                        Linking.openURL(`tel:${selectedMember?.phoneNumber}`)
                      }
                    >
                      <Image source={require("../../assets/phone-icon.png")} />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.favIconTxt,
                        style.mt5,
                        { color: COLORS.GREY },
                      ]}
                    >
                      Call
                    </Text>
                  </View>
                  <View style={[styles.btnsAlignment, style.mH10]}>
                    <TouchableOpacity
                      style={[styles.userIcons]}
                      onPress={() =>
                        Linking.openURL(`mailto:${selectedMember?.email}`)
                      }
                    >
                      <Image source={require("../../assets/mail-icon.png")} />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.favIconTxt,
                        style.mt5,
                        { color: COLORS.GREY },
                      ]}
                    >
                      Email
                    </Text>
                  </View>
                  <View style={[styles.btnsAlignment,style.mH10]}>
                  {selectedMember?.attachments &&
                    selectedMember?.attachments.length === 0 ? null : (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[style.mt10]}
                        onPress={downloadFiles}
                      >
                        <Icon
                          style={[style.mH10]}
                          name={"download"}
                          size={25}
                          color={COLORS.PRIMARY}
                        />
                        <Text style={[styles.favIconTxt,style.mt15, style.grayText]}>
                          Resume
                        </Text>
                      </TouchableOpacity>
                    )}
                    </View>
                </View>
                <View style={style.mt15}>
                  <Text style={styles.nameTitleStyle}>OVERVIEW</Text>
                  <Text style={styles.overviewTitleTextStyle}>
                    {selectedMember?.overview
                      ? selectedMember?.overview
                      : "N/A"}
                  </Text>
                </View>
                  
                  <View style={style.mt10}>
                    <Text style={styles.nameTitleStyle}>EMAIL</Text>
                    <Text style={styles.nameTitleTextStyle}>
                      {selectedMember?.email}
                    </Text>
                  </View>
                  <View style={style.mt10}>
                    <Text style={styles.nameTitlePhoneStyle}>PHONE NO</Text>
                    <Text style={styles.nameTitleTextStyle}>
                      {selectedMember?.phoneNumber}
                    </Text>
                  </View>
                  <View style={style.mt10}>
                    <Text style={styles.nameTitleStyle}>
                            QUALIFICATION
                          </Text>
                          <Text style={styles.nameTitleTextStyle}>
                            {selectedMember?.qualification
                              ? selectedMember?.qualification.replace(/_/g, " ")
                              : "N/A"}
                          </Text>
                        </View>
                  <View style={style.mt10}>
                    <Text style={styles.nameTitleStyle}>
                      SAILING EXPERIENCE{" "}
                    </Text>
                    <Text style={styles.nameTitleTextStyle}>
                      {selectedMember?.sailingExperience
                        ? selectedMember?.sailingExperience
                        : "N/A"}
                    </Text>
                  </View>
                  <View style={style.mt10}>
                    <Text style={styles.nameTitlePhoneStyle}>SMOKER</Text>
                    <Text style={styles.nameTitlePhoneTextStyle}>Yes</Text>
                  </View>


                  <View style={style.mt10}>
                    <Text style={styles.nameTitleStyle}>
                      DIETRY REQUIREMENTS
                    </Text>
                    <Text style={styles.nameTitleTextStyle}>
                      {selectedMember?.dietryRequirements
                        ? selectedMember?.dietryRequirements
                        : "N/A"}
                    </Text>
                  </View>
                  <View style={[style.mt10]}>
                    <Text style={styles.nameTitlePhoneStyle}>
                      AVAILABALE DATES
                    </Text>
                    <Text style={styles.nameTitlePhoneTextStyle}>
                      {dateFormat(
                        selectedMember?.availableDates?.split(",")[0]
                      ) +
                        " to " +
                        dateFormat(
                          selectedMember?.availableDates?.split(",")[1]
                        )}
                    </Text>
                  </View>
               
                {loggedInUser?.id !== selectedMember?.member?.id && (
                  <View style={[style.centerItem, , style.mt15, style.mB30]}>
                    {requested &&
                    status !== "ACCEPTED" &&
                    status !== "REJECTED" ? (
                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => requestInfoHandler(selectedMember)}
                      >
                        {requestLoader ? <ActivityIndicator color={COLORS.PRIMARY}/> 
                      :  
                        <Text style={styles.btnTextStyless}>Undo</Text>
                      }
                      </TouchableOpacity>
                    ) : status === "ACCEPTED" ? (
                      <TouchableOpacity
                        style={[styles.button, style.primaryLayout]}
                      >
                        <Text style={style.whiteText}>Accepted</Text>
                      </TouchableOpacity>
                    ) : status === "REJECTED" ? (
                      <TouchableOpacity
                        style={[styles.button, style.primaryLayout]}
                      >
                        <Text style={style.whiteText}>Rejected</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.button, style.primaryLayout]}
                        onPress={() => requestInfoHandler(selectedMember)}
                      >
                         {requestLoader ? <ActivityIndicator color={COLORS.WHITE}/> 
                      :
                        <Text style={style.whiteText}>Request to crew</Text>
                    }
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <ModalNative
                  animationIn={"zoomIn"}
                  animationOut={"zoomOut"}
                  isVisible={modalVisible}
                  backdropColor="rgba(0, 0, 0, 0.3)"
                >
                  <View
                    style={[style.p20, style.whiteLayout, style.borderRadius8]}
                  >
                    <Text style={styles.modalText}>
                        {modalVisibleMsg}
                    </Text>
                  </View>
                </ModalNative>

                <ModalNative
                  animationIn={"zoomIn"}
                  animationOut={"zoomOut"}
                  isVisible={UndomodalVisible}
                  backdropColor="rgba(0, 0, 0, 0.3)"
                >
                  <View
                    style={[style.p20, style.whiteLayout, style.borderRadius8]}
                  >
                    <Text style={styles.modalText}>Undo successfull!</Text>
                  </View>
                </ModalNative>

                <ModalNative
                  animationIn={"zoomIn"}
                  animationOut={"zoomOut"}
                  isVisible={modal}
                  backdropColor="rgba(0, 0, 0, 0.3)"
                >
                  <View
                    style={[style.p20, style.whiteLayout, style.borderRadius8]}
                  >
                    <Text style={styles.modalText}>
                      You do not currently have a registered boat
                    </Text>
                  </View>
                </ModalNative>
                <ModalNative
                  animationIn={"zoomIn"}
                  animationOut={"zoomOut"}
                  isVisible={fileDownloadModal}
                  backdropColor="rgba(0, 0, 0, 0.3)"
                >
                  <View
                    style={[style.p20, style.whiteLayout, style.borderRadius8]}
                  >
                    <Text style={styles.modalText}>
                      {selectedMember?.attachments &&
                      selectedMember?.attachments.length === 0
                        ? "No files are uploaded"
                        : "File downloaded successfully"}
                    </Text>
                  </View>
                </ModalNative>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.container} showsVerticalScrollIndicator={false}>
              <View style={[style.row]}>
                <View style={style.contant}>
                  <Text
                    style={[
                      isTablet
                        ? style.font20
                        : (style.font16, style.mt30, style.boldTxt),
                      style.primaryText,
                      style.mt15,
                    ]}
                  >
                    Find crew on the search bar
                  </Text>
                </View>
                {!isTablet && (
                  <TouchableOpacity
                    onPress={advertiseCrewBtn}
                    style={[
                      style.button,
                      style.primaryLayout,
                      style.borderRadius5,
                      style.row,
                      {
                        marginTop: 5,
                      },
                    ]}
                  >
                    <Text style={[style.font12, style.whiteText, style.mr10]}>
                      {" "}
                      Advertise Crew
                    </Text>
                    <Icon
                      name="plus"
                      size={isTablet ? 20 : 16}
                      color={COLORS.WHITE}
                    ></Icon>
                  </TouchableOpacity>
                )}
              </View>
              <FilterComponent
                searchInput={search}
                onSearchBut={() => setsearchTxt(search)}
                onChangeText={(txt: string) => {
                  setSearch(txt);
                }}
                placeholder={"Find Crew"}
                Buttonholder={"Find Crew"}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                filter={true}
                departureDateRange={true}
                // location={true}
                qualification={true}
                // experience={true}
                experienceDropDown={true}
                qualificationTxt={qualificationTxt}
                setQualificationTxt={setQualificationTxt}
                experienceTxt={experienceTxt}
                setExperinceTxt={setExperinceTxt}
                setDateTxtFrom={setDateTxtFrom}
                dateTxtFrom={dateTxtFrom}
                setDateTxtTo={setDateTxtTo}
                dateTxtTo={dateTxtTo}
                data={crew}
                locationInput={locationTxt}
                onLocationTxt={setLocationTxt}
              />
              {isLoader ? (
                <View style={[style.mt40, style.contant]}>
                  <ActivityIndicator
                    style={[style.mt40, style.centerBox]}
                    color={COLORS.PRIMARY}
                  />
                </View>
              ) : (
                <View style={styles.container}>
                  {filteredList && filteredList.length > 0 ? (
                    <FlatList
                      data={filteredList}
                      contentContainerStyle={[style.pb80]}
                      renderItem={
                        isTablet ? renderCrewList : renderPhomeCrewList
                      }
                      showsVerticalScrollIndicator={false}
                    />
                  ) : (
                    <View
                      style={[style.contant, style.centerItem, style.centerBox]}
                    >
                      <Text style={[style.font14]}>{noCrewText}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )
        ) : (
          <ScrollView
            style={{ paddingBottom: normalize(20) }}
            showsVerticalScrollIndicator={false}
          >
            <View style={[style.contentCenter, style.mt10]}>
              <Text style={[style.font18, style.boldTxt, style.primaryText]}>
                Crew Vacancy Advertise
              </Text>
            </View>

            {getMemberData?.boats?.length > 0 ? (
              <FlatList
                scrollEnabled={getMemberData?.boats?.length > 3 ? true : false}
                horizontal={true}
                data={getMemberData?.boats}
                renderItem={renderSuggestedBoats}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={[style.font16, style.textCenter, style.mtb20]}>
                No Boats Found
              </Text>
            )}
            <View style={[isTablet && style.row]}>
              <View style={[style.contant, style.mt15]}>
                <RenderInput
                  name="BOAT NAME"
                  placeholder="Enter boat name"
                  value={boatName}
                  setValue={setBoatName}
                  valueError={boatNameError}
                  setValueError={setBoatNameError}
                  editable={false}
                  required={true}
                />
                <RenderInput
                  name="BOAT OWNER"
                  placeholder="Enter owner name"
                  value={boatOwner}
                  setValue={setBoatOwner}
                  required={true}
                  editable={false}
                />
                <RenderInput
                  name="BOAT CAPTAIN"
                  placeholder="Enter captain name"
                  value={boatCaptain}
                  setValue={setBoatCaptain}
                  required={false}
                  editable={false}
                />
                <RenderInput
                  name="BOAT LENGTH"
                  placeholder="Enter boat length"
                  value={boatLength}
                  setValue={setBoatLength}
                  required={false}
                  editable={false}
                />
                <RenderInput
                  name="CREWS SOLICITED"
                  placeholder="Enter crews solicited"
                  value={crewSolicited}
                  setValue={setCrewSolicited}
                  required={false}
                  editable={false}
                />
                <View style={[isTablet && style.row, style.between]}>
                  <RenderInput
                    name="PHONE NUMBER"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                    valueError={phoneNumberError}
                    setValueError={setPhoneNumberError}
                    keyboardType={"numeric"}
                    required={true}
                    maxLength={10}
                  />
                  <RenderInput
                    name="EMAIL"
                    placeholder="Enter email"
                    value={email}
                    setValue={setEmail}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                    valueError={emailError}
                    setValueError={setEmailError}
                    required={true}
                  />
                </View>
                <View style={[isTablet && style.row, style.between]}>
                  <RenderInput
                    name="CREW VACANCY"
                    placeholder="Enter crew vacancy"
                    value={crewVacancy}
                    setValue={setCrewVacancy}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                    valueError={crewVacancyError}
                    setValueError={setCrewVacancyError}
                    required={true}
                  />
                  <RenderDropdown
                    name="POSITION"
                    placeholder="Select position"
                    value={position}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                    valueError={positionError}
                    onChange={(item) => {
                      setPosition(item.value);
                    }}
                    required={true}
                    data={positiondata}
                  />
                </View>
                <View style={[isTablet && style.row, style.between]}>
                  <View style={[style.row, style.between]}>
                    <RenderInput
                      name="Route From"
                      placeholder="Enter route from"
                      value={routeFrom}
                      setValue={setRouteFrom}
                      required={true}
                      stylesProp={{ width: "48%" }}
                      valueError={routeFromError}
                      setValueError={setRouteFromError}
                    />
                    <RenderInput
                      name="Route To"
                      placeholder="Enter route to"
                      value={routeTo}
                      setValue={setRouteTo}
                      required={true}
                      stylesProp={{ width: "48%" }}
                      valueError={routeToError}
                      setValueError={setRouteToError}
                    />
                  </View>
                  <View style={[style.row, style.between]}>
                    <DateTimePickerBox
                      onChangeText={(value) => {
                        setRallyDateFrom(value);
                        setRallyDateError("");
                      }}
                      value={rallyDateFrom}
                      placeholder={"From"}
                      labelName="Rally dates"
                      modal={"date"}
                      minDate={new Date()}
                      required={true}
                      stylesProp={{ width: "48%" }}
                    />
                    <DateTimePickerBox
                      onChangeText={(value) => {
                        setRallyDateTo(value);
                        setRallyDateError("");
                      }}
                      value={rallyDateTo}
                      placeholder={"To"}
                      modal={"date"}
                      minDate={rallyDateFrom}
                      stylesProp={{ width: "48%" }}
                      disabled={!rallyDateFrom}
                    />
                  </View>
                  {rallyDateError && (
                    <Text style={[style.textDanger]}>{rallyDateError} </Text>
                  )}
                  <RenderInput
                  name="MAKE & MODEL"
                  placeholder="Enter make and model"
                  value={model}
                  setValue={setModel}
                  editable={false}
                  stylesProp={isTablet ? styles.renderInputStyle : undefined}
                  />
                  <RenderDropdown
                    value={smokingPreferences}
                    onChange={(item) => {
                      setSmokingPreferences(item.value);
                    }}
                    name={"SMOKER"}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                    data={data}
                    placeholder={"Select"}
                  />
                </View>
                <View style={[isTablet && style.row, style.between]}>
                  <RenderInput
                    name="EXPENSE"
                    placeholder="Enter expense"
                    value={costOfCrewMember}
                    setValue={setCostOfCrewMember}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                    valueError={costOfCrewMemberError}
                    setValueError={setCostOfCrewMemberError}
                    required={true}
                  />
                </View>
                <View style={[isTablet && style.row, style.between]}>
                  <RenderInput
                    name="ANY DIETARY RESTRICTIONS"
                    placeholder="Enter restrictions"
                    value={restrictions}
                    setValue={setRestrictions}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                  />

                  <RenderInput
                    name="DESCRIPTION"
                    placeholder="Enter description"
                    value={description}
                    setValue={setDescription}
                    multiline={true}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                  />
                </View>
                {!isTablet && (
                  <TouchableOpacity
                    onPress={selectImage}
                    style={{
                      backgroundColor: "rgba(52, 52, 52, 0.3)",
                      width: normalize(80),
                      height: normalize(80),
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      marginTop: 10,
                    }}
                  >
                    {loading ? (
                      <View style={{ position: "absolute", zIndex: 10 }}>
                        <ActivityIndicator
                          theme={{ colors: { primary: COLORS.WHITE } }}
                        />
                      </View>
                    ) : (
                      <View
                        style={[
                          {
                            position: "absolute",
                            zIndex: 10,
                            flexDirection: "column",
                          },
                          style.centerBox,
                          style.centerItem,
                        ]}
                      >
                        <Icon
                          onPress={selectImage}
                          name="upload"
                          size={30}
                          color={COLORS.WHITE}
                        />
                        <Text style={[style.font14, { color: "white" }]}>
                          Upload Image
                        </Text>
                      </View>
                    )}
                    {selectedImage && (
                      <Image
                        source={{ uri: selectedImage }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 8,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                )}
                <View style={[style.row,style.mt3]}>
                  <Text style={[style.font14,style.grayText]}>NOTE:</Text>
                  <Text style={[style.textDanger]}> * </Text>
                  <Text style={[style.font14,style.grayText]}>Indicates Required Fields</Text>
                  </View>
                {beError && <Text style={style.textDanger}>{beError} </Text>}
                <View
                  style={
                    isTablet
                      ? style.row && style.mtb10
                      : !isTablet && style.mtb10
                  }
                >
                  {editboat ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.btnStyle}
                      onPress={advertiseCrewVacancyHandler}
                    >
                      {advertiseCrewLoader ? (
                        <ActivityIndicator
                          theme={{ colors: { primary: COLORS.WHITE } }}
                        />
                      ) : (
                        <Text style={styles.btnTextStyle}>
                          {isDarft ? "Update Draft" : "Update Vacancy"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <View style={style.contentBetween}>
                      <TouchableOpacity
                        onPress={() => onDraftCreate()}
                        activeOpacity={0.8}
                        style={styles.btnStyleBorder}
                      >
                        {savedraftLoader ? (
                          <ActivityIndicator
                            theme={{ colors: { primary: COLORS.PRIMARY } }}
                          />
                        ) : (
                          <Text style={styles.btnTextStyleDraft}>
                            Save as Draft
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.btnStyle}
                        onPress={advertiseCrewVacancyHandler}
                      >
                        {advertiseCrewLoader ? (
                          <ActivityIndicator
                            theme={{ colors: { primary: COLORS.WHITE } }}
                          />
                        ) : (
                          <Text style={styles.btnTextStyle}>Post Vacancy</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              <ModalNative
                  animationIn={"zoomIn"}
                  animationOut={"zoomOut"}
                  isVisible={adCrewSuccess}
                  backdropColor="rgba(0, 0, 0, 0.3)"
                >
                  <View
                    style={[style.p20, style.whiteLayout, style.borderRadius8]}
                  >
                    <Text style={styles.modalText}>
                      {adCrewSuccessMsg}
                    </Text>
                  </View>
                </ModalNative>
              {isTablet && (
                <View style={[{ flex: 0.5 }, style.row, style.centerItem]}>
                  <View
                    style={{
                      backgroundColor: "rgba(52, 52, 52, 0.3)",
                      width: normalize(80),
                      height: normalize(85),
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4,
                      marginTop: 40,
                    }}
                  >
                    <Image
                      source={require("../../assets/boat1.png")}
                      style={styles.profileImg}
                    />
                    <Icon
                      onPress={selectImage}
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
      {loader && <ActivityIndicator style={{position:'absolute',top:"50%",right:"50%"}} theme={{   colors: { primary: COLORS.PRIMARY } }} /> }
    </View>
  );
}

export default FindCrew

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:normalize(5),
    marginBottom:normalize(5)
},
  nameTitlePhoneStyle:{
    color:COLORS.GREY,
    fontSize:normalize(10),
  },
  nameTitlePhoneTextStyle:{
    color:COLORS.BLACK,
    fontSize:normalize(14),
    fontWeight:"600",
    lineHeight:30,
  },
    labelStyle:{
        fontSize:normalize(14),
        color:COLORS.BLACK,
        marginTop:normalize(10)
    },

    inputBorderStyle:{
        borderWidth:.9,
        borderColor:COLORS.GREY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(10),
        borderRadius:4,
        marginVertical:normalize(5),
       
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
        resizeMode:'contain',
        borderWidth:1,
      },
      crewProfile:{
        width:normalize(80),
        height:normalize(80),
        borderRadius: 60,
        resizeMode:'contain',
        borderWidth:1,
        borderColor:"#EDEDED"
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
      },
      overviewTitleTextStyle:{
        color:COLORS.BLACK,
        fontSize:normalize(14),
        fontWeight:"600",
        lineHeight:20,
        width: "100%"
      },
      line: {
        borderTopWidth: 1,
        borderColor: COLORS.BORDERGREY,
        paddingVertical: normalize(10),
      },
      btnStyleBorder:{
        borderColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        borderRadius:8,
        height: normalize(40),
        width: "45%",
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        borderWidth:1
      }
,
      btnStyle:{
        backgroundColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        borderRadius:8,
        height: normalize(40),
        width: "45%",
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
      },
      btnStyless:{
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        margin:normalize(5),
        borderRadius:normalize(4),
        height:normalize(30),
        justifyContent:'center',
        alignItems:'center',
        marginLeft:40,
        width:"100%"
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
      btnTextStyle:{
        color:COLORS.WHITE,
        fontSize:normalize(14),
        fontWeight:'600'
      },
      btnTextStyleDraft:{
        color:COLORS.PRIMARY,
        fontSize:normalize(14),
        fontWeight:'600'
      },


      btnStyleOutline:{
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        // paddingVertical:normalize(5),
        marginBottom:normalize(5),
        borderRadius:normalize(4),
        marginRight:'auto',
        height:normalize(30),
        justifyContent:'center',
        alignItems:'center',
        marginTop:20
      },
      btnOutlineTextStyle:{
        color:COLORS.PRIMARY,
        fontSize:normalize(13),
      },

      btnDownloadOutline:{
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        marginBottom:50,
        borderRadius:normalize(4),
        marginRight:'auto',
        justifyContent:'center',
        alignItems:'center',
        marginTop:5,
        backgroundColor: COLORS.WHITE,
        height: normalize(40),
        width:"100%"
      },
      downloadTextStyle:{
        color:COLORS.PRIMARY,
        fontSize:normalize(13),
      },


      viewBtnStyle:{
        paddingHorizontal:15,
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        borderRadius:4,
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
        color: COLORS.BLACK
      },
      dropdown: {
        height: 50,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.GREY,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(0),
        borderRadius: 4,
        width: '100%',
        marginTop: 5
      },
      placeholderStyle: {
        fontSize: 16,
        color: COLORS.BLACK
      },
      selectedTextStyle: {
        fontSize: 16,
        color: COLORS.BLACK
      },
      iconStyle: {
        width: 30,
        height: 30,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      button:{
        borderColor:COLORS.PRIMARY,
        borderWidth:1,
        borderRadius:8,
        alignContent:'center',
        alignItems:'center',
        paddingHorizontal:10,
        paddingVertical:10
     },
     editIconsWidth:{
      flex:1
     },
     btnsAlignment :{
      flexDirection:"column",
      alignItems:'center'
    },
    userIcons:{
      width:45,
      height:45,
      borderWidth:0,
      borderColor:COLORS.PRIMARY,
      alignItems:"center",
      display:'flex',
      justifyContent:"center",
      borderRadius:5,
    },
    favIconTxt:{
      fontSize:14,
      textAlign:'center'
    },
    boatImage :{
      width:normalize(55),
      height:normalize(55),
      borderRadius: 8
    },
    viewButton:{
      borderColor:COLORS.PRIMARY,
      borderWidth:1,
      borderRadius:8,
      alignContent:'center',
      alignItems:'center',
      paddingHorizontal:8,
      paddingVertical:10
   },
   renderInputStyle:{ 
    width: "48%" 
   }
  })