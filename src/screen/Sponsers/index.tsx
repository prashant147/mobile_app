import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import Header from '../../components/Header';
import DeviceInfo from 'react-native-device-info';
import TabBox from '../../components/TabBox';
import SvgUri from 'react-native-svg-uri';
import { scaleWidth,normalize } from '../../styles/utilities/dimentions';
import AboutSponsors from './aboutSponsors';
import AccessingMember from './accessingMember';
import UserInfo from '../../components/UserInfo';
import Menu from '../../routes/Menu';
import AntDesign from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
// ... (Your existing code remains unchanged)

const SponsersScreen = () => {
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation()
  const [selectedTab, setSelectedTab] = useState('About Sponsors');
  let tabData = ["About Sponsors","Accessing Member Benefits"]

  return (
    <View style={style.contant}>
      <View style={[style.row]}>
        <View style={[{flex: 2}]}>
          <View style={style.sidepanelcolor}>
            <Menu selectIndex={9}></Menu>
            </View>
        </View>
      </View>
      <View
        style={[
          style.contant,
          style.pH20,
          style.pt20
        ]}>
         <TabBox data={tabData} selectedTab={selectedTab} onTab={(tab:string)=>setSelectedTab(tab)}></TabBox>
         <View style={style.contant}>
            {
              selectedTab == "About Sponsors" && <AboutSponsors></AboutSponsors>
            }
            {
              selectedTab == "Accessing Member Benefits" && <AccessingMember></AccessingMember>
            }
         </View>
      </View>
    </View>
  );
};


export default SponsersScreen;
