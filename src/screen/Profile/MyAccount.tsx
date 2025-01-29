import { Image, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight, FlatList, Platform, PermissionsAndroid, Alert } from "react-native";
import Share from 'react-native-share';
import style from "../../styles/style";
import { normalize, scaleWidth } from "../../styles/utilities/dimentions";
import { isTablet } from "react-native-device-info";
import React, { useEffect, useState, useRef, RefObject,useContext } from "react";
import COLORS from "../../styles/theme/color";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Feather';
import CheckBox from "react-native-check-box";
import { deleteLinkedProfiles, getLinkedProfiles, getMember, updateMemberInfo,deleteMember, getMyBoats } from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderInput from "../BecomeMember/RenderInput";
import { RadioButton } from 'react-native-paper';
import moment from "moment";
import { ActivityIndicator } from 'react-native-paper';
import MembersContext from '../Members/MembersContext';
import Config from 'react-native-config';
import s3 from '../../services/aws-config';
import RenderDropdown from "../BecomeMember/RenderDropdown";
import DateTimePickerBox from "../../components/dateTimeBox";
import { Dimensions } from "react-native";
import RenderCheckBox from "../BecomeMember/RenderCheckBox";
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker'
import fs from 'react-native-fs';
import {decode} from 'base64-arraybuffer';
import RNFetchBlob from "rn-fetch-blob";
import ModalNative from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import ProgressBar from 'react-native-progress/Bar';
import { checkPermissions, dateFormatFunction, permissionAlert } from "../../styles/utilities/variables";
import  ImageCompressor  from 'react-native-compressor';
import { CometChat } from "@cometchat/chat-sdk-react-native";



const MyAccount = ({ isEdit, setIsEdit }: any) => {
  const navigation = useNavigation()
  const [isConfigEdit, setIsConfigEdit] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isActive, setIsActive] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const token = AsyncStorage.getItem("accessToken");
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [firstname, setFirstName] = useState('');
  const [firstnameErr, setFirstNameErr] = useState('');
  const [lastname, setLastName] = useState('');
  const [lastnameErr, setLastNameErr] = useState('');
  const [knownAs, setKnownAs] = useState('');
  const [role, setRole] = useState('');
  const [roleErr, setRoleErr] = useState('');
  const [email, setEmail] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [homeEmail, setHomeEmail] = useState('');
  const [homeEmailErr, setHomeEmailErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [mobileNoErr, setMobileNoErr] = useState('');
  const [dob, setDob] = useState(new Date());
  const [dobErr, setDobErr] = useState('');
  const [address1, setAddress1] = useState('');
  const [address1Err, setAddress1Err] = useState('');
  const [address2, setAddress2] = useState('');
  const [addressErr, setAddressErr] = useState('');
  const [city, setCity] = useState('');
  const [cityErr, setCityErr] = useState('');
  const [state, setState] = useState('');
  const [stateErr, setStateErr] = useState('');
  const [country, setCountry] = useState('');
  const [countryErr, setCountryErr] = useState('');
  const [postalcode, setPostalCode] = useState('');
  const [postalcodeErr, setPostalCodeErr] = useState('');
  const [oceanOrWorldClassQualification, setOceanOrWorldClassQualification] = useState('');
  const [oceanOrWorldClassQualificationError, setOceanOrWorldClassQualificationError] = useState('');
  const [showPickerBirthday, setShowPickerBirthday] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [checked, setChecked] = useState('ocean_class');
  const [oceanClassQualificationPassage, setOceanClassQualificationPassage] = useState('');
  const [worldClassQualificationPassage, setWorldClassQualificationPassage] = useState('');
  const [dwagTalesNewsletter, setDwagTalesNewsletter] = useState(false);
  const [rallyUpdates, setRallyUpdates] = useState(false);
  const [membershipUpdates, setMembershipUpdates] = useState(false);
  const [crewServiceUpdates, setCrewServiceUpdates] = useState(false);
  const [events, setEvents] = useState(false);
  const [generalInfo, setGeneralInfo] = useState(false);
  const [allTheAbove, setAllTheAbove] = useState(false);
  const [memberDirectory, setMemberDirectory] = useState('do_not');
  const [memberMap, setMemberMap] = useState('do_not');
  const [dateFormat, setDateFormat] = useState('MM/dd/yyy');
  const [sailingdistance, setSailingDistance] = useState('Knots');
  const [otherdistance, setOtherDistance] = useState('Metric');
  const [temperature, setTemperature] = useState("Celsius");
  const [hearAboutUs, setHearAboutUs] = useState('');
  const [isLodering, setIsLodering] = useState(false);
  const [isProfileLoader, setIsProfileLoader] = useState(false);
  const [isConfigLoader, setIsConfigLoader] = useState(false);
  const [isImageLodering, setIsImageLodering] = useState(false);
  const [showLinkedProfiles, setShowLinkedProfiles] = useState(false);
  const [getLinkedProfilesData, setGetLinkedProfilesData] = useState([]);
  const {loggedInUser,setLoggedInUserUpdate,setHideChatbotMember, setHideChatbot,setDateFormatter,setLoggedInUser } = useContext(MembersContext);  
  const [doc, setDoc] = useState(null);
  const [fileDownloadModal,setFileDownloadModal] = useState(false);
  const [loader, setLoader] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteUserModal,setDeleteUserModal] = useState(false);
  const [userPrimaryBoat,setUserPrimaryBoat] = useState(null);

  const data = [
    { label: 'English', value: 'English' }
  ];

  const positiondata = [
    { label: 'Captain', value: 'CAPTAIN' },
    { label: 'Co-Captain', value: 'CO_CAPTAIN' },
    { label: 'First Mate', value: 'FIRSTMATE' },
    { label: 'Crew', value: 'CREW' },
  ];

  const openProfile = () =>{
    navigation.navigate('MemberCard')
  }

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.doc,DocumentPicker.types.pdf,DocumentPicker.types.docx],
      });
  
      const file = res[0]; // Take only the first file if multiple are picked
  
      // Prepare content disposition header
      const contentDisposition = 'inline; filename="' + file.name + '"';
      let arrayBuffer = null
  if(Platform.OS === 'android'){
// Read file data and convert to ArrayBuffer
const base64 = await fs.readFile(file.uri, 'base64');
 arrayBuffer = await decode(base64);
  }else{
    // Read file data and convert to ArrayBuffer using fetch
    const response = await fetch(file.uri);
     arrayBuffer = await response.arrayBuffer();
  }
  
      // Prepare S3 upload parameters
      const params = {
        Bucket: Config.BUCKET_NAME,
        Key: `${Config.DIRECTORY_NAME}/${loggedInUser.id}/${file.name}`,
        Body: arrayBuffer,
        ContentDisposition: contentDisposition,
        ContentType: file.type,
      };
      setIsUploading(true);
      // Perform S3 upload
      s3.upload(params)
      .on('httpUploadProgress', (evt) => {
        setUploadProgress(evt.loaded / evt.total);
      })
      .send((err, data) => {
        setIsUploading(false);
        if (err) {
          console.error("Error uploading file:", err);
        } else {
          console.log("File uploaded successfully:", data);
          // You can save the file URL in your database or use it as needed.
      const uploadedFile = {
        fileName: file.name,
        uploadUrl: `${Config.DIRECTORY_URL}/${Config.DIRECTORY_NAME}/${loggedInUser.id}/${file.name}`,
        uploaded: true,
      };
      setDoc([uploadedFile]); // Set doc as an array with the uploaded file
    }
  });
    } catch (error) {
      console.error("Error picking/uploading file:", error);
      setIsUploading(false);
      // Handle error
    }
  };

  const removeDocument = (index) => {
    const updatedDocuments = [...doc];
    updatedDocuments.splice(index, 1);
    setDoc(updatedDocuments);
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 31) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "This app needs access to your storage to download files",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  };

  const downloadFile = async() => {
   if (Platform.OS === 'android' && Platform.Version < 31) {
    const granted = await requestStoragePermission();
    if (!granted) {
    Alert.alert('Storage permission is required to download the file');
      return;
    }
   }
    const { dirs } = RNFetchBlob.fs;
    const fileUrl = userData?.attachments[0]?.uploadUrl; // Assuming only one file is selected, change as needed
    if (!fileUrl) {
      console.log('No file URL found');
      setFileDownloadModal(true)
      return;

    }
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    RNFetchBlob.config({
      fileCache: true,
      appendExt:userData?.attachments[0]?.fileName.split(".")[1], 
      path : `${dirToSave}/${userData?.attachments[0]?.fileName}`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: userData?.attachments[0]?.fileName,
        path : `${dirToSave}/${userData?.attachments[0]?.fileName}`,
        description:'Downloading file'
      },
    })
      .fetch('GET', fileUrl)
      .then(res => {
        // File was downloaded successfully
        console.log('File downloaded to:', res.path());
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
    let timeout = null;
    if (fileDownloadModal) {
      timeout = setTimeout(() => {
        setFileDownloadModal(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [fileDownloadModal]);
  
  const updateInfoHandler = async () => {
    
    setAddress1Err("")
    setEmailErr("")
    setFirstNameErr("")
    setLastNameErr("")
    setRoleErr("")
    setMobileNoErr("")
    setAddressErr("")
    setCityErr("")
    setCountryErr("")
    setPostalCodeErr("")
    setStateErr("")
    setHomeEmailErr('')
    setDobErr("")

    const phoneRegex = /^\d{10}$/;
    const postalcodeRegex = /^\d{5}$/;
    const nameRegex = /^[A-Za-z0-9 !@#$%^&*()_+{}[\]:;<>,.?~`-]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = true;
    if (firstname === '') {
      setFirstNameErr('Please enter the firstname');
      isValid = false;
    } else if (!nameRegex.test(firstname)) {
      setFirstNameErr('Please enter the firstname');
      isValid = false;
    }
    if (lastname === '') {
      setLastNameErr('Please enter the lastname');
      isValid = false;
    } else if (!nameRegex.test(lastname)) {
      setLastNameErr('Please enter the lastname');
      isValid = false;
    }
     if (homeEmail && !emailRegex.test(homeEmail)) {
      setHomeEmailErr('Please enter valid mail');
      isValid = false;
    }
    if (mobileNo === '') {
      setMobileNoErr('Please enter the mobile number');
      isValid = false;
    } else if (!phoneRegex.test(mobileNo)) {
      setMobileNoErr('Please enter the mobile number');
      isValid = false;
    }
    if (address1 === '') {
      setAddress1Err('Please enter the address');
      isValid = false;
    }
    if (city === '') {
      setCityErr('Please enter the city');
      isValid = false;
    } else if (!nameRegex.test(city)) {
      setCityErr('Please enter the city');
      isValid = false;
    }
    if (state === '') {
      setStateErr('Please enter the state');
      isValid = false;
    } else if (!nameRegex.test(state)) {
      setStateErr('Please enter the state');
      isValid = false;
    }
    if (country === '') {
      setCountryErr('Please enter the country');
      isValid = false;
    } else if (!nameRegex.test(country)) {
      setCountryErr('Please enter the country');
      isValid = false;
    }
   const momentObject = moment(dob, "MM-DD-YYYY"); 
    const formattedDate = momentObject.format("YYYY-MM-DD"); 


    const homeEmailAddress = userData.emailAddress.find(email => email.type === "HOME");
    const nonBillingAddresses = userData.addresses.filter(address => address.isPreferred);
    const isValidDate = !isNaN(new Date(formattedDate));
    const payload = {
      "id": userData.id,
      "firstName": firstname,
      "lastName": lastname,
      "dob": isValidDate? formattedDate : null,
      "knownAs": knownAs,
      "isPrivate": isPrivate,
      "isPrimary": true,
      "profileUrl":selectedImage,
      "autoRenewal": true,
      "membershipLevel": userData?.membershipLevel,
      "addresses":nonBillingAddresses && nonBillingAddresses.length > 0 ? nonBillingAddresses.map(address => ({
        ...address,
        "country": country,
        "city": city,
        "postalCode": postalcode,
        "streetAddress1": address1,
        "streetAddress2": address2,
        "state": state
      })) : [{
        "country": country,
        "city": city,
        "postalCode": postalcode,
        "streetAddress1": address1,
        "streetAddress2": address2,
        "state": state,
        "isPreferred":true,
        "isPrimary":true
      }],
      "role": (role ?{
        ...userData.role,
        "roleName": role
      } : null),
      "emailAddress": homeEmailAddress && homeEmail  ? [
        {
          ...homeEmailAddress,
          "email": homeEmail
        },...userData.emailAddress.filter(item => item.type !== 'HOME')
      ] : [
        ...(homeEmail && [{
          "email": homeEmail,
          "type": 'HOME'
        }] )
        ,...userData.emailAddress
      ],
      "attachments":doc ? doc : [],
      "phoneNumbers": userData.phoneNumbers.length > 0 ? [
        {
          ...userData.phoneNumbers[0],
          "phoneNumber": mobileNo,
        }
      ] : [
        {
          "phoneNumber": mobileNo,
          "type": "PRIMARY"
        }
      ]
    };
    if (isValid) {
      setLoggedInUserUpdate(false)
      
      try {
        setIsProfileLoader(true)
        setUpdateSuccess(false)
        const response = await updateMemberInfo(payload, token)
        if (response.status === 200) {
          try {
            let user = new CometChat.User(userData.id);
            const name = `${firstname || ""} ${lastname || ""}${userPrimaryBoat ? ` - ${userPrimaryBoat}` : ""}`;

            user.setName(name);
            user.setAvatar(encodeURI(selectedImage));
    
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
          setIsEdit(false)
          setIsProfileLoader(false)
          setIsConfigEdit(false)
          setUpdateSuccess(true)
          setLoggedInUserUpdate(true)
        }
      } catch (error) {
        console.error(error);
        setIsProfileLoader(false)
      }
    }
  }

useFocusEffect(React.useCallback(()=>{
  getLinkedProfilesHandler()
},[updateSuccess]))
const getLinkedProfilesHandler = async () => {
  try {
    const response = await getLinkedProfiles(loggedInUser.id, token);
    if (response.status === 200) {
      if(response.data[0].message ==='No Records Found'){
        setGetLinkedProfilesData([]);
      }else{
        setGetLinkedProfilesData(response.data);
      }
    }
  } catch (err) {
    console.error(err);
  }
};


  const selectImage = async() => {
    const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        permissionAlert()
        return; 
      }
    ImagePicker.openPicker({
      mediaType:'photo',
      cropping: false,
      cropperActiveWidgetColor:"#FFFFFF",
    }).then(async (image) => {
      const result = await ImageCompressor.Image.compress(image.path,{
        quality:0.8
      });
      const fileContent = await fetch(result);
      const blob = await fileContent.blob();
      if (result) {
        const fileName = result.split('/').pop();
        setIsImageLodering(true);
        const params = {
          Bucket: Config.BUCKET_NAME,
          Key: `${Config.DIRECTORY_NAME}/${loggedInUser.id}/${fileName}`,
          Body: blob,
        };
        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading image:", err);
            setIsImageLodering(false);
          } else {
            
            console.log('uploadedImag',data);
            setSelectedImage(`${Config.DIRECTORY_URL}/${data.key}`)
            setIsImageLodering(false);
          }
        });
      }
    });

};
const getMyBoatsHandler = async ()=>{
  try {
    const response = await getMyBoats(token);
    if(response.status === 200){
      if(response.data && response.data.length >0){
        const filterPrimaryBoat = response.data?.find(item => item.isPrimary)
        if(filterPrimaryBoat && filterPrimaryBoat.boatName){
          setUserPrimaryBoat(filterPrimaryBoat.boatName)
        }
      }
    }
  } catch (error) {
    console.error('error',error);
    
  }
}
  useEffect(() => {
    getMyBoatsHandler()
    getMemberData()
  }, [updateSuccess])

    const getMemberData = async () => {
      try {
        setIsLodering(true)
        const response = await getMember(token)
        if (response.status === 200) {
          setUserData(response.data)
          setFirstName(response.data?.firstName)
          setLastName(response.data?.lastName)
          setKnownAs(response.data?.knownAs)
          setRole(response.data?.role?.roleName)
          setMobileNo(response.data?.phoneNumbers[0]?.phoneNumber)
          const preferedEmailAddress = response.data?.emailAddress.filter(item => item.type === 'HOME')
          const primaryEmailAddress = response.data?.emailAddress.filter(item => item.type === 'PRIMARY')
          setEmail(response.data?.username)
          setHomeEmail(preferedEmailAddress[0]?.email ? preferedEmailAddress[0]?.email :'')
          setPrimaryEmail(primaryEmailAddress[0]?.email ? primaryEmailAddress[0]?.email :'')
          setDob(response.data?.dob ? new Date(response.data?.dob) : "")
          const preferedAddress = response.data?.addresses.filter(item => item.isPreferred)
          setAddress1(preferedAddress[0]?.streetAddress1 || '')
          setAddress2(preferedAddress[0]?.streetAddress2 || '')
          setCity(preferedAddress[0]?.city || '')
          setState(preferedAddress[0]?.state || '')
          setCountry(preferedAddress[0]?.country || '')
          setPostalCode(preferedAddress[0]?.postalCode || '')
          setIsPrivate(response.data?.isPrivate)
          setProfileImage(response.data?.profileUrl)
          setOceanOrWorldClassQualification(response.data?.metadata && response.data?.metadata?.oceanOrWorldClassQualification)
          setChecked(response.data?.metadata && response.data?.metadata?.oceanOrWorldClassQualification)
          setOceanClassQualificationPassage(response.data?.metadata && response.data?.metadata?.oceanClassQualificationPassage)
          setWorldClassQualificationPassage(response.data?.metadata && response.data?.metadata?.worldClassQualificationPassage)
          setMemberDirectory(response.data?.metadata && response.data?.metadata?.memberDirectoryVisibility)
          setDoc(response.data?.attachments)
          setDateFormat(response.data?.metadata && response.data?.metadata?.dateFormat)
          setDateFormatter(response.data?.metadata && response.data?.metadata?.dateFormat)
          setSelectedLanguage(response.data?.metadata && response.data?.metadata?.language)
          setOtherDistance(response.data?.metadata && response.data?.metadata?.otherDistances)
          setSailingDistance(response.data?.metadata && response.data?.metadata?.sailingDistance)
          setTemperature(response.data?.metadata && response.data?.metadata?.temperature)
          setMemberMap(response.data?.metadata && response.data?.metadata?.memberMapVisibility);
          setHearAboutUs(response.data?.metadata && response.data?.metadata?.hearAboutUs);          
          setDwagTalesNewsletter(response.data?.metadata && response.data?.metadata?.dwagTalesNewsletter ? response.data?.metadata?.dwagTalesNewsletter : false);
          setRallyUpdates(response.data?.metadata && response.data?.metadata?.rallyUpdates ? response.data?.metadata?.rallyUpdates : false);
          setCrewServiceUpdates(response.data?.metadata && response.data?.metadata?.crewServiceUpdates ? response.data?.metadata?.crewServiceUpdates : false);
          setAllTheAbove(response.data?.metadata && response.data?.metadata?.allTheAbove ? response.data?.metadata?.allTheAbove : false);
          setGeneralInfo(response.data?.metadata && response.data?.metadata?.generalInfo ? response.data?.metadata?.generalInfo :false);
          setEvents(response.data?.metadata && response.data?.metadata?.events ? response.data?.metadata?.events : false);
          setMembershipUpdates(response.data?.metadata && response.data?.metadata?.membershipUpdates ? response.data?.metadata?.membershipUpdates : false);
          setSelectedImage(response.data?.profileUrl)
          setIsLodering(false)
        }
      } catch (error) {
        console.error(error)
      }
    }
   
  const closeEditProfileHandler = ()=> {
    setAddress1Err("")
    setEmailErr("")
    setFirstNameErr("")
    setLastNameErr("")
    setRoleErr("")
    setMobileNoErr("")
    setAddressErr("")
    setCityErr("")
    setCountryErr("")
    setPostalCodeErr("")
    setStateErr("")
    setHomeEmailErr('')
    setDobErr("") 
    setIsEdit(false)
    getMemberData()
  }

  const closeEditConfigHandler = () => {
    setIsConfigEdit(false)
    getMemberData()
  }

  const handleDeleteUser = async ()=>{
    try {
     setLoader(true)
     const response = await deleteMember(loggedInUser?.id,token)
     if (!response.errors) {
      try {
       await AsyncStorage.removeItem('accessToken');
       await AsyncStorage.removeItem('userStatus');
      setLoggedInUser([])
      } catch (error) {
       console.log(error);
      }
         setDeleteUserModal(false)
         setLoader(false);
         setTimeout(() => {
           navigation.navigate("authStack")
         }, 200);
     }
    } catch (error) {
     console.error(error)
     try {
       await AsyncStorage.removeItem('accessToken');
       await AsyncStorage.removeItem('userStatus');
       setLoggedInUser([])
      } catch (error) {
       console.log(error);
      }
     // await AsyncStorage.clear()
     setDeleteUserModal(false)
     setLoader(false)
     setTimeout(() => {
       navigation.navigate("authStack")
     }, 200);
    }
 }

  const updateConfigHandler = async() => {
    const momentObject = moment(dob, "MM-DD-YYYY"); 
    const formattedDate = momentObject.format("YYYY-MM-DD"); 
    const isValidDate = !isNaN(new Date(formattedDate));
    const payload={
        "id": userData.id,
        "username": email,
        "firstName": firstname,
        "lastName": lastname,
        "dob": isValidDate? formattedDate : null,
        "knownAs": knownAs,
        "profileUrl":selectedImage,
        "metadata": {
          "id":userData?.metadata?.id,
          "language":selectedLanguage,
          "oceanOrWorldClassQualification": checked,
          "oceanClassQualificationPassage": oceanClassQualificationPassage,
          "worldClassQualificationPassage": worldClassQualificationPassage,
          "memberDirectoryVisibility": memberDirectory,
          "hearAboutUs": hearAboutUs,
            "dwagTalesNewsletter": dwagTalesNewsletter ,
            "rallyUpdates": rallyUpdates ,
            "membershipUpdates": membershipUpdates ,
            "crewServiceUpdates": crewServiceUpdates ,
            "events": events ,
            "generalInfo": generalInfo ,
            "allTheAbove": allTheAbove ,
          "temperature":temperature

        }
    }
    try {
      setIsConfigLoader(true);
      setUpdateSuccess(false)
      const response = await updateMemberInfo(payload,token);
      if(response.status === 200){
        setIsConfigEdit(false)
        setUpdateSuccess(true)
        setIsConfigLoader(false)
      }
    } catch (error) {
      setIsConfigLoader(false)
      console.error(error)
    }
  }


  const deleteLinkedProfilesHandler = async(item:any) =>{
    setUpdateSuccess(false)
    try{
      const response = await deleteLinkedProfiles(item.id,token)
      if(response.status === 200){
        setUpdateSuccess(true)
      }
    }catch(err){
      console.error(err);
      
    }
  }

  useEffect(()=>{
    if(allTheAbove){
      setDwagTalesNewsletter(true);
      setRallyUpdates(true);
      setMembershipUpdates(true);
      setCrewServiceUpdates(true);
      setEvents(true);
      setGeneralInfo(true);
      setAllTheAbove(true);
    }
      },[allTheAbove])

  const UserInfoBox = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={[{paddingBottom:80}]}>
        {userData && (
          <View style={[style.contant,style.mtb20]}>
            <View style={[style.row]}>
              <View>
              {userData && userData?.profileUrl ? (
                <Image
                  source={{ uri: userData?.profileUrl }}
                  style={styles.profileImg}
                />
              ) : (
                <Image
                  style={styles.profileImg}
                  source={require("../../assets/avatarImage.png")}
                  alt="img"
                />
              )}
              </View>

              <View style={[style.mH20, style.contant]}>
                <View style={style.mt10}>
                  <Text style={[style.font14, style.grayText]}>
                    MEMBER NAME
                  </Text>
                    <Text
                      style={[
                        style.font16,
                        style.BlackbuttonTxt,
                        style.boldTxt,
                      ]}>
                      {userData?.firstName + " " + userData?.lastName}
                    </Text>
                  <View>
                  <Text style={[style.font14, style.grayText]}>
                    EMAIL
                  </Text>
                    <Text style={[
                        style.font16,
                        style.BlackbuttonTxt,
                      ]}>{primaryEmail}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setIsEdit(true)}
              >
                <MaterialIconCommunity
                  name="square-edit-outline"
                  size={25}
                  color={COLORS.DARK_PRIMARY}
                />
              </TouchableOpacity>
            </View>
            <View style={[isTablet() && style.row, style.contant, style.mt10]}>
              <View style={[style.row, style.contant]}>
                <View style={style.contant}>
                  <Text style={[style.font12, style.grayText, styles.lh12]}>
                    KNOWN AS
                  </Text>
                  <Text
                    style={[
                      style.font14,
                      style.BlackbuttonTxt,
                      style.boldTxt,
                      styles.lh14,
                    ]}
                  >
                    {userData?.knownAs ? userData?.knownAs : "N/A"}
                  </Text>
                </View>
                <View
                  style={[
                    style.contant,
                    !isTablet() && {
                      alignContent: "flex-end",
                      alignItems: "flex-end",
                    },
                  ]}
                >
                  <Text style={[style.font12, style.grayText, styles.lh12]}>
                    ROLE
                  </Text>
                  <Text
                    style={[
                      style.font14,
                      style.BlackbuttonTxt,
                      style.boldTxt,
                      styles.lh14,
                    ]}
                  >
                    {userData?.role?.roleName}
                  </Text>
                </View>
              </View>
              <View
                style={[style.row, style.contant, !isTablet() && style.mtb10]}
              >
                <View style={style.contant}>
                  <Text style={[style.font12, style.grayText, styles.lh12]}>
                    BIRTHDAY
                  </Text>
                  <Text
                    style={[
                      style.font14,
                      style.BlackbuttonTxt,
                      style.boldTxt,
                      styles.lh14,
                    ]}
                  >
                    {userData?.dob ? dateFormatFunction(userData?.dob) : 'N/A' }
                  </Text>
                </View>
                <View
                  style={[
                    !isTablet() && {
                      alignContent: "flex-end",
                      alignItems: "flex-end",
                    },
                  ]}
                >
                  <Text style={[style.font12, style.grayText, styles.lh12]}>
                    MEMBERSHIP LEVEL
                  </Text>
                  <Text
                    style={[
                      style.font14,
                      style.BlackbuttonTxt,
                      style.boldTxt,
                      styles.lh14,
                    ]}
                  >
                    {userData?.membershipLevel}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                isTablet() && style.row,
                style.contant,
                isTablet() && style.mt30,
              ]}
            >
              <View style={[style.row, style.contant, style.mB10]}>
                <View style={[style.contant]}>
                  <Text style={[style.font12, style.grayText, styles.lh12]}>
                    ALTERNATIVE EMAIL
                  </Text>
                  <Text
                    style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}
                  >
                    {homeEmail ? homeEmail : "N/A"}
                  </Text>
                </View>
                <View
                  style={
                    !isTablet() && {
                      alignContent: "flex-end",
                      alignItems: "flex-end",
                    }
                  }
                >
                  <Text style={[style.font12, style.grayText, styles.lh12]}>
                    MOBILE NO
                  </Text>
                  <Text
                    style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}
                  >
                    {userData?.phoneNumbers[0]?.phoneNumber}
                  </Text>
                </View>
              </View>
              
            </View>
            <View style={style.mt0}>
              <Text style={[style.font12, style.grayText]}>
                PRIMARY ADDRESS
              </Text>
              <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>
                {address1} {address2}
              </Text>
              <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>
                {city}
              </Text>
              <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>
                {state}
              </Text>
              <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>
                {country}
              </Text>
              <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>
                {postalcode}
              </Text>
              {/* <Text style={[style.font12, style.grayText,style.mt10]}>SECONDARY ADDRESS</Text>
            <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>{secondaryaddress ? secondaryaddress : "N/A"},{secondarystreetaddress}</Text>
            <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>{secondarycity ? secondarycity : "N/A"}</Text>
            <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>{secondarystate ? secondarystate : "N/A"}</Text>
            <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>{secondarycountry ? secondarycountry : "N/A"}</Text>
            <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt]}>{secondarypostalcode ? secondarypostalcode : "N/A"}</Text> */}
            </View>
            <View>
              {/* <TouchableOpacity style={[style.contant,style.centerItem,style.centerBox,style.pV10]} onPress={()=>setShowLinkedProfiles(!showLinkedProfiles)}>                            
              <FontAwesome name={showLinkedProfiles ? "chevron-up" :"chevron-down"} style={style.pH20} size={20} color={COLORS.LIGHT_PRIMARY} />
          </TouchableOpacity> */}
              <View style={style.breakeLine} />
              <View>
                <Text
                  style={[
                    isTablet() ? style.font20 : style.font18,
                    style.BlackbuttonTxt,
                    style.boldTxt,
                    style.mB10,
                  ]}
                >
                My Resume
                </Text>
                <View>
                {userData?.attachments && userData?.attachments?.length > 0 ?  userData?.attachments.map((document,index) => (
              <View style={style.mt10}>
                <View style={[styles.resumeUpload,style.contentBetween]}>
              <Text style={[style.font14,style.mt2]}>{document.fileName}</Text>
              <TouchableOpacity style={style.pH10} onPress={downloadFile}>
                <Icon name="download" color={COLORS.GREEN} size={25}/>
                </TouchableOpacity>
              </View>
              </View>
              )) :
              <View style={[style.centerBox,style.centerItem]}>
                <Text style={[style.font14, style.BlackbuttonTxt, style.boldTxt,style.textCenter,style.mtb10]}>No Resume Uploaded</Text>
                </View>
            }
              </View>

              </View>
              <View style={style.breakeLine} />
              <View style={[style.row, style.between, style.baseBox]}>
                <Text
                  style={[
                    isTablet() ? style.font20 : style.font18,
                    style.BlackbuttonTxt,
                    style.boldTxt,
                    style.mB10,
                  ]}
                >
                Family Members
                </Text>
                <TouchableOpacity
                  style={[style.mtb10, style.row, styles.linkBtn]}
                  onPress={()=>navigation.navigate('LinkedProfilesForm')}
                >
                  <Text style={[styles.linkBtnText]}>+ Add Member</Text>
                </TouchableOpacity>
              </View>
              {
                <View style={[style.mB10]}>
                  {getLinkedProfilesData?.length > 0 ?
                    getLinkedProfilesData.map((item) => {
                      return (
                        <View style={[style.mtb10]}>
                          <View style={[style.row]}>
                            {item?.profileUrl ? (
                              <Image
                                source={{ uri: item?.profileUrl }}
                                style={styles.profileImg}
                              />
                            ) : (
                              <Image
                                style={styles.profileImg}
                                source={require("../../assets/avatarImage.png")}
                                alt="img"
                              />
                            )}

                            <View style={[style.mH20, style.contant]}>
                              <View style={style.mt10}>
                                <Text style={[style.font14, style.grayText]}>
                                  MEMBER NAME
                                </Text>
                                <View style={[style.row]}>
                                {`${item?.firstName} ${item?.lastName}`.length > 25 ? (
                                  <View>
                                  <Text
                                    style={[
                                      isTablet() ? style.font20 : style.font16,
                                      style.BlackbuttonTxt,
                                      style.boldTxt,
                                    ]}
                                  >
                                    {item?.firstName}
                                  </Text>
                                  <Text
                                    style={[
                                      isTablet() ? style.font20 : style.font16,
                                      style.BlackbuttonTxt,
                                      style.boldTxt,
                                      style.mH5,
                                    ]}
                                  >
                                    {item?.lastName}
                                  </Text>
                                  </View>
                                  ) : (
                                  <Text
                                    style={[
                                      isTablet() ? style.font20 : style.font16,
                                      style.BlackbuttonTxt,
                                      style.boldTxt,
                                      style.mH5,
                                    ]}
                                  >
                                    {`${item?.firstName} ${item?.lastName}`}
                                  </Text>
                              )}
                                </View>
                              </View>
                            </View>
                            <TouchableOpacity onPress={()=>deleteLinkedProfilesHandler(item)} style={[style.mt10]}>
                            <MaterialIcon 
                              name='delete'
                              size={30}
                              color={COLORS.DARK_PRIMARY}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }): <Text  style={[style.font14, style.BlackbuttonTxt, style.boldTxt,style.textCenter,style.mtb10]}>No Family Members Found </Text>   }
                </View>
              }
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  const profileTabHandler = () => {
    setIsActive(0)
    setIsConfigEdit(false)
    setIsEdit(false)
  }

  const configTabHandler = () => {
    setIsActive(1)
    setIsEdit(false)
    if(userData?.metadata){
      setIsConfigEdit(false)
    }else{
      setIsConfigEdit(true)
    }
    
  }

  return (
    <View style={style.contant}>
      <View
        style={[
          style.button,
          style.primaryLayout,
          style.row,
          { maxWidth: "100%", paddingHorizontal: 4, paddingVertical: 5, },style.borderRadius5
        ]}>
        <TouchableOpacity
          style={[
            style.contant,
            isActive == 0 && style.whiteLayout,
            { paddingVertical: 8},style.borderRadius5
          ]}
          onPress={profileTabHandler}>
          <Text
            style={[
              style.font14,
              isActive == 0 ? style.primaryText : style.whiteText,
              { textAlign: 'center' },
            ]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            style.contant,
            isActive == 1 && style.whiteLayout,
            { paddingVertical: 8,  },style.borderRadius5
          ]}
          onPress={configTabHandler}>
          <Text
            style={[
              style.font14,
              isActive == 1 ? style.primaryText : style.whiteText,
              { textAlign: 'center' },
            ]}>
            Configure App
          </Text>
        </TouchableOpacity>
      </View>
      {isLodering ? 
      <View style={[style.centerBox,style.mt40]}>
      <ActivityIndicator style={[style.centerItem,style.mt40]} color={COLORS.PRIMARY} />
    </View>
    :
      <ScrollView showsVerticalScrollIndicator={false}>
        {
          !isEdit && isActive == 0 ? (<UserInfoBox></UserInfoBox>
          ) :
            <View>
              {isActive == 0 &&
                <View style={[style.contant]}> 
                <TouchableOpacity onPress={selectImage}
                  style={styles.selectImage}>
                    {isImageLodering  ? <View  style={{position: 'absolute', zIndex: 10}}><ActivityIndicator theme={{ colors: { primary: COLORS.WHITE } }} /></View> :
                     <Icon
                      onPress={selectImage}
                      name="upload"
                      size={30}
                      color={COLORS.WHITE}
                      style={{position: 'absolute', zIndex: 10}}
                    />
                }
                  {selectedImage && (
                    <Image
                    source={{ uri: selectedImage }}
                      style={[{width: '100%', height: '100%',borderRadius:8}]}
                      resizeMode='cover'
                    />
                  )}
                   
                </TouchableOpacity>
                  <View>
                    <RenderInput
                    name={'FIRST NAME'}
                    placeholder={'Enter First name'}
                    value={firstname}
                    setValue={setFirstName}
                    valueError={firstnameErr}
                    setValueError={setFirstNameErr}
                    required={true}
                    />
                    <RenderInput
                    name={'LAST NAME'}
                    placeholder={'Enter Last name'}
                    value={lastname}
                    setValue={setLastName}
                    valueError={lastnameErr}
                    setValueError={setLastNameErr}
                    required={true}
                    />
                    <RenderInput
                    name={'KNOWN AS'}
                    placeholder={'Enter Known as'}
                    value={knownAs}
                    setValue={setKnownAs}
                    />
                    <RenderDropdown
                    name={'ROLE'}
                    placeholder={'Select Role'}
                    value={role}
                    onChange={(item) => {
                      setRole(item.value);
                    }}
                    valueError={roleErr}
                    data={positiondata}
                    selectedItem={role}
                    />
                    <RenderInput
                    name={'EMAIL'}
                    placeholder={'Enter Email'}
                    value={primaryEmail}
                    setValue={setPrimaryEmail}
                    readOnly={true}
                    />
                    <RenderInput
                    name={'ALTERNATIVE EMAIL'}
                    placeholder={'Enter Email'}
                    value={homeEmail}
                    setValue={setHomeEmail}
                    valueError={homeEmailErr}
                    setValueError={setHomeEmailErr}
                    />
                    <RenderInput
                    name={'MOBILE NUMBER'}
                    placeholder={'Enter Mobile Number'}
                    value={mobileNo}
                    setValue={setMobileNo}
                    valueError={mobileNoErr}
                    setValueError={setMobileNoErr}
                    keyboardType={'numeric'}
                    maxLength={10}
                    required={true}
                    />
                    
                    <View>
                    <DateTimePickerBox
                      onChangeText={setDob} 
                      value={dob} 
                      placeholder={'Enter Birthday'} 
                      labelName="BIRTHDAY" 
                      modal={'date'} 
                      maxDate={new Date()}
                      />
                      {dobErr && <Text style={[styles.textDanger]}>{dobErr} </Text>}
                      {/* <RenderInput
                        placeholder={'DD/MM/YYYY'}
                        dobName={'DOB'}
                        value={dob}
                        setValue={setDob}
                        showPicker={showPickerBirthday}
                        setShowPicker={setShowPickerBirthday}
                        type={'date'}
                      /> */}
                    </View>
                    <Text style={[style.font16,style.grayText]}>PRIMARY ADDRESS</Text>
                    <RenderInput
                    name={'STREET ADDRESS 1'}
                    placeholder={'Enter Street Address 1'}
                    value={address1}
                    setValue={setAddress1}
                    valueError={address1Err}
                    setValueError={setAddress1Err}
                    required={true}
                    />
                    <RenderInput
                    name={'STREET ADDRESS 2'}
                    placeholder={'Enter Street Address 2'}
                    value={address2}
                    setValue={setAddress2}
                    />
                      <View style={[style.row, style.between]}>
                      <RenderInput
                    name={'COUNTRY'}
                    placeholder={'Enter Country'}
                    value={country}
                    setValue={setCountry}
                    valueError={countryErr}
                    setValueError={setCountryErr}
                    required={true}
                    stylesProp={{ width: "48%" }}
                    />
                      <RenderInput
                    name={'STATE'}
                    placeholder={'Enter State'}
                    value={state}
                    setValue={setState}
                    valueError={stateErr}
                    setValueError={setStateErr}
                    required={true}
                    stylesProp={{ width: "48%" }}
                    />
                   
                      </View>
                      <View style={[style.row, style.between]}>
                      <RenderInput
                    name={'CITY'}
                    placeholder={'Enter City'}
                    value={city}
                    setValue={setCity}
                    valueError={cityErr}
                    setValueError={setCityErr}
                    required={true}
                    stylesProp={{ width: "48%" }}
                    />
                    
                    <RenderInput
                    name={'ZIP/POSTAL CODE'}
                    placeholder={'Enter Zip/Postal Code'}
                    value={postalcode}
                    setValue={setPostalCode}
                    valueError={postalcodeErr}
                    setValueError={setPostalCodeErr}
                    required={false}
                    keyboardType={'numeric'}
                    stylesProp={{ width: "48%" }}
                    />
                    
                      </View>            
                    <TouchableOpacity onPress={pickFile}
                    style={styles.resumeContainer}>
                      {isLodering  ? <View  style={{position: 'absolute', zIndex: 10}}><ActivityIndicator theme={{ colors: { primary: COLORS.WHITE } }} /></View> :
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
          <View>
          {isUploading && (
        <View style={style.mt20}>
          <Text style={[style.centerItem,style.font12]}>Uploading Resume: {Math.round(uploadProgress * 100)}%</Text>
          <ProgressBar style={[style.mt10]} progress={uploadProgress} width={Dimensions.get("screen").width *0.87} height={10} />
        </View>
      )}
        {doc && doc.length > 0 && doc.map((document,index) => (
              <View style={style.mt10}>
                <View style={[styles.resumeUpload,style.contentBetween]}>
              <Text style={[style.font14,style.mt2]}>{document.fileName}</Text>
              <TouchableOpacity style={style.pH10} onPress={() => removeDocument(index)}>
                <Icon name="trash-2" color={COLORS.RED} size={22}/>
                </TouchableOpacity>
              </View>
              </View>
            ))}
        </View>             
                    <View style={[style.row, { display: "flex" }]}>
                      <CheckBox
                        style={[style.mt10,styles.checkboxSize]}
                        isChecked={isPrivate}
                        onClick={() => setIsPrivate(!isPrivate)}
                        checkBoxColor={COLORS.PRIMARY}
                      />
                      <Text style={[style.font16, style.mt10, { maxWidth: '90%' }]}>Private</Text>
                    </View>
                    {(firstnameErr || lastnameErr || mobileNoErr || address1Err || countryErr || stateErr || cityErr || postalcodeErr) && 
                    <Text style={[style.textDanger]}>Some fields contains error</Text>
                    }
                    <Text style={[style.font14,style.grayText,style.mt10]}>Check this box to keep your info “Email, Phone No” hidden to other members.</Text>
                  </View>

                  <View style={[style.contentBetween, style.pV20, style.mtb10]}>
                    <TouchableOpacity style={[style.whiteLayout,style.button,style.mtb10,styles.w150,style.borderRadius5]} onPress={closeEditProfileHandler}>
                      <Text style={[style.BlackbuttonTxt]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.primaryLayout, style.button,style.mtb10,styles.w150,style.borderRadius5]} onPress={updateInfoHandler}>
                      {isProfileLoader ?
                        <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
                        :
                        <Text style={[style.font16, style.whiteText]}>Save</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              }
            </View>}
        {!isConfigEdit && userData && isActive == 1 ? (
          <View style={[style.mtb10]}>
            <View>
              <View style={[style.contentBetween,style.mtb10]}>
              <Text style={[style.boldTxt, style.BlackbuttonTxt, style.font16]} >Configure App</Text>
              <TouchableOpacity onPress={() => setIsConfigEdit(true)}>
              <MaterialIconCommunity 
              name='square-edit-outline'
              size={25}
              color={COLORS.DARK_PRIMARY}
              />
            </TouchableOpacity>
              </View>
             
              <View></View>
              <Text style={[style.font16, style.mt10, style.boldTxt]}>The SDSA provides a Member Directory to all active members which will enable you to network with other Salty Dwags. If you would rather NOT be included, check here to opt out of being in the directory*</Text>

              <View style={[style.row,style.mt10, style.centerBox]}>
                <RadioButton.Android  color={COLORS.PRIMARY} status={'checked'} />
                {memberDirectory === 'do' && <Text style={[style.font16, styles.w80,{ color: COLORS.BLACK }]}>Please DO Include my information</Text>}
                {memberDirectory === 'do_not' && <Text style={[style.font16,styles.w80, { color: COLORS.BLACK }]}>Please DO NOT include my information in the Member Directory</Text>}
              </View>
            </View>
            {/* <View>
              <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt30]}>The SDSA provides a Member Map to all active members which will enable you to network with other Salty Dawgs. If you would rather NOT be included, check here to opt out of being on the map.*</Text>
              <View style={[style.row,style.mt10, style.centerBox]}>
                <RadioButton.Android  color={COLORS.PRIMARY} status={'checked'} />
                {memberMap == 'do' && <Text style={[style.font16,styles.w80, { color: COLORS.BLACK }]}>Please DO Include my information</Text>}
                {memberMap == 'do_not' && <Text style={[style.font16,styles.w80, { color: COLORS.BLACK }]}>Please DO NOT include my information on the Member Map</Text>}
              </View>
            </View> */}

            <Text style={[style.font16, style.boldTxt,style.mt10,]}>Ocean Class and World Class Qualification</Text>
              <Text style={[style.font16, style.mt10,style.boldTxt]}>Do you or a family member qualify for the Ocean or World Class category?</Text>
              <View style={[style.row, { alignItems: "center", display: "flex" }, style.mt10]}>
                <RadioButton.Android  status={'checked'} color={COLORS.PRIMARY} />
                <Text style={[style.font16, { maxWidth: '90%', }, style.mH10, style.textCapitalize]}>{oceanOrWorldClassQualification?.replace(/_/g, ' ')}</Text>
              </View>
              
            {checked === 'ocean_class' && <Text style={[style.font16,style.boldTxt]}>For Ocean Class tell us about your qualifying passage (from where to where, how many nm) and which family members qualify.</Text>}
              {checked === 'world_class' && <Text style={[style.font16,style.boldTxt]}>If you qualify for World Class, list details of only passages 600 nm or more, and at least one non-stop 1,400 nm passage. Include nm for each passage</Text>}
              {checked === 'world_class' && <Text style={[style.font16, style.mt10]}>{worldClassQualificationPassage?.replace(/_/g, ' ')}</Text>}
              {checked === 'ocean_class' && <Text style={[style.font16, style.mt10]}>{oceanClassQualificationPassage?.replace(/_/g, ' ')}</Text>}
              {hearAboutUs && <View style={[style.mtb10]}>
                <Text style={[style.font16, style.boldTxt]}>How did you hear about the Salty Dawg Sailing Association?</Text>
                <Text style={[style.font16]}>{hearAboutUs}</Text>
              </View>}

            <View style={[style.mtb10,style.mH5]}>
                <Text style={[style.font16, style.boldTxt]}>Mailing Lists</Text>
                {dwagTalesNewsletter && <RenderCheckBox name={'Dawg Tales Newsletter'} value={true} disabled={true} />}
                {rallyUpdates && <RenderCheckBox name={'Rally Updates'} value={true} disabled={true} />}
                {membershipUpdates && <RenderCheckBox name={'Membership Updates'} value={true} disabled={true} />}
                {crewServiceUpdates && <RenderCheckBox name={'Crew Service Updates'} value={true} disabled={true} />}
                {events && <RenderCheckBox name={'Events'} value={true} disabled={true} />}
                {generalInfo && <RenderCheckBox name={'General Info'} value={true} disabled={true} />}
                {allTheAbove && <RenderCheckBox name={'All of the Above'} value={true} disabled={true} />}
              </View>
            {/* <View style={[style.mt20]}>
              <Text style={[style.font14, style.boldTxt]}>Date Format</Text>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android  color={COLORS.PRIMARY} status={'checked'} />
                {dateFormat == 'MM/dd/yyyy' && <Text style={[style.font16, { color: COLORS.BLACK }]}>MM/DD/YYYY</Text>}
                {dateFormat == 'DD/MM/YYYY' && <Text style={[style.font16, { color: COLORS.BLACK }]}>DD/MM/YYYY</Text>}              
                {dateFormat == 'YYYY/MM/DD' && <Text style={[style.font16, { color: COLORS.BLACK }]}>YYYY/MM/DD</Text>}
                {dateFormat == 'MMM Do YYYY' && <Text style={[style.font16, { color: COLORS.BLACK }]}>MMM Do YYYY</Text>}
              </View>
            </View> */}
            {/* <View style={[style.mt20]}>
              <Text style={[style.font14, style.boldTxt]}>Sailing Distance</Text>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android color={COLORS.PRIMARY} status={'checked'} />
                {sailingdistance == 'Knots' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Knots</Text>}
                {sailingdistance == 'Mile' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Mile</Text>}
                {sailingdistance == 'Km' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Km</Text>}
              </View>
            </View> */}
            {/* <View style={[style.mt20]}>
              <Text style={[style.font14, style.boldTxt]}>Other distances</Text>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android  color={COLORS.PRIMARY} status={'checked'} />
                {otherdistance == 'Metric' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Metric</Text>}
                {otherdistance == 'Imperial' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Imperial</Text>}
              </View>
            </View> */}
            <View style={[style.mt20]}>
              <Text style={[style.font14, style.boldTxt]}>Temperature</Text>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android  color={COLORS.PRIMARY} status={'checked'} />
                {temperature == 'Celsius' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Celsius</Text>}
                {temperature == 'Fahrenheit' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Fahrenheit</Text>}
              </View>
            </View>
           
            {/* <View style={[style.mt20]}>
              <Text style={[style.font14, style.boldTxt]}>Language</Text>
              <View style={{ width: isTablet() ? "100%" : scaleWidth(150), marginRight: normalize(10) }}>
                <Text  style={[style.font16,style.mt10,style.mH10, { color: COLORS.BLACK }]}>{userData?.metadata?.language}</Text>
              </View>
            </View> */}

          </View>
        ) : (<View>
          {isActive == 1 &&
            (
            <View style={[style.contant, style.mt20, style.mtb10]}>
              <View>
                <Text style={[style.boldTxt, style.BlackbuttonTxt, style.font16]} >Configure App</Text>
                <Text style={[style.font14, style.mt10, style.boldTxt]}>The SDSA provides a Member Directory to all active members which will enable you to network with other Salty Dwags. If you would rather NOT be included, check here to opt out of being in the directory*</Text>
                <RadioButton.Group onValueChange={newValue => setMemberDirectory(newValue)} value={memberDirectory}>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="do" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, styles.w80,{ color: COLORS.BLACK }]}>Please DO Include my information</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="do_not" color={COLORS.PRIMARY} />
                    <Text style={[style.font16,styles.w80, { color: COLORS.BLACK }]}>Please DO NOT include my information in the Member Directory</Text>
                  </View>

                </RadioButton.Group>
              </View>
              {/* <View>
                <Text style={[style.font14, style.mt20, style.boldTxt]}>The SDSA provides a Member Map to all active members which will enable you to network with other Salty Dwags. If you would rather NOT be included, check here to opt out of being in the directory*</Text>
                <RadioButton.Group onValueChange={newValue => setMemberMap(newValue)} value={memberMap}>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="do" color={COLORS.PRIMARY} />
                    <Text style={[style.font16,styles.w80, { color: COLORS.BLACK }]}>Please DO Include my information</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="do_not" color={COLORS.PRIMARY} />
                    <Text style={[style.font16,styles.w80, { color: COLORS.BLACK }]}>Please DO NOT include my information on the Member Map</Text>
                  </View>

                </RadioButton.Group>
              </View> */}
              <View>
              <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt20]}>Do you or a family member qualify for the Ocean or World Class category?</Text>
            <RadioButton.Group onValueChange={newValue =>{ setChecked(newValue);setOceanOrWorldClassQualificationError('')}} value={checked}>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android value="none" color={COLORS.PRIMARY} />
                <Text style={[style.font16, { color: COLORS.BLACK }]}>None</Text>
              </View>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android value="ocean_class" color={COLORS.PRIMARY} />
                <Text style={[style.font16, { color: COLORS.BLACK }]}>Ocean Class</Text>
              </View>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android value="world_class" color={COLORS.PRIMARY} />
                <Text style={[style.font16, { color: COLORS.BLACK }]}>World Class</Text>
              </View>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android value="not_yet" color={COLORS.PRIMARY} />
                <Text style={[style.font16, { color: COLORS.BLACK }]}>Not Yet</Text>
              </View>
            </RadioButton.Group>
          </View>
          {checked === 'ocean_class' && <RenderInput
            name={'For Ocean Class tell us about your qualifying passage (from where to where, how many nm) and which family members qualify.'}
            required={true}
            multiline={true}
            numberOfLines={4}
            value={oceanOrWorldClassQualification}
            setValue={setOceanOrWorldClassQualification}
            valueError={oceanOrWorldClassQualificationError}
            setValueError={setOceanOrWorldClassQualificationError}
            inputStyle={{height:normalize(70)}}
          />}
          {checked === 'world_class' && <RenderInput
            required={true}
            name={'If you qualify for World Class, list details of only passages 600 nm or more, and at least one non-stop 1,400 nm passage. Include nm for each passage'}
            multiline={true}
            numberOfLines={4}
            value={oceanOrWorldClassQualification}
            setValue={setOceanOrWorldClassQualification}
            valueError={oceanOrWorldClassQualificationError}
            setValueError={setOceanOrWorldClassQualificationError}
            inputStyle={{height:normalize(70)}}
          />}
          <RenderInput
            name={'How did you hear about the Salty Dawg Sailing Association?'}
            multiline={true}
            numberOfLines={4}
            value={hearAboutUs}
            setValue={setHearAboutUs}
          />

          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt20]}>Mailing Lists</Text>
          <RenderCheckBox name={'Dawg Tales Newsletter'} value={dwagTalesNewsletter} setValue={setDwagTalesNewsletter} disabled={allTheAbove}/>
          <RenderCheckBox name={'Rally Updates'} value={rallyUpdates} setValue={setRallyUpdates} disabled={allTheAbove}/>
          <RenderCheckBox name={'Membership Updates'} value={membershipUpdates} setValue={setMembershipUpdates} disabled={allTheAbove}/>
          <RenderCheckBox name={'Crew Service Updates'} value={crewServiceUpdates} setValue={setCrewServiceUpdates} disabled={allTheAbove}/>
          <RenderCheckBox name={'Events'} value={events} setValue={setEvents} disabled={allTheAbove}/>
          <RenderCheckBox name={'General Info'} value={generalInfo} setValue={setGeneralInfo} disabled={allTheAbove}/>
          <RenderCheckBox name={'All of the Above'} value={allTheAbove} setValue={setAllTheAbove} />

              
              {/* <View style={[style.mt20]}>
                <Text style={[style.font14, style.boldTxt]}>Date Format</Text>
                <RadioButton.Group onValueChange={newValue => setDateFormat(newValue)} value={dateFormat}>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="DD/MM/YYYY" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>DD/MM/YYYY</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="MM/dd/yyyy" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>MM/DD/YYYY</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="YYYY/MM/DD" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>YYYY/MM/DD</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="MMM Do YYYY" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>MMM Do YYYY</Text>
                  </View>

                </RadioButton.Group>
              </View> */}
              {/* <View style={[style.mt20]}>
                <Text style={[style.font14, style.boldTxt]}>Sailing Distance</Text>
                <RadioButton.Group onValueChange={newValue => setSailingDistance(newValue)} value={sailingdistance}>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="Knots" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>Knots</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="Mile" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>Mile</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="Km" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>Km</Text>
                  </View>

                </RadioButton.Group>
              </View> */}
              {/* <View style={[style.mt20]}>
                <Text style={[style.font14, style.boldTxt]}>Other distances</Text>
                <RadioButton.Group onValueChange={newValue => setOtherDistance(newValue)} value={otherdistance}>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="Metric" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>Metric</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="Imperial" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>Imperial</Text>
                  </View>
                </RadioButton.Group>
              </View> */}
              <View style={[style.mt20]}>
                <Text style={[style.font14, style.boldTxt]}>Temperature</Text>
                <RadioButton.Group onValueChange={newValue => setTemperature(newValue)} value={temperature}>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="Celsius" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>Celsius</Text>
                  </View>
                  <View style={[style.row, style.centerBox]}>
                    <RadioButton.Android  value="Fahrenheit" color={COLORS.PRIMARY} />
                    <Text style={[style.font16, { color: COLORS.BLACK }]}>Fahrenheit</Text>
                  </View>
                </RadioButton.Group>
              </View>
              {/* <View style={[style.mt20]}>
                <Text style={[style.font14, style.boldTxt]}>Language</Text>
                <RenderDropdown
                required={true}
                data={data}
                onChange={(item) => {
                    setSelectedLanguage(item.value);
                }}
                setValue={setSelectedLanguage}
                value={selectedLanguage}
                placeholder={"Select language"}
                open={true} // Set open prop to true to keep the dropdown open by default
                selectedItem={selectedLanguage} // Set selectedItem prop to the initial selected value
            />
              </View> */}
              <View style={[style.contentBetween, style.pV20, style.mtb10]}>  
                {userData?.metadata ? <TouchableOpacity style={[style.button,style.whiteLayout, !isTablet() ? style.mtb10 : null,styles.w150 ,style.borderRadius5]} onPress={closeEditConfigHandler}>
                  <Text style={[style.BlackbuttonTxt]}>Cancel</Text>
                </TouchableOpacity>:
                <TouchableOpacity ></TouchableOpacity>}
                <TouchableOpacity style={[style.primaryLayout, style.button, !isTablet() ? style.mtb10 : null,styles.w150,style.borderRadius5]} onPress={updateConfigHandler}>
                  {isConfigLoader ?
                    <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
                    :
                    <Text style={[style.font16, style.whiteText]}>Save</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>   )  }
        </View>)}
      </ScrollView>}
      <ModalNative 
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        isVisible={fileDownloadModal}
        backdropColor='rgba(0, 0, 0, 0.3)'>  
        <View style={[style.p20,style.whiteLayout]}>
          <Text style={styles.modalText}>
          {doc?.attachments && doc?.attachments.length === 0 ? 'No files are uploaded' :
          'File downloaded successfully'}
          </Text>
        </View>
        </ModalNative>
    </View>
  )
}
const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 8,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 18,
    color: '#000'
  },
  labelStyle: {
    fontSize: normalize(14),
    fontFamily: 'Roboto-Regular',
    color: COLORS.BLACK,
    marginTop: normalize(10),
    fontWeight: '600'
  },
  profileImg: {
    width: normalize(80),
    height: normalize(80),
    borderRadius:8
    
  },
  uploadImg: {
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:COLORS.GREY
  },
  option: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    width: 20,
    height: 20,
    borderRadius: 50,
    marginVertical: 5,
  },
  dropdownText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownStyle: {
    backgroundColor: 'lightgray',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
    marginBottom: 10
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  innerButton: {
    backgroundColor: "#0D2C6C",
    width: 15,
    height: 15,
    borderRadius: 50,
    marginVertical: -7
  },
  inputBorderStyle: {
    borderWidth: 1,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(0),
    borderRadius: 4,
    marginVertical: normalize(5),
    backgroundColor: '#f2f4f6',
    width: '100%',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    height: normalize(40),
  },
  input: {
    color: '#000',
    width: "100%",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: COLORS.GREY
  },
  item: {
    padding: 10
  },
  dropdown: {
    height: 50,
    // backgroundColor: '#F3F4F6',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(0),
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
    width: "100%",
    marginTop: 5,
    color: COLORS.BLACK
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
    color: COLORS.BLACK
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: COLORS.BLACK
  },
  lh12:{
  paddingBottom: 2, 
  lineHeight: 12
  },
  lh14:{
  lineHeight: 14, 
  marginTop: 3
  },
  w100:{
    width: 100 
 },
 width100:{ 
  width: "100%" 
},
w150:{
  width: Dimensions.get('screen').width * 0.4
},
selectImage:{
  backgroundColor: 'rgba(52, 52, 52, 0.3)',
  width: normalize(80),
  height: 100,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  marginTop: 10,
},
linkBtnText: {
  color: COLORS.WHITE,
  fontSize: 16,
  fontFamily: 'Roboto-Regular',
},
linkBtn: {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: COLORS.PRIMARY,
  borderWidth: 1,
  paddingHorizontal: normalize(10),
  paddingVertical: normalize(5),
  borderRadius: 4,
},
w80:{
  width:"80%"
},
textDanger: {
  color: 'red',
  fontSize: normalize(12)
},
resumeUpload:{
  backgroundColor:"#E0EAFF",
  padding:10,
  color:COLORS.BLACK,
  borderRadius:8
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
resumeContainer:{
  backgroundColor: 'rgba(52, 52, 52, 0.3)',
  width: '100%',
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 4,
  marginTop: 10,
},
checkboxSize:{
  width: normalize(30),
  height: normalize(30)
},
mH:{
  marginHorizontal:Dimensions.get('screen').width * 0.07
},
widthScreen:{
  width:Dimensions.get('screen').width * 0.25
}
})
export default MyAccount;
