import { StyleSheet, Text, View ,ScrollView,TouchableOpacity} from 'react-native'
import React from 'react'
import COLORS from '../../styles/theme/color';
import { normalize } from '../../styles/utilities/dimentions';
import TextFeild from '../../components/TextFeild';
import Icon from "react-native-vector-icons/FontAwesome";
import style from '../../styles/style';
import DeviceInfo from 'react-native-device-info';

const Addevents = ({setActiveTab}) => {
  const isTablet = DeviceInfo.isTablet();
  return (
    <ScrollView style={{paddingBottom:normalize(50)}} showsVerticalScrollIndicator={false}>

    <View style={styles.container}>
        <View style={[ isTablet ? styles.formContainer : styles.formContainerMobile]}>
        <View style={style.row}>
           
            <TextFeild labelName="Rally/Event Name" placeholder="Enter event name" onchange={()=>{}}/>
        </View>
        {isTablet && <View style={style.row}>
            <TextFeild labelName="Date" onchange={()=>{}}  placeholder='Enter date'/>
            <TextFeild labelName="Time" onchange={()=>{}} placeholder='Enter time'/>
        </View>}

        {!isTablet && <View style={style.row}>
            <TextFeild labelName="Date" onchange={()=>{}} placeholder='Enter date'/>
        </View>}

        {!isTablet && <View style={style.row}>
            <TextFeild labelName="Time" onchange={()=>{}} placeholder='Enter time'/>
        </View>}
       
        <View style={style.row}>
            <TextFeild labelName="Location" onchange={()=>{}} placeholder='Enter location'/>
        </View>
        <View style={style.row}>
            <TextFeild labelName="Organizer Name" onchange={()=>{}} placeholder='Enter organization name'/>
        </View>
        {isTablet && <View style={style.row}>
            <TextFeild labelName="Description" onchange={()=>{}} placeholder='Enter description'/>
            <TextFeild labelName="Position" onchange={()=>{}} placeholder='Enter position'/>
        </View>}

        {!isTablet && <View style={style.row}>
            <TextFeild labelName="Description" onchange={()=>{}} placeholder='Enter description'/>
      
        </View>}
        {!isTablet && <View style={style.row}>
          
            <TextFeild labelName="Position" onchange={()=>{}} placeholder='Enter position'/>
        </View>}
        <View style={[style.row,]}>
            <TextFeild labelName="Add Picture & Video" onchange={()=>{}} placeholder='Add picture/video'/>
        </View>
        <View style={style.row}>
            <TextFeild labelName="Invite Members" onchange={()=>{}} placeholder='Invite members' />
        </View>

        <View style={[style.mtb10]}>
            <TouchableOpacity 
             onPress={()=>setActiveTab(0)}
             activeOpacity={.8} style={[styles.btnStyle,{height:normalize(40)}]}>
                <Text style={styles.btnTextStyle}>Post Rally/Event</Text>
            </TouchableOpacity>
        </View>

        </View>
        
        
    </View>

</ScrollView>
  )
}

export default Addevents

const styles = StyleSheet.create({
    btnStyle:{
        backgroundColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        borderRadius:4,
        justifyContent:'center',
        alignItems:'center',
        height:normalize(30),
        width:"100%"
      },
      btnTextStyle:{
        color:COLORS.WHITE,
        fontSize:normalize(14),
        fontWeight:'600'
      },


      btnStyleOutline:{
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        // paddingVertical:normalize(5),
        marginBottom:normalize(5),
        marginTop:normalize(10),
        borderRadius:normalize(4),
        marginRight:'auto',
        height:normalize(20),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      },
      btnOutlineTextStyle:{
        color:COLORS.PRIMARY,
        fontSize:normalize(14),
      },
      formContainer:{
        // flex:1,
        width:'70%'
      },
      formContainerMobile:{
         flex:1,
       
      },


      container:{
        flex:1,
        flexDirection:'row',
        alignItems:'flex-start',
        paddingBottom:normalize(10)
      }
})
