import React, { useEffect, useState, useRef, useContext } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal} from "react-native";
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import { normalize } from '../../styles/utilities/dimentions';
import DeviceInfo from 'react-native-device-info';
import Header from '../../components/Header';
import UserInfo from '../../components/UserInfo';
import Menu from '../../routes/Menu';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/Feather";
import TextFeild from '../../components/TextFeild';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RenderInput from '../BecomeMember/RenderInput';
import RenderDropdown from '../BecomeMember/RenderDropdown';
import { requestToJoin,getMember } from '../../services/api/auth';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { launchImageLibrary } from "react-native-image-picker";
import Config from 'react-native-config';
import MembersContext from '../Members/MembersContext';
import s3 from '../../services/aws-config';
import { BackHandler } from 'react-native';
import DateTimePickerBox from '../../components/dateTimeBox';
import DocumentPicker from 'react-native-document-picker';
import fs from 'react-native-fs';
import {decode} from 'base64-arraybuffer';
import ModalNative from "react-native-modal";

const Registercrew = ({ route }) => {
  const { loggedInUser,setHideChatbotMember, setHideChatbot } = useContext(MembersContext);
  const token = AsyncStorage.getItem('accessToken');
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation();
  const [doc, setDoc] = useState(null);
  const [value, setValue] = useState('')
  const data = [
    { label: 'Yes', value: 'boat' },
    { label: 'No', value: 'name' },
  ];


  const [overview, setOverView] = useState('');

  const [rallyDateFrom, setRallyDateFrom] = useState('');
  const [rallyDateTo, setRallyDateTo] = useState('');
  const [rallyDateError, setRallyDateError] = useState("");
  const [sailingExperience, setSailingExperience] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [smokingPreferences, setSmokingPreferences] = useState(false);


  const [sailingExperienceError, setSailingExperienceError] = useState('');
  const [phoneNoError, setPhoneNoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [beError, setBeError] = useState("");
  const [becomeCrewLoader, setbecomeCrewLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleMsg, setModalVisibleMsg] = useState('');
  const smokingPrefData = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  useFocusEffect(
    React.useCallback(() => {
        setHideChatbot(true);
        setHideChatbotMember(true);
        setSailingExperience('');
        setDietaryRequirements('');
        setOverView('');
        setRallyDateTo('')
        setRallyDateFrom('')
       
    }, [])
  );
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Crew");
     
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);


  const toggleModal = (index) => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    let timeout;
    if (modalVisible) {
      timeout = setTimeout(() => {
        setModalVisible(false);
      
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [modalVisible]);



  useEffect(() => {
        setEmail(loggedInUser?.username)
        setPhoneNo(loggedInUser?.phoneNumbers[0]?.phoneNumber ? loggedInUser?.phoneNumbers[0]?.phoneNumber : "")
        setDoc(loggedInUser?.attachments ? loggedInUser?.attachments : "")
  },[])



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


  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10}$/;

  const becomeCrewHandler = async () => {
    // alert("You have already requested to join the crew")
    setEmailError('')
    setRallyDateError('')
    setSailingExperienceError('')
    setBeError('')
    setPhoneNoError('')
    let isValid = true
    if (email === '') {
      setEmailError('Email is required')
      isValid = false
    } else if (!emailRegex.test(email)) {
      setEmailError('Enter valid email')
      isValid = false
    } if (phoneNo === '') {
      setPhoneNoError('Phone number is required')
      isValid = false
    } else if (!phoneRegex.test(phoneNo)) {
      setPhoneNoError('Enter valid phone number')
      isValid = false
    } if (rallyDateFrom === '') {
      setRallyDateError('Rally dates / dates needed is required ')
      isValid = false
    } if (rallyDateTo === '') {
      setRallyDateError('Rally dates / dates needed is required ')
      isValid = false
    }if (rallyDateFrom && rallyDateTo && moment(rallyDateTo).isBefore(moment(rallyDateFrom))) {
      setRallyDateError('Please select To date after the From date.');
      isValid = false;
    }
    const payload_data =  {
      "overview":overview,
      "phoneNumber": phoneNo,
      "email": email,
      "sailingExperience": sailingExperience,
      "avaliableDates": moment(rallyDateFrom).format("YYYY-MM-DD") + ',' + moment(rallyDateTo).format("YYYY-MM-DD"),
      "smokingPrefrence": smokingPreferences,
      "dietryRequriements": dietaryRequirements,
      "attachments":doc ? doc : [],
      "crewAdvertiseId": route.params.id
    };

   


    if (isValid) {
      

      try {
        setbecomeCrewLoader(true)
        const response = await requestToJoin(payload_data, token);
      
        if (response.status === 200) {
          // setEmail('')
          setPhoneNo('')
          setOverView('')
          setRallyDateFrom('')
          setRallyDateTo('')
          setSmokingPreferences(false)
          setSailingExperience('')
          setDietaryRequirements('')
          setSelectedImage('')
          setbecomeCrewLoader(false)
          setDoc('')
          navigation.navigate('Crew');
          
          if(response?.data?.message){
            setModalVisible(true);
            setModalVisibleMsg(response?.data?.message)
            setTimeout(() => {
              setModalVisible(false)
              backBtnHandler()
            }, 3000);
            
          }
        }
      
      } catch (error) {
        console.error(error);
        setbecomeCrewLoader(false)
      }
    }
  };
  const backBtnHandler=()=>{
    navigation.navigate("Crew"),
    setOverView('')
    setRallyDateFrom('')
    setRallyDateTo('')
    setSmokingPreferences(false)
    setSailingExperience('')
    setDietaryRequirements('')
    setSelectedImage('')
    setbecomeCrewLoader(false)
  }
  return (
    <View style={[style.contant]}>
      <View style={[style.row]}>
        <View style={[{ flex: 2 }]}>
          {/* <Header></Header> */}
          {!isTablet && <View style={style.sidepanelcolor}>
          <Menu selectIndex={7} />
          </View>}
        </View>
        {isTablet && (
          <View style={[{ flex: 1 }, [style.mt20, style.mH10]]}>
            <UserInfo isDark={true}></UserInfo>
          </View>
        )}
      </View>
      <View
        style={[
          style.contant,
          style.pH20,
          style.pt20
        ]}>
        <TouchableOpacity onPress={backBtnHandler} style={[style.row,style.centerBox]}>
          <Icon name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} />
          <Text style={[isTablet ? style.font24 : style.font14, style.boldTxt,style.primaryText]}>Back to crew</Text>
        </TouchableOpacity>
    
          <View style={[style.contentCenter, style.mt10]}>
            <Text style={[style.font18, style.boldTxt, style.primaryText,style.mB10]}>
              Request to join
            </Text>
          </View>
          <ScrollView
          style={{ paddingBottom: normalize(20) }}
          showsVerticalScrollIndicator={false}>
          <View >

            <View style={[isTablet && style.row]}>
              <View style={style.contant}>
                <View style={[isTablet && style.row, style.between]}>
                  <RenderInput
                    name="PHONE NUMBER"
                    placeholder="Enter phone number"
                    value={phoneNo}
                    setValue={setPhoneNo}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                    valueError={phoneNoError}
                    setValueError={setPhoneNoError}
                    keyboardType={'numeric'}
                    maxLength={10}
                    required={true}

                  />
                  <RenderInput
                    name="EMAIL"
                    placeholder="Enter email"
                    value={email}
                    setValue={setEmail}
                    stylesProp={isTablet ? { width: '48%' } : undefined}
                    valueError={emailError}
                    setValueError={setEmailError}
                    required={true}
                  />
                </View>

                <View style={[isTablet && style.row, style.between]}>
                  <View style={[style.row, style.between]}>
                    <DateTimePickerBox
                      onChangeText={(value) => { setRallyDateFrom(value); setRallyDateError('') }}
                      value={rallyDateFrom}
                      placeholder={'From Date'}
                      labelName="Available dates"
                      modal={'date'}
                      minDate={new Date()}
                      required={true}
                      stylesProp={{ width: "48%" }}
                    />
                    <DateTimePickerBox
                      onChangeText={(value) => { setRallyDateTo(value); setRallyDateError('') }}
                      value={rallyDateTo}
                      placeholder={'To Date'}
                      modal={'date'}
                      minDate={rallyDateFrom}
                      stylesProp={{ width: "48%" }}
                    />
                  </View>
                  {rallyDateError && <Text style={[style.textDanger]}>{rallyDateError} </Text>}
                  <RenderInput
                    name="SAILING EXPERIENCE"
                    placeholder="Enter Experience"
                    value={sailingExperience}
                    setValue={setSailingExperience}
                    stylesProp={isTablet ? { width: '48%' } : undefined}
                    valueError={sailingExperienceError}
                    setValueError={setSailingExperienceError}
                  />
                </View>
                <View style={[isTablet && style.row, style.between]}>
                  <RenderDropdown
                    value={smokingPreferences}
                    onChange={item => {
                      setSmokingPreferences(item.value);
                    }}
                    name={'SMOKER'}
                    stylesProp={isTablet ? { width: "48%" } : undefined}
                    data={smokingPrefData}
                    placeholder={'Select'}

                  />
                  <RenderInput
                    name="ANY DIETARY REQUIREMENTS"
                    placeholder="Enter requirements"
                    value={dietaryRequirements}
                    setValue={setDietaryRequirements}
                    stylesProp={isTablet ? { width: "48%" } : undefined}

                  />
                </View>

                <RenderInput
                  name="OVERVIEW"
                  placeholder="Enter overview"
                  value={overview}
                  setValue={setOverView}
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
                <View style={isTablet ? style.row && style.mtb10 : !isTablet && style.mtb10}>
                  <TouchableOpacity activeOpacity={0.8} style={[styles.btnStyle,style.mB15]} onPress={becomeCrewHandler}>
                    {becomeCrewLoader ? <ActivityIndicator theme={{ colors: { primary: COLORS.WHITE } }} />
                      :
                      <Text style={styles.btnTextStyle}>Apply</Text>

                    }
                  </TouchableOpacity>
                </View>
              </View>
              {isTablet && (
                <View style={[{ flex: 0.5 }, style.row, style.centerItem]}>
                  <View
                    style={styles.imageUpload}>
                    <Image source={require('../../assets/boat1.png')} style={styles.profileImg} />
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
            
            <Modal
            animationType="fade"
            transparent={true}
            style={styles.modelUser}
            visible={modalVisible}
            onRequestClose={toggleModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
             
                <Text style={styles.modalText}>
                  {modalVisibleMsg}
                </Text>
              </View>
            </View>
          </Modal>
          </View>
        </ScrollView>
      </View>

    </View>
  )
}
export default Registercrew;
const styles = StyleSheet.create({
  loader:{ 
    position: 'absolute',
     zIndex: 10 
    },
  btnStyleOutline: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(10),
    // paddingVertical:normalize(5),
    marginBottom: normalize(5),
    borderRadius: normalize(4),
    marginRight: 'auto',
    height: normalize(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  btnOutlineTextStyle: {
    color: COLORS.PRIMARY,
    fontSize: normalize(13),
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
    height: Platform.OS == 'ios' ? 45 : 50,
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
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  btnStyle: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    borderRadius: 8,
    height: normalize(40),
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  btnTextStyle: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
    fontWeight: '600'
  },
  imageUpload:{
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    width: 200,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 40,
  },
  resumeUpload:{
    backgroundColor:"#E0EAFF",
    padding:10,
    color:COLORS.BLACK
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
})
