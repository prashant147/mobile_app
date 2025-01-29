import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,FlatList, Linking
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../../styles/theme/color';
import style from '../../../styles/style';
import DeviceInfo from 'react-native-device-info';

interface AboutEducationScreenProps {
  selectedIndex:any
}
const SdsaGuideScreen: React.FC<AboutEducationScreenProps> = ({selectedIndex}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const isTablet = DeviceInfo.isTablet();
  useEffect(() => {  
    if(scrollViewRef && scrollViewRef.current){
      scrollViewRef.current.scrollTo({ y: 200*selectedIndex, animated: true });
  }
  }, [selectedIndex]);

  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <View style= {[style.contant,style.pV20]}>
        <Text style={[isTablet? style.font24:style.font14,style.boldTxt,style.primaryText]}>PAPERS FROM THE 2017 RALLY TO CUBA</Text>
        <Text style={[isTablet? style.font18:style.font12,style.mt10,style.lineHeight20]}>
           CUBA TODAY – Twenty Three Boats and One Hundred Twenty Four Sailors Participated in the 2017 Salty Dawg Rally to Cuba. These sailors conducted research in numerous topics of interest to future visitors to Cuba and those interested about Cuba today. The results of their research are documented in these summary papers. These sailors were able to roam and interview Cubans directly, visit their shops and farms, and were not spoon-fed the propaganda other US visitors receive in their Cuban Government-run educational sessions, or guided by Cuban Government “tour guides.” The papers provide a wealth of original material from these Salty Dawg sailors. Enjoy and let your friends know of this resource.
        </Text>
        <View style={styles.borderBox}>
          <Text style={[isTablet? style.font18:style.font12,style.mt10,style.lineHeight20]}>
            (REPRINT: Bluewater Sailing Magazine, May, 2017, article on the Salty Dawg 2017 Rally to Cuba)
          </Text>
          <Text style={[isTablet? style.font18:style.font12,style.mt10,style.lineHeight20]}>
            “Landing in Cuba is like stepping off a time machine. Colonial era architecture, 1940’s and 1950’s American cars in 
            great shape, oxen-drawn ploughs, trash burned by incinerator or in open air, and more. And, add-in the many unique 
            features of Cuba -plenty of Cuban cigars (farmers, and elderly ladies with a stogie stuffed in their mouths), colorful 
            clothing, upbeat music, and…” <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/cuba-today.pdf")}>
              <Text style={style.primaryText}>Read More</Text>
              </TouchableOpacity> 
          </Text>
        </View>
       

        <Text style={[isTablet? style.font20:style.font16,style.boldTxt,style.primaryText]}>UNDERSTAND YOUR BOAT</Text>

        <View style={[style.mH20,style.mt20]}>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
               <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Cuba-Guarda-Frontera-.pdf")}>
                <Text style={[isTablet?style.font16:style.font14,style.primaryText,]}>GUARDA FRONTERA</Text>
                </TouchableOpacity> 
                <Text style={[isTablet?style.font16:style.font12,style.lineHeight20,isTablet && {marginLeft:10}]}>– The Cuban Coast Guard</Text> 
              </View>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
              <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Communications-2.pdf")}>
                <Text style={[isTablet?style.font16:style.font14,style.primaryText]}>COMMUNICATIONS IN CUBA</Text>
                </TouchableOpacity> 
                <Text style={[isTablet?style.font16:style.font12,style.lineHeight20,isTablet && {marginLeft:10}]}>– For Cruisers and General Visitors</Text> 
              </View>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
                <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Marine-Services-in-Cuba-1.pdf")}>
                  <Text style={[style.primaryText,]}>MARINE SERVICES IN CUBA</Text>
                </TouchableOpacity> 
                <Text style={[isTablet?style.font16:style.font12,style.lineHeight20,isTablet && {marginLeft:10}]}>– Fixing Boats in Exotic Places</Text>
              </View>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
                <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Marina-Gaviota.pdf")}>
                  <Text style={style.primaryText}>MARINA GAVIOTA, VARADERO</Text>
                </TouchableOpacity> 
                <Text style={[isTablet?style.font16:style.font12,style.lineHeight20,isTablet && {marginLeft:10}]}> – Cuba’s Largest and Most Modern Marina</Text>
              </View>
            </View>
        </View>

      
        <Text style={[isTablet? style.font20:style.font16,style.boldTxt,style.primaryText,style.mt20]}>IMPRESSIONS</Text>
        <View style={[style.mH20,style.mt20,{paddingBottom:20}]}>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
                <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Cubanism-Bristol-Head-R2.pdf")}>
                  <Text style={style.primaryText}>CUBANISM–</Text>
                </TouchableOpacity>
                <Text style={[isTablet?style.font16:style.font12,style.lineHeight20,isTablet && {marginLeft:10}]}>
                  Human Interest Observations
                </Text>
              </View>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
                <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Hola-Cuba-2.pdf")}>
                  <Text style={style.primaryText}>HOLA CUBA!</Text>
                </TouchableOpacity>
                <Text style={[isTablet?style.font16:style.font12,style.lineHeight20,isTablet && {marginLeft:10}]}>
                  – Sweet Memories
                </Text>
              </View>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
                <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Navigating-Donation-Process-2.pdf")}>
                  <Text style={style.primaryText}>NAVIGATING THE DONATION PROCESS</Text>
                </TouchableOpacity> 
                <Text style={[isTablet?style.font16:style.font12,style.lineHeight20,isTablet && {marginLeft:10}]}>
                  – Good Intentions Aren’t Enough
                </Text>
              </View>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
                <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Negotiations-with-a-Non-Govt-Entity-in-Cuba.pdf")}>
                  <Text style={style.primaryText}>NEGOTIATING IN CUBA</Text>
                </TouchableOpacity> 
                <Text style={[isTablet?style.font16:style.font12,style.lineHeight20,isTablet && {marginLeft:10}]}>
                  – Central Authority Influences Actions of Non- Governmental Organizations 
                </Text>
              </View>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12]}>•</Text>
              <View style={[isTablet && style.row]}>
                <TouchableOpacity onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/assets/docs/Visiting-Cuba.pdf")}>
                  <Text style={style.primaryText}>VISITING CUBA</Text>
                </TouchableOpacity> 
                <Text style={[isTablet?style.font16:style.font12,isTablet && {marginLeft:10}]}>
                  – Skepticism Replaced by Friendship
                </Text>
              </View>
            </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  borderBox:{
    borderColor:COLORS.SECONDARY,
    borderTopWidth:1,
    borderBottomWidth:1,
    marginVertical:20,
    paddingBottom:10
  }
});

export default SdsaGuideScreen;
