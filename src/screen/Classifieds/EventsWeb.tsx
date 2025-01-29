import React, { useState } from 'react';
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
import DeviceInfo from 'react-native-device-info';
import UserInfo from '../../components/UserInfo';
import Menu from '../../routes/Menu';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { LinearProgress } from 'react-native-elements';
import BackIcon from 'react-native-vector-icons/FontAwesome';

const EventsWeb = ({route}:any) => {
  const navigation = useNavigation()
  const isTablet = DeviceInfo.isTablet();
  const [loading, setLoading] = useState(true);

  const backBtnHandler = () => {
    if (route?.params?.path) {
        navigation.navigate(route?.params?.path,{item:route?.params?.id})
      } else {
        navigation.navigate('Home')
  
      }
    }
    
  return (
    <View style={style.contant}>
      <View style={[style.sidepanelcolor]}>
        <Menu selectIndex={4} />
      </View>
      {loading && (
        <LinearProgress color={COLORS.PRIMARY} style={[styles.loader]} />
      )}
      <View style={[style.contant]}>
      <TouchableOpacity style={[style.row,style.mt20,style.mH20,style.centerBox]} onPress={backBtnHandler}>
              <BackIcon name="chevron-left" size={15} style={[style.mr10,style.mt3]} color={COLORS.PRIMARY} />
              <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
            </TouchableOpacity>
        <WebView
          source={{
            uri: "https://sdsa.memberclicks.net/rendezvous",
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

export default EventsWeb;
