import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { boatList } from "../../styles/utilities/constants";
import COLORS from "../../styles/theme/color";
import TextFeild from "../../components/TextFeild";
import { isTablet } from "react-native-device-info";
import style from "../../styles/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { normalize } from "../../styles/utilities/dimentions";
import { launchImageLibrary } from "react-native-image-picker";

const AddLogs = ({setIsAddBoat,isAddBoat}:any) => { 

    const selectImage = async() => {
        const result = await launchImageLibrary({mediaType:'photo'});
    };



    return  <ScrollView showsVerticalScrollIndicator={false}>


     <Text style={[style.font20,style.boldTxt,style.primaryText]}>Add log</Text>
    
     <View style={isTablet() && style.row}>
         <View style={style.contant}>
           <View style={isTablet() && style.row}>
               <TextFeild onchange={()=>{}} labelName="LOG NAME" placeholder="Enter log name"/>
               <TextFeild onchange={()=>{}} labelName="DATE" placeholder="Enter date"/>
           </View>
           <View style={isTablet() &&style.row}>
               <TextFeild onchange={()=>{}} labelName="START PORT NAME" placeholder="Enter start port name"/>
               <TextFeild onchange={()=>{}} labelName="END PORT NAME" placeholder="Enter end port name"/>
           </View>
           <View style={isTablet() &&style.row}>
               <TextFeild onchange={()=>{}} labelName="ADD STOPS +" placeholder="Enter stops" />
               <TextFeild onchange={()=>{}} labelName="MMSI" placeholder="Enter MMSI"/>
           </View>
           <View style={isTablet() &&style.row}>
               <TextFeild onchange={()=>{}} labelName="SELECT BOAT" placeholder="Select Boat"/>
               <TextFeild onchange={()=>{}} labelName="COLOR" placeholder="Add color"/>
           </View>
         <View >
             <TextFeild onchange={()=>{}} labelName="INVITE MEMBERS" placeholder="Invite members" />
         </View>
         <View >
             <TextFeild onchange={()=>{}} labelName="ADD NOTE" placeholder="Add note" />
         </View>

         <View style={style.mtb10}>
             <TouchableOpacity style={[style.button,style.borderRadius8,style.centerItem,{backgroundColor:COLORS.PRIMARY,height:normalize(40), width:"100%"}]} onPress={()=>setIsAddBoat(false)}>
                 <Text style={[style.centerItem,style.buttonTxt,style.whiteText]}>Save Log</Text>
             </TouchableOpacity>
         </View>

         </View>
         {
           isTablet() && <View style={{flex:0.5}}> 
           <View style={{backgroundColor:'rgba(52, 52, 52, 0.3)',width:200,height:150, justifyContent:'center',alignItems:'center', borderRadius:4,marginTop:40}}>
               <Icon onPress={selectImage} name="upload" size={30} color={COLORS.WHITE}/>
           </View></View>
         }
         
     </View>
     
 </ScrollView>
}
export default AddLogs;