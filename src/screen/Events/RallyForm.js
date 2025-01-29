import { View, Text, Linking, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import style from '../../styles/style'
import DeviceInfo from 'react-native-device-info';
import Menu from '../../routes/Menu';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { normalize } from '../../styles/utilities/dimentions';
import BackIcon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../../styles/theme/color';
import RenderInput from '../BecomeMember/RenderInput';
import RenderCheckBox from '../BecomeMember/RenderCheckBox';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, RadioButton, TextInput } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RenderDropdown from '../BecomeMember/RenderDropdown';
import { BackHandler } from 'react-native';
import { getAllForms, getMember, getUsersCustomAttributes, submitForm, submitRallyForm, updateBoatdetails, updateMemberInfo, updateUsersCustomAttributes } from '../../services/api/auth';
import MembersContext from '../Members/MembersContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalNative from "react-native-modal";
import CheckBox from 'react-native-check-box';
import { BoatForm } from './BoatForm';
import DateTimePickerBox from '../../components/dateTimeBox';
import moment from 'moment';

export default function RallyForm({ route }) {
  const inputFields = BoatForm()
  const { accessToken, setHideChatbotMember, setHideChatbot, loggedInUser } = useContext(MembersContext)
  const scrollRef = useRef(null);
  const navigation = useNavigation()
  const isTablet = DeviceInfo.isTablet();
  const [switchTab, setSwitchTab] = useState(1)
  const [formData, setFormData] = useState(null)
  const [formDataSuccess, setFormDataSuccess] = useState(false)
  const [formOptionError, setFormOptionError] = useState({})
  const [updatedFormData, setUpdatedFormData] = useState(null)
  const [updatedFormDataAttributes, setUpdatedFormDataAttributes] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formsubmitLoader, setFormsubmitLoader] = useState(false);
  const [boatinfoForm, setBoatInfoForm] = useState(inputFields);
  const [address1, setAddress1] = useState('');
  const [address1Err, setAddress1Err] = useState('');
  const [address2, setAddress2] = useState('');
  const [address2Err, setAddress2Err] = useState('');
  const [city, setCity] = useState('');
  const [cityErr, setCityErr] = useState('');
  const [state, setState] = useState('');
  const [stateErr, setStateErr] = useState('');
  const [country, setCountry] = useState('');
  const [countryErr, setCountryErr] = useState('');
  const [postalcode, setPostalCode] = useState('');
  const [postalcodeErr, setPostalCodeErr] = useState('');
  const [updatedUserData, setUpdatedUserData] = useState(null);

  const [loader, setLoader] = useState(true);
  const [formloader, setFromLoader] = useState(true);

  useEffect(() => {
      setLoader(true)
      setFormOptionError({})
      setHideChatbot(true)
      setHideChatbotMember(true)
      setShowSuccessModal(false)

    }, []
  )
  useEffect(() => {
    getMemberHandler();
    const backAction = () => {
      backBtnHandler()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [switchTab]);


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
  const token = AsyncStorage.getItem('accessToken');
  const [billingZipcode, setBillingZipcode] = useState('');
  const [billingZipcodeError, setBillingZipcodeError] = useState('');
  const [paymentFirstName, setPaymentFirstName] = useState('');
  const [billingAddressCheck, setBillingAddressCheck] = useState(false);
  const [paymentLastName, setPaymentLastName] = useState('');
  const [getMemberData, setGetMemberData] = useState([])
  const [getMemberDataSuccess, setGetMemberDataSuccess] = useState(false)
  const [customAttributesData, setCustomAttributesData] = useState([])
  const [customAttributesDataSuceess, setCustomAttributesDataSuccess] = useState(false)
  const [primaryBoat, setPrimaryBoat] = useState('')
  const [primaryBoatDetails, setPrimaryBoatDetails] = useState('')

  const scrollsToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }
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
    const getAllFormsHandler = async () => {
      try {
        setFromLoader(true)
        setFormDataSuccess(false)
        const response = await getAllForms(route?.params?.category, accessToken)
        if (route?.params?.id) {
          const filter = response.data.filter(item => route?.params?.id === item.eventId && item.isPublished === true)[0]
          setFormData(filter)
          setFormOptionError({})
          setAddress1Err('')
          setAddress2Err('')
          setCountryErr('')
          setStateErr('')
          setCityErr('')
          setPostalCodeErr('')
          setTimeout(() => {
            setFromLoader(false)
          }, 3000);
          if(route?.params?.boatForm){
            setSwitchTab(3)
          }else{
            setSwitchTab(1)
          }
          setFormDataSuccess(true)
        }
      } catch (error) {
        setFromLoader(false)
        setFormDataSuccess(false)
        console.error(error);
      }
    }
      getAllFormsHandler()
    }, [route]
  )
  useFocusEffect(
    React.useCallback(()=>{
      getUsersCustomAttributesHandler()
      getMemberHandler();
    },[])
  )
    const getUsersCustomAttributesHandler = async () => {
      try {
        setLoader(true)
        setCustomAttributesDataSuccess(false)
        const response = await getUsersCustomAttributes(loggedInUser.id, accessToken)
        if (response.status === 200) {
          setCustomAttributesData(response.data);
          setTimeout(() => {
            setLoader(false)
          }, 2000);
          setCustomAttributesDataSuccess(true)
        }
      } catch (error) {
        setCustomAttributesDataSuccess(false)
        setLoader(false)
        console.error(error);
      }
    }


 
  useEffect(
    () => {
      if (formDataSuccess && customAttributesDataSuceess && getMemberDataSuccess) {
        const updatedQuestions = formData?.questions?.map(question => {
          const matchedInput = customAttributesData.find(attr => question.attributeId === attr.customAttributeId);
          const matchedProfileInput = getMemberData.hasOwnProperty(question.memberProfileLabel);
          if(question.memberProfileLabel === 'addresses'){
            const primarAddress =getMemberData?.addresses?.find(item => item.isPreferred)
            setCountry(primarAddress?.country)
            setState(primarAddress?.state)
            setCity(primarAddress?.city)
            setAddress2(primarAddress?.streetAddress2)
            setAddress1(primarAddress?.streetAddress1)
            setPostalCode(primarAddress?.postalCode) 
          }
          if(question.memberProfileLabel === 'boats'&&question.isMemberProfileAttribute){
            const primaryBoat = getMemberData?.boats.find(item => item.isPrimary)
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: ''
              }]
            };
          }
          if(question.memberProfileLabel === 'phoneNumbers'&&question.isMemberProfileAttribute){
            const primaryPhone = getMemberData?.phoneNumbers.find(item => item.type ==='PRIMARY')
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: primaryPhone?.phoneNumber
              }]
            };
          }
          if(question.memberProfileLabel === 'emailAddress'&&question.isMemberProfileAttribute){
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: getMemberData?.username
              }]
            };
          }
          if (question.type === 'text' && matchedProfileInput &&question.isMemberProfileAttribute) {
      
              return {
                ...question,
                options: [{
                  ...question.options[0],
                  optionName: getMemberData[question.memberProfileLabel]
                }]
              };
            
          }
          if (question.type === 'text' && matchedInput &&question.isCustomAttribute) {
      
              return {
                ...question,
                options: [{
                  ...question.options[0],
                  optionName: matchedInput.value
                }]
              };
            
          }
          return question;
        });
        setFormData(prevFormData => ({
          ...prevFormData,
          questions: updatedQuestions
        }));
      }
      if (formDataSuccess && customAttributesDataSuceess) {
        const updatedQuestions = boatinfoForm?.map(question => {
          const matchedInput = customAttributesData.find(attr => question.customAttributeId === attr.customAttributeId);
          if(question.title === 'Yacht Name'){
            return {
              ...question,
              options: [{
                ...question.options[0],
                optionName: primaryBoat
              }]
            };
          }
          if(matchedInput && matchedInput?.customAttributeId === '887912c4-5808-4e56-aeb1-0317d4801947'){
            if (
              question.title ===
                "What email address do you use with the PredictWind account" ||
                question.title === "PredictWind Tracking Page url"
            ) {
              return {
                ...question,
                isVisible : matchedInput?.value === "Yes" ? true : false,
              };
            }
          }

          if (question.type === 'text' && matchedInput) {
      
              return {
                ...question,
                options: [{
                  ...question.options[0],
                  optionName: matchedInput.value
                }]
              };
            
          }else if(question.type === 'radio' && matchedInput){
            const findOption = question.options.find(item =>item.optionName === matchedInput.value)
            if (findOption) {
              const updatedOptions = question.options.map(option => {
                if (option === findOption) {
                  return {
                    ...option,
                    optionsId: option.id
                  };
                }
                return option;
              });
              return {
                ...question,
                options: updatedOptions
              };
            }

          }else if (question.type === 'checkbox' && matchedInput) {
            const selectedValues = matchedInput.value.split(',').map(value => value.trim());
      
            const updatedOptions = question.options.map(option => {
              if (selectedValues.includes(option.optionName)) {
                return {
                  ...option,
                  optionsId: option.id
                };
              }
              return option;
            });
      
            return {
              ...question,
              options: updatedOptions
            };
          }
          return question;
        });
        setBoatInfoForm(updatedQuestions);
      }
    }, [customAttributesDataSuceess, formDataSuccess,getMemberDataSuccess])
 
  
  const backBtnHandler = () => {
    if (switchTab === 4) {
      scrollsToTop()
      setSwitchTab(3)
    }else if (switchTab === 2) {
      scrollsToTop()
      setSwitchTab(1)
    } else if (route?.params?.path) {
      navigation.navigate(route?.params?.path,{item:route?.params?.id})
      setFormData(null)
    } else {
      navigation.navigate('Home')
      setFormData(null)

    }
  }

  const getMemberHandler = async () => {
    try {
      setGetMemberDataSuccess(false)
      const response = await getMember('',token);
      if (response.status === 200) {
        setGetMemberData(response.data)
        getBoatDetailsHandler()
        const primaryBoatData =response?.data?.boats?.find(item =>item.isPrimary)
        setPrimaryBoat(primaryBoatData?.boatName || '');
        setPrimaryBoatDetails(primaryBoatData)
        setGetMemberDataSuccess(true)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBoatDetailsHandler =()=>{
    setPaymentFirstName(getMemberData?.firstName);
    setPaymentLastName(getMemberData?.lastName)
  }


  const nextHandler = async () => {
    setFormOptionError({})
    setAddress1Err('')
    setAddress2Err('')
    setCountryErr('')
    setStateErr('')
    setCityErr('')
    setPostalCodeErr('')
    if (switchTab === 1) {

      const updatedInputs = formData.questions.map(item => {
        const { id, type } = item;
        let optionName = null
        if(item?.memberProfileLabel ==='addresses'){
          optionName = `${address1}${address2 ? ',' + address2 : ''}${city ? ',' + city : ''}${state ? ',' + state : ''}${country ? ',' + country : ''}${postalcode ? ',' + postalcode : ''}`;
        }else if(item?.memberProfileLabel ==='dob'){
          optionName = moment(item?.options[0]?.optionName).format('YYYY-MM-DD')
        }
        else{
          optionName = item.options.map(optionItem => type === 'text' && optionItem.optionName).filter(Boolean)[0];

        }
        const selectedOptions = item.options.map(user => user.optionsId).filter(Boolean);

        let optionId = null;
        if (type === 'radio') {
          optionId = selectedOptions.length > 0 ? selectedOptions[0] : null;
        } else {
          optionId = selectedOptions.length > 0 ? selectedOptions.join(",") : null;
        }

        return { questionId: id, optionId, inputText: type === 'text' ? optionName : null };
      });
      let isValid = true;
      formData.questions.forEach(item => {
        let isValidQuestion = false;
      
        if (item?.memberProfileLabel === 'addresses') {
          if (address1 === '' || !address1) {
            setAddress1Err('This field is required');
            isValid = false;
          }
          if (address2 === '' || !address2) {
            setAddress2Err('This field is required');
            isValid = false;
          }
          if (country === '' || !country) {
            setCountryErr('This field is required');
            isValid = false;
          }
          if (state === '' || !state) {
            setStateErr('This field is required');
            isValid = false;
          }
          if (city === '' || !city) {
            setCityErr('This field is required');
            isValid = false;
          }
          if (postalcode === '' || !postalcode) {
            setPostalCodeErr('This field is required');
            isValid = false;
          }
        } else if (item?.memberProfileLabel !== 'profileUrl') {
          if (item.type === 'text') {
            isValidQuestion = item.options.some(optionItem => optionItem.optionName);
          } else {
            isValidQuestion = item.options.some(optionItem => optionItem.optionsId);
          }
      
          if (!isValidQuestion) {
            isValid = false;
            setFormOptionError(prevErrors => ({
              ...prevErrors,
              [item.id]: 'This field is required',
            }));
          }
        }
      });
      const payload_data = {
        id: formData.id,
        userResponseOptions: updatedInputs,
        payment: {
          firstName: paymentFirstName,
          lastName: paymentLastName,
          company: '',
          creditCardNumber: creditCardNumber,
          creditCardType: creditCardType,
          cvv: cvv,
          expirationMonth: expiryMonth,
          expirationYear: expiryYear,
          addressDto: {
            country: billingCountry,
            city: billingCity,
            postalCode: billingZipcode,
            streetAddress1: billingLane1,
            streetAddress2: billingLane2,
            state: billingState,
            isPrimary: false,
            isPreferred: false,
            isBillingAddress: true
          }
        }

      }
      const updatedData = formData?.questions?.map(question => {
        const matchedInput = customAttributesData.find(attr => question.attributeId === attr.customAttributeId);
        if (question.type === 'text'  &&question.isCustomAttribute) {
    
          return  {
            customAttributeId: question.attributeId,
            value: question.options[0].optionName,
            ...(matchedInput ? { id: matchedInput.id } : {}),
            memberId:loggedInUser.id
          };
          
        }
      });
      const updatedProfileData = formData?.questions?.reduce((acc, question) => {
        const matchedProfileInput = getMemberData.hasOwnProperty(question.memberProfileLabel);
        if (question.type === 'text' && 
            matchedProfileInput && 
            question.memberProfileLabel !== 'addresses' &&  
            question.memberProfileLabel !== 'username' &&
            question.memberProfileLabel !== 'emailAddress' &&
            question.memberProfileLabel !== 'boats') {
          let optionValue = null
         
          if(question.memberProfileLabel ==='dob'){
            optionValue =moment(question.options[0].optionName).format('YYYY-MM-DD')
          }else{
            optionValue = question.options[0].optionName
          }
            acc[question.memberProfileLabel] = optionValue;
        }if (question.memberProfileLabel === 'phoneNumbers') {
          let primaryPhone = getMemberData.phoneNumbers.find(item => item.type === 'PRIMARY');
          if (primaryPhone) {
            acc[question.memberProfileLabel] = [
              {
                ...primaryPhone,
                "phoneNumber": question.options[0].optionName
              }
            ];
          } else {
            acc[question.memberProfileLabel] = [
              {
                "phoneNumber": question.options[0].optionName,
                "type": "PRIMARY"
              }
            ];
          }
        }
        
        return acc;
    }, {});
    

    const nonBillingAddresses = getMemberData?.addresses?.filter(address => address.isPreferred) || [];

      const addressesToUpdate =
        nonBillingAddresses.length > 0
          ? nonBillingAddresses.map((address) => ({
              ...address,
              country: country,
              city: city,
              postalCode: postalcode,
              streetAddress1: address1,
              streetAddress2: address2,
              state: state,
            }))
          : [
              ...(getMemberData?.addresses || []),
              {
                country: country,
                city: city,
                postalCode: postalcode,
                streetAddress1: address1,
                streetAddress2: address2,
                state: state,
                isPreferred: true,
              },
            ];
        const userDataPayload = {
          ...updatedProfileData,
          "addresses":addressesToUpdate, 
          "id":getMemberData?.id
      }
      if (isValid) {
        setUpdatedFormData(payload_data)
        setUpdatedFormDataAttributes(updatedData.filter(Boolean))
        setUpdatedUserData(userDataPayload)
        if(route?.params?.isPaid && route?.params?.category === 'EVENT'){
         scrollsToTop()
         setSwitchTab(2) 
       }else{   
        submitFormHandler(payload_data,updatedData.filter(Boolean),userDataPayload)
       }
      }
    }
    if (switchTab === 2) {
      submitFormHandler(updatedFormData,updatedFormDataAttributes,updatedUserData)
    }
    if(switchTab === 3){
      const updatedData = boatinfoForm?.map(question => {
        const matchedInput = customAttributesData.find(attr => question.customAttributeId === attr.customAttributeId);
       
        if (question.type === 'text'  && question.customAttributeId) {
    
          return  {
            customAttributeId: question.customAttributeId,
            value: question.options[0].optionName,
            ...(matchedInput ? { id: matchedInput.id } : {}),
            memberId:loggedInUser.id
          };
          
        }else if(question.type === 'radio'  && question.customAttributeId){
          return  {
            customAttributeId: question.customAttributeId,
            value: question.options.find(item => item.optionsId)?.optionName,
            ...(matchedInput ? { id: matchedInput.id } : {}),
            memberId:loggedInUser.id
          };
        }else if(question.type === 'checkbox'  && question.customAttributeId){
          return  {
            customAttributeId: question.customAttributeId,
            value: question.options.map(item => item.optionsId && item.optionName).filter(Boolean).toString(),
            ...(matchedInput ? { id: matchedInput.id } : {}),
            memberId:loggedInUser.id
          };
        }
      });
      const payload_data_boat = {
        id:primaryBoatDetails?.id,
        boatName: primaryBoat
      }
     if(primaryBoatDetails){ 
      try {
        let res = await updateBoatdetails(payload_data_boat,token);
      if(res.status === 200){
      
      }
      } catch (error) {
        console.error(error)
      }}
      setFormsubmitLoader(true)
      try {
        const attResponse = await updateUsersCustomAttributes(updatedData.filter(Boolean),accessToken)
        if(attResponse.status ===200 ){
          setFormsubmitLoader(false)
          scrollsToTop()
            setSwitchTab(4)
          
        }
       } catch (error) {
      console.error('error',error);
       }
    }
    if(switchTab === 4){
      const payload_data =  {
          firstName: paymentFirstName,
          lastName: paymentLastName,
          company: '',
          creditCardNumber: creditCardNumber,
          creditCardType: creditCardType,
          cvv: cvv,
          expirationMonth: expiryMonth,
          expirationYear: expiryYear,
          addressDto: {
            country: billingCountry,
            city: billingCity,
            postalCode: billingZipcode,
            streetAddress1: billingLane1,
            streetAddress2: billingLane2,
            state: billingState,
            isPrimary: false,
            isPreferred: false,
            isBillingAddress: true
          }
        

      }
      setFormsubmitLoader(true)
      try {
        const paymentResponse = await submitRallyForm(route?.params?.eventParticipantId,payload_data,accessToken)
        if(paymentResponse.status === 200){
          setShowSuccessModal(true)
          setFormsubmitLoader(false)
          setTimeout(() => {
            if(route?.params?.path){
              navigation.navigate(route?.params?.path,{item:route?.params?.id})
            }else{
              navigation.navigate('Home')
            }
          setShowSuccessModal(false)
          
          },2000)
        }
      } catch (error) {
        setFormsubmitLoader(false)
      }
    }
  }
  const navigationHandler =()=>{
    setShowSuccessModal(true)
    setFormsubmitLoader(false)
    setTimeout(() => {
      if(route?.params?.path){
        navigation.navigate(route?.params?.path,{item:route?.params?.id})
      }else{
        navigation.navigate('Home')
      }
    setShowSuccessModal(false)
    
    },2000)
  }
  const updateProfileHandler = async (userData)=>{
    if(userData){
      try {
        const response = await updateMemberInfo(userData, accessToken);
        if (response.status === 200) {
          navigationHandler()
        }
      } catch (error) {
        console.error(error);
        navigationHandler()
      }
    }else{
      navigationHandler()
    }
  }
  const submitFormHandler = async (payload,attributes,userData)=>{
    try {
      setFormsubmitLoader(true)
      const response = await submitForm(payload, accessToken)
      if (response.status === 200) {
        if(attributes){
         try {
          const attResponse = await updateUsersCustomAttributes(attributes,accessToken)
          if(attResponse.status ===200 ){
            updateProfileHandler(userData)
          
          }
         } catch (error) {
          updateProfileHandler(userData)
         }
          
        }else{
          updateProfileHandler(userData)
        }
       
      }
    } catch (error) {
      console.error(error);
    }
  }
  const handleTextInputChange = (question, option, value, setErrorValue) => {
    setFormData(prev => {
      return {
        ...prev,
        questions: prev.questions.map(q => {
          if (q.id === question.id) {
            return {
              ...q,
              options: q.options.map(opt => {
                if (opt.id === option.id) {
                  return {
                    ...opt,
                    optionName: value
                  };
                }
                return opt;
              })
            };
          }
          return q;
        })
      };
    });
    if (setErrorValue) {
      setErrorValue((prevErrors) => ({
        ...prevErrors,
        [question.id]: "",
      }));
    }
  };
  const handleRadioButtonChange = (questionId, optionId, setErrorValue) => {
    setFormData(prevSurvey => {
      return {
        ...prevSurvey,
        questions: prevSurvey.questions.map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              options: question.options.map(option => {
                if (option.id === optionId) {
                  return {
                    ...option,
                    optionsId: optionId
                  };
                } else {
                  return {
                    ...option,
                    optionsId: null
                  };
                }
              })
            };
          }
          return question;
        })
      }
    });
    if (setErrorValue) {
      setErrorValue((prevErrors) => ({
        ...prevErrors,
        [questionId]: "",
      }));
    }
  };

  const handleCheckBoxChange = (questionId, option, setErrorValue) => {
    setFormData(prevSurvey => {
      return {
        ...prevSurvey,
        questions: prevSurvey.questions.map(question => {
          if (question.id === questionId) {
            return {
              ...question,
              options: question.options.map(currOption => {
                if (currOption.id === option.id) {
                  return {
                    ...currOption,
                    optionsId: currOption.optionsId ? null : option.id
                  };
                } else {
                  return currOption;
                }
              })
            };
          }
          return question;
        })
      };
    });
    if (setErrorValue) {
      setErrorValue((prevErrors) => ({
        ...prevErrors,
        [questionId]: "",
      }));
    }
  };
  const handleBoatTextInputChange = (question, option, value, setErrorValue) => {
    setBoatInfoForm(prev => {
      return prev.map(q => {
          if (q.id === question.id) {
            return {
              ...q,
              options: q.options.map(opt => {
                if (opt.id === option.id) {
                  return {
                    ...opt,
                    optionName: value
                  };
                }
                return opt;
              })
            };
          }
          return q;
        })
      
    });
    if (setErrorValue) {
      setErrorValue((prevErrors) => ({
        ...prevErrors,
        [question.id]: "",
      }));
    }
  };
  const handleBoatRadioButtonChange = (Question, Option, setErrorValue) => {
    setBoatInfoForm(prevSurvey => {
      return  prevSurvey.map(question => {
          if (question.id === Question.id) {
            return {
              ...question,
              options: question.options.map(option => {
                if (option.id === Option.id) {
                  return {
                    ...option,
                    optionsId: Option.id
                  };
                } else {
                  return {
                    ...option,
                    optionsId: null
                  };
                }
              })
            };
          }else if(Question.title === 'Do you have a PredictWind account?'){
           
            if (
              question.title ===
                "What email address do you use with the PredictWind account" ||
                question.title === "PredictWind Tracking Page url"
            ) {
              return {
                ...question,
                isVisible : Option.optionName === "Yes" ? true : false,
              };
            }

          }
          return question;
        })
      
    });
    if (setErrorValue) {
      setErrorValue((prevErrors) => ({
        ...prevErrors,
        [Question]: "",
      }));
    }
  };

  const handleBoatCheckBoxChange = (Question, option, setErrorValue) => {
    setBoatInfoForm(prevSurvey => {
      return  prevSurvey.map(question => {
          if (question.id === Question.id) {
            return {
              ...question,
              options: question.options.map(currOption => {
                if (currOption.id === option.id) {
                  return {
                    ...currOption,
                    optionsId: currOption.optionsId ? null : option.id
                  };
                } else {
                  return currOption;
                }
              })
            };
          }
          return question;
        })
      
    });
    if (setErrorValue) {
      setErrorValue((prevErrors) => ({
        ...prevErrors,
        [Question.id]: "",
      }));
    }
  };
let selectedTab = 4
if(route?.params?.category === 'EVENT'){
  selectedTab = 4
}else if (route?.params?.category === 'RALLY'){
  selectedTab = 14
}

const preAddress = getMemberData?.addresses?.filter(item => item.isPreferred)
useEffect(() => {
  if (billingAddressCheck) {
   setBillingCountry(preAddress && preAddress[0]?.country)
   setBillingState(preAddress && preAddress[0]?.state)
   setBillingCity(preAddress && preAddress[0]?.city)
   setBillingZipcode(preAddress && preAddress[0]?.postalCode)
   setBillingLane1(preAddress && preAddress[0]?.streetAddress1)
   setBillingLane2(preAddress && preAddress[0]?.streetAddress2)
  }
}, [billingAddressCheck,getMemberData]); 
  return (
    <View style={style.contant}>
      <View style={[style.row]}>
        <View style={[{ flex: 2 }]}>
          {!isTablet &&  <View style={style.sidepanelcolor}>
          <Menu selectIndex={selectedTab} />
          </View>}
        </View>

      </View>
      <View
        style={[
          style.contant,
          style.pH20,
          style.pt20
        ]}>
        <View>
          <View style={[style.row]}>
            {<TouchableOpacity style={[style.row]}
              onPress={backBtnHandler}>
              <BackIcon name="chevron-left" size={normalize(15)} style={[style.mt3,style.mr10]} color={COLORS.PRIMARY} />
            <Text style={[isTablet ? style.font24 : style.font16, style.boldTxt,style.primaryText]}>Back</Text>
            </TouchableOpacity>}
          </View>
        </View>
        <Text style={[isTablet ? style.font24 : style.font16, style.boldTxt, style.mt10]}>{formData?.eventsLabel} Registration</Text>
        <View style={style.breakeLine} />
        {loader && formloader ? <View style={[style.contant,style.row,style.centerBox,style.centerItem]}><ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} size={'large'} /></View> :
          (formData && formData?.questions?.length > 0 ?<ScrollView ref={scrollRef} scrollsToTop={true}>

            {switchTab === 1 &&
              <View>
                {formData?.questions?.sort((a, b) => a.ordinal - b.ordinal).map((question, index) => {
                  return(
                  <View key={question.id} style={{ marginBottom: 10 }}>
                    {question.type !== 'text' && <View>
                      <Text style={[style.font16, style.BlackbuttonTxt]}>{question.title}</Text>
                    </View>}
                    {question.type === "text" && question?.memberProfileLabel === 'profileUrl' && question?.memberProfileLabel === 'addresses' &&<View>
                      <Text style={[style.font16, style.BlackbuttonTxt]}>{question.title}</Text>
                    </View>}

                    <View >
                      <View>
                        {question.options.sort((a, b) => a.ordinal - b.ordinal).map((option) => (
                          <View key={option.id} >
                            {question.type === "radio" && (
                              <View>
                                <RadioButton.Group
                                  onValueChange={() => handleRadioButtonChange(question.id, option.id, setFormOptionError)}
                                  value={question.options.find(option => option.optionsId)?.id}
                                >
                                  <View key={option.id} style={[style.row, style.centerBox]}>
                                    <RadioButton.Android value={option.id} color={COLORS.PRIMARY} />
                                    <Text style={[style.font16, { color: COLORS.BLACK }]}>{option.optionName}</Text>
                                  </View>
                                </RadioButton.Group>
                              </View>
                            )}
                            {question.type === "checkbox" && (
                              <RenderCheckBox
                                name={option.optionName}
                                value={option.optionsId}
                                onchange={() => handleCheckBoxChange(question.id, option, setFormOptionError)}
                              />
                            )}
                            {question.type === "text" && question?.memberProfileLabel !== 'dob' && question?.memberProfileLabel !== 'profileUrl'&&question?.memberProfileLabel !== 'addresses' && question?.memberProfileLabel !== 'boats' &&(
                              <RenderInput
                                dobName={question.title}
                                placeholder={question.title}
                                value={option.optionName}
                                onChangeText={(value) => handleTextInputChange(question, option, value, setFormOptionError)}
                                keyboardType={question.title.toLowerCase().includes('phone') ? "numeric" : "default"}
                                readOnly={(question?.memberProfileLabel === 'username' || question?.memberProfileLabel === 'emailAddress') ? true : false}
                              />
                            )}
                            {question.type === "text" && question?.memberProfileLabel === 'dob' && (
                              <DateTimePickerBox
                              labelName={question.title}
                                placeholder={question.title}
                                value={option.optionName}
                                onChangeText={(value) => handleTextInputChange(question, option, value, setFormOptionError)}
                                modal={'date'} 
                                maxDate={new Date()}
                              />
                            )}
                            {question.type === "text" && question?.memberProfileLabel === 'boats' && 
                            (getMemberData?.boats?.length > 0 ?
                            <RenderDropdown
                            name={'Boats'}
                            placeholder={'Select Boat'}
                            data={getMemberData?.boats.map((e:any) => {
                              return{label:e.boatName, value:e.boatName}
                            })} 
                            value={option.optionName || ''}
                            onChange={(value) => handleTextInputChange(question, option, value?.value, setFormOptionError)}
                            search={true} 
                            />:
                            <RenderInput
                                dobName={question.title}
                                placeholder={question.title}
                                value={option.optionName}
                                onChangeText={(value) => handleTextInputChange(question, option, value, setFormOptionError)}
                                keyboardType={question.title.toLowerCase().includes('phone') ? "numeric" : "default"}
                                readOnly={(question?.memberProfileLabel === 'username' || question?.memberProfileLabel === 'emailAddress') ? true : false}
                              />)

                            }
                             {question.type === "text" && question?.memberProfileLabel === 'profileUrl' && (
                              <Image
                                source={option.optionName ?{ uri: option.optionName }:require("../../assets/avatarImage.png")}
                                style={styles.profileImg}
                              />
                              )}
                            {question?.memberProfileLabel === 'addresses' && <View>
                              <RenderInput
                              name={'STREET ADDRESS 1'}
                              placeholder={'Enter Street Address 1'}
                              value={address1}
                              setValue={setAddress1}
                              valueError={address1Err}
                              setValueError={setAddress1Err}
                              required={false}
                              />
                              <RenderInput
                              name={'STREET ADDRESS 2'}
                              placeholder={'Enter Street Address 2'}
                              value={address2}
                              setValue={setAddress2}
                              valueError={address2Err}
                              setValueError={setAddress2Err}
                              />
                              <View style={[style.row, style.between]}>
                                <RenderInput
                                name={'COUNTRY'}
                                placeholder={'Enter Country'}
                                value={country}
                                setValue={setCountry}
                                valueError={countryErr}
                                setValueError={setCountryErr}
                                required={false}
                                stylesProp={{ width: "48%" }}
                                />
                                <RenderInput
                                name={'STATE'}
                                placeholder={'Enter State'}
                                value={state}
                                setValue={setState}
                                valueError={stateErr}
                                setValueError={setStateErr}
                                required={false}
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
                              required={false}
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
                                  </View>}
                          </View>
                        ))}
                        {formOptionError[question.id] && <Text style={[styles.textDanger, style.mH5]}>{formOptionError[question.id]} </Text>}
                      </View>
                    </View>

                  </View>
                )})

                }
              </View>
            }
            {switchTab === 2 &&
              <View>


                <Text style={[style.font16, style.BlackbuttonTxt, { color: COLORS.TEXT_PRIMARY, }]}>Individual Name <Text style={styles.textDanger}>*</Text> </Text>
                <View style={[style.row, style.between]}>
                  <RenderInput
                    name="First Name"
                    placeholder="Enter first name"
                    value={paymentFirstName}
                    setValue={setPaymentFirstName}
                    stylesProp={{ width: "48%" }}
                    required={true}

                  />
                  <RenderInput
                    name="Last Name"
                    placeholder="Enter last name"
                    value={paymentLastName}
                    setValue={setPaymentLastName}
                    stylesProp={{ width: "48%" }}
                    required={true}

                  />

                </View>
                <RenderInput name={'Credit Card Number'} required={true} placeholder={'Enter Credit Card Number'} keyboardType={'numeric'} value={creditCardNumber} setValue={setCreditCardNumber} valueError={creditCardNumberError} setValueError={setCreditCardNumberError} maxLength={16} />
                <RenderDropdown data={cardsData} required={true} name={'Credit Card Type'} placeholder={'Select Card Type'} value={creditCardType} onChange={item => { setCreditCardType(item.value); setCreditCardTypeError('') }} setValue={setCreditCardType} valueError={creditCardTypeError} />
                <RenderInput name={'CVV'} required={true} placeholder={'Enter CVV'} keyboardType={'numeric'} value={cvv} setValue={setCvv} valueError={cvvError} maxLength={3} setValueError={setCvvError} />
                <View style={[style.row, { justifyContent: "space-between" }]}>
                  <RenderDropdown stylesProp={{ width: '45%' }} data={months} required={true} name={'Expiration Month'} placeholder={'Month'} value={expiryMonth} onChange={item => { setExpiryMonth(item.value); setExpiryMonthError('') }} setValue={setExpiryMonth} valueError={expiryMonthError} />
                  <RenderDropdown stylesProp={{ width: '45%' }} data={years} required={true} name={'Expiration Year'} placeholder={'Year'} value={expiryYear} onChange={item => { setExpiryYear(item.value); setExpiryYearError('') }} setValue={setExpiryYear} valueError={expiryYearError} />
                </View>

                <View style={styles.breakeLine} />
                <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, { color: COLORS.TEXT_PRIMARY, }]}>Billing Address</Text>
                {preAddress && preAddress[0] &&preAddress[0].country && preAddress[0].state && preAddress[0].city && preAddress[0].postalCode && preAddress[0].streetAddress1 &&  <View style={[style.row, style.centerBox, style.mt10]}>
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
                <RenderInput name={'Street address 1'} required={true} placeholder={'Enter Street address 1'} value={billingLane1} setValue={setBillingLane1} valueError={billingLane1Error} setValueError={setBillingLane1Error} readOnly={billingAddressCheck} />
                <RenderInput name={'Street address 2'} placeholder={'Enter Street address 2'} value={billingLane2} setValue={setBillingLane2} readOnly={billingAddressCheck} />
                <View style={[style.row, style.between]}>
                  <RenderInput placeholder={'Enter Country'} search={true} required={true} name={'Country'} value={billingCountry} setValue={setBillingCountry} valueError={billingCountryError} setValueError={setBillingCountryError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck} />
                  <RenderInput placeholder={'Enter State'} search={true} required={true} name={'State'} value={billingState} setValue={setBillingState} valueError={billingStateError} setValueError={setBillingStateError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck} />
                </View>
                <View style={[style.row, style.between]}>
                  <RenderInput placeholder={'Enter City'} name={'City'} required={true} value={billingCity} setValue={setBillingCity} valueError={billingCityError} setValueError={setBillingCityError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck} />
                  <RenderInput name={'Zip/Postal Code'} required={true} placeholder={'Enter Zip/Postal Code'} value={billingZipcode} setValue={setBillingZipcode} valueError={billingZipcodeError} keyboardType={'numeric'} setValueError={setBillingZipcodeError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck} />
                </View>


              </View>
            }
            {switchTab === 3 &&
            <View>
             <Text style={[style.font18, style.BlackbuttonTxt,style.boldTxt, { color: COLORS.TEXT_PRIMARY, }]}>Boat Information</Text>
             {boatinfoForm?.map((question, index) => {
                  return(
                  <View key={question.id} style={{ marginBottom: 10 }}>
                    {question.type !== 'text' && <View>
                      <Text style={[style.font16, style.BlackbuttonTxt]}>{question.title}</Text>
                    </View>}

                    <View >
                      <View>
                        {question.options.map((option) => (
                          <View key={option.id} >
                            {question.type === "radio" && (
                              <View>
                                <RadioButton.Group
                                  onValueChange={() => handleBoatRadioButtonChange(question, option, setFormOptionError)}
                                  value={question.options.find(option => option.optionsId)?.id}
                                >
                                  <View key={option.id} style={[style.row, style.centerBox]}>
                                    <RadioButton.Android value={option.id} color={COLORS.PRIMARY} />
                                    <Text style={[style.font16, { color: COLORS.BLACK }]}>{option.optionName}</Text>
                                  </View>
                                </RadioButton.Group>
                              </View>
                            )}
                            {question.type === "checkbox" && (
                              <RenderCheckBox
                                name={option.optionName}
                                value={option.optionsId}
                                onchange={() => handleBoatCheckBoxChange(question, option, setFormOptionError)}
                              />
                            )}
                            {question.type === "text" && question.isVisible &&(
                              <RenderInput
                                dobName={question.title}
                                placeholder={question.title}
                                value={option.optionName}
                                onChangeText={(value) => handleBoatTextInputChange(question, option, value, setFormOptionError)}
                                keyboardType={question.title.toLowerCase().includes('phone') ? "numeric" : "default"}
                              />
                            )}
                          </View>
                        ))}
                        {formOptionError[question.id] && <Text style={[styles.textDanger, style.mH5]}>{formOptionError[question.id]} </Text>}
                      </View>
                    </View>

                  </View>
                )})

                }
            </View>
            }
            {switchTab === 4 &&
              <View>


                <Text style={[style.font16, style.BlackbuttonTxt, { color: COLORS.TEXT_PRIMARY, }]}>Individual Name <Text style={styles.textDanger}>*</Text> </Text>
                <View style={[style.row, style.between]}>
                  <RenderInput
                    name="First Name"
                    placeholder="Enter first name"
                    value={paymentFirstName}
                    setValue={setPaymentFirstName}
                    stylesProp={{ width: "48%" }}
                    required={true}

                  />
                  <RenderInput
                    name="Last Name"
                    placeholder="Enter last name"
                    value={paymentLastName}
                    setValue={setPaymentLastName}
                    stylesProp={{ width: "48%" }}
                    required={true}

                  />

                </View>
                <RenderInput name={'Credit Card Number'} required={true} placeholder={'Enter Credit Card Number'} keyboardType={'numeric'} value={creditCardNumber} setValue={setCreditCardNumber} valueError={creditCardNumberError} setValueError={setCreditCardNumberError} maxLength={16} />
                <RenderDropdown data={cardsData} required={true} name={'Credit Card Type'} placeholder={'Select Card Type'} value={creditCardType} onChange={item => { setCreditCardType(item.value); setCreditCardTypeError('') }} setValue={setCreditCardType} valueError={creditCardTypeError} />
                <RenderInput name={'CVV'} required={true} placeholder={'Enter CVV'} keyboardType={'numeric'} value={cvv} setValue={setCvv} valueError={cvvError} maxLength={3} setValueError={setCvvError} />
                <View style={[style.row, { justifyContent: "space-between" }]}>
                  <RenderDropdown stylesProp={{ width: '45%' }} data={months} required={true} name={'Expiration Month'} placeholder={'Month'} value={expiryMonth} onChange={item => { setExpiryMonth(item.value); setExpiryMonthError('') }} setValue={setExpiryMonth} valueError={expiryMonthError} />
                  <RenderDropdown stylesProp={{ width: '45%' }} data={years} required={true} name={'Expiration Year'} placeholder={'Year'} value={expiryYear} onChange={item => { setExpiryYear(item.value); setExpiryYearError('') }} setValue={setExpiryYear} valueError={expiryYearError} />
                </View>

                <View style={styles.breakeLine} />
                <Text style={[style.font16, style.BlackbuttonTxt, style.boldTxt, { color: COLORS.TEXT_PRIMARY, }]}>Billing Address</Text>
                {preAddress && preAddress[0] &&preAddress[0].country && preAddress[0].state && preAddress[0].city && preAddress[0].postalCode && preAddress[0].streetAddress1 &&  <View style={[style.row, style.centerBox, style.mt10]}>
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
                <RenderInput name={'Street address 1'} required={true} placeholder={'Enter Street address 1'} value={billingLane1} setValue={setBillingLane1} valueError={billingLane1Error} setValueError={setBillingLane1Error} readOnly={billingAddressCheck} />
                <RenderInput name={'Street address 2'} placeholder={'Enter Street address 2'} value={billingLane2} setValue={setBillingLane2} readOnly={billingAddressCheck} />
                <View style={[style.row, style.between]}>
                  <RenderInput placeholder={'Enter Country'} search={true} required={true} name={'Country'} value={billingCountry} setValue={setBillingCountry} valueError={billingCountryError} setValueError={setBillingCountryError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck} />
                  <RenderInput placeholder={'Enter State'} search={true} required={true} name={'State'} value={billingState} setValue={setBillingState} valueError={billingStateError} setValueError={setBillingStateError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck} />
                </View>
                <View style={[style.row, style.between]}>
                  <RenderInput placeholder={'Enter City'} name={'City'} required={true} value={billingCity} setValue={setBillingCity} valueError={billingCityError} setValueError={setBillingCityError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck} />
                  <RenderInput name={'Zip/Postal Code'} required={true} placeholder={'Enter Zip/Postal Code'} value={billingZipcode} setValue={setBillingZipcode} valueError={billingZipcodeError} keyboardType={'numeric'} setValueError={setBillingZipcodeError} stylesProp={{ width: "48%" }} readOnly={billingAddressCheck} />
                </View>


              </View>
            }
            {formData?.questions?.length > 0 && <View style={[style.mtb10, style.row, { justifyContent: switchTab > 1 ? "space-between" : "flex-end" }]}>
              {switchTab > 1 && <TouchableOpacity style={[styles.prevBtn]} onPress={backBtnHandler}>
                <Text style={[styles.prevText]}>Previous</Text>
              </TouchableOpacity>}
              <TouchableOpacity style={[styles.nextBtn,]} onPress={nextHandler}>
               { formsubmitLoader ?
              <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
              :
                <Text style={[styles.nextTxt]}>{switchTab === 1 ? (route?.params?.isPaid && route?.params?.category ==='EVENT' ? 'Next' : 'Submit') : (switchTab === 3 ? 'Next' : 'Submit')}</Text>
                }
              </TouchableOpacity>
            </View>}
          </ScrollView>
          : 
          <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
          <Text style={[style.font18, style.textCenter]}>
            No Form Found
          </Text>
        </View>
          )}
      </View>
        <ModalNative
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            isVisible={showSuccessModal}
            backdropColor='rgba(0, 0, 0, 0.3)'>  
              <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
                <Text style={[style.font14,style.boldTxt,style.textCenter]}>
                 {route?.params?.category === 'EVENT' ? 'You have registered successfully' :(route?.params?.boatForm ? "You have registered successfully" : 'Thank you for your submission!')} 
                </Text>
              </View>
          </ModalNative>
    </View>
  )
}
const styles = StyleSheet.create({
  profileImg: {
    width: normalize(80),
    height: normalize(80),
    borderRadius:8
  },
  prevText: { textAlign: 'center', color: COLORS.BLACK },
  nextTxt: { textAlign: 'center', color: COLORS.WHITE },
  nextBtn: {
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: 4,
    marginVertical: normalize(5),
    backgroundColor: COLORS.PRIMARY,
    width: '45%'
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
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  linkBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: 4,
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
    height: '100%',
    backgroundColor: '#f2f4f6'
  },
  icon: {
    marginRight: 5,
  },
  prevBtn: {
    borderWidth: 1,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: 4,
    marginVertical: normalize(5),
    backgroundColor: '#f2f4f6',
    width: '45%'
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