import React,{useContext, useEffect,useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image, TextInput, StyleSheet, Text, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import style from "../../styles/style";
import { TouchableOpacity } from 'react-native';
import { normalize } from "../../styles/utilities/dimentions";
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from "../../styles/theme/color";
import Icons from 'react-native-vector-icons/FontAwesome';
import { getMember, firstTimeUserSetPassword,resendOtp } from "../../services/api/auth";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CometChatUIKit } from "@cometchat/chat-uikit-react-native";
import MembersContext from "../Members/MembersContext";
import { AppConstants } from "../../services/CometUtils";
import Config from "react-native-config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Resetpassword = ({route}) => {
  const{setLoggedInUser} = useContext(MembersContext)
  const isTablet = DeviceInfo.isTablet();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [confirmpassword, setConfirmPassword] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState('');
  const [backendErrMsg,setBackendErrMsg] = useState('');
  const [otp, setOtp] = useState("")
  const [otpErr, setOtpErr] = useState("");
  const [otpBackendErr, setOtpBackendErr] = useState("")
  const [successMsg,setSuccessMsg] = useState("")

const resetPasswordHandler = async () => {
  setConfirmPasswordErrorMsg('');
  setPasswordErrorMsg('');
  setBackendErrMsg("")
  setOtpErr("")
  setSuccessMsg("")
  const regexOtp = /^[0-9]{6}$/;
  const passwordMinLength = 8;
  const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  let isValid = true;

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

  if (otp === "") {
    setOtpErr("Please enter verification code");
    isValid = false
  } else if (!regexOtp.test(otp)) {
    setOtpErr("Please enter valid verification code");
    isValid = false;
  }

  if (confirmpassword === '') {
    setConfirmPasswordErrorMsg('Confirm password is required');
    isValid = false;
  } else if (!passwordRegex.test(confirmpassword)) {
    setConfirmPasswordErrorMsg('Enter valid confirm password');
    isValid = false;
  } else if (password !== confirmpassword) {
    setConfirmPasswordErrorMsg("Passwords do not match");
    isValid = false;
  }

  const payload = {
    otp:otp,
    password: password,
    reCheckPassword: confirmpassword,
    deviceType:Platform.OS
  };

  if (isValid) {
    try {
      setLoader(true);
      const response = await firstTimeUserSetPassword(route.params.email, payload);
      if (response.status === 200) {
        await AsyncStorage.setItem('accessToken', response.data?.token);
        if(response.data?.applicationRole){
          await AsyncStorage.setItem('applicationRole', response.data?.applicationRole);
        }
        if(response.data?.email){
          await AsyncStorage.setItem('username', response.data?.email);
        }
        await AsyncStorage.setItem('password', password);
        if(response.data?.memberId){
          await AsyncStorage.setItem('userId', response.data?.memberId);
        }
        if(response.data?.timezone){
          await AsyncStorage.setItem('timeZone', response.data?.timezone);
        }
        const res = await getMember(response.data.token);
        setLoggedInUser(res.data)
        const username = res.data.id;
        if(username){
          await AsyncStorage.setItem('userId', username);
        }
        try {
          CometChatUIKit.login({uid:username,authToken:Config.AUTH_KEY})
           
          .then(user => {
            console.log('login success',user);
            setLoader(false)
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
              ...(res.data.profileUrl && { "avatar": res.data.profileUrl }),
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
                setLoader(false)
                 CometChat.registerTokenForPushNotification(FCM_TOKEN);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
                setPassword('')
                setOtp("")
                setConfirmPassword('')
              })
            }).catch(err => {
              console.log('create User error',err);
              setLoader(false)
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
              setPassword('')
              setOtp("")
              setConfirmPassword('')
            })
            
          })

          setLoader(false);
          setConfirmPasswordErrorMsg('');
          setPasswordErrorMsg('');
          setBackendErrMsg("")
  
        } catch (error) { 
        }
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
      setBackendErrMsg(error)
    }
  }
};

