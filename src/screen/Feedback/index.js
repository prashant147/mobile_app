import React,{useEffect,useState,useContext} from "react";
import { View,Text,ScrollView,TouchableOpacity,StyleSheet } from "react-native";
import style from "../../styles/style";
import Menu from "../../routes/Menu";
import { ActivityIndicator } from "react-native-paper";
import RenderInput from "../BecomeMember/RenderInput";
import RenderDropdown from "../BecomeMember/RenderDropdown";
import { createFeedback } from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MembersContext from "../Members/MembersContext";
import ModalNative from "react-native-modal";
import Entypo from "react-native-vector-icons/Entypo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import COLORS from "../../styles/theme/color";
import { normalize } from "../../styles/utilities/dimentions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Feedback = () => {
    const {loggedInUser } = useContext(MembersContext);  
    const navigation = useNavigation()
    const [problemorFeature,setProblemOrFeature] = useState("");
    const [problemorFeatureErr,setProblemOrFeatureErr] = useState("")
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [subjectErr, setSubjectErr] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionErr, setDescriptionErr] = useState('');
    const [loader, setLoader] = useState(false)
    const token = AsyncStorage.getItem('accessToken');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const data = [
        { label: 'Feature Request', value: 'Feature Request' },
        { label: 'Report Problem', value: 'Report Problem' },
      ];

      useFocusEffect(React.useCallback(() => {
        setEmail(loggedInUser?.username)
        setSubjectErr("");
        setDescriptionErr("");
        setProblemOrFeatureErr("");
        setSubject('')
        setDescription("")
        setProblemOrFeature("")
      },[]))

      const backClickHandler = () => {
        navigation.navigate("Home")
        
      }

    const submitFeedbackForm = async() => {
        setSubjectErr("");
        setDescriptionErr("");
        setProblemOrFeatureErr("");
        let isValid = true;
        if (subject === '') {
            setSubjectErr('Please enter the subject');
            isValid = false;
        }
        if (description === '') {
            setDescriptionErr('Please enter the description');
            isValid = false;
        }
        if (problemorFeature === '') {
            setProblemOrFeatureErr('Please select feedback type');
            isValid = false;
        }
        const payload = {
            "problemOrFeature":problemorFeature,
            "subject":subject,
            "description": description
          }
          console.log(payload,"payload")
          if(isValid){
          try {
            setLoader(true)
            const response = await createFeedback(payload,token);
            if(response.status === 200){
                setLoader(false);
                setSubject('')
                setDescription("")
                setProblemOrFeature("")
                setShowSuccessModal(true)
                setTimeout(() => {
                 setShowSuccessModal(false)
                },2000)
               
            }
          } catch (error) {
            console.error(error)
          }
        }
    }

    return (
        <View style={[style.contant]}>
                <View style={[style.row]}>
                <View style={[style.sidepanelcolor]}>
                    <Menu selectIndex={16}/>
                </View>
            </View>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"} enableAutomaticScroll={true} extraScrollHeight={110}  style={[style.mH20,style.contant]}>
                <View style={[style.mt10]}> 
                    
                    <RenderDropdown
                    value={problemorFeature}
                    onChange={item => {setProblemOrFeature(item.value);setProblemOrFeatureErr("")}}
                    name={'Feedback Type'}
                    required={true}
                    data={data}
                    valueError={problemorFeatureErr}
                    placeholder={'Select'}   
                    />
                    <RenderInput
                    name={'Email Address'}
                    placeholder={'Enter email address'}
                    value={email}
                    setValue={setEmail}
                    required={true}
                    readOnly={true}
                    /> 
                    <RenderInput
                    name={'Subject'}
                    placeholder={'Enter subject'}
                    value={subject}
                    setValue={setSubject}
                    valueError={subjectErr}
                    setValueError={setSubjectErr}
                    required={true}
                    /> 
                    <RenderInput
                    name={'Description'}
                    placeholder={'Enter description'}
                    value={description}
                    setValue={setDescription}
                    valueError={descriptionErr}
                    setValueError={setDescriptionErr}
                    required={true}
                    multiline={true}
                    inputStyle={styles.inputStyle}
                    /> 

                    <TouchableOpacity style={[style.primaryLayout, style.button,style.mtb10,style.borderRadius5]} onPress={submitFeedbackForm}>
                      {loader ?
                        <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
                        :
                        <Text style={[style.font16, style.whiteText]}>Submit</Text>
                      }
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            <ModalNative
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        isVisible={showSuccessModal}
        onBackdropPress={() => setShowSuccessModal(false)}
        backdropColor="rgba(0, 0, 0, 0.3)"
      >
        <View style={[style.p20, style.whiteLayout, style.borderRadius8]}>
          <Text style={[style.font14, style.boldTxt, style.textCenter]}>
          Successfully submitted your feedback.
          </Text>
        </View>
      </ModalNative>
        </View>
    )
}
export default Feedback;
const styles = StyleSheet.create({
  inputStyle:{
    height:normalize(100)
  }
})