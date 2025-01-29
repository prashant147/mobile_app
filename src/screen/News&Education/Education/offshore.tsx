import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,FlatList
} from 'react-native';
import COLORS from '../../../styles/theme/color';
import style from '../../../styles/style';
import DeviceInfo, { isTablet } from 'react-native-device-info';

interface AboutEducationScreenProps {
  selectedIndex:any
}
const OffShoreScreen: React.FC<AboutEducationScreenProps> = ({selectedIndex}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const isTablet = DeviceInfo.isTablet();
  useEffect(() => {  
    if(scrollViewRef && scrollViewRef.current){
      scrollViewRef.current.scrollTo({ y: 200*selectedIndex, animated: true });
  }
  }, [selectedIndex]);
  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <View style= {[style.contant,style.pt20,{paddingBottom:20}]}>
        <Text style={[isTablet? style.font24:style.font14,style.boldTxt,style.primaryText]}>Preparing for Offshore</Text>
        
        <Text style={[isTablet? style.font18:style.font12,style.mt20,style.lineHeight20]}>Preparing your vessel and crew for an offshore passage can seem like an impossible task. To aid in this process, this section provides links to articles and checklists that both educate and assist with preparation.</Text>
        <Text style={[isTablet? style.font18:style.font12,style.mt10,style.lineHeight20]}>In this section, we concentrate on four key areas essential to successful passage preparation:</Text>
        <View style={[style.mH20,style.mt20]}>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
              <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Understand Your Boat</Text>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
              <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Required and Recommended Experience, Equipment, and Preparation</Text>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
              <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Checklist for Offshore</Text>
            </View>
            <View style={style.row}>
              <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
              <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Advice from Experts</Text>
            </View>
        </View>
        <Text style={[isTablet? style.font20:style.font14,style.boldTxt,style.primaryText,style.mt10]}>UNDERSTAND YOUR BOAT</Text>
        
        <Text style={[isTablet? style.font18:style.font12,style.mt10,style.lineHeight20]}>This useful article by Salty Dawg and longtime sailor Hank George will help you understand the basic parameters of your boat’s performance and its key features, to be better able to plan and manage your offshore passage.</Text>
       
        <Text style={[isTablet? style.font20:style.font14,style.boldTxt,style.primaryText,style.mt10,style.lineHeight20]}>REQUIRED AND RECOMMENDED EXPERIENCE, EQUIPMENT, AND PREPARATION</Text>
        
        <Text style={[isTablet? style.font18:style.font12,style.mt20,style.lineHeight20]}>A list of required and recommended equipment, experience, and preparation for your offshore passage, compiled by the Salty Dawg’s veteran offshore sailors. Study it carefully and implement this in the best manner you can for your vessel.</Text>
       
        <Text style={[isTablet? style.font20:style.font14,style.boldTxt,style.primaryText,style.mt10]}>CHECKLIST FOR OFFSHORE</Text>
        
        <Text style={[isTablet? style.font18:style.font12,style.mt20,style.lineHeight20]}>The To-Do List before a passage can be daunting. This is a comprehensive checklist that will help guide you through the priorities for a successful passage. You’ll find guidance about spares, special tools, safety gear, provisions, inspections, and more.</Text>
        
        <Text style={[isTablet? style.font20:style.font14,style.boldTxt,style.primaryText,style.mt10]}>ADVICE FROM EXPERTS</Text>
        
        <Text style={[isTablet? style.font18:style.font12,style.mt20,style.lineHeight20]}>The Salty Dawg’s veteran offshore sailors have prepared this collection of articles providing superb advice to sailors on many topics of important to safe and fun offshore sailing and cruising.</Text>
       
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
 
});

export default OffShoreScreen;
