import { View, Text, StyleSheet, ScrollView, BackHandler } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserPayload } from '../BecomeMember/UserPayload';
import style from '../../styles/style';
import DeviceInfo from 'react-native-device-info';
import Menu from '../../routes/Menu';
import { TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import COLORS from '../../styles/theme/color';
import { normalize } from '../../styles/utilities/dimentions';
import { TextInput } from 'react-native';
import RenderInput from '../BecomeMember/RenderInput';
import MembersContext from '../Members/MembersContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Config from 'react-native-config';
import { addLinkedProfiles } from '../../services/api/auth';
import { ActivityIndicator } from 'react-native-paper';


export default function LinkedprofilesForm() {
    const user_payload = UserPayload()
    const navigation = useNavigation()
    const { setHideChatbotMember, setHideChatbot, accessToken } = useContext(MembersContext);
    const isTablet = DeviceInfo.isTablet();
    const [userInputs, setUserInputs] = useState([user_payload]);
    const [userInputsError, setUserInputsError] = useState({});
    const [firstNameError, setFirstNameError] = useState({})
    const [lastNameError, setLastNameError] = useState({})
    const [homeMailError, setHomeMailError] = useState({})
    const [expand, setExpand] = useState([]);
    const [firstUserAddressCheck, setFirstUserAddressCheck] = useState({});
    const [loader, setLoader] = useState(false)
    const [backendError, setBackendError] = useState('');

    useEffect(() => {
        const backAction = () => {
            backBtnHandler()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            setHideChatbot(true)
            setHideChatbotMember(true)
        }, [])
    )
    const addUserInputs = () => {
        setUserInputs([...userInputs, user_payload]);;
    };

    const deleteUserInputs = (id) => {
        const updatedUserInputs = userInputs.filter(
            (userInput) => userInput.id !== id,
        );
        setUserInputs(updatedUserInputs);
        setExpand(expand.filter(expandedId => expandedId !== id));
    };

    const handleUserInputsChange = (id, field, value, setErrorValue) => {
        setUserInputs((prevUserInputs) =>
            prevUserInputs.map((userInput) => {
                if (userInput.id === id) {
                    return { ...userInput, [field]: value };
                }
                return userInput;
            }),
        );
        if (setErrorValue) {
            setErrorValue((prevErrors) => ({
                ...prevErrors,
                [id]: "",
            }));
        }


    };




    const handleEmailChange = (id, index, value, setValueError) => {
        setUserInputs((prevUserInputs) =>
            prevUserInputs.map((userInput) => {
                if (userInput.id === id) {
                    return {
                        ...userInput,
                        emailAddress: userInput.emailAddress.map((item, i) => {
                            if (i === index) {
                                return { ...item, email: value };
                            }
                            return item;
                        }),
                    };
                }
                return userInput;
            }),
        );
        if (setValueError) {
            setValueError((prevErrors) => ({
                ...prevErrors,
                [id]: "",
            }));
        }
    };

    const toggleExpand = (id) => {
        if (expand.includes(id)) {
            setExpand(prevExpand => prevExpand.filter(item => item !== id));
        } else {
            setExpand(prevExpand => [...prevExpand, id]);
        }
    };

    const backBtnHandler = () => {
        navigation.navigate('Profile')
        setHideChatbot(false)
        setHideChatbotMember(false)
        clearStates()
        clearErrorStates()
    }
    const clearErrorStates = () => {
        setExpand([])
        setFirstNameError({});
        setLastNameError({});
        setHomeMailError({});
        setUserInputsError({})
        setBackendError('')
    }
    const clearStates = () => {
        setUserInputs([user_payload])
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const nextHandler = async () => {
        clearErrorStates()
        let isValidUserData = true;
        updatedInputs = userInputs.map((userInput) => {
            const firstName = userInput.firstName.trim();
            const lastName = userInput.lastName.trim();


            if (firstName === "") {
                isValidUserData = false;
                setFirstNameError((prevErrors) => ({
                    ...prevErrors,
                    [userInput.id]: "First name is required",
                }));
            }

            if (lastName === "") {
                isValidUserData = false;
                setLastNameError((prevErrors) => ({
                    ...prevErrors,
                    [userInput.id]: "Last name is required",
                }));
            }






            if (userInput.emailAddress && userInput.emailAddress.length > 0) {

                const homeMail = userInput.emailAddress[0].email.trim();

                if (homeMail && emailRegex.test(homeMail)) {
                    fetch(`${Config.SOA_BASE_URL}auth/member/validate-email?emailAddress=${homeMail}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                        })
                        .catch(error => {
                            isValidUserData = false;
                            setHomeMailError((prevErrors) => ({
                                ...prevErrors,
                                [userInput.id]: "Account already exists with this email",
                            }));
                            setUserInputsError((prevErrors) => ({
                                ...prevErrors,
                                [userInput.id]: "Fields in this section contain errors",
                            }));
                        });

                }
                if (homeMail === "") {
                    isValidUserData = false;
                    setHomeMailError((prevErrors) => ({
                        ...prevErrors,
                        [userInput.id]: "Email is required",
                    }));
                } else if (!emailRegex.test(homeMail)) {
                    isValidUserData = false;
                    setHomeMailError((prevErrors) => ({
                        ...prevErrors,
                        [userInput.id]: "Enter valid email",
                    }));

                }
            }





            if (!isValidUserData) {
                setUserInputsError((prevErrors) => ({
                    ...prevErrors,
                    [userInput.id]: "Fields in this section contain errors",
                }));
            }


            return { ...userInput };
        });
        const valuesWithoutIds = updatedInputs.map((item, index) => {
            const { id, firstName, lastName, emailAddress, ...withoutId } = item
            return { firstName, lastName, username: emailAddress[0].email, }
        })
        if (isValidUserData) {
            setLoader(true)
            try {
                const linkedProfilesResponse = await addLinkedProfiles(valuesWithoutIds, accessToken)
                if (linkedProfilesResponse.status === 200) {
                    setLoader(false)
                    navigation.navigate('Profile')
                    clearStates()
                    clearErrorStates()
                }
            } catch (error) {
                console.error(error);
                setLoader(false)
                setBackendError('User Already exists')

            }
        }

    }
    return (
        <View style={style.contant}>
            <View>
                {/* <Header></Header> */}
                {!isTablet &&

                    <Menu selectIndex={11} style={style.sidepanelcolor} />
                }
            </View>
            <View style={[
                style.contant,
                style.pH20,
                style.pt20,
            ]}>
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[style.row,style.between,style.baseBox]}>
                        <Text style={[style.font18, style.boldTxt, style.mB10]}>Family Members</Text>
                        <TouchableOpacity style={[style.mtb10, style.row, styles.linkBtn]} onPress={addUserInputs}>
                                <Text style={[styles.linkBtnText]}>+ Add More</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {userInputs.map((userInput, index) => (
                                <View key={userInput.id} style={style.mB10}>
                                    <View>
                                        {userInputs.length > 1 && <View style={[style.row, { justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.GREY, borderRadius: 5 }, style.pH20, style.pV20]}>
                                            <TouchableOpacity style={[style.row, { justifyContent: "space-between" }]} onPress={() => toggleExpand(userInput.id)}
                                            >
                                                <FeatherIcon name={expand.includes(userInput.id) ? "chevron-down" : "chevron-right"} size={normalize(20)} color={COLORS.WHITE} />
                                                <Text style={styles.linkBtnText}>{userInput.firstName + " " + userInput.lastName} </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.linkBtnText}
                                                onPress={() => deleteUserInputs(userInput.id)}
                                            >
                                                <Text style={{ color: COLORS.WHITE }}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>}
                                        {(expand.includes(userInput.id) || userInputs.length === 1) && <View>
                                            <View style={style.mtb10}>
                                                <Text style={[style.font18, style.boldTxt, style.mB10]}>Applicant Details </Text>
                                                <Text style={[style.font14, style.BlackbuttonTxt, { color: COLORS.BLACK, }]}>Individual Name <Text style={styles.textDanger}>*</Text> </Text>
                                                <View style={[style.row, style.spaceBetween]}>
                                                    <View style={styles.nameWidth}>
                                                        <View style={[styles.inputBorderStyle]}>
                                                            <TextInput style={styles.input} placeholder="Enter First Name" placeholderTextColor={COLORS.GREY} value={userInput.firstName} onChangeText={(value) => handleUserInputsChange(userInput.id, 'firstName', value, setFirstNameError)} autoComplete='off'></TextInput>
                                                        </View>
                                                        {firstNameError[userInput.id] && <Text style={[styles.textDanger, style.mH5]}>{firstNameError[userInput.id]} </Text>}
                                                    </View>
                                                    <View style={styles.nameWidth}>
                                                        <View style={[styles.inputBorderStyle]}>
                                                            <TextInput style={styles.input} placeholder="Enter Last Name" placeholderTextColor={COLORS.GREY} value={userInput.lastName} onChangeText={(value) => handleUserInputsChange(userInput.id, 'lastName', value, setLastNameError)} autoComplete='off'></TextInput>
                                                        </View>
                                                        {lastNameError[userInput.id] && <Text style={[styles.textDanger, style.mH5]}>{lastNameError[userInput.id]} </Text>}
                                                    </View>
                                                </View>
                                            </View>

                                            {userInput.emailAddress?.map((item, index) => (
                                                <RenderInput
                                                    key={index}
                                                    placeholder={index === 0 ? 'Enter Email' : 'Enter Work Mail'}
                                                    name={index === 0 ? 'Email' : 'Work Mail'}
                                                    value={item.email}
                                                    setValue={(value) => handleEmailChange(userInput.id, index, value, setHomeMailError)}
                                                    required={index === 0 ? true : false}
                                                />
                                            ))}
                                            {index === 0 ?  <Text style={[styles.textDanger, style.mH5]}>{homeMailError[userInput.id]}</Text> : undefined}

                                        </View>}
                                    </View>
                                    {userInputs?.length > 1 && !expand.includes(userInput.id)&& userInputsError[userInput.id] && <Text style={[styles.textDanger, style.mH5]}>{userInputsError[userInput.id]} </Text>}
                                </View>))}
                           
                        </View>
                        <View>

                            

                            <View style={[style.mtb10, style.row, { justifyContent: "space-between" }]}>
                                <TouchableOpacity style={[styles.nextBtn, { width: '45%' }]} onPress={backBtnHandler}>
                                    <Text style={[{ textAlign: 'center', color: COLORS.BLACK }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.createBtn, { width: '45%' }]} onPress={nextHandler}>
                                    {loader ?
                                        <ActivityIndicator theme={{ colors: { primary: 'white' } }}/>
                                        :
                                        <Text style={[styles.linkBtnText]}>Create</Text>}
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textDanger: {
        color: 'red',
        fontSize: normalize(14)
    },
    nameWidth: {
        width: '46%'
    },
    linkBtnText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign:'center'
    },
    linkBtn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.PRIMARY,
        borderWidth: 1,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
        borderRadius: 8,
    },
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
        justifyContent: "space-between",
        height: normalize(35),

    },
    input: {
        color: '#000',
        width: '90%',
        height: '100%'
    },
    icon: {
        marginRight: 5,
    },
    nextBtn: {
        borderWidth: 1,
        borderColor: COLORS.GREY,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(10),
        borderRadius: 8,
        marginVertical: normalize(5),
        backgroundColor: '#f2f4f6',
    },
    createBtn: {
        borderWidth: 1,
        borderColor: COLORS.GREY,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(10),
        borderRadius: 8,
        marginVertical: normalize(5),
        backgroundColor: COLORS.PRIMARY,
    },
    breakeLine: {
        height: 0.6,
        maxWidth: '100%',
        backgroundColor: COLORS.PRIMARY,
        marginBottom: normalize(15),
        marginTop: normalize(15)
    }, textItem: {
        flex: 1,
        fontSize: 16,
        color: COLORS.BLACK
    },
    item: {
        padding: 10
    },

})