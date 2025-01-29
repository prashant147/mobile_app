import React, { useContext, useState,useEffect } from "react";
import { Image, Text, View, StyleSheet, ScrollView, Linking, PermissionsAndroid, Platform,Modal,TextInput } from "react-native";
import style from "../../styles/style";
import COLORS from "../../styles/theme/color";
import { normalize } from "../../styles/utilities/dimentions";
import { TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getMember, isFirstUser, loginUser,otpVerification,resendOtp } from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "react-native-check-box";
import { ActivityIndicator } from 'react-native-paper';
import TextFeild from "../../components/TextFeild";
import MembersContext from "../Members/MembersContext";
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import DeviceInfo from "react-native-device-info";
import AntDesign from 'react-native-vector-icons/FontAwesome';
import { CometChatUIKit } from "@cometchat/chat-uikit-react-native";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { AppConstants } from "../../services/CometUtils";
import Config from "react-native-config";
import { green } from "react-native-reanimated/lib/typescript/Colors";

const Login = () => {
 const{ accessToken,setHideChatbot,status,setLoggedInUser,setUserTimeZone,setApplicationRole,internetStatus } = useContext(MembersContext)
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [password, setPassword] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(false);
  const navigation = useNavigation();
  const [isLodering, setIsLodering] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [rememberMe, setRememberMer] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true)
  const [isFirstTimeUserLoader, setIsFirstTimeUserLoader] = useState(false)
  
  useFocusEffect(
    React.useCallback(()=>{
      setIsLodering(false)
      setHideChatbot(true)
    },[])
  )
  const getPermissions = async () => {
    try {
      await messaging().requestPermission();
      console.log('Messaging permission granted');
      if (Platform.OS === 'android') {
           await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
  
  
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
  
        const allPermissionsGranted = Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED
        );
  
        if (allPermissionsGranted) {
          console.log('All permissions granted');
        } else {
          console.log('Some permissions were not granted');
        }
      }
    } catch (error) {
      crashlytics().log(error);
    }
  };
  
  useEffect(() => {
    console.log('called app.js');
    
  const callpermissions = async ()=>{
    await getPermissions();
  
  }
  callpermissions()
   
   
    CometChatUIKit.init({
      appId: Config.APP_ID,
    authKey: Config.AUTH_KEY,
    region: Config.REGION,
    })
      .then(() => {
        CometChatLocalize.setLocale("en");
        try{CometChat.setDemoMetaInfo(metaInfo)}catch(err){}
        if (CometChat.setSource) {
          CometChat.setSource('ui-kit', Platform.OS, 'react-native');
        }
      })
      .catch(() => {
        return null;
      });
      
  
  }, []);
  const getFcmToken = async () => {
    try {
      const newFcmToken = await messaging().getToken();
      console.log("newFcmToken",newFcmToken);
      return newFcmToken;
    } catch (error) {
      console.error("error",error);
      return null;
    }
  };
  useEffect(() => {
    const getSavedCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('username');
      const savedPassword = await AsyncStorage.getItem('password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMer(true);
        setIsFirstTimeUser(false)
      }
    };
    getSavedCredentials();
  }, []);

  const firstTimeUserhandler = async ()=>{
    setEmailErrorMsg("");
    setBackendError("");
  
    let isValid = true;
    if (email === "") {
      setEmailErrorMsg("Email is required");
      isValid = false
    }
    if(email){
      setEmailErrorMsg("")
    }
    if(isValid){
      setIsFirstTimeUserLoader(true)
      try {
        const response = await isFirstUser(email)
        if(response.status === 200){
          setIsFirstTimeUser(response.data.isFirstTimeUser)
          setIsFirstTimeUserLoader(false)
          setEmailErrorMsg("");
          const savedEmail = await AsyncStorage.getItem('username');
          const savedPassword = await AsyncStorage.getItem('password');
          if(savedEmail === email){
            setPassword(savedPassword);
          }else{
            setPassword('')
          }
          if(response.data.isFirstTimeUser){
            navigation.navigate("Resetpassword",{ email })
          }
          
      }
    } catch (error) {
      setIsFirstTimeUserLoader(false)
      setEmailErrorMsg(Object.keys(error).length === 0 ?`Something went wrong`:error);
    }
  }
  }
  const loginHandler = async () => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailErrorMsg("");
    setPasswordErrorMsg("");
    setBackendError("");
    const passwordMinLength = 8;
  
    let isValid = true;
    if (email === "") {
      setEmailErrorMsg("Email is required");
      isValid = false
    } 
    if(email){
      setEmailErrorMsg("")
    }

  let passwordErrorMsg = "";

  if (password === "") {
      passwordErrorMsg = "Password is required";
      isValid = false;
  } else if (password.length < passwordMinLength) {
      passwordErrorMsg = "Password must be at least 8 characters long";
      isValid = false;
  } else if (!/[A-Z]/.test(password)) {
      passwordErrorMsg = "Password must contain at least one uppercase letter";
      isValid = false;
  } else if (!/[a-z]/.test(password)) {
      passwordErrorMsg = "Password must contain at least one lowercase letter";
      isValid = false;
  } else if (!/[0-9]/.test(password)) {
      passwordErrorMsg = "Password must contain at least one digit";
      isValid = false;
  }
  
  if (passwordErrorMsg) {
      setPasswordErrorMsg(passwordErrorMsg);
  }
    let res = await getFcmToken();
    const payload = {
      username: email,
      password: password,
      fireBaseToken:res,
      deviceName:DeviceInfo.getBrand(),
      deviceType:Platform.OS
    }
    console.log(payload)
    if (isValid) {
      setIsLodering(true);
      try {
        const response = await loginUser(payload);
        if (response.data.token) {
          await AsyncStorage.setItem('accessToken', response.data.token);
        }
        if (response.status === 200) {
          await AsyncStorage.setItem('userStatus', response.data.userStatus);
          if(response?.data?.applicationRole){
            await AsyncStorage.setItem('applicationRole', response.data.applicationRole);
            setApplicationRole(response.data.applicationRole)
          }
          if(response.data?.timezone){
            await AsyncStorage.setItem('timeZone', response.data?.timezone);
            setUserTimeZone(response.data.timezone)
          }
          if (rememberMe) { // Check if "Remember Me" is checked
            await AsyncStorage.setItem('username', email); // Save the email
            await AsyncStorage.setItem('password', password); // Save the password
          }
        else{
          await AsyncStorage.removeItem('username');
          await AsyncStorage.removeItem('password');
        }
          
          
          if(response.data.userStatus === 'Active'){
            const res = await getMember(response.data.token);
            setLoggedInUser(res.data)
            crashlytics().log("Login");
            const username = res.data.id;
            if(username){
              await AsyncStorage.setItem('userId', username);
            }
            try {
              CometChatUIKit.login({uid:username,authToken:Config.AUTH_KEY})
               
              .then(user => {
                console.log('login success',user);
                setIsLodering(false)
                navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
              })
              .catch(err => {
                console.log('login error',err);
                const payload = {
                  "uid": res.data.id,
                  "name": res.data.firstName + " " + res.data.lastName,
                  ...(res.data.profileUrl && { "avatar": encodeURI(res.data.profileUrl) }),
                  "metadata": {
                      "@private": {
                          "email": res.data.username
                      }
                  }
              };
                CometChatUIKit.createUser(payload, Config.AUTH_KEY).then(user =>{
                  console.log('create user',user);
                  CometChatUIKit.login({uid:username,authToken:Config.AUTH_KEY}).then(user =>{
                    const FCM_TOKEN =  messaging().getToken();
                    console.log('FCM_TOKEN',FCM_TOKEN);
                    setIsLodering(false)
                     CometChat.registerTokenForPushNotification(FCM_TOKEN);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Main' }],
                    });
                  })
                }).catch(err => {
                  console.log('create User error',err);
                  setIsLodering(false)
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                  });
                })
                
              })
            } catch (error) {
              
            }
           
                        
          }else{
            navigation.navigate("UpdatePassword", { password });
            setIsLodering(false)
            setEmail("")
            setPassword("")
          }
        }
      } catch (error) {
       
        console.log("login error",error)
        setBackendError(Object.keys(error).length === 0 ?`Something went wrong`:error);
        setIsLodering(false)
        console.log("sss")
        crashlytics().log(error);
        console.log("eee")
      }
    }
};


  return (
    // accessToken ? <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} /> :
    <ScrollView style={[style.contant, style.whiteLayout]} showsVerticalScrollIndicator={true}>
      <View style={[style.mt40, style.centerBox]}>
        <Image source={require("../../assets/saltyDawgLogo.png")} alt="" />
      </View>
      <View style={[style.mH20, style.mt40]}>
        <Text style={[style.font20, style.boldTxt]}>
         Login here.
        </Text>
      </View>
      {!isFirstTimeUser && <View style={[style.row,style.mt20, style.pH20,style.centerBox]}>
            {(
              <TouchableOpacity
              style={[style.row]}
              onPress={()=>setIsFirstTimeUser(true)}

              >
                <AntDesign
                  name={"chevron-left"}
                  size={normalize(15)}
                  style={[style.mr10,style.mt3]}
                  color={COLORS.PRIMARY}
                />
                <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
              </TouchableOpacity>
            )}
          </View>}
      <View style={[style.mH20, style.contant, style.mt20]}>
         <TextFeild errorMsg={emailErrorMsg} setErrorMessage={setEmailErrorMsg} labelName={'Email or UserId'} placeholder={'Enter Email or UserId'} value={email} onchange={setEmail}></TextFeild>
         {!isFirstTimeUser && <TextFeild isPassword={true} errorMsg={passwordErrorMsg?passwordErrorMsg:backendError?backendError:''} setErrorMessage={setPasswordErrorMsg} labelName={'Password'} placeholder={'Enter Password'} value={password} onchange={setPassword}></TextFeild>}
         {!isFirstTimeUser &&<View style={[style.contentBetween,style.mt10]}>
              <View style={[style.row, style.centerItem]}>
                <CheckBox
                  style={styles.mb5}
                  isChecked={rememberMe}
                  onClick={() => setRememberMer(!rememberMe)}
                  checkBoxColor={COLORS.PRIMARY}
                />
                <Text style={[style.font14, style.primaryText, styles.mt3, style.mH5]}>Remember me</Text>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={[{ color: COLORS.PRIMARY, marginBottom: 10, fontSize: 14 }, style.boldTxt]}>Forgot password ?</Text>
              </TouchableOpacity>
            </View>}
        {isFirstTimeUser ? 
        <TouchableOpacity activeOpacity={.8} style={[styles.btnStyleOutline,style.mt15, { backgroundColor: COLORS.PRIMARY, width: "100%" }]} onPress={() => firstTimeUserhandler()} disabled={isFirstTimeUserLoader || !internetStatus}>
          {isFirstTimeUserLoader ?
            <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
            :
            <Text style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>Next</Text>
          }
        </TouchableOpacity> :
        <TouchableOpacity activeOpacity={.8} style={[styles.btnStyleOutline,style.mt15, { backgroundColor: COLORS.PRIMARY, width: "100%" }]} onPress={() => loginHandler()} disabled={isLodering || !internetStatus}>
          {isLodering ?
            <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
            :
            <Text style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>Login</Text>
          }
        </TouchableOpacity>}
        {/* <View style={[style.centerBox, style.mtb10, style.mt20]}>

          <Text style={[style.centerBox,style.font16]}>Or</Text>
        </View>
        <View style={[style.centerBox]}>
          <Text style={[style.font16, style.centerBox, style.boldTxt]}>Register here for new user</Text>
        </View>
        <TouchableOpacity style={[styles.btnStylesForgot, style.mtb10,]} onPress={() => navigation.navigate("Signup")}>
          <Text style={[styles.btnOutlineTextStyle, { color: COLORS.PRIMARY }]}>Click Here To Register</Text>
        </TouchableOpacity> */}
        <View style={[style.centerBox]}>
        {/* <Text style={[style.mH40, style.font14, style.mt20,style.mB10]}>Know more about <Text style={[{textDecorationStyle:'solid',textDecorationLine:"underline",color:COLORS.PRIMARY,fontWeight:'600'}]} onPress={()=>{Linking.openURL('https://www.saltydawgsailing.org/about-membership')}}>Member Subscription</Text> </Text> */}
        </View>
      </View>
    
    </ScrollView>
  )
}
export default Login;
const styles = StyleSheet.create({

  inputBorderStyle: {
    borderWidth: .9,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(10),
    borderRadius: 4,
    marginVertical: normalize(5),
    backgroundColor: '#f2f4f6',
    width: '100%',
    justifyContent:"center",
    height: normalize(35),

  },
  input: {
    color: '#000',
    width: "100%",
  },
  btnStyleOutline: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(10),
    borderRadius: normalize(8),
    marginRight: 'auto',
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center'

  },
  btnOutlineTextStyle: {
    color: COLORS.PRIMARY,
    fontSize: normalize(13),
  },
  btnStylesForgot: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    margin: normalize(5),
    borderRadius: normalize(8),
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mt3: {
    marginTop: 3
  },
  btnOutlineTextStyle: {
    color: COLORS.PRIMARY,
    fontSize: normalize(13),
  },
  btnStyless: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    margin: normalize(5),
    borderRadius: normalize(8),
    height: normalize(30),
    justifyContent: 'center',
    alignItems: 'center',
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
    width:380,
    height:300,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    color: COLORS.BLACK,
    fontSize: normalize(14),
    fontWeight: "600",
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  btnStyleModal: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(10),
    marginBottom: normalize(5),
    borderRadius: normalize(8),
    height: normalize(20),
    width:normalize(100),
    justifyContent: 'center',
    alignItems: 'center'
  },
  greenText:{
    color:COLORS.GREEN
  },
  redText:{
    color:COLORS.RED
  },
  submitButtonStyle:{ 
    backgroundColor: COLORS.PRIMARY, 
    height: normalize(30) 
  }
})