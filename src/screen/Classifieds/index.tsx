import React, {useCallback, useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image
} from 'react-native';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import Header from '../../components/Header';
import DeviceInfo from 'react-native-device-info';
import SvgUri from 'react-native-svg-uri';
import { scaleWidth } from '../../styles/utilities/dimentions';
import Menu from '../../routes/Menu';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { LinearProgress } from 'react-native-elements';
import MembersContext from '../Members/MembersContext';
import BackIcon from 'react-native-vector-icons/FontAwesome';
// ... (Your existing code remains unchanged)

const ClassifiedsScreen = () => {
  const navigation = useNavigation()
  const isTablet = DeviceInfo.isTablet();
  const [loading, setLoading] = useState(true);
  const {setSelectedMenu}=useContext(MembersContext)
  useFocusEffect(React.useCallback(()=>{
    setSelectedMenu(6)
  },[]))
  return (
    <View style={style.contant}>
            <View style={[style.sidepanelcolor]}>
              <Menu selectIndex={6} />
            </View>
      {loading && (
        <LinearProgress color={COLORS.PRIMARY} style={[styles.loader]} />
      )}
      <View style={[style.contant]}>
        <WebView
          source={{
            uri: "https://sdsa.spiritsale.com/products",
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
});

export default ClassifiedsScreen;
