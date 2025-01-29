import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import style from "../../styles/style";
import DeviceInfo from "react-native-device-info";
import { scaleHeight, scaleWidth } from "../../styles/utilities/dimentions";
import COLORS from "../../styles/theme/color";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect } from "react";
import { getAllAwards } from "../../services/api/auth";
import moment from "moment";

interface AwardsInfoProps {
    openInfo:any
  } 
  const isTablet = DeviceInfo.isTablet();
const AwardsInfo: React.FC<AwardsInfoProps> = ({openInfo}) => { 

    const [isLoader, setIsLoader] = useState(true);
    const [awardData,setAwardData]=useState([]);
    const token = AsyncStorage.getItem("accessToken");

    useEffect(()=>{
        getAllAwardsData()
      },[])
    
      const getAllAwardsData =async()=>{
        try {
          const response = await getAllAwards(token);
    
          if(response.status === 200){
            setAwardData(response.data.reverse());
            setIsLoader(false);
          }
    
        } catch (error) {
          console.error(error);
          setIsLoader(false);
        }
      }




    const renderAward =({item}:any)=>{
        return(
            <View>
                 <Text
                    style={[
                      isTablet ? style.font24 : style.font14,
                      style.primaryText,
                      style.boldTxt,
                      style.mtb10,
                    ]}>{item.awardsType}-{moment(item.issuedDate).format('YYYY') }</Text>
                    <View style={[style.row,{backgroundColor:"#FAFAFA",marginBottom:10,padding:10}]}>
                        <Image style={{width: isTablet ? scaleWidth(100):scaleWidth(60),height: isTablet ?scaleHeight(100):scaleHeight(60),marginTop:15,marginRight:15}} resizeMode="contain" source={{uri:item.awardsMediaUrl}}></Image> 
                        <View style={[style.contant,isTablet && style.row]}>
                             <View style={style.contant}>
                                <Text style={styles.award}>{moment(item.issuedDate).format('YYYY') } Recipient</Text>
                                <Text style={styles.awardName}>{item.recipientName}</Text>
                                <Text style={styles.awardDetail}>{item.issuedBy}</Text>
                             </View>
                             <View style={{justifyContent:'center'}}>
                                <TouchableOpacity onPress={()=>openInfo(item)} style={[style.button,style.borderRadius8,{maxWidth:120,marginTop:10}]}>
                                    <Text style={style.primaryText}>View More</Text>
                                </TouchableOpacity>
                             </View>
                        </View>

                    </View>
                </View>
        )
    }
    return ( 
        <View style={[style.contant, style.row]}>
        {isLoader ? 
            <View style={[style.centerBox,style.contant,style.centerItem]}>
            <ActivityIndicator size={'large'} style={[style.centerItem]} color={COLORS.PRIMARY} />
           </View>
          :
    <ScrollView style={[style.contant,isTablet?style.padding20:style.padding10]} showsVerticalScrollIndicator={false}>
        <Text
                    style={[
                      isTablet ? style.font24 : style.font14,
                      style.primaryText,
                      style.boldTxt,
                      style.mtb10,
                    ]}>SDSA Awards</Text>
                      <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.SECONDARY,
                    }}></View>
      <Text
                    style={[
                      isTablet ? style.font24 : style.font14,
                      style.primaryText,
                      style.boldTxt,
                      style.mtb10,
                    ]}>SDSA Founders Awards</Text>
        <View>
            <Text style={styles.details}>Purpose: To recognize the contribution of an individual or individuals that most embody the spirit of “Sailors Helping Sailors”.</Text>
            <Text style={styles.details}>
                Description: The Salty Dawg Sailing Association, as it is now known, was founded by Bill and Linda Knowles with the goal of helping Sailors build blue water sailing skills and to foster the spirit of “sailors helping sailors”.
                This award, to be given out on an annual basis, when appropriate, will recognize an individual or crew that most exemplifies the spirit of this goal.
            </Text>
            <Text style={styles.details}>
                Nominations will be made by members of the Salty Dawg Sailing Association and submitted to the Awards committee comprised of three members of the SDSA board of directors. This committee will select the nomination that they judge to be the worthiest of this recognition.
            </Text>
            <Text style={styles.details}>
                The award, a custom engraved crystal plaque, will be presented by the president of the organization, either at the Fall Annapolis rendezvous or during the Caribbean Rally departure events in Hampton.
            </Text>
            <Text style={styles.details}>
                The recipient will be noted in a subsequent newsletter and included on an awards page on the SDSA website.
                Nominations for the award will be accepted by the committee through conclusion of the summer rallies at the end of August.
            </Text>
            <Text style={[styles.details,{textAlign:'auto'}]}>
                Nominations should be sent to nominations@saltydawgsailing.org
            </Text>
        </View>

        <FlatList 
         data={awardData}
         renderItem={renderAward}
         keyExtractor={(item) => item.id}

        />
 
    </ScrollView>}
    </View>
    )
}
const styles = StyleSheet.create({ 
    details:{
        fontSize:scaleWidth(isTablet?16:12),
        color:COLORS.BLACK,
        marginBottom:10,
        textAlign:'justify'
    },
    awardName:{
        fontSize:scaleWidth(isTablet?24:16),
        color:COLORS.BLACK,
        fontWeight:'bold',
        marginTop:5,
    },
    awardDetail:{
        fontSize:scaleWidth(isTablet?16:13),
        color:COLORS.BLACK,
        marginTop:5,
    },
    award:{
        fontSize:scaleWidth(isTablet?16:11),
        color:COLORS.GREY,
        marginTop:5,
    }
})
export default AwardsInfo;