import React, { useState, useEffect } from "react";
import { Image, Text, View, StyleSheet, Modal, TextInput, TouchableOpacity } from "react-native";
import style from "../../styles/style";
import COLORS from "../../styles/theme/color";
import { normalize } from "../../styles/utilities/dimentions";
import Icons from 'react-native-vector-icons/FontAwesome';
import { forgotPassword, otpVerification, resendOtp,ResetPassword } from "../../services/api/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [backendErrorMessage, setBackendErrorMessage] = useState("");
  const [loaderShow, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [otp, setOtp] = useState("")
  const [otpErr, setOtpErr] = useState("");
  const [otpBackendErr, setOtpBackendErr] = useState("")
  const token = AsyncStorage.getItem('accessToken');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");
  const [resetPassword,setResetPassword] = useState(false);
  const [successMsg,setSuccessMsg] = useState("")
  const [backendErrMsg,setBackendErrMsg] = useState('')
  const [isLoader, setIsLoader] = useState(false);

  const submitHandler = async () => {
    setBackendErrorMessage("")
    setEmailErrorMsg("")
    
    let isValid = true;
    const emailAddress = email.toLowerCase();
    if (emailAddress === "") {
      setEmailErrorMsg("Please enter the email or userId");
      isValid = false;
    }
    const payload = {
      email: emailAddress 
    };
    if (isValid) {
      setLoader(true)
      try {
        const response = await forgotPassword(payload);
        if (response.status === 200) {
          setModalVisible(true);
          setLoader(false);
        }
      } catch (error) {
        setLoader(false)
        setBackendErrorMessage("User does not exist");
      }
    }
  };  

  const submitOtpHandler = async () => {
    setOtpErr("");
    setOtpBackendErr("")
    const regexOtp = /^[0-9]{6}$/;
    const emailAddress = email.toLowerCase();
    let isValid = true;
    if (otp === "") {
      setOtpErr("Please enter verification code");
      isValid = false
    } else if (!regexOtp.test(otp)) {
      setOtpErr("Please enter valid verification code");
      isValid = false;
    }
    const payload = {
      username:emailAddress,
      otp:otp
    }
    if(isValid){
    try {
      setIsLoader(true)
      const response = await otpVerification(payload,token);
      if(response.status === 200){
        setModalVisible(false);
        setResetPassword(true)
        setIsLoader(false)
      }
    } catch (error) {
      console.error(error)
      setOtpBackendErr("Invalid verification code")
      setIsLoader(false)
    }
  }
  }

  const resendOtpHandler = async() => {
    const emailAddress = email.toLowerCase();
     const payload = {
      username:emailAddress
     }
     try {
      setLoader(true)
      const response = await resendOtp(payload,token);
      if(response.status === 200){
        setSuccessMsg(response.data.message)
        setLoader(false)
      }
     } catch (error) {
      console.error(error)
     }
  }

  const resetPasswordHandler = async () => {
    setConfirmPasswordErrorMsg('');
    setPasswordErrorMsg('');
    setBackendErrMsg("")
    const passwordMinLength = 8;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
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
      password: password,
      reCheckPassword: confirmpassword
    };
  
    if (isValid) {
      try {
        setLoader(true);
        const response = await ResetPassword(email, payload);
        if (response.status === 200) {
          await AsyncStorage.setItem('accessToken', response.data?.token);
          setLoader(false);
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error(error);
        setLoader(false);
        setBackendErrMsg("Old password & new password are same")
      }
    }
  };
  

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"} style={[style.contant,style.whiteLayout]}>
      {resetPassword ?
    <View style={[style.contant, style.whiteLayout]}>
      <View style={[style.mt40, style.centerBox, style.mtb10]}>
        <Image source={require("../../assets/saltyDawgLogo.png")} alt="" />
      </View>
      <View style={[style.mH20, style.mt40]}>
        <View style={style.mtb10}>
          <Text style={[style.font24, style.boldTxt]}>Reset Account Password</Text>
          <Text style={[style.font16, style.mt10, { color: COLORS.LIGHTGREY }]}>Password must be atleast 8 characters long, with letters (atleast one capital letter) and numbers.</Text>
        </View>
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
        <Text style={{ color: 'red' }}>{passwordErrorMsg}</Text>
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
        <TouchableOpacity activeOpacity={.8} style={[styles.btnStyleOutline, { backgroundColor: COLORS.PRIMARY, height: normalize(44), width: "100%" }]} onPress={resetPasswordHandler}>
        {loaderShow ? 
          <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> 
          :
          <Text style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>Submit</Text>
        }
        </TouchableOpacity>
      </View>
    </View>
    :
    <View style={[style.contant, style.whiteLayout]}>
      <View style={[style.mt40, style.centerBox]}>
        <Image source={require("../../assets/saltyDawgLogo.png")} alt="" />
      </View>
      <View style={[style.mH20, { width: 100, borderRadius: 8 }, style.mt20]}>

      </View>
      <View style={[style.mH20, style.mt20]}>
        <TouchableOpacity style={style.container} onPress={() => navigation.navigate("Login")}>
          <View style={style.mtb10}>

            <Text style={[style.font24, style.boldTxt]}>
              <Icons name="chevron-left" size={normalize(20)} color={COLORS.PRIMARY} /> Reset Account Password
            </Text>
          </View>
        </TouchableOpacity>


        <Text style={[style.font14, style.mt10, { color: COLORS.LIGHTGREY }]}>Input the email address associated with your account. If you have an account with us you will receive an email with instructions on how to reset your password.</Text>
      </View>
      <View style={[style.mH20, style.contant, style.mt20]}>
        <View>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt]}>Email or UserId</Text>
          <View style={[styles.inputBorderStyle]}>
            <TextInput style={styles.input} value={email} onChangeText={(e) => setEmail(e)} placeholder="Enter email or userId" placeholderTextColor={COLORS.GREY}></TextInput>
          </View>
          {emailErrorMsg && (
          <Text style={{ color: COLORS.RED }}>{emailErrorMsg}</Text>)}
          {backendErrorMessage && (
          <Text style={{ color: COLORS.RED }}>{backendErrorMessage}</Text>)}
        </View>

        <TouchableOpacity activeOpacity={.8} style={[styles.btnStyleOutline,,style.mt20,{ backgroundColor: COLORS.PRIMARY, height: normalize(44), width: "100%" }]} onPress={() => submitHandler()}>
          {loaderShow ? 
          <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> 
          :
          <Text style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>Submit</Text>
          }
        </TouchableOpacity>
        <View style={{color:COLORS.BLACK}}>
        <Modal
          animationType="fade"
          transparent={true}
          style={styles.modelUser}
          visible={modalVisible}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalText, style.font18, style.boldTxt]}>
                Verification code sent to registered email address!
              </Text>
              <View>
                <Text style={[style.font16, style.BlackbuttonTxt]}>Enter verification code.</Text>
                <View style={[styles.inputBorderStyle]}>
                  <TextInput keyboardType="numeric" style={styles.input} value={otp} maxLength={6} onChangeText={(e) => setOtp(e)} placeholder="Enter verification code" placeholderTextColor={COLORS.GREY}></TextInput>
                </View>
                {otpErr && (<Text style={[style.font14,{color:COLORS.RED}]}>{otpErr}</Text>)}
                {otpBackendErr && (<Text style={[style.font14,{color:COLORS.RED}]}>{otpBackendErr}</Text>)}
                <Text style={styles.input}>Verification code is valid for 15 minutes</Text>
                
                {successMsg && (<Text style={[style.font14,{color:COLORS.GREEN}]}>{successMsg}</Text>)}
              </View>
              <View style={style.contentBetween}>
                <TouchableOpacity activeOpacity={.8} style={[styles.btnStyleOutline, style.mt20, { backgroundColor: COLORS.PRIMARY, height: normalize(30) }]} onPress={resendOtpHandler}>
                {loaderShow ? 
                <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> 
                :
                <Text style={[styles.btnOutlineTextStyle,style.whiteText]}>Resend</Text>
                }
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.8} style={[styles.btnStyleOutline, style.mt20, { backgroundColor: COLORS.PRIMARY, height: normalize(30) }]} onPress={submitOtpHandler}>
                {isLoader ? 
                <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> 
                :
                <Text style={[styles.btnOutlineTextStyle,style.whiteText]}>Submit</Text>
                }
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>
        </View>
      </View>
    </View>
    }
    </KeyboardAwareScrollView>
  )
}
export default Forgotpassword;
const styles = StyleSheet.create({
  inputBorderStyle: {
    borderWidth: 1,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(0),
    borderRadius: 8,
    marginVertical: normalize(5),
    backgroundColor: '#f2f4f6',
    width: '100%',
    flexDirection: 'row',
    alignItems: "center",
    height:normalize(35),
    justifyContent:'center'


  },
  btnTextStyle: {
    color: COLORS.PRIMARY,
    fontSize: normalize(14),
  },
  input: {
    color: '#000',
    width:"100%",
  },
  btnStyleOutline: {
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
    // alignItems: 'center',
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
  }
})