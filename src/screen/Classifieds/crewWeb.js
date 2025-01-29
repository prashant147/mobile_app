import React, { useState,useEffect,useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  BackHandler
} from 'react-native';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import DeviceInfo from 'react-native-device-info';
import UserInfo from '../../components/UserInfo';
import Menu from '../../routes/Menu';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { LinearProgress } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import BackIcon from 'react-native-vector-icons/FontAwesome';
import { normalize } from '../../styles/utilities/dimentions';

const CrewWeb = ({route}) => {
  const navigation = useNavigation()
  const isTablet = DeviceInfo.isTablet();
  const [loading, setLoading] = useState(true);



  return (
    <View style={style.contant}>
      <View style={[style.row]}>
        <View style={[{ flex: 2 }]}>
            <View style={[style.sidepanelcolor]}>
              <Menu selectIndex={7} />
            </View>
        </View>
      </View>
      {loading && (
        <LinearProgress color={COLORS.PRIMARY} style={[styles.loader]} />
      )}
      <View style={[style.contant]}>
        <WebView
          source={{
            uri: "https://sdsa.memberclicks.net/about-crew",
          }}
          style={{ backgroundColor: "transparent" }}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  description: {
    fontSize: 16,
    color: COLORS.GREY
  },
  phonedescription: {
    fontSize: 12,
    color: COLORS.GREY
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    height: normalize(45),
    width: '100%'
},
url: {
    fontSize: 14,
    color: 'white',
    fontFamily:'Roboto-Regular',
},
});

export default CrewWeb;
