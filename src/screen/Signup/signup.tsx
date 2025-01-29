import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import style from '../../styles/style';
import { TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { normalize } from '../../styles/utilities/dimentions';
import COLORS from '../../styles/theme/color';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { validateEmail } from '../../services/api/auth';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import TextFeild from '../../components/TextFeild';
import RenderInput from '../BecomeMember/RenderInput';
import MembersContext from '../Members/MembersContext';

const Signup = () => {
  const{ setHideChatbot } = useContext(MembersContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [createProfile, setCreateProfile] = useState(false);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  useFocusEffect(
    React.useCallback(()=>{
      setHideChatbot(true)
    },[])
  )
  const register = async () => {
    setEmailErrorMsg('')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    if (email === '') {
      setEmailErrorMsg('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailErrorMsg('Enter valid email');
      isValid = false;
    }
    if (isValid) {
      try {
        setLoader(true)
        const response = await validateEmail(email)
        if (response.status === 200) {
          setLoader(false)
          setCreateProfile(true);
        }

      } catch (error) {
        console.log(error)
        setEmailErrorMsg('Email already exists')
        setLoader(false)
      }
    }
  };
  const createUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    setEmailErrorMsg('');
    setPasswordErrorMsg('');
    setConfirmPasswordErrorMsg('');
    let isValid = true;
    if (email === '') {
      setEmailErrorMsg('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) { 
      setEmailErrorMsg('Enter valid email');
      isValid = false;
    }

    if (password === '') {
      setPasswordErrorMsg('Password is required');
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordErrorMsg('Enter valid password');
      isValid = false;
    }
    if (confirmpassword === '') {
      setConfirmPasswordErrorMsg('Confirm password is required');
      isValid = false;
    } else if (!passwordRegex.test(confirmpassword)) {
      setConfirmPasswordErrorMsg('Enter valid confirm password');
      isValid = false;
    }else if (password !== confirmpassword) {
      setConfirmPasswordErrorMsg("Passwords do not match");
      isValid = false;
    }
    const payload = {
      email: email,
      password: password,
      reCheckPassword: confirmpassword,
    };
    if (isValid) {
      setLoader(true)

      navigation.navigate('BecomeMember', { params: payload });
      setLoader(false)

    }
  };

  return (
    <View style={[style.contant, style.whiteLayout]}>
      {!createProfile ? (
        <>
          <View style={[style.mt40, style.centerBox]}>
            <Image source={require('../../assets/saltyDawgLogo.png')} alt="" />
          </View>
          <View style={[style.mH20, style.row, style.mt20]}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Icons
                name="chevron-left"
                size={normalize(20)}
                style={style.p410}
                color={COLORS.PRIMARY}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.memberTitleText,
                style.contant,style.font16,style.primaryText
              ]}>
              Enter your Email ID to Register.
            </Text>
          </View>
          <View style={[style.mH20, style.contant, style.mt20]}>
            <View style={{height:normalize(emailErrorMsg?90:75)}}>
              <TextFeild required={true} errorMsg={emailErrorMsg} setErrorMessage={setEmailErrorMsg} labelName={'Email'} placeholder={'Enter Email'} value={email} onchange={setEmail}></TextFeild>
            </View>
            
            <Text style={[style.font12, style.grayText]}>
                By providing your email address, you agree to receive emails
                from Salty Dawg Sailing Association.
              </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.btnStyleOutline,
                {
                  backgroundColor: COLORS.PRIMARY,
                  height: normalize(44),
                  width: '100%',
                },
                style.mt40,
              ]}
              onPress={register}>
              {loader ? <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
                :
                <Text style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>
                  Register
                </Text>
              }
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[style.mt40, style.centerBox]}>
            <Image source={require('../../assets/saltyDawgLogo.png')} alt="" />
          </View>
          <View style={[style.row, style.mH20, { borderRadius: 8 }, style.mt20]}>
            <TouchableOpacity onPress={() => setCreateProfile(false)}>
              <Icons
                name="chevron-left"
                size={normalize(20)}
                style={style.p410}
                color={COLORS.PRIMARY}
              />
            </TouchableOpacity>
            <View style={[style.contant]}>
              <Text style={[style.font14]}>
                Enter your Email ID to Register.
              </Text>
            </View>
          </View>

          <View style={[style.mH20, style.contant, style.mt20]}>
           
            <View>
              <RenderInput
              name={'Email'}
              placeholder={'Enter Email'}
              value={email}
              required={true}
              setValue={setEmail}
              readOnly={true}
              />
              <View>
                <Text
                  style={[style.font16, style.mt10, { color: COLORS.LIGHTGREY }]}>
                  Password must be atleast 8 characters long, with letters (atleast one capital letter), numbers, and special characters. Ex: 'Test@123'
                </Text>
              </View>
             
              <View style={[style.mtb10]}>
               <TextFeild required={true} isPassword={true} errorMsg={passwordErrorMsg?passwordErrorMsg:''} setErrorMessage={setPasswordErrorMsg} labelName={'Password'} placeholder={'Enter Password'} value={password} onchange={setPassword}></TextFeild>
 
                <TextFeild required={true} isPassword={true} errorMsg={confirmPasswordErrorMsg?confirmPasswordErrorMsg:''} setErrorMessage={setConfirmPasswordErrorMsg} labelName={'Confirm Password'} placeholder={'Enter Confirm Password'} value={confirmpassword} onchange={setConfirmPassword}></TextFeild>
             
              </View>
            </View>

            <View style={[style.row]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  style.button,
                 styles.cancelBtn,
                  style.mt20,
                  style.row,
                  style.centerBox,
                  style.centerItem
                ]}
                onPress={() => setCreateProfile(false)}>
                <Text
                  style={[
                    styles.memberTitleText,
                    style.boldTxt,
                    style.centerBox,
                  ]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btnStyleOutline,
                  {
                    backgroundColor: COLORS.PRIMARY,
                    height: normalize(44),
                    width: normalize(140),
                    marginLeft: 10,
                  },
                  style.mt20,
                ]}
                onPress={createUser}>
                {loader ?
                  <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
                  : <Text
                    style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>
                    Create Profile
                  </Text>
                }

              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
export default Signup;

const styles = StyleSheet.create({
  cancelBtn: { height: normalize(44), width: normalize(140) },
  memberTitleText: {
    lineHeight: 25,
    fontSize: normalize(14),
    color: COLORS.PRIMARY
  },
  inputBorderStyle: {
    borderWidth: 0.9,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(3),
    borderRadius: 8,
    marginVertical: normalize(5),
    backgroundColor: '#f2f4f6',
    width: '100%',
    height: normalize(40),
  },
  btnTextStyle: {
    color: COLORS.PRIMARY,
    fontSize: normalize(14),
  },
  input: {
    color: '#000',
    width: '100%',
  },
  btnStyleOutline: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(10),
    // paddingVertical:normalize(2),
    marginBottom: normalize(5),
    borderRadius: normalize(8),
    marginRight: 'auto',
    height: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOutlineTextStyle: {
    color: COLORS.PRIMARY,
    fontSize: normalize(13),
  },
});
