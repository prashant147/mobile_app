import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import COLORS from '../../../styles/theme/color';
import style from '../../../styles/style';
import DeviceInfo, { isTablet } from 'react-native-device-info';

interface AboutEducationScreenProps {
  selectedIndex:any
}
const WebinarsScreen : React.FC<AboutEducationScreenProps> = ({selectedIndex}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const isTablet = DeviceInfo.isTablet();
  useEffect(() => {  
    if(scrollViewRef && scrollViewRef.current){
      scrollViewRef.current.scrollTo({ y: 200*selectedIndex, animated: true });
  }
  }, [selectedIndex]);
  const webinarData = [
    {
      date: '',
      time: '',
      name: 'Entire Winter Webinar Series ',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2190510#!/",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $25 for all in this group',
      desp:[]
    },
    {
      date: 'Tues January 2',
      time: '5:00 pm ET',
      name: 'Caribbean Winter Weather',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2190509#!/",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["What is it really like?",
          "Whether you are in the Caribbean or Bahamas or planning to head there in a few years, Chris will share what it’s really like to be in the Caribbean during “The season”.",
        "Marine Weather Center - Chris Parker"
      ]
    },
    {
      date: 'Tues January 9',
      time: '5:30 pm ET',
      name: 'A Winter of Caribbean Rendezvous',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2190536#!/",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["Diane MacDonald-Mackenzie, SDSA Board Member, will host a discussion of the many rendezvous that the Dawgs will enjoy during the 2024/25 cruising season. There will be discussion of the gatherings to the north, as far as the Bahamas and south into the Grenadines.",
    "Whether you are already in the Caribbean or planning to head there soon, this will help you better understand what to look forward to.",
  "A special emphasis will be on “official” marinas that offer discounts for the Dawgs."]
    },
    {
      date: 'Tues February 6',
      time: '5:30 pm ET',
      name: 'Should You Upgrade to Lithium?',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191474",
      type: ' Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["We’ve all heard so much about the pros and cons of upgrading to lithium. Past SDSA president Hank George will share the latest about this amazing technology that is sweeping the cruising community and why the conversion should be done with care.",
    "Blue Heron - Hank George"]
    },
    {
      date: 'Tues February 13',
      time: '5:30 pm ET',
      name: 'Heavy Weather Tactics: Using Para-anchors & Storm Drogues',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191475#!/",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["Para Anchor - Zach Smith"]
    },
    {
      date: 'Tues February 20',
      time: '5:30 pm ET',
      name: 'Making Sense out of the Yacht Insurance Market',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191497#!/",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["Whether you have insurance or are shopping for the best policy, SDSA supporter Morgan Wells of Jack Martin Insurance will walk us through the complex insurance market. Today’s increasingly expensive market requires ever greater diligence to be sure that you are getting what you pay for.",
    "Jack Martin Insurance - Morgan Wells"]
    },
    {
      date: 'Tues February 27',
      time: '5:30 pm ET',
      name: 'Getting the Most out of Predict Wind',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191498#!/",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["Most of SDSA members use Predict Wind for preparation and weather routing on passage. Nick Olson of Predict Wind will share the latest features of this powerful tool.",
    "Predict Wind - Nick Olson"]
    },
    {
      date: 'Thurs March 21',
      time: '5:30 pm ET',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191499#!/",
      name: 'How to Make Cruising Together a True Partnership',
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["Join this roundtable of experienced cruising couples as they share what works and what doesn’t to live for months on a cruising boat. They will share practical tips to make sure that your first season afloat won’t be your last."]
    },
    {
      date: 'Thursday March 28',
      time: '5:30 pm ET',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191500#!/",
      name: 'Gadgets and Work-arounds Aboard that Really Work.',
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["A group of experienced cruisers will share their favorite tips that have made their time aboard easier and more rewarding. These ideas may prove to be a game-changer for you too."]
    },
    {
      date: 'TBD',
      time: '',
      name: 'Storage Solutions',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191501",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["proven ways to store away food, boat parts and more",
    "Boat  Galley - Nica Waters"]
    },
    {
      date: 'TBD',
      time: '',
      name: 'Keeping the Stick Up!',
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191503",
      desp:["Nothing will ruin your day like being dismasted. Anna Maddox of M Yachts will share her secrets on clues to look for that may lead to catastrophic failures offshore.",
    "M Yacht Services - Anna Maddox"]
    },
    {
      date: 'TBD',
      time: '',
      name: 'What to Look for in a Capable Offshore Yacht',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191503",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["Looking for that perfect cruising yacht that combines comfort offshore and fits in your budget? YaZu Yacht Brokers will share their insights into the dos and don’ts of selecting that “perfect boat”.",
    "YaZu Yacht  Brokers"]
    },
    {
      date: 'TBD',
      time: '',
      name: 'Emergency at Sea: Planning for the Unexpected',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191504",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["Nobody wants to think about “when the worst happens at sea”. With expanded offshore communication options, getting medical support when you are far from land has never been easier. Learn about the medical support and evacuation services that are available to keep you and your crew safe when on passage.",
    "Several service providers will be invited to discuss their services and answer questions"]
    },
    {
      date: 'TBD',
      time: '',
      name: 'Emergency Medicine at Sea, a 5 Part Series',
      link:"https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2191505",
      type: 'Register for All Free for Salty Dawg Members Non-Members pay $12 for this webinar',
      desp:["When you are far from medical assistance, this series will help you keep health issues from becoming life threatening.",
    "This five part series will focus on key areas you need to understand to keep you and your crew as safe as possible."]
    },
    // Add more webinar data as needed
  ];

  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <View style={[style.contant,{paddingBottom:20}]}>
        <View>
          <Text style={[isTablet?style.font24:style.font14,style.boldTxt,style.primaryText]}>
            Salty Dawg 2023 Webinar Series Register Now
          </Text>
          <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
            Can't make a live event? All webinars are recorded and everyone who
            has registered will receive a link to view the recording.
          </Text>
          <Text style={[isTablet?style.font18:style.font12,style.mt10,{color:COLORS.GREEN}]}>Free to Salty Dawg Members</Text>
            
            <Text style={[isTablet?style.font16:style.font12,style.mt10]}>
              Non-Members - $25 for the entire series or $12 for an individual
              webinar.
            </Text>
            <View style={[style.row,style.mt10,]}>
              <Text style={[isTablet?style.font16:style.font12,style.mt10, {marginRight:10}]}>
                  OR </Text>
                   <TouchableOpacity style={[style.button,style.borderRadius5]} onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/index.php?option=com_mcform&view=ngforms&id=2068147#!/")}>
                <Text style={[style.font12,style.buttonTxt]}>Join the SDSA</Text>
              </TouchableOpacity>
            
              
            </View>
              <Text style={[isTablet?style.font16:style.font12,style.mt10,style.lineHeight20]}>
               Now to take advantage of all of the benefits of membership
                including FREE webinars.
              Members can access recordings below:
            </Text>
            <View style={[ isTablet && style.row,style.mt10]}>
              
              <TouchableOpacity style={[style.button,style.borderRadius5]} onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/webinar-series---2023-fall-recordings")}>
                <Text style={[style.font12,style.buttonTxt]}>2023 Fall webinar recordings here</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[style.button,style.borderRadius5,style.mt10]} onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/webinar-series---2023-recordings")}>
                <Text style={[style.font12,style.buttonTxt]}>2023 Spring webinar series recordings here</Text>
              </TouchableOpacity>
        
            </View>
            <View style={[ isTablet && style.row,style.mt10]}>
              <TouchableOpacity style={[style.button,style.borderRadius5]} onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/webinar-series---2022-fall-recordings")}>
                <Text style={[style.font12,style.buttonTxt]}>2022 webinar series recordings here</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[style.button,style.borderRadius5,style.mt10]} onPress={()=>Linking.openURL("https://sdsa.memberclicks.net/members-only---library-of-webinar-recordings--arh")}>
                <Text style={[style.font12,style.buttonTxt]}>2021 webinar recordings here</Text>
              </TouchableOpacity>
            </View>
        </View>
        <View style={style.mt20}>
            <View style={styles.headerCellBlue}>
              <Text style={[style.font20,style.boldTxt,style.whiteText]}>2024 Webinars</Text>
            </View>
            <View style={style.row}>
              <Text style={[styles.headerCell,{textAlign:'center'},isTablet?style.font16:style.font14,style.boldTxt,style.primaryText]}>Date</Text>
              <Text style={[styles.headerCell,{textAlign:'center'},isTablet?style.font16:style.font14,style.boldTxt,style.primaryText]}>Time</Text>
              <Text style={[styles.headerCell,{textAlign:'center'},isTablet?style.font16:style.font14,style.boldTxt,style.primaryText]}>Webinar Name</Text>
              <Text style={[styles.headerCell,{textAlign:'center'},isTablet?style.font16:style.font14,style.boldTxt,style.primaryText]}>Webinar Type</Text>
            </View>

            {/* Sample webinar data */}
            {webinarData.map((webinar, index) => (
              <View key={index} style={style.row}>
                <View style={[style.contant,styles.headerCell]}>
                  <Text style={[isTablet?style.font14:style.font12]}>{webinar.date}</Text>
                </View>
                <View style={[style.contant,styles.headerCell]}>
                <Text style={[isTablet?style.font14:style.font12]}>{webinar.time}</Text>
                </View>
                <View style={[style.contant,styles.headerCell]}>
                  
                    <TouchableOpacity style={style.contant} onPress={()=>Linking.openURL(webinar.link)}>
                      <Text style={style.primaryText}>{webinar.name}</Text>
                    </TouchableOpacity>
                   
                    {
                      webinar.desp.map(e=>(<Text style={isTablet?style.font14:style.font12}>{e}</Text>))
                    }
                    
                </View>
                <View style={[style.contant,styles.headerCell]}>
                <Text style={[isTablet?style.font14:style.font12]}>{webinar.type}</Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerCellBlue:{
    backgroundColor:COLORS.LIGHT_PRIMARY,
    alignContent:'center',
    alignItems:'center'
  },
  headerCell:{
    flex:1,
    borderColor:COLORS.BLACK,
    borderWidth:0.5,
    paddingHorizontal:5
  }
});

export default WebinarsScreen;