const resendOtpHandler = async() => {
  setOtpErr("");
  setOtpBackendErr("");
  setOtp("")
   const payload = {
    username:route.params.email
   }
   try {
      const response = await resendOtp(payload);
    if(response.status === 200){
      setSuccessMsg(response.data.message)
    }
   } catch (error) {
    console.error(error)
   }
}

  return (
    <View style={[style.contant, style.whiteLayout]}>
      <KeyboardAwareScrollView style={[style.whiteLayout]} extraHeight={80} showsVerticalScrollIndicator={true}>
      <View style={[style.mt40, style.centerBox, style.mtb10]}>
        <Image source={require("../../assets/saltyDawgLogo.png")} alt="" />
      </View>
      <View style={[style.mH20, style.mt40,style.row]}>
      <TouchableOpacity style={[style.row]} onPress={() => navigation.navigate("Login")}>
            <Text style={[style.font24, style.boldTxt]}>
              <Icons name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} /> Set Your Password
            </Text>
        </TouchableOpacity>
      </View>
            <Text style={[style.font16, style.mt10,style.mH20, { color: COLORS.LIGHTGREY }]}>Password must be atleast 8 characters long, with letters (atleast one capital letter) and  numbers.</Text>
            <Text style={[style.font16, style.mt10,style.mH20,style.grayText]}>Verification code sent to your email address.</Text>
            <View style={[style.mt10, style.mH20]}>
        <Text
          style={[style.font16, style.BlackbuttonTxt, style.boldTxt]}>
          Verification Code
        </Text>
        <View style={[styles.inputBorderStyle, style.contentBetween]}>
        <TextInput keyboardType="numeric" style={[styles.input]} value={otp} onChangeText={(e) => {setOtp(e),setOtpErr("")}} maxLength={6}  placeholder="Enter verification code" placeholderTextColor={COLORS.GREY}></TextInput>
        
        </View>
        <View style={[style.contentBetween]}>
        <Text style={[style.font14]}>Verification code is valid for 15 minutes</Text>
        <TouchableOpacity onPress={resendOtpHandler}>
        <Text style={[style.font14,style.primaryText]}>Resend code</Text>
        </TouchableOpacity>
        </View>
        {otpErr && (<Text style={{ color: COLORS.RED }}>{otpErr}</Text>)}
        {successMsg && (<Text style={[style.font14,style.greenText]}>{successMsg}</Text>)}
      </View>
            <View style={[style.mtb10, style.mH20]}>
        <Text
          style={[style.font16, style.BlackbuttonTxt, style.boldTxt]}>
          New Password
        </Text>
        <View style={[styles.inputBorderStyle, style.contentBetween]}>
          <TextInput
            style={styles.input}
            textContentType={showPassword ? 'none' : 'password'}
            placeholder="Enter New Password"
            value={password}
            onChangeText={e => setPassword(e)}
            placeholderTextColor={COLORS.GREY}
            secureTextEntry={!showPassword}
            autoCapitalize={'none'}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={[style.centerItem, { marginLeft: -20 }]}>
            {showPassword ? (
              <Icon name="eye-outline" size={20} color="black" />
            ) : (
              <Icon name="eye-off-outline" size={20} color="black" />
            )}
          </TouchableOpacity>
        </View>
       {passwordErrorMsg && <Text style={{ color: 'red' }}>{passwordErrorMsg}</Text>}
      </View>
      <View style={[style.mH20]}>
        <Text
          style={[style.font16, style.BlackbuttonTxt, style.boldTxt]}>
          Confirm Password
        </Text>
        <View style={[styles.inputBorderStyle, style.contentBetween]}>
          <TextInput
            style={styles.input}
            textContentType={confirmShowPassword ? 'none' : 'password'}
            placeholder="Enter Confirm Password"
            value={confirmpassword}
            onChangeText={e => setConfirmPassword(e)}
            placeholderTextColor={COLORS.GREY}
            autoCapitalize={'none'}
            secureTextEntry={!confirmShowPassword}
          />
          <TouchableOpacity
            onPress={() => setConfirmShowPassword(!confirmShowPassword)}
            style={[style.centerItem, { marginLeft: -20 }]}>
            {confirmShowPassword ? (
              <Icon name="eye-outline" size={20} color="black" />
            ) : (
              <Icon name="eye-off-outline" size={20} color="black" />
            )}
          </TouchableOpacity>
        </View>
       {confirmPasswordErrorMsg && (<Text style={{ color: 'red' }}>{confirmPasswordErrorMsg}</Text>)}
        {backendErrMsg && (<Text style={[{color:COLORS.RED}]}>{backendErrMsg}</Text>)}
      </View>
      <View style={[style.mtb10, style.mH20]}>
        <TouchableOpacity activeOpacity={.8} style={[styles.btnStyleOutline, { backgroundColor: COLORS.PRIMARY, width: "100%" }]} onPress={resetPasswordHandler}>
          {loader ?
          <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> 
        :
          <Text style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>Submit</Text>
        }
        </TouchableOpacity>
      </View>
      </KeyboardAwareScrollView>
    </View>
  )
}
export default Resetpassword;

const styles = StyleSheet.create({
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
  input: {
    color: '#000',
    width: '100%',
  },
  inputBorderStyle: {
    borderWidth: 0.9,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(3),
    borderRadius: 4,
    marginVertical: normalize(5),
    backgroundColor: '#f2f4f6',
    width: '100%',
    height: normalize(35),
  },
  btnOutlineTextStyle: {
    color: COLORS.PRIMARY,
    fontSize: normalize(13),
  },
})
