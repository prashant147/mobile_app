import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  FlatList
} from 'react-native';
import COLORS from '../../../styles/theme/color';
import style from '../../../styles/style';
import DeviceInfo, { isTablet } from 'react-native-device-info';

interface AboutEducationScreenProps {
  selectedIndex:any
}
const AboutEducationScreen: React.FC<AboutEducationScreenProps> = ({selectedIndex}) => {
  const isTablet = DeviceInfo.isTablet();
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {  
    if(scrollViewRef && scrollViewRef.current){
      scrollViewRef.current.scrollTo({ y: 150*selectedIndex, animated: true });
  }
  }, [selectedIndex]);
  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <View style= {[style.contant]}>
            <Text style={[isTablet?style.font24:style.font14,style.boldTxt,style.primaryText,style.mt10]}>Education / Resources</Text>
            <View>
              <Text style={[isTablet?style.font16:style.font12,style.boldTxt,style.primaryText,style.mt10]}>INTRODUCTION</Text>
              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
                We all strive to be known as that "Good (safe) Sailor". While there
                is no substitute for the learning that comes from experience and
                time on the water, there is a lot that can be learned from others.
                The SDSA has developed a series of Webinars, Checklists and Articles
                that can assist you in preparing your boat and the skills of you and
                your crew so that you can become that "Good Sailor"
              </Text>
            </View>
            <View>
              <Text style={[isTablet?style.font16:style.font12,style.boldTxt,style.primaryText,style.mt10]}>LIBRARY OF PRIOR WEBINARS:</Text>
              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
                The SDSA has compiled a Library of recorded webinars on a wide array
                of topics, featuring industry experts and specialists from our
                sponsors, as well as extremely experienced World and Ocean Class
                Salty Dawg members.
              </Text>
              <View style={[style.mH20,style.mt20]}>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Choosing your Boat, Buying / Selling and Boat Restoration</Text>
                </View>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Destinations and Cruising with the Salty Dawgs</Text>
                </View>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Getting There</Text>
                </View>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Passage Preparation</Text>
                </View>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Sails and Rigging</Text>
                </View>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Gear and Techniques</Text>
                </View>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Safety at Sea</Text>
                </View>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Keep You and Your Crew Happy</Text>
                </View>
                <View style={style.row}>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>•</Text>
                  <Text style={[isTablet?style.font16:style.font12,style.lineHeight20]}>Experts Corner</Text>
                </View>
            </View>
              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
                Access to this Library is free to Members, and may be accessed at
                any time that is convenient. The Library is a serious investment in
                developing or fine tuning your blue water sailing knowledge and
                skills. See our Library of Prior Webinars for details. The Library
                includes:
              </Text>
            </View>
            <View>
              <Text style={[isTablet?style.font16:style.font12,style.boldTxt,style.primaryText,style.mt10]}>CHECKLISTS AND ARTICLES:</Text>
              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
                The SDSA has produced check lists and articles that will assist you
                in organizing and preparing for an off-shore passage. Members can
                access these articles at Preparing for an Offshore Passage
              </Text>
            </View>

            <View style={{marginBottom:20}}>
              <Text style={[isTablet?style.font16:style.font12,style.boldTxt,style.primaryText,style.mt10]}>CHECKLISTS AND ARTICLES:</Text>
              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
                Each year, the SDSA conducts a two-part Winter Webinar Series, with
                10 to 12 webinars in each part, The Winter Series Part I will be in
                February and Part II in March. The Spring Webinar Series, will
                feature Part I in May and Part II in June. These webinars are all
                free to Members, and a very low fee, either individually priced or
                as a package for all non-Members. A great value whether taking them
                free by members or low cost for non-Members.
              </Text>

              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
                We will publish our webinar series for the coming year in December
                for the Winter series and early March for the Spring series.
              </Text>
              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
                These will feature experienced Salty Dawg speakers, industry experts
                and specialists from our sponsors. Many ion these one-hour webinars
                are conducted live with a Question and Answer session at the end of
                each presentation, and some as recordings by our experts and we
                include periodic sessions with an expert panel. They are all
                recorded so they can be viewed at a later time. At the end of the
                season, all recordings are moved to our Library for continued access
                by our members.
              </Text>
              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
                Coming Soon: See our Webinar page for more details and to register.
              </Text>
            </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
});

export default AboutEducationScreen;
