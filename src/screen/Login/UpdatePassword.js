import React, { useState, useEffect } from "react";
import { Image, Text, View, StyleSheet, Modal, TextInput, TouchableOpacity } from "react-native";
import style from "../../styles/style";
import COLORS from "../../styles/theme/color";
import { normalize } from "../../styles/utilities/dimentions";
import { updatePassword } from "../../services/api/auth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from "react-native-gesture-handler";

const UpdatePassword = ({ route }) => {
    const [loaderShow, setLoader] = useState(false);
    const navigation = useNavigation();
    const token = AsyncStorage.getItem('accessToken');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("")
    const [backendErrMsg, setBackendErrMsg] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    useFocusEffect(
        React.useCallback(() => {
            if (route) {
                setOldPassword(route?.params?.password)
            }
        }, [route])
    )
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    const submitHandler = async () => {
        setPasswordErrorMsg('')
        setConfirmPasswordErrorMsg('')
        let isValid = true;
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
        } else if (password !== confirmpassword) {
            setConfirmPasswordErrorMsg("Passwords do not match");
            isValid = false;
        }
        const payload = {
            oldPassword: oldPassword,
            newPassword: password,
            confirmPassword: confirmpassword
        };
        if (isValid) {
            setLoader(true)
            try {
                const response = await updatePassword(payload, token)
                if (response.status === 200) {
                    setLoader(false)
                    navigation.navigate("Main");
                }
            } catch (error) {
                console.error(error);
                setLoader(false)
            }
        }
    }
    return (
        <ScrollView style={[style.contant, style.whiteLayout]}>

            <View style={[style.contant, style.whiteLayout]}>
                <View style={[style.mt40, style.centerBox, style.mtb10]}>
                    <Image source={require("../../assets/saltyDawgLogo.png")} alt="" />
                </View>
                <View style={[style.mH20, style.mt40]}>
                    <View style={style.mtb10}>
                        <Text style={[style.font24, style.boldTxt]}>Reset Account Password</Text>
                        <Text style={[style.font16, style.mt10, { color: COLORS.LIGHTGREY }]}>Password must be atleast 8 characters long, with letters (atleat one capital letter) and numbers.</Text>
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
                    <Text style={style.textDanger}>{passwordErrorMsg}</Text>
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
                    {confirmPasswordErrorMsg && (<Text style={style.textDanger}>{confirmPasswordErrorMsg}</Text>)}
                    {backendErrMsg && (<Text style={[style.textDanger]}>{backendErrMsg}</Text>)}
                </View>
                <View style={[style.mtb10, style.mH20]}>
                    <TouchableOpacity activeOpacity={.8} style={[styles.btnStyleOutline, { backgroundColor: COLORS.PRIMARY, height: normalize(44), width: "100%" }]} onPress={submitHandler}>
                        {loaderShow ?
                            <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
                            :
                            <Text style={[styles.btnOutlineTextStyle, { color: COLORS.WHITE }]}>Submit</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>


        </ScrollView>
    )
}
export default UpdatePassword;
const styles = StyleSheet.create({
    inputBorderStyle: {
        borderWidth: .9,
        borderColor: COLORS.GREY,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(3),
        borderRadius: 8,
        marginVertical: normalize(5),
        backgroundColor: '#f2f4f6',
        width: '100%',


    },
    btnTextStyle: {
        color: COLORS.PRIMARY,
        fontSize: normalize(14),
    },
    input: {
        color: '#000',
        width: "100%",
        height: normalize(35)
    },
    btnStyleOutline: {
        borderWidth: 1,
        borderColor: COLORS.PRIMARY,
        paddingHorizontal: normalize(10),
        marginBottom: normalize(5),
        borderRadius: normalize(8),
        height: normalize(20),
        width: normalize(100),
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
        width: 380,
        height: 300,
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