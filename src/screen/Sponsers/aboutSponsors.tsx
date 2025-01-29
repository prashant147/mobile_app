import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import style from '../../styles/style';
import COLORS from '../../styles/theme/color';
import {
  normalize,
  scaleHeight,
  scaleWidth,
} from '../../styles/utilities/dimentions';
import { getAllSponsors } from '../../services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AboutSponsors = () => {
  const isTablet = DeviceInfo.isTablet();
  const [selectedTab, setSelectedTab] = useState('PLATINUM LEVEL SPONSORS');
  const [sponsorsData, setSponsorsData] = useState();
  const [sponsorsType, setSponsorsType] =useState()
  const [isLoader, setIsLoader] = useState(true);
  const token = AsyncStorage.getItem("accessToken");

  const scrollViewRef = useRef<ScrollView>(null);
  const selectTabBox = (tab: string, index: number) => {
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 600 * index, animated: true});
    }
    setSelectedTab(tab);
  };

  useFocusEffect(React.useCallback(() => {
    getSponsorsData()
  },[]))

  const getSponsorsData = async () => {
    try {
      const response = await getAllSponsors(token);
      if (response.status === 200) {
        const customSort = (a, b) => {
          if (a.sponsorsType === 'PLATINUM') return -1;
          if (b.sponsorsType === 'PLATINUM') return 1;
          if (a.sponsorsType === 'GOLD') return -1;
          if (b.sponsorsType === 'GOLD') return 1;
          if (a.sponsorsType === 'SILVER') return -1;
          if (b.sponsorsType === 'SILVER') return 1;
          if (a.sponsorsType === 'BRONZE') return -1;
          if (b.sponsorsType === 'BRONZE') return 1;
          if (a.sponsorsType === 'MARINA') return -1;
          if (b.sponsorsType === 'MARINA') return 1;
          return 0;
        };
        const sortedData = response.data.sort(customSort); 
        setSponsorsData(sortedData);
        setIsLoader(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoader(false);
    }
  };
  
  return (
    <View style={[style.contant, style.row]}>
      {isLoader ? 
          <View style={[style.centerBox,style.mt40,{flex:1, alignItems:'center'}]}>
          <ActivityIndicator size={'large'} style={[style.centerItem,style.mt40]} color={COLORS.PRIMARY} />
         </View>
        :
      <ScrollView style={[{flex: 2},style.mB15]} ref={scrollViewRef}>
        <Text
          style={[
            isTablet ? style.font20 : style.font14,
            style.primaryText,
            style.boldTxt,
            style.mtb10,
          ]}>
          Meet the Salty Dawg Sponsors
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.SECONDARY,
          }}></View>
        <Text
          style={[
            isTablet ? styles.description : styles.phonedescription,
            {marginBottom: 5},
          ]}>
           Vital to the Salty Dawg Sailing Association mission is our dedication to bringing events to the offshore sailing community that are offered at the lowest possible entry fee with the greatest possible value to participants. To achieve this goal consistently, we rely heavily on the contributions of our sponsors - some of the most respected companies in the marine industry.
        </Text>
        {sponsorsData && sponsorsData.map((e, index) => (
          <View style={style.mH10} key={`${e.title}-${index}`}>
            <Text
              style={[
                isTablet ? style.font18 : style.font14,
                style.primaryText,
                style.boldTxt,
                style.mtb10,
              ]}>
              {e.sponsorsType}&nbsp; LEVEL SPONSORS
            </Text>
              <View
                style={[
                  {
                    borderWidth: 1,
                    borderColor: COLORS.LIGHT_PRIMARY,
                    marginBottom: 10,
                    padding: normalize(10),
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius:8
                  },
                ]}>
                {e.sponsorsMediaUrl == 'string' ?<Image
                  style={[
                    {
                      width: scaleWidth(isTablet ? 300 : 150),
                      height: scaleWidth(isTablet ? 200 :100),
                      alignSelf: 'center',
                    },
                  ]}
                  resizeMode="contain"
                  source={require('../../assets/sponsers.png')}
                />:
                <TouchableOpacity onPress={() => {
                  if (e?.sponsorUrl) {
                    Linking.openURL(e.sponsorUrl);
                  }}}><Image
                style={[
                  {
                    width: scaleWidth(isTablet ? 300 : 150),
                    height: scaleWidth(isTablet ? 200 :100),
                    alignSelf: 'center',
                  },
                ]}
                resizeMode="contain"
                source={{uri: e.sponsorsMediaUrl}}
              />
              </TouchableOpacity>
              }
              <Text onPress={() => {
                  if (e?.sponsorUrl) {
                    Linking.openURL(e.sponsorUrl);
                  }}}
                  style={[
                    styles.description,
                    style.contant,
                    style.boldTxt,
                    style.mH10
                  ]}>
                  {e.sponsorName}
                </Text>
                <Text
                  style={[
                    styles.description,
                    style.mt5,
                    style.contant,
                    style.mH10
                  ]}>
                  {e.sponsorDescription}
                </Text>
              </View>
            {/* {e.Offering && <Text style={styles.description}>{e.Offering}</Text>}
            {e.details && <Text style={[styles.description, {marginBottom:30}]}>{e.details}</Text>} */}
          </View>
        ))}
      </ScrollView>}
      {/* {isTablet && (
        <View
          style={[
            {flex: 0.5, backgroundColor: COLORS.LIGHT_PRIMARY, paddingTop: 20},
          ]}>
          {sponsorsData && sponsorsData.map((e, index) => (
            <TouchableOpacity onPress={() => selectTabBox(e.title, index)}>
              <Text
                style={e.title == selectedTab ? styles.activeTab : styles.tab}>
                {e.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}
    </View>
  );
};
const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    color: '#141416',
  },
  phonedescription: {
    fontSize: 12,
    color: '#141416',
    lineHeight: 19,
    marginTop: 15,
  },
  activeTab: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(10),
    color: COLORS.LIGHT_PRIMARY,
    fontSize: scaleWidth(18),
  },
  tab: {
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(10),
    color: COLORS.WHITE,
    fontSize: scaleWidth(18),
  },
});
export default AboutSponsors;
