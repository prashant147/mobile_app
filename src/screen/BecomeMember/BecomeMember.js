import { View, Text, StyleSheet, ScrollView, BackHandler } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import style from '../../styles/style';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { normalize } from '../../styles/utilities/dimentions';
import COLORS from '../../styles/theme/color';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TextInput } from 'react-native';
import CheckBox from 'react-native-check-box'
import { RadioButton } from 'react-native-paper';
import moment from 'moment';
import RenderInput from './RenderInput';
import RenderDropdown from './RenderDropdown';
import RenderCheckBox from './RenderCheckBox';
import { addLinkedProfiles, becomeMember, getAllMembersNonFav, validateEmail, validateEmailFetch,getMember } from '../../services/api/auth';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { UserPayload } from './UserPayload';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator} from 'react-native-paper';
import DateTimePickerBox from '../../components/dateTimeBox';
import { dateFormat } from '../../styles/utilities/variables';
import MembersContext from '../Members/MembersContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



export default function BecomeMember({ route }) {
  const token = AsyncStorage.getItem('accessToken')
  const { email, password, reCheckPassword } = route.params.params;
  const user_payload = UserPayload()
  const navigation = useNavigation();
  const scrollRef = useRef(null);
 const { setHideChatbotMember, setHideChatbot,setLoggedInUser } = useContext(MembersContext);
  const [loader, setLoader] = useState(false)
  const [switchTab, setSwitchTab] = useState(1)
  const [autoRenewal, setAutoRenewal] = useState(false)
  const [membershipType, setMembershipType] = useState('')
  const [membershipTypeError, setMembershipTypeError] = useState('')
  const [expand, setExpand] = useState([]);
  const [expandSummary, setExpandSummary] = useState([]);
  const [userInputs, setUserInputs] = useState([user_payload]);
  const [userInputsError, setUserInputsError] = useState({});
  const [firstNameError, setFirstNameError] = useState({})
  const [lastNameError, setLastNameError] = useState({})
  const [birthdayError, setBirthdayError] = useState({})
  const [positionError, setPositionError] = useState({})
  const [phoneNumberNoError, setPhoneNumberNoError] = useState({})
  const [homeMailError, setHomeMailError] = useState({})
  const [homeMailLoader, setHomeMailLoader] = useState(false)
  const [selectedCountryError, setSelectedCountryError] = useState({});
  const [selectedStateError, setSelectedStateError] = useState({});
  const [selectedCityError, setSelectedCityError] = useState({});
  const [zipcodeError, setZipCodeError] = useState({});
  const [laneOneError, setLaneOneError] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerBought, setShowPickerBought] = useState(false);
  const [showPickerBirthday, setShowPickerBirthday] = useState(false);
  const [checked, setChecked] = useState('ocean_class');
  const [oceanOrWorldClassQualification, setOceanOrWorldClassQualification] = useState('');
  const [oceanOrWorldClassQualificationError, setOceanOrWorldClassQualificationError] = useState('');
  const [dawgTales, setDawgTales] = useState(false);
  const [rallyUpdates, setRallyUpdates] = useState(false);
  const [membershipUpdates, setMembershipUpdates] = useState(false);
  const [crewServiceUpdates, setCrewServiceUpdates] = useState(false);
  const [events, setEvents] = useState(false);
  const [generalInfo, setGeneralInfo] = useState(false);
  const [allTheAbove, setAllTheAbove] = useState(false);
  const [memberDirectory, setMemberDirectory] = useState('do_not');
  const [memberMap, setMemberMap] = useState('do_not');
  const [hearAboutUs, setHearAboutUs] = useState('');
  const [paymentFirstName, setPaymentFirstName] = useState('');
  const [paymentFirstNameError, setPaymentFirstNameError] = useState('');
  const [firstUserAddressCheck, setFirstUserAddressCheck] = useState({});
  const [companyAddressCheck, setCompanyAddressCheck] = useState(false);
  const [billingAddressCheck, setBillingAddressCheck] = useState(false);
  const [paymentLastName, setPaymentLastName] = useState('');
  const [paymentLastNameError, setPaymentLastNameError] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [companyNameError, setCompanyNameError] = useState('');
  const [companyCountry, setCompanyCountry] = useState('');
  const [companyCountryError, setCompanyCountryError] = useState('');
  const [companyState, setCompanyState] = useState('');
  const [companyStateError, setCompanyStateError] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  const [companyCityError, setCompanyCityError] = useState('');
  const [companyZipcode, setCompanyZipcode] = useState('');
  const [companyZipcodeError, setCompanyZipcodeError] = useState('');
  const [companyLane1, setCompanyLane1] = useState('');
  const [companyLane1Error, setCompanyLane1Error] = useState('');
  const [companyLane2, setCompanyLane2] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyPhoneError, setCompanyPhoneError] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyEmailError, setCompanyEmailError] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [creditCardNumberError, setCreditCardNumberError] = useState('');

  const [creditCardType, setCreditCardType] = useState('');
  const [creditCardTypeError, setCreditCardTypeError] = useState('');

  const [cvv, setCvv] = useState('');
  const [cvvError, setCvvError] = useState('');

  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryMonthError, setExpiryMonthError] = useState('');

  const [expiryYear, setExpiryYear] = useState('');
  const [expiryYearError, setExpiryYearError] = useState('');

  const [billingLane1, setBillingLane1] = useState('');
  const [billingLane1Error, setBillingLane1Error] = useState('');

  const [billingLane2, setBillingLane2] = useState('');

  const [billingCountry, setBillingCountry] = useState('');
  const [billingCountryError, setBillingCountryError] = useState('');

  const [billingState, setBillingState] = useState('');
  const [billingStateError, setBillingStateError] = useState('');

  const [billingCity, setBillingCity] = useState('');
  const [billingCityError, setBillingCityError] = useState('');

  const [billingZipcode, setBillingZipcode] = useState('');
  const [billingZipcodeError, setBillingZipcodeError] = useState('');
  const [getAllMembersData, setGetAllMembersData] = useState([]);
  const [updatedValues, setUpdatedValues] = useState([]);
  const [updatedValuesFirstUser, setUpdatedValuesFirstUser] = useState([]);
  const [backendError, setBackendError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const phoneRegex = /^\d{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // const creditCardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?| 5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/;
  const creditCardNumberRegex =/\b(?:\d[ -]*?){13,16}\b/;
  const cvvRegex = /^[0-9]{3,4}$/;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllMembersNonFav()
        if (response.data?.length > 0) {
          setGetAllMembersData(response.data)
        } else {
          setGetAllMembersData([])
        }
      } catch (error) {
        console.error('error', error);
      }
    }
    getData()
  }, [])


  const scrollsToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const backBtnHandler = () => {
    if (switchTab === 5) {
      setSwitchTab(4)
      scrollsToTop()
    } else if (switchTab === 4) {
      setSwitchTab(3)
      scrollsToTop()
    } else if (switchTab === 3) {
      setSwitchTab(2)
      scrollsToTop()
    }
    else if (switchTab === 2) {
      setSwitchTab(1)
      scrollsToTop()
    }else if(switchTab === 1){
      navigation.navigate('Signup')
    }

  }
  useEffect(()=>{
if(userInputs.length === 1){
  setFirstUserAddressCheck({})
}
  },[userInputs])
  const data = [
    { label: 'Family Membership', value: 'Family Membership' }
  ];
  const cardsData = [
    { label: 'Visa', value: 'Visa' },
    { label: 'MasterCard', value: 'MasterCard' },
    { label: 'American Express', value: 'American Express' },
    { label: 'Discover', value: 'Discover' },
  ];

  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ];
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 0; i < 30; i++) {
    const year = currentYear + i;
    years.push({ label: year.toString(), value: year.toString() });
  }



  useEffect(() => {
    const backAction = () => {
      backBtnHandler()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  useFocusEffect(
    React.useCallback(()=>{
      setHideChatbot(true)
      setHideChatbotMember(true)
    },[])
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

  const handleUserInputsChange = (id, field, value,setErrorValue) => {
    setUserInputs((prevUserInputs) =>
      prevUserInputs.map((userInput) => {
        if (userInput.id === id) {
          return { ...userInput, [field]: value };
        }
        return userInput;
      }),
    );
   if(setErrorValue){
     setErrorValue((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));}


  };
  const handleRoleChange = (id, value,setValueError) => {
    setUserInputs((prevUserInputs) =>
      prevUserInputs.map((userInput) => {
        if (userInput.id === id) {
          return { ...userInput, role: { roleName: value } };
        }
        return userInput;
      }),
    );
    if(setValueError){
      setValueError((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };
  const handleAddressChange = (id, field, value,setValueError) => {
    setUserInputs((prevUserInputs) =>
      prevUserInputs.map((userInput) => {
        if (userInput.id === id) {
          return {
            ...userInput,
            addresses: {
              ...userInput.addresses,
              [field]: value
            }
          };
        }
        return userInput;
      })
    );
    if(setValueError){
      setValueError((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };


  const handleEmailChange = (id, index, value,setValueError) => {
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
    if(setValueError){
      setValueError((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };
  const handlePhoneNumberChange = (id, index, value,setValueError) => {
    setUserInputs((prevUserInputs) =>
      prevUserInputs.map((userInput) => {
        if (userInput.id === id) {
          return {
            ...userInput,
            phoneNumber: userInput.phoneNumber.map((item, i) => {
              if (i === index) {
                return { ...item, phoneNumber: value };
              }
              return item;
            }),
          };
        }
        return userInput;
      }),
    );
    if(setValueError){
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
  const toggleExpandSummary = (id) => {
    if (expandSummary.includes(id)) {
      setExpandSummary(prevExpand => prevExpand.filter(item => item !== id));
    } else {
      setExpandSummary(prevExpand => [...prevExpand, id]);
    }
  };

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const getaccessTokenData = await AsyncStorage.getItem('accessToken');
        if (getaccessTokenData !== null) {
          setAccessToken(getaccessTokenData)
        } else {
          console.log('Access Token not found');
          return null;
        }
      } catch (error) {
        console.error('Error retrieving Access Token:', error);
        return null;
      }
    };
    getAccessToken()
  }, [updateSuccess])
  const clearErrorStates =()=>{
    setExpand([])
    setMembershipTypeError('');
    setCompanyNameError('');
    setCompanyEmailError('');
    setCompanyPhoneError('');
    setCompanyCountryError('');
    setCompanyStateError('');
    setCompanyCityError('');
    setCompanyZipcodeError('');
    setCompanyLane1Error('');
    setFirstNameError({});
    setLastNameError({});
    setBirthdayError({});
    setPositionError({});
    setPhoneNumberNoError({});
    setHomeMailError({}); 
    setSelectedCountryError({});
    setSelectedStateError({});
    setSelectedCityError({});
    setZipCodeError({});
    setLaneOneError({});
    setUserInputsError({})
    setOceanOrWorldClassQualificationError('');
    setPaymentFirstNameError('');
    setPaymentLastNameError('');
    setCreditCardNumberError('');
    setCreditCardTypeError('');
    setCvvError('');
    setExpiryMonthError('');
    setExpiryYearError('');
    setBillingCountryError('');
    setBillingStateError('');
    setBillingCityError('');
    setBillingZipcodeError('');
    setBillingLane1Error('');
    setBackendError('')
  }
  const clearStates =()=>{
    setMembershipType('')
    setAutoRenewal(false)
    setCompanyName('')
    setCompanyEmail('')
    setCompanyPhone('')
    setCompanyCountry('')
    setCompanyState()
    setCompanyCity('')
    setCompanyZipcode('')
    setCompanyLane1('')
    setUserInputs([user_payload])
    setUpdatedValues([])
    setUpdatedValuesFirstUser([])
    setChecked('ocean_class')
    setOceanOrWorldClassQualification('')
    setRallyUpdates(false)
    setMembershipUpdates(false)
    setCrewServiceUpdates(false)
    setEvents(false)
    setGeneralInfo(false)
    setAllTheAbove(false)
    setMemberMap('do_not')
    setMemberDirectory('do_not')
    setHearAboutUs('')
    setPaymentFirstName('')
    setPaymentLastName('')
    setCreditCardNumber('')
    setCreditCardType('')
    setCvv('')
    setExpiryMonth('')
    setExpiryYear('')
    setBillingCountry('')
    setBillingState('')
    setBillingCity('')
    setBillingZipcode('')
    setBillingLane1('')

  }

  useEffect(()=>{
    setUserInputsError({});
  },[userInputs])

  const nextHandler = async () => {
    let isValidOne = true
    let isValidTwo = true
    let isValidThree = true
    setLoader(false)
    clearErrorStates()

    if (switchTab === 1) {
      if (membershipType === '') {
        setMembershipTypeError('Member type is required')
        isValidOne = false
        scrollsToTop()
      }

      let isValidUserData = {};
      const updatedInputs = await Promise.all(userInputs.map(async (userInput, index) => {
          const id = userInput.id;
          const firstName = userInput.firstName.trim();
          const lastName = userInput.lastName.trim();
          const position = userInput.role?.roleName.trim();
          const birthDay = userInput.dob;
          const country = userInput.addresses?.country.trim();
          const state = userInput.addresses?.state.trim();
          const city = userInput.addresses?.city.trim();
          const zipcode = userInput.addresses?.postalCode.trim();
          const lane1 = userInput.addresses?.streetAddress1.trim();
          const homeMail = userInput.emailAddress[0].email.trim();

        isValidUserData[id] = true; // Initialize as true for each id

          if (firstName === "") {
              isValidUserData[id] = false;
              setFirstNameError((prevErrors) => ({
                  ...prevErrors,
                  [id]: "First name is required",
              }));
          }

          if (lastName === "") {
              isValidUserData[id] = false;
              setLastNameError((prevErrors) => ({
                  ...prevErrors,
                  [id]: "Last name is required",
              }));
          }

          if (index === 0 && userInput.phoneNumber && userInput.phoneNumber.length > 0) {
              const phoneNumberNo = userInput.phoneNumber[0].phoneNumber.trim();

              if (phoneNumberNo && !phoneRegex.test(phoneNumberNo)) {
                  isValidUserData[id] = false;
                  setPhoneNumberNoError((prevErrors) => ({
                      ...prevErrors,
                      [id]: "Enter valid phone number",
                  }));
              }
          }

          if (userInput.emailAddress && userInput.emailAddress.length > 0) {
              if (index !== 0 && homeMail === "") {
                  isValidUserData[id] = false;
                  setHomeMailError((prevErrors) => ({
                      ...prevErrors,
                      [id]: "Home mail is required",
                  }));
              } else if (homeMail && !emailRegex.test(homeMail)) {
                  isValidUserData[id] = false;
                  setHomeMailError((prevErrors) => ({
                      ...prevErrors,
                      [id]: "Enter valid email",
                  }));
              } else if (homeMail && emailRegex.test(homeMail)) {
                  try {
                    setHomeMailLoader(true)
                    const response = await validateEmail(homeMail);
                    if (response.status !== 200) {
                        setHomeMailLoader(false)
                        isValidUserData[id] = false;
                      }
                      else if(response.status === 200){
                        setHomeMailLoader(false)

                      }
                      
                  } catch (error) {
                      isValidUserData[id] = false;
                      setHomeMailError((prevErrors) => ({
                        ...prevErrors,
                        [id]: "Email already exists",
                    }));
                    setHomeMailLoader(false)
                  }
              }
          }
          

          if (!isValidUserData[id]) {
              setUserInputsError((prevErrors) => ({
                  ...prevErrors,
                  [id]: "Fields in this section contain errors",
              }));
          }

          return {
              ...userInput,
              dob: birthDay ? moment(birthDay).format('YYYY-MM-DD') : ""
          };
      }));

      console.log('isValidUserData', isValidUserData);
      if (isValidOne && Object.values(isValidUserData).every(Boolean)) {
          const firstUser = {
              ...updatedInputs[0],
              isPrimary: true,
              emailAddress: updatedInputs[0]?.emailAddress[0]?.email === '' ? [] : updatedInputs[0]?.emailAddress ,
          };
          
          const { id, ...firstPersonWithoutId } = firstUser;
          // setSwitchTab(2);
          // setUpdatedValues(updatedInputs);
          // setUpdatedValuesFirstUser([firstPersonWithoutId]);
          // scrollsToTop();
          let haveAddress = false;
          if(firstPersonWithoutId.addresses.city ||firstPersonWithoutId.addresses.country || firstPersonWithoutId.addresses.state || firstPersonWithoutId.addresses.streetAddress1 || firstPersonWithoutId.addresses.streetAddress2 || firstPersonWithoutId.addresses.postalCode ){
            haveAddress = true
            setSwitchTab(2);
            setUpdatedValues(updatedInputs);
            scrollsToTop();
          setUpdatedValuesFirstUser([{...firstPersonWithoutId,
            addresses:firstPersonWithoutId?.addresses}]);
          }else{
            haveAddress = false
            setSwitchTab(2);
            setUpdatedValues(updatedInputs);
            scrollsToTop();
            setUpdatedValuesFirstUser([{
              ...firstPersonWithoutId,
            addresses:null
          }]);
          }
      }
  }
    if (switchTab === 2) {
      if ((checked === 'world_class' || checked === 'ocean_class') && oceanOrWorldClassQualification === '') {
        isValidTwo = false
        if(checked === 'world_class'){
          setOceanOrWorldClassQualificationError('Enter world class qualification')
        }else if(checked === 'ocean_class'){
          setOceanOrWorldClassQualificationError('Enter ocean class qualification')

        }
      }
      if (isValidTwo) {
        setSwitchTab(3)
        scrollsToTop()

      }
    } 
    // if (switchTab === 3) {
    //   scrollsToTop()

    // }
    // if (switchTab === 4) {
    //   if (paymentFirstName === '') {
    //     isValidThree = false;
    //     setPaymentFirstNameError('First name is required');
    //   }
    //   if (paymentLastName === '') {
    //     isValidThree = false;
    //     setPaymentLastNameError('Last name is required');
    //   }

      

    //   if (creditCardNumber === '') {
    //     isValidThree = false;
    //     setCreditCardNumberError('Credit card number is required');
    //   }


    //   if (creditCardType === '') {
    //     isValidThree = false;
    //     setCreditCardTypeError('Credit card type is required');
    //   }

    //   if (cvv === '') {
    //     isValidThree = false;
    //     setCvvError('CVV is required');
    //   } else if (!cvvRegex.test(cvv)) {
    //     isValidThree = false;
    //     setCvvError('Enter Valid CVV');
    //   }
      
    //   if (expiryMonth === '') {
    //     isValidThree = false;
    //     setExpiryMonthError('Expiry month is required');
    //   }

    //   if (expiryYear === '') {
    //     isValidThree = false;
    //     setExpiryYearError('Expiry year is required');
    //   }

    //   if (billingLane1 === '') {
    //     isValidThree = false;
    //     setBillingLane1Error('Lane one is required');
    //   }



    //   if (billingCountry === '') {
    //     isValidThree = false;
    //     setBillingCountryError('Country is required');
    //   }

    //   if (billingState === '') {
    //     isValidThree = false;
    //     setBillingStateError('State is required');
    //   }

    //   if (billingCity === '') {
    //     isValidThree = false;
    //     setBillingCityError('City is required');
    //   }

    //   if (billingZipcode === '') {
    //     isValidThree = false;
    //     setBillingZipcodeError('Zip/Postal is required');
    //   }


    // }


    const valuesWithoutIds = updatedValues.map((item, index) => {
      const { id, firstName,lastName , emailAddress, ...withoutId } = item
      return { firstName, lastName,username : emailAddress[0].email, }
  })

    const payload_data = {
      "email": email,
      "password": password,
      "reCheckPassword": reCheckPassword,
      "membershipProfiles": updatedValuesFirstUser,
      "autoRenewal": autoRenewal,
      "membershipLevel": membershipType,
      "organization": {
        "name": companyName,
        "address": {
          "country": companyCountry,
          "city": companyCity,
          "postalCode": companyZipcode,
          "streetAddress1": companyLane1,
          "streetAddress2": companyLane2,
          "state": companyState,
          "isPrimary": true,
          "isPreferred": true,
          "isBillingAddress": false
        },
        "phoneNumber": companyPhone,
        "emailAddress": companyEmail
      },
      "metadata": {
        "oceanOrWorldClassQualification": checked,
        "oceanClassQualificationPassage": checked === 'ocean_class' ? oceanOrWorldClassQualification : null,
        "worldClassQualificationPassage": checked === 'world_class' ? oceanOrWorldClassQualification : null,
        "memberDirectoryVisibility": memberDirectory,
        "memberMapVisibility": memberMap,
        "hearAboutUs": hearAboutUs,
        "mailList": {
          "dwagTalesNewsletter": dawgTales,
          "rallyUpdates": rallyUpdates,
          "membershipUpdates": membershipUpdates,
          "crewServiceUpdates": crewServiceUpdates,
          "events": events,
          "generalInfo": generalInfo,
          "allTheAbove": allTheAbove
        }
      },
      "payment": {
        "firstName": paymentFirstName,
        "lastName": paymentLastName,
        "company": companyName,
        "creditCardNumber": creditCardNumber,
        "creditCardType": creditCardType,
        "cvv": cvv,
        "expirationMonth": expiryMonth,
        "expirationYear": expiryYear,
        "addressDto": {
          "country": billingCountry,
          "city": billingCity,
          "postalCode": billingZipcode,
          "streetAddress1": billingLane1,
          "streetAddress2": billingLane2,
          "state": billingState,
          "isPrimary": false,
          "isPreferred": false,
          "isBillingAddress": true
        }
      }
    }


    if (isValidOne && isValidTwo  && isValidThree && switchTab === 3) {
      clearErrorStates()
      setUpdateSuccess(false)
      console.log('valuesWithoutIds.slice(1)',JSON.stringify(valuesWithoutIds.slice(1)));
      console.log('payload_data',JSON.stringify(payload_data));
      setLoader(true)
      try {
        const response = await becomeMember(payload_data, token)
        if (response.status === 200) {
          await AsyncStorage.setItem('accessToken', response.data.token);
          setUpdateSuccess(true)
          if (valuesWithoutIds.length > 1) {
            try {
              const linkedProfilesResponse = await addLinkedProfiles(valuesWithoutIds.slice(1), accessToken)
              if (linkedProfilesResponse.status === 200) {
                const res = await getMember('',response.data.token);
                setLoggedInUser(res.data)
                setLoader(false)
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
                clearStates()
              }
            } catch (error) {
              console.error(error);
              setLoader(false)
            }
          } else {
            const res = await getMember('',response.data.token);
            setLoggedInUser(res.data)
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
            setLoader(false)
            clearStates()

          }
        }
      } catch (error) {
        setLoader(false)
        if (error.response && error.response.status === 500 && error.response.data && error.response.data.message) {
          console.error('Server Error:', error.response.data.message);
          setBackendError(error.response.data.message)
        } else {
          console.error(error);
        }
      }

    }
  }
  useEffect(() => {
    if (companyAddressCheck) {
      handleAddressChange(userInputs[0].id, 'streetAddress1', companyLane1, setLaneOneError);
      handleAddressChange(userInputs[0].id, 'streetAddress2', companyLane2);
      handleAddressChange(userInputs[0].id, 'country', companyCountry, setSelectedCountryError);
      handleAddressChange(userInputs[0].id, 'state', companyState, setSelectedStateError)
      handleAddressChange(userInputs[0].id, 'city', companyCity, setSelectedCityError)
      handleAddressChange(userInputs[0].id, 'postalCode', companyZipcode, setZipCodeError)
    }
  }, [companyAddressCheck]); 
  useEffect(() => {
    if (billingAddressCheck) {
     setBillingCountry(userInputs[0].addresses.country)
     setBillingState(userInputs[0].addresses.state)
     setBillingCity(userInputs[0].addresses.city)
     setBillingZipcode(userInputs[0].addresses.postalCode)
     setBillingLane1(userInputs[0].addresses.streetAddress1)
     setBillingLane2(userInputs[0].addresses.streetAddress2)
    }
  }, [billingAddressCheck]); 
  useEffect(()=>{
if(allTheAbove){
  setDawgTales(true);
  setRallyUpdates(true);
  setMembershipUpdates(true);
  setCrewServiceUpdates(true);
  setEvents(true);
  setGeneralInfo(true);
  setAllTheAbove(true);
}
  },[allTheAbove])
  return (
    <View style={[style.contant, style.mt40, style.pH20, style.pb20,]}>
      {<TouchableOpacity onPress={backBtnHandler} style={[style.row, style.centerBox, style.mB10]}>
        <Icon name="chevron-left" size={normalize(18)} style={style.p410} color={COLORS.PRIMARY} />
      {switchTab === 1 && <Text style={[styles.heading, style.boldTxt]}>Membership</Text>}
        {switchTab === 2 && <Text style={[styles.heading, style.boldTxt]}>Ocean Class and World Class Qualification</Text>}
        {switchTab === 3 && <Text style={[styles.heading, style.boldTxt]}>Summary</Text>}
        {/* {switchTab === 4 && <Text style={[styles.heading, style.boldTxt]}>Payment</Text>} */}
      </TouchableOpacity>}
      <ScrollView ref={scrollRef} scrollsToTop={true} showsVerticalScrollIndicator={false}>
        {switchTab === 1 && <View >


          <Text style={[style.font16, style.mtb10]}>Membership in the Salty Dawg Sailing Association offers benefits to both experienced and developing sailors. Come rub shoulders with other Salty Dawgs.</Text>
          <Text style={[style.font18, style.boldTxt]}>Use the Add Family Member to include all family members.</Text>

          <RenderDropdown required={true} data={data} name={'Member Type'} onChange={item => { setMembershipType(item.value);setMembershipTypeError('') }} setValue={setMembershipType} value={membershipType} valueError={membershipTypeError} />
          {/* <Text style={[style.font16, style.boldTxt]}>Membership Options</Text>
          <Text style={[style.font16]}>1 period - $75.00</Text> */}
          <View style={[style.row, { alignItems: "center", display: "flex" }, style.mt20]}>
            <CheckBox
              isChecked={autoRenewal}
              onClick={() => setAutoRenewal(!autoRenewal)}
              checkBoxColor={COLORS.PRIMARY}


            />
            <Text style={[style.font16, style.mH10]}>Automatically Renew </Text>
          </View>
    
          <View style={styles.breakeLine} />
          {userInputs.map((userInput, index) => (
            <View key={userInput.id} style={style.mB10}>
              <View>
                {userInputs.length > 1 && <View style={[style.row, { justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.GREY, borderRadius: 5 }, style.pH20, style.pV20]}>
                  <TouchableOpacity style={[style.row, { justifyContent: "space-between" }]} onPress={() => toggleExpand(userInput.id)}
                  >
                    <FeatherIcon name={expand.includes(userInput.id) ? "chevron-down" : "chevron-right"} size={normalize(20)} color={COLORS.WHITE} />
                    <Text style={styles.linkBtnText}>{userInput.firstName + " " + userInput.lastName} {index === 0 && <Text style={styles.linkBtnText}>(Primary)</Text>} </Text>
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
                    <Text style={[style.font16, style.BlackbuttonTxt, ]}>Individual Name <Text style={styles.textDanger}>*</Text> </Text>
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
                 {index === 0 && <RenderInput
                    placeholder={'Known as'}
                    name={'Known as'}
                    value={userInput.knownAs}
                    setValue={(value) => handleUserInputsChange(userInput.id, 'knownAs', value)}

                  />}
                    {index === 0 &&  <DateTimePickerBox 
                      onChangeText={(value)=>handleUserInputsChange(userInput.id, 'dob', value,setBirthdayError)} 
                      value={userInput.dob} 
                      placeholder={'Select Birthday'} 
                      labelName="Birthday" 
                      modal={'date'} 
                      maxDate={new Date()}
                      valueError={birthdayError[userInput.id]}
                      />}
              
                 
                 {index === 0 && <RenderInput
                    placeholder={'Enter Position'}
                    name={'Position'}
                    value={userInput.role.roleName}
                    setValue={(value) => handleRoleChange(userInput.id, value, setPositionError)}
                    valueError={positionError[userInput.id]}
                  />}

                  {index === 0 && userInput.phoneNumber?.map((item, index) => (
                    <RenderInput
                      key={index}
                      placeholder={index === 0 ? 'Enter Phone Number' : 'Enter Telephone No.'}
                      name={index === 0 ? 'Phone Number' : 'Telephone No.'}
                      value={item.phoneNumber}
                      setValue={(value) => handlePhoneNumberChange(userInput.id, index, value, setPhoneNumberNoError)}
                      keyboardType={'numeric'}
                      valueError={index === 0 ? phoneNumberNoError[userInput.id] : undefined}
                      maxLength={10}
                    />
                  ))}



                  { userInput.emailAddress?.map((item, emailindex) => (
                    <RenderInput
                      key={emailindex}
                      placeholder={index === 0 ? 'Enter Alternative Mail' : 'Enter Email'}
                      name={index === 0 ? 'Alternative Mail' : 'Email'}
                      value={item.email}
                      setValue={(value) => handleEmailChange(userInput.id, emailindex, value, setHomeMailError)}
                      valueError={emailindex === 0 ? homeMailError[userInput.id] : undefined}
                      required={index !== 0 ? true : false}
                    />
                  ))}

                 {index === 0 && <View>

                    <Text style={[style.font18, style.boldTxt,style.mt10]}>Address</Text>
                    {index === 0 &&  companyLane1 && companyCountry && companyState && companyCity && companyZipcode && <View style={[style.row, style.centerBox, style.mt10]}>
                      <CheckBox
                        isChecked={companyAddressCheck}
                        onClick={() => {
                          setCompanyAddressCheck(prev => !prev)
                          if(companyAddressCheck){
                            handleAddressChange(userInputs[0].id, 'streetAddress1', '');
                            handleAddressChange(userInputs[0].id, 'streetAddress2', '');
                            handleAddressChange(userInputs[0].id, 'country', '',);
                            handleAddressChange(userInputs[0].id, 'state', '',)
                            handleAddressChange(userInputs[0].id, 'city', '',)
                            handleAddressChange(userInputs[0].id, 'postalCode', '')
                          }
                        }}

                        checkBoxColor={COLORS.PRIMARY}
                      />
                      <Text style={[style.font16, style.mH10]}>Same as Organization Address</Text>
                    </View>}
                    {index !== 0 && userInputs[0]?.addresses?.streetAddress1 && userInputs[0]?.addresses?.country && userInputs[0]?.addresses?.state && userInputs[0]?.addresses?.city && userInputs[0]?.addresses?.postalCode && <View style={[style.row, style.centerBox, style.mt10]}>
                      <CheckBox
                        isChecked={firstUserAddressCheck[userInput.id]}
                        onClick={() => {
                          setFirstUserAddressCheck(prevState => ({
                            ...prevState,
                            [userInput.id]: !prevState[userInput.id]
                          }));
                          if (!firstUserAddressCheck[userInput.id]) {
                            handleAddressChange(userInput.id, 'streetAddress1', userInputs[0]?.addresses?.streetAddress1, setLaneOneError);
                            handleAddressChange(userInput.id, 'streetAddress2', userInputs[0]?.addresses?.streetAddress2);
                            handleAddressChange(userInput.id, 'country', userInputs[0]?.addresses?.country, setSelectedCountryError);
                            handleAddressChange(userInput.id, 'state', userInputs[0]?.addresses?.state, setSelectedStateError)
                            handleAddressChange(userInput.id, 'city', userInputs[0]?.addresses?.city, setSelectedCityError)
                            handleAddressChange(userInput.id, 'postalCode', userInputs[0]?.addresses?.postalCode, setZipCodeError)
                          } else {
                            handleAddressChange(userInput.id, 'streetAddress1', '');
                            handleAddressChange(userInput.id, 'streetAddress2', '');
                            handleAddressChange(userInput.id, 'country', '',);
                            handleAddressChange(userInput.id, 'state', '',)
                            handleAddressChange(userInput.id, 'city', '',)
                            handleAddressChange(userInput.id, 'postalCode', '')
                          }
                        }}

                        checkBoxColor={COLORS.PRIMARY}
                      />
                      <Text style={[style.font16, style.mH10]}>Same as Primary Address</Text>
                    </View>}
                    <RenderInput
                      placeholder={'Enter Street address 1'}
                      name={'Street address 1'}
                      value={userInput.addresses.streetAddress1}
                      setValue={(value) => handleAddressChange(userInput.id, 'streetAddress1', value, setLaneOneError)}
                      valueError={laneOneError[userInput.id]}
                      readOnly={((firstUserAddressCheck[userInput.id]) || ( index === 0 && companyAddressCheck)) ? true : false}

                    />
                    <RenderInput
                      placeholder={'Enter Street address 2'}
                      name={'Street address 2'}
                      value={userInput.addresses.streetAddress2}
                      setValue={(value) => handleAddressChange(userInput.id, 'streetAddress2', value)}
                      readOnly={((firstUserAddressCheck[userInput.id]) || ( index === 0 && companyAddressCheck)) ? true : false}
                    />
                    <View style={[style.row, style.between]}>
                      
                      <RenderInput
                        value={userInput.addresses.country}
                        setValue={(value) => handleAddressChange(userInput.id, 'country', value, setSelectedCountryError)}
                        placeholder={'Enter Country'}
                        valueError={selectedCountryError[userInput.id]}
                        name={'Country'}
                        stylesProp={{ width: "48%" }}
                        readOnly={((firstUserAddressCheck[userInput.id]) || ( index === 0 && companyAddressCheck)) ? true : false}

                      />
                      <RenderInput
                        value={userInput.addresses.state}
                        setValue={(value) => handleAddressChange(userInput.id, 'state', value, setSelectedStateError)}
                        placeholder={'Enter State'}
                        valueError={selectedStateError[userInput.id]}
                        name={'State'}
                        stylesProp={{ width: "48%" }}
                        readOnly={((firstUserAddressCheck[userInput.id]) || ( index === 0 && companyAddressCheck)) ? true : false}
                      />


                    </View>
                    <View style={[style.row, style.between]}>
                      <RenderInput
                        value={userInput.addresses.city}
                        setValue={(value) => handleAddressChange(userInput.id, 'city', value, setSelectedCityError)}
                        placeholder={'Enter City'}
                        valueError={selectedCityError[userInput.id]}
                        name={'City'}
                        stylesProp={{ width: "48%" }}
                        readOnly={((firstUserAddressCheck[userInput.id]) || ( index === 0 && companyAddressCheck)) ? true : false}
                      />
                      <RenderInput
                        placeholder={'Enter Zip/Postal Code'}
                        name={'Zip/Postal Code'}
                        value={userInput.addresses.postalCode}
                        setValue={(value) => handleAddressChange(userInput.id, 'postalCode', value, setZipCodeError)}
                        keyboardType={'numeric'}
                        valueError={zipcodeError[userInput.id]}
                        stylesProp={{ width: "48%" }}
                        readOnly={((firstUserAddressCheck[userInput.id]) || ( index === 0 && companyAddressCheck)) ? true : false}
                      />
                    </View>
                  </View>}
                </View>}
              </View>
              {!expand.includes(userInput.id) && userInputsError[userInput.id] && <Text style={[styles.textDanger, style.mH5]}>{userInputsError[userInput.id]} </Text>}
            </View>))}


        </View>}

        {switchTab === 2 && 
        <KeyboardAwareScrollView>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt10]}>Ocean Class and World Class Qualificaton</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, ]}><Text style={{ fontSize: 30 }}>.</Text> If you have completed a non-stop ocean passage of 1,400 nautical miles or more, you qualify to be recognized on the Ocean Class Register.</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, ]}><Text style={{ fontSize: 30 }}>.</Text> If you have completed a circumnavigation or completed over 15,000 miles of ocean sailing, you qualify to be recognized on the World Class Register.</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt30]}>The qualifying passage may have been:</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, ]}><Text style={{ fontSize: 30 }}>.</Text> In a Salty Dawg Rally</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, ]}><Text style={{ fontSize: 30 }}>.</Text> On an independent passage with friends/crew/or as a single-hander</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, ]}><Text style={{ fontSize: 30 }}>.</Text> In another organized event</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt30]}>All of these blue water adventures will qualify!</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt20]}>Do you or a family member qualify for the Ocean or World Class category?</Text>

          <View>
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

          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt10]}>Preferences</Text>
          <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt10]}>Mailing Lists</Text>
          <RenderCheckBox name={'Dawg Tales Newsletter'} value={dawgTales} setValue={setDawgTales} disabled={allTheAbove}/>
          <RenderCheckBox name={'Rally Updates'} value={rallyUpdates} setValue={setRallyUpdates} disabled={allTheAbove}/>
          <RenderCheckBox name={'Membership Updates'} value={membershipUpdates} setValue={setMembershipUpdates} disabled={allTheAbove}/>
          <RenderCheckBox name={'Crew Service Updates'} value={crewServiceUpdates} setValue={setCrewServiceUpdates} disabled={allTheAbove}/>
          <RenderCheckBox name={'Events'} value={events} setValue={setEvents} disabled={allTheAbove}/>
          <RenderCheckBox name={'General Info'} value={generalInfo} setValue={setGeneralInfo} disabled={allTheAbove}/>
          <RenderCheckBox name={'All of the Above'} value={allTheAbove} setValue={setAllTheAbove} />

          <View>
            <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt30]}>The SDSA provides a Member Directory to all active members which will enable you to network with other Salty Dawgs. If you would rather NOT be included, check here to opt out of being in the directory.*</Text>
            <RadioButton.Group onValueChange={newValue => setMemberDirectory(newValue)} value={memberDirectory}>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android value="do" color={COLORS.PRIMARY} />
                <Text style={[style.font16, { color: COLORS.BLACK }]}>Please DO Include my information</Text>
              </View>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android value="do_not" color={COLORS.PRIMARY} />
                <Text style={[style.font16, { color: COLORS.BLACK }]}>Please DO NOT include my information in the Member Directory</Text>
              </View>

            </RadioButton.Group>
          </View>
          <View>
            <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt30]}>The SDSA provides a Member Map to all active members which will enable you to network with other Salty Dawgs. If you would rather NOT be included, check here to opt out of being on the map.*</Text>
            <RadioButton.Group onValueChange={newValue => setMemberMap(newValue)} value={memberMap}>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android  value="do" color={COLORS.PRIMARY} />
                <Text style={[style.font16, { color: COLORS.BLACK }]}>Please DO Include my information</Text>
              </View>
              <View style={[style.row, style.centerBox]}>
                <RadioButton.Android  value="do_not" color={COLORS.PRIMARY} />
                <Text style={[style.font16, { color: COLORS.BLACK }]}>Please DO NOT include my information on the Member Map</Text>
              </View>

            </RadioButton.Group>
          </View>

          <RenderInput
            name={'How did you hear about the Salty Dawg Sailing Association?'}
            multiline={true}
            numberOfLines={4}
            value={hearAboutUs}
            setValue={setHearAboutUs}
            nameStyle={[style.boldTxt]}
          />
        </KeyboardAwareScrollView>}
        {switchTab === 3 &&
          <View>
            <View>

              <Text style={[style.font16, style.mt20,style.boldTxt]}>Member Type</Text>
              <Text style={[style.font16]}>{membershipType}</Text>
              <Text style={[style.font16,style.boldTxt]}>Membership Options</Text>
              {/* <View style={[style.row, { justifyContent: "space-between" }, style.mtb10]}>
                <Text style={[style.font16, style.boldTxt]}>1 period - $75.00</Text>
                <Text style={[style.font16, style.boldTxt]}>$75.00</Text>
              </View> */}
              <View style={[style.row, { justifyContent: "space-between" }, style.mtb10]}>
                <Text style={[style.font16,style.boldTxt]}>Auto Renewal</Text>
                <Text style={[style.font16]}>{autoRenewal === false ? 'No' : 'Yes'}</Text>
              </View>
              <SummaryText name={'Organization'} value={companyName} />


              <View style={styles.breakeLine} />

              {
                updatedValues.map((item, index) => (
                  <View key={index} style={style.mB10}>
                    <View >
                      {userInputs.length > 1 && <View style={[style.row, { justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.GREY, borderRadius: 5 }, style.pH20, style.pV20]}>
                        <TouchableOpacity style={[style.row, { justifyContent: "space-between" }]} onPress={() => toggleExpandSummary(item.id)}
                        >
                          <FeatherIcon name={expandSummary.includes(item.id) ? "chevron-down" : "chevron-right"} size={normalize(20)} color={COLORS.WHITE} />
                          <Text style={styles.linkBtnText}>{item.firstName + " " + item.lastName} {index === 0 && <Text style={styles.linkBtnText}>(Self)</Text>} </Text>
                        </TouchableOpacity>

                      </View>}
                      {(expandSummary.includes(item.id) || userInputs.length === 1) && <View style={style.mtb10}>
                        <View>
                          <Text style={[style.font18, style.boldTxt]}>Applicant Details</Text>
                          <SummaryText name={'Individual Name'} value={item.firstName + ' ' + item.lastName} />
                          <SummaryText name={'known As'} value={item.knownAs} />
                          {item.dob && <SummaryText name={'Birthday'} value={dateFormat(item.dob)} />}
                          <SummaryText name={'Position'} value={item.role.roleName} />
                          {item.phoneNumber?.map((phone, index) => (
                            phone.phoneNumber && <SummaryText name={index === 0 ? 'Phone Number' : 'Telephone No.'} value={phone.phoneNumber} />
                          ))}
                          {item.emailAddress?.map((mail, index) => (
                            mail.email && <SummaryText name={index === 0 ? 'Home Mail' : 'Work Mail'} value={mail.email} />
                          ))}
                        </View>
                       {(item.addresses?.streetAddress1 || item.addresses?.streetAddress2 ||item.addresses?.city || item.addresses?.state || item.addresses?.postalCode || item.addresses?.country)&& <View style={styles.breakeLine} />}
                        <View>
                          {(item.addresses?.streetAddress1 || item.addresses?.streetAddress2 ||item.addresses?.city || item.addresses?.state || item.addresses?.postalCode || item.addresses?.country)&&<Text style={[style.font16, style.boldTxt]}>Address</Text>}
                          <SummaryText name={'Street address 1'} value={item.addresses?.streetAddress1} />
                          <SummaryText name={'Street address 2'} value={item.addresses?.streetAddress2} />
                          <SummaryText name={'City'} value={item.addresses?.city} />
                          <SummaryText name={'State'} value={item.addresses?.state} />
                          <SummaryText name={'Zip / Postal code'} value={item.addresses?.postalCode} />
                          <SummaryText name={'Country'} value={item.addresses?.country} />
                        </View>

                      </View>}
                      <View style={styles.breakeLine} />
                    </View>
                  </View>))}


              <Text style={[style.font16, style.boldTxt]}>Ocean Class and World Class Qualification</Text>
              <Text style={[style.font16, style.mt20,style.boldTxt]}>Do you or a family member qualify for the Ocean or World Class category?</Text>
              <View style={[style.row, { alignItems: "center", display: "flex" }, style.mt10]}>
                <RadioButton.Android  status={'checked'} color={COLORS.PRIMARY} />
                <Text style={[style.font16, { maxWidth: '90%', }, style.mH10, style.textCapitalize]}>{checked}</Text>
              </View>
              {checked === 'ocean_class' && <Text style={[style.font16,style.boldTxt]}>For Ocean Class tell us about your qualifying passage (from where to where, how many nm) and which family members qualify.</Text>}
              {checked === 'world_class' && <Text style={[style.font16,style.boldTxt]}>If you qualify for World Class, list details of only passages 600 nm or more, and at least one non-stop 1,400 nm passage. Include nm for each passage</Text>}
              {checked === 'world_class' || checked === 'ocean_class' && <Text style={[style.font16, style.mt10]}>{oceanOrWorldClassQualification}</Text>}
              <View style={[style.mtb10]}>
                <Text style={[style.font16, style.boldTxt]}>Mailing Lists</Text>
                {dawgTales && <RenderCheckBox name={'Dawg Tales Newsletter'} value={true} disabled={true} />}
                {rallyUpdates && <RenderCheckBox name={'Rally Updates'} value={true} disabled={true} />}
                {membershipUpdates && <RenderCheckBox name={'Membership Updates'} value={true} disabled={true} />}
                {crewServiceUpdates && <RenderCheckBox name={'Crew Service Updates'} value={true} disabled={true} />}
                {events && <RenderCheckBox name={'Events'} value={true} disabled={true} />}
                {generalInfo && <RenderCheckBox name={'General Info'} value={true} disabled={true} />}
                {allTheAbove && <RenderCheckBox name={'All of the Above'} value={true} disabled={true} />}
              </View>
              <View>
                <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt30]}>The SDSA provides a Member Directory to all active members which will enable you to network with other Salty Dawgs. If you would rather NOT be included, check here to opt out of being in the directory.*</Text>

                <View style={[style.row, style.centerBox]}>
                  <RadioButton.Android  color={COLORS.PRIMARY} status={'checked'} />
                  {memberDirectory === 'do' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Please DO Include my information</Text>}
                  {memberDirectory === 'do_not' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Please DO NOT include my information in the Member Directory</Text>}
                </View>

              </View>
              <View>
                <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, style.mt30]}>The SDSA provides a Member Map to all active members which will enable you to network with other Salty Dawgs. If you would rather NOT be included, check here to opt out of being on the map.*</Text>
                <View style={[style.row, style.centerBox]}>
                  <RadioButton.Android  color={COLORS.PRIMARY} status={'checked'} />
                  {memberMap == 'do' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Please DO Include my information</Text>}
                  {memberMap == 'do_not' && <Text style={[style.font16, { color: COLORS.BLACK }]}>Please DO NOT include my information on the Member Map</Text>}
                </View>

              </View>
              {hearAboutUs && <View style={[style.mtb10]}>
                <Text style={[style.font16, style.boldTxt]}>How did you hear about the Salty Dawg Sailing Association?</Text>
                <Text style={[style.font16]}>{hearAboutUs}</Text>
              </View>}
              {backendError && <Text style={[style.textDanger]}>{backendError}</Text>}
            </View>
          </View>
        }
        {/* {switchTab === 4 &&
          <View>

            <Text style={[style.font20, style.boldTxt, style.mtb10]}>Total: $75.00</Text>
            <Text style={[style.font16, style.BlackbuttonTxt, ]}>Individual Name <Text style={styles.textDanger}>*</Text> </Text>
            <View style={[style.row, style.spaceBetween]}>
              <View style={styles.nameWidth}>
                <View style={[styles.inputBorderStyle]}>
                  <TextInput style={styles.input} placeholder="Enter First Name" placeholderTextColor={COLORS.GREY} value={paymentFirstName} onChangeText={(txt) => {setPaymentFirstName(txt);setPaymentFirstNameError('')}}></TextInput>
                </View>
                {paymentFirstNameError && <Text style={[styles.textDanger,style.mH5]}>{paymentFirstNameError} </Text>}
              </View>
              <View style={styles.nameWidth}>
                <View style={[styles.inputBorderStyle]}>
                  <TextInput style={styles.input} placeholder="Enter Last Name" placeholderTextColor={COLORS.GREY} value={paymentLastName} onChangeText={(txt) => {setPaymentLastName(txt);setPaymentLastNameError('')}}></TextInput>
                </View>
                {paymentLastNameError && <Text style={[styles.textDanger,style.mH5]}>{paymentLastNameError} </Text>}
              </View>
            </View> 
            <RenderInput name={'Credit Card Number'} required={true} placeholder={'Enter Credit Card Number'} keyboardType={'numeric'} value={creditCardNumber} setValue={setCreditCardNumber} valueError={creditCardNumberError}  setValueError={setCreditCardNumberError} maxLength={16}/>
            <RenderDropdown data={cardsData} required={true} name={'Credit Card Type'} placeholder={'Select Card Type'} value={creditCardType} onChange={item => { setCreditCardType(item.value);setCreditCardTypeError('') }} setValue={setCreditCardType} valueError={creditCardTypeError} />
            <RenderInput name={'CVV'} required={true} placeholder={'Enter CVV'} keyboardType={'numeric'} value={cvv} setValue={setCvv} valueError={cvvError} maxLength={3} setValueError={setCvvError}/>
            <View style={[style.row,{justifyContent:"space-between"}]}>
            <RenderDropdown stylesProp={{width:'45%'}} data={months} required={true} name={'Expiration Month'} placeholder={'Month'} value={expiryMonth} onChange={item => { setExpiryMonth(item.value);setExpiryMonthError('') }} setValue={setExpiryMonth} valueError={expiryMonthError} />
            <RenderDropdown stylesProp={{width:'45%'}} data={years} required={true} name={'Expiration Year'} placeholder={'Year'} value={expiryYear} onChange={item => { setExpiryYear(item.value);setExpiryYearError('') }} setValue={setExpiryYear} valueError={expiryYearError} />
            </View>

            <View style={styles.breakeLine} />
            <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, ]}>Billing Address</Text>
            { <View style={[style.row, style.centerBox, style.mt10]}>
                      <CheckBox
                        isChecked={billingAddressCheck}
                        onClick={() => {
                          setBillingAddressCheck(prev => !prev)
                          if(billingAddressCheck){
                            setBillingCountry('')
                            setBillingState('')
                            setBillingCity('')
                            setBillingZipcode('')
                            setBillingLane1('')
                            setBillingLane2('')
                          }
                        }}

                        checkBoxColor={COLORS.PRIMARY}
                      />
                      <Text style={[style.font16, style.mH10]}>Same as Primary Address</Text>
                    </View>}
            <RenderInput name={'Street address 1'} required={true} placeholder={'Enter Street address 1'} value={billingLane1} setValue={setBillingLane1} valueError={billingLane1Error} setValueError={setBillingLane1Error} readOnly={billingAddressCheck}/>
            <RenderInput name={'Street address 2'} placeholder={'Enter Street address 2'} value={billingLane2} setValue={setBillingLane2} readOnly={billingAddressCheck}/>
            <View style={[style.row, style.between]}>
            <RenderInput placeholder={'Enter Country'} search={true} required={true} name={'Country'} value={billingCountry} setValue={setBillingCountry} valueError={billingCountryError} setValueError={setBillingCountryError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck}/>
            <RenderInput placeholder={'Enter State'} search={true} required={true} name={'State'} value={billingState} setValue={setBillingState} valueError={billingStateError} setValueError={setBillingStateError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck}/>
            </View>
            <View style={[style.row, style.between]}>
            <RenderInput placeholder={'Enter City'} name={'City'} required={true} value={billingCity} setValue={setBillingCity} valueError={billingCityError} setValueError={setBillingCityError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck}/>
            <RenderInput name={'Zip/Postal Code'} required={true} placeholder={'Enter Zip/Postal Code'} value={billingZipcode} setValue={setBillingZipcode} valueError={billingZipcodeError} keyboardType={'numeric'} setValueError={setBillingZipcodeError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck}/>
            </View>
            {backendError && <Text style={[style.textDanger]}>{backendError}</Text>}

          </View>
        } */}
        {/* {switchTab === 1 && <TouchableOpacity style={[style.mtb10, style.row, styles.linkBtn]} onPress={addUserInputs}>
          <Text style={[styles.linkBtnText]}>Add Family Member</Text>
        </TouchableOpacity>} */}
        <View style={[style.mtb10, style.row, { justifyContent:  "space-between"  }]}>
        {switchTab === 1 && <TouchableOpacity style={[style.mtb10, style.row, styles.linkBtn,{ width: '48%' }]} onPress={addUserInputs}>
          <Text style={[styles.linkBtnText]}>Add Family Member</Text>
        </TouchableOpacity>}
          {switchTab > 1 && <TouchableOpacity style={[styles.nextBtn, { width: '45%' }]} onPress={backBtnHandler}>
            <Text style={[{ textAlign: 'center', color: COLORS.BLACK }]}>Previous</Text>
          </TouchableOpacity>}
          {switchTab !== 3 && <TouchableOpacity style={[styles.nextBtn, { width: '45%' }]} onPress={nextHandler}>
            {homeMailLoader ?
              <ActivityIndicator color={COLORS.PRIMARY} />
              :
            <Text style={[{ textAlign: 'center', color: COLORS.BLACK }]}>Next</Text>
              }
          </TouchableOpacity>}
          {switchTab === 3 && <TouchableOpacity  style={[styles.nextBtn, { width: '45%', backgroundColor: COLORS.PRIMARY }]} onPress={nextHandler}>
            {loader ?
              <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
              :
            <Text style={[{ textAlign: 'center', color: COLORS.WHITE }]}>Submit</Text>
            }
          </TouchableOpacity>}
        </View>
      </ScrollView>

    </View>
  )
}

export const SummaryText = ({ name, value }) => {
  return (
    value && (<View style={style.mtb5}>
      <Text style={[style.font16, style.boldTxt]}>{name}</Text>
      <Text style={[style.font16]}>{value} </Text>
    </View>)
  )
}

const styles = StyleSheet.create({
  heading:{
    fontSize:normalize(15),
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
  },
  textDanger: {
    color: 'red',
    fontSize: normalize(14)
  },
  nameWidth: {
    width: '46%'
  },
  linkBtnText: {
    color: COLORS.WHITE,
    fontSize: normalize(12),
    fontFamily: 'Roboto-Regular',
  },
  linkBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius:8,
    marginVertical: normalize(5),
    backgroundColor: COLORS.PRIMARY
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
    justifyContent:'center',
    alignContent:'center',
    borderRadius: 8,
    marginVertical: normalize(5),
    backgroundColor: '#f2f4f6',
  },
  breakeLine: {
    height: 0.6,
    maxWidth: '100%',
    backgroundColor: COLORS.PRIMARY,
    marginBottom: normalize(15),
    marginTop: normalize(15)
  }, textItem: {
    flex: 1,
    fontSize: normalize(12),
    color: COLORS.BLACK
  },
  item: {
    padding: 10
  },

})