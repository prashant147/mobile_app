import React,{ useState, useEffect, useRef} from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput
  } from 'react-native';
  import COLORS from "../../styles/theme/color";
  import style from "../../styles/style";
  import DeviceInfo from "react-native-device-info";
import Menu from "../../routes/Menu";
import Icon from "react-native-vector-icons/FontAwesome";
import { normalize } from "../../styles/utilities/dimentions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import RenderInput from "../BecomeMember/RenderInput";

const Eventform = ({route}) => {
    const isTablet = DeviceInfo.isTablet();
    const navigation = useNavigation()
    const [firstName, setFirstName] = useState('Jack Sparrow');
    const [workEmail, setWorkEmail] = useState('Jack@gmail.com');
    const [Address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [mobileNo, setMobileNo] = useState('8989898888');
    const [note, setNote] = useState('');

    useFocusEffect(
      React.useCallback(()=>{
if(route.params){
  console.log(route.params.path);
}
      },[route])
    )
    const handleSave = () => {
        // Handle form submission here
        console.log('Form data:', {firstName, workEmail, note});
        if(route?.params?.path){
          navigation.navigate(route.params.path)
        }else{
          navigation.navigate('Home')

        }
        // You can add your logic to handle form submission or API calls here
      };
    return (
        <View style={[style.contant]}>
        {!isTablet && 
        <View style={style.contant}>
            {/* <Header></Header> */}
            {!isTablet && <View style={[style.sidepanelcolor]}>
            <Menu  selectIndex={0}/>
            </View>
            }
            <ScrollView>
            <View style={[style.contant]}>

            <View
            style={[
              style.contant,
              style.shadowBox,
              style.mt20,
              style.mH20,
              style.pH20,
              style.pt20,
              styles.leftColumn,
              style.mtb10
            ]}>
                 <View style={[style.row]}>
              <TouchableOpacity onPress={handleSave}
              style={[style.row]}>
                <Icon name="chevron-left" size={normalize(20)} style={style.p410} color={COLORS.PRIMARY} />
            </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
              <Text style={[isTablet?style.font24:style.font16,style.boldTxt,style.primaryText]}>Event Registration</Text>
              
              <View style={styles.containerForm}>


            <View style={style.mtb10}>
                <Text style={[style.boldTxt,style.boldTxt,style.font18]}>Event details</Text>
                <View style={style.row}>
                <Text style={[style.font16,style.boldTxt,style.mt10,{color:COLORS.PRIMARY}]}>Titan on Ship</Text>
                  </View>
                  <View style={[style.row]}>
                  <Text style={[style.font14,style.grayText,style.mt10]}>Category : </Text>
                  <Text style={[style.font14,style.mt10,style.primaryText]}> Rendezvous</Text>
                  </View>
                  <View style={[style.row]}>
                    <Text style={[style.font14,style.grayText,style.mt10]}>Date/Time :</Text>
                    <Text style={[style.font14,style.grayText,style.mt10]}>01/02/2024 10:00 AM - 04:30 PM </Text>
                  </View>
                
                <Text></Text>
            </View>
                   
           
              <View style={[style.shadowBoxVolunteerHead]}>
              <Text style={[isTablet? style.font16:style.font14,style.mH10,style.mt10,style.boldTxt]}>Registration Form</Text>
              <TextInput
                    placeholderTextColor={COLORS.GREY}
                    style={[styles.input,style.mH10]}
                    placeholder="Form description"
                    value={description}
                    onChangeText={text => setDescription(text)}
                  />
                  <Text style={[isTablet? style.font16:style.mH10,{marginBottom:10,color:COLORS.LIGHTGREY}]}>This form is automatically collecting emails from all respondents.</Text>
                </View>
                <RenderInput
                  setValue={setFirstName}
                  name="Name"
                  placeholder={'Enter Name'}
                  value={firstName}
                />      
                 <RenderInput
                  setValue={setWorkEmail}
                  name="Work Email"
                  placeholder={'Enter Work Email'}
                  value={workEmail}
                />
                 <RenderInput
                  setValue={setMobileNo}
                  name="Mobile Number"
                  placeholder={'Enter Mobile no'}
                  value={mobileNo}
                />

                <RenderInput
                  setValue={setAddress}
                  name="Address"
                  placeholder={'Enter Address'}
                  value={Address}
                />
                 <RenderInput
                  setValue={setNote}
                  name="Add a note"
                  placeholder={'Add a Note'}
                  value={note}
                  multiline={true}
                  numberOfLines={4}
                />
                 <View style={[{alignItems: 'center'},style.mb10]}>
                  <TouchableOpacity
                    style={[style.button, style.primaryLayout,style.mtb10]}
                    onPress={handleSave}>
                    <Text
                      style={[
                        style.buttonTxt,
                        style.font16,
                        style.whiteText,
                        style.pH20,
                      ]}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
             
              </View>
            </View>
                </View>
                </View>
           

            </ScrollView>
        </View>
            
          
  
        }
        </View>
    )
}
export default Eventform;
const styles = StyleSheet.create({
    leftColumn: {
        flex: 2,
        flexDirection: 'column',
      },
      textContainer: {
        marginTop: 10,
    
      },
      containerForm: {
        flex: 1,
        borderTopColor:COLORS.GREEN,
        borderTopWidth:.5,
        paddingTop:5,
        marginTop:10
      },
      textArea: {
        height: 100,
        textAlignVertical: 'top',
      },
      input: {
        color:COLORS.PRIMARY,
        fontSize:normalize(12),
        // borderBottomColor:COLORS.GREEN,
        // borderBottomWidth:.5,
        // paddingTop:20,
        // marginTop:10
      },

})