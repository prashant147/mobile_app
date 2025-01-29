import React,{useState,useEffect,useContext} from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  FlatList,
  Linking,
  Platform,
} from "react-native";
import Share from 'react-native-share';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import style from "../../styles/style";
import { normalize, scaleWidth } from "../../styles/utilities/dimentions";
import COLORS from "../../styles/theme/color";
import Menu from "../../routes/Menu";
import DeviceInfo from "react-native-device-info";
import Icon from "react-native-vector-icons/Feather";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { applicationInviteCrew, applicationNotInterested, getCrewApplicationById } from "../../services/api/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import RNFetchBlob from "rn-fetch-blob";
import ModalNative from "react-native-modal";
import { dateFormat } from '../../styles/utilities/variables';
import MembersContext from "../Members/MembersContext";
import { ActivityIndicator } from "react-native-paper";


const ApplicationDetails = ({ navigation }) => {
  const route = useRoute();
  const {setChatData}= useContext(MembersContext)
  const { applicationId ,advertisementId,path}: any = route.params;
  const isTablet = DeviceInfo.isTablet();
  const token = AsyncStorage.getItem('accessToken');
  const navigate = useNavigation();
  const [fileDownloadModal,setFileDownloadModal] = useState(false);
  const [applicationData,setApplicationData] = useState(null);
  const [applicationLoader,setApplicationLoader] = useState(true);
  const [updateSuccess,setUpdateSuccess] = useState(false);
   
  useFocusEffect(
    React.useCallback(()=>{
      const getApplicationByIdHandler =async ()=>{
        try {
          setApplicationLoader(true)
          const response = await getCrewApplicationById(applicationId,token)
          if(response.status === 200){
            setApplicationLoader(false)
            setApplicationData(response.data)
          }
          
        } catch (error) {
          setApplicationLoader(false)
          console.error(error);
          
        }
      }
      if(applicationId){
        getApplicationByIdHandler()
         
      }
    },[applicationId,updateSuccess])
  )
  const handleInvite = async (inv:string) => {
    setUpdateSuccess(false)
    try {
      const response = await applicationInviteCrew(inv);
      
      if (response.status === 200) {
        setUpdateSuccess(true)
      }
    } catch (error) {
      console.error(error);
    }
  };



  
  const handleNotInterested = async (inv:string) => {

    try {
      const response = await applicationNotInterested(inv);
   
      if (response.status === 200) {
        console.log("response", response);
        navigation.navigate("MyApplications",{id:advertisementId});
      }
    } catch (error) {
      console.error(error);
    }
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
  
  const downloadFiles = () => {
    const { dirs } = RNFetchBlob.fs;
    const fileUrl = applicationData?.attachments?.[0]?.uploadUrl; // Assuming only one file is selected, change as needed
  
    if (!fileUrl) {
      console.log('No file URL found');
      setFileDownloadModal(true)
      return;
    }
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    RNFetchBlob.config({
      fileCache: true,
      appendExt:applicationData?.attachments[0]?.fileName.split(".")[1],  
      path : `${dirToSave}/${applicationData?.attachments[0]?.fileName}`,
  
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: applicationData?.attachments[0]?.fileName,
         // Adjust MIME type according to your file type
       // path: `${dirs.DownloadDir}/${applicationData?.attachments[0]?.fileName}`, // Adjust file name and extension
      },
    })
      .fetch('GET', fileUrl)
      .then(res => {
        // File was downloaded successfully
        console.log('File downloaded to:', res.path());
        //setFileDownloadModal(true)
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
      });
  };

const backBtnHandler =()=>{
  if(path){
    navigation.navigate(path)
  }else{
    navigation.navigate("MyApplications",{id:advertisementId})
  }
}
  return (
    <View style={style.contant}>
      <View style={[style.row]}>
        <View style={[{ flex: 2 }]}>
          {!isTablet && 
          <View style={style.sidepanelcolor}>
          <Menu selectIndex={7} />
          </View>
          }
        </View>
      </View>
      {!isTablet && (
        <View
          style={[
            style.contant,
            style.mH20,
            style.mtb20
          ]}
        >
          <View style={[style.contant]}>
            <View
              style={[ style.row, style.between]}
            >
              <TouchableOpacity
                style={[style.row, style.centerBox]}
                onPress={backBtnHandler}
              >
                <Icon
                  name="chevron-left"
                  size={normalize(20)}
                  color={COLORS.PRIMARY}
                />
                <Text
                  style={[
                    styles.memberTitleText,
                    style.font16,
                    style.boldTxt,
                    style.primaryText,
                  ]}
                >
                  Back
                </Text>
              </TouchableOpacity>
            </View>
            {applicationLoader ?
            <View style={[style.contant,style.centerBox,style.centerItem,style.row]}>
              <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} />
            </View>
              :
            <ScrollView>
              <Text style={[style.mt20,style.boldTxt]}>
                Application Details
              </Text>
              {applicationData && (
                <View
                  style={[style.contant, isTablet ? style.mt20 : style.mtb20]}
                >
                  <View style={[style.row]}>
                    {applicationData && applicationData?.member?.profileUrl ? (
                      <Image
                        source={{ uri: applicationData?.member?.profileUrl }}
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
                          <Text
                            style={[
                              isTablet ? style.font20 : style.font16,
                              style.BlackbuttonTxt,
                              style.boldTxt,
                            ]}
                          >
                            {applicationData?.member?.firstName}
                          </Text>
                          <Text
                            style={[
                              isTablet ? style.font20 : style.font16,
                              style.BlackbuttonTxt,
                              style.boldTxt,
                              style.mH5,
                            ]}
                          >
                            {applicationData?.member?.lastName}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={[style.contant]}>
                    <View style={style.mt10}>
                      <Text style={[style.font14, style.grayText]}>
                        OVERVIEW
                      </Text>
                      <View style={[style.row]}>
                        <Text
                          style={[
                            isTablet ? style.font20 : style.font16,
                            style.BlackbuttonTxt,
                            style.boldTxt,
                          ]}
                        >
                          {applicationData?.overview
                            ? applicationData?.overview
                            : "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[isTablet && style.row, style.contant, style.mt10]}
                  >
                    <View style={[style.row, style.contant]}>
                      <View style={style.contant}>
                        <Text
                          style={[style.font12, style.grayText, styles.lh12]}
                        >
                          PHONE NO
                        </Text>
                        <Text
                          style={[
                            style.font14,
                            style.BlackbuttonTxt,
                            style.boldTxt,
                            styles.lh14,
                          ]}
                        >
                          {applicationData?.phoneNumber
                            ? applicationData?.phoneNumber
                            : "-"}
                        </Text>
                      </View>
                      <View
                        style={[
                          style.contant,
                          !isTablet && {
                            alignContent: "flex-end",
                            alignItems: "flex-end",
                          },
                        ]}
                      >
                        <Text
                          style={[style.font12, style.grayText, styles.lh12]}
                        >
                          EMAIL
                        </Text>
                        <Text
                          style={[
                            style.font14,
                            style.BlackbuttonTxt,
                            style.boldTxt,
                            styles.lh14,
                          ]}
                        >
                          {applicationData?.email.length > 25
                            ? applicationData?.email.substring(0,25).concat('...')
                            : applicationData?.email}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        style.row,
                        style.contant,
                        !isTablet && style.mtb10,
                      ]}
                    >
                      <View style={style.contant}>
                        <Text
                          style={[style.font12, style.grayText, styles.lh12]}
                        >
                          SAILING EXPERIENCE
                        </Text>
                        <Text
                          style={[
                            style.font14,
                            style.BlackbuttonTxt,
                            style.boldTxt,
                            styles.lh14,
                          ]}
                        >
                          {applicationData?.sailingExperience
                            ? applicationData?.sailingExperience
                            : "N/A"}
                        </Text>
                      </View>
                      <View
                        style={[
                          !isTablet && {
                            alignContent: "flex-end",
                            alignItems: "flex-end",
                          },
                        ]}
                      >
                        <Text
                          style={[style.font12, style.grayText, styles.lh12]}
                        >
                          SMOKER
                        </Text>
                        <Text
                          style={[
                            style.font14,
                            style.BlackbuttonTxt,
                            style.boldTxt,
                            styles.lh14,
                          ]}
                        >
                          <Text>
                            {applicationData?.smokingPrefrence ? "Yes" : "No"}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      isTablet && style.row,
                      style.contant,
                      isTablet && style.mt30,
                      { marginBottom: isTablet ? -10 : 0 },
                    ]}
                  >
                    <View style={[style.row, style.contant, style.mB10]}>
                      <View style={[style.contant]}>
                        <Text
                          style={[style.font12, style.grayText, styles.lh12]}
                        >
                          DIERTY REQUIREMENTS
                        </Text>
                        <Text
                          style={[
                            style.font14,
                            style.BlackbuttonTxt,
                            style.boldTxt,
                          ]}
                        >
                          {applicationData?.dietryRequriements
                            ? applicationData?.dietryRequriements
                            : "N/A"}
                        </Text>
                      </View>
                      <View
                        style={
                          !isTablet && {
                            alignContent: "flex-end",
                            alignItems: "flex-end",
                          }
                        }
                      >
                        <Text
                          style={[style.font12, style.grayText, styles.lh12]}
                        >
                          AVAILABLE DATES
                        </Text>
                        <Text
                          style={[
                            style.font14,
                            style.BlackbuttonTxt,
                            style.boldTxt,
                          ]}
                        >

{dateFormat(applicationData?.avaliableDates.split(',')[0]) + ',' + dateFormat(applicationData?.avaliableDates.split(',')[1])}
                         
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              {applicationData?.attachments && applicationData?.attachments?.length === 0 ? null :
              <TouchableOpacity style={styles.ResumeContainer} onPress={downloadFiles}>
                <Text style={styles.Downloadresume}>Download Resume</Text>
                <View style={{ flex: 1 }} />
                <Icon
                  name="download"
                  size={20}
                  color="black"
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>}

              <View style={{ flexDirection: "row", ...style.mt20 }}>
                {(!applicationData?.isInvited && !applicationData?.isAccepted) && 
                <TouchableOpacity
                  style={[style.button,styles.buttionBox]}
                  onPress={() => handleNotInterested(applicationData.id)}
                >
                  <Text
                    style={[
                      style.font14,
                      style.boldTxt,
                      { color: COLORS.PRIMARY },
                    ]}
                  >
                    Not Interested
                  </Text>
                </TouchableOpacity>
          }
                
  <TouchableOpacity
  disabled={(applicationData?.isInvited || applicationData?.isAccepted)}
    style={[style.button,(applicationData?.isInvited || applicationData?.isAccepted)? styles.invitedBtn : styles.inviteBtn]}
    onPress={() => handleInvite(applicationData.id)}
  >
    <Text style={[style.font14, style.boldTxt, { color: COLORS.WHITE }]}>
      {(applicationData?.isInvited || applicationData?.isAccepted)? "Invited":"Invite"}
    </Text>
  </TouchableOpacity>

              </View>

          <View style={[style.mt20,style.contentCenter]}>
              <View style={[styles.btnsAlignment]}>
              <TouchableOpacity style={[styles.userIcons]}  onPress={() => {
                setChatData({id:applicationData?.member?.id,type:'user'})
                  navigation.navigate("WebChat")
              }}>
                <Image source={require('../../assets/msg-icon.png')} />
              </TouchableOpacity>
              <Text style={[styles.favIconTxt,style.mt5,{color:COLORS.GREY}]}>Message</Text>
            </View>
            <View style={[styles.btnsAlignment]}>
              <TouchableOpacity style={[styles.userIcons]}  onPress={() =>Linking.openURL(`tel:${applicationData?.phoneNumber}`)}>
              <Image source={require('../../assets/phone-icon.png')}/>
              </TouchableOpacity>
              <Text style={[styles.favIconTxt,style.mt5,{color:COLORS.GREY}]}>Call</Text>
            </View>
            <View style={[styles.btnsAlignment]}>
              <TouchableOpacity style={[styles.userIcons]}  onPress={() =>Linking.openURL(`mailto:${applicationData?.email}`)}>
              <Image source={require('../../assets/mail-icon.png')}/>
              </TouchableOpacity>
              <Text style={[styles.favIconTxt,style.mt5,{color:COLORS.GREY}]}>Email</Text>
            </View>
          </View>
            </ScrollView>}
          </View>
        </View>
      )}
      <ModalNative 
       animationIn={'zoomIn'}
       animationOut={'zoomOut'}
       isVisible={fileDownloadModal}
       backdropColor='rgba(0, 0, 0, 0.3)'>  
       <View style={[style.p20,style.whiteLayout]}>
       <Text style={styles.modalText}>
       {applicationData?.attachments && applicationData?.attachments.length === 0 ? 'No files are uploaded' :
        'File downloaded successfully'}
        </Text>
        </View>
        </ModalNative>
              
    </View>
    //inviteId
    //value
  );
};

const styles = StyleSheet.create({
  invitedBtn:{
    backgroundColor: COLORS.GREY ,
    borderColor:COLORS.GREY,
    width:"100%"
  },
  inviteBtn:{
    backgroundColor: COLORS.PRIMARY ,
    borderColor:COLORS.PRIMARY,
    width:"50%"
  },
  buttionBox:{
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
    marginRight: 10,
    width: "45%",
  },
  profileImg: {
    width: normalize(80),
    height: normalize(80),
    borderRadius:8
  },

  lh12: {
    paddingBottom: 2,
    lineHeight: 12,
  },
  lh14: {
    lineHeight: 14,
    marginTop: normalize(5),
  },

  memberTitleText: {
    color: COLORS.LIGHT_BLACK,
    fontSize: normalize(12),
    lineHeight: 25,
  },
  ResumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#8A97A4",
    borderWidth: 1,
    padding: 15,
    borderRadius:8
  },
  Downloadresume: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  btnsAlignment :{
    flexDirection:"column",
    alignItems:'center',
    paddingRight:50
  },
  userIcons:{
    width:45,
    height:45,
    borderWidth:1.2,
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
  modalText: {
    color:COLORS.BLACK,
    fontSize:normalize(14),
    fontWeight:"600",
    lineHeight:30,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10
  },
});

export default ApplicationDetails;
