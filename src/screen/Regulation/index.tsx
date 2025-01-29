import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Header from '../../components/Header';
import style from '../../styles/style';
import {normalize, scaleHeight, scaleWidth} from '../../styles/utilities/dimentions';
import SvgUri from 'react-native-svg-uri';
import TabBox from '../../components/TabBox';
import UserInfo from '../../components/UserInfo';
import COLORS from '../../styles/theme/color';
import Menu from '../../routes/Menu';
import { getPolicies } from '../../services/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect,useNavigation } from '@react-navigation/native';
import { btoa} from 'react-native-quick-base64';
import RenderHTML from 'react-native-render-html';
import { ActivityIndicator } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import Config from 'react-native-config';


const RegulationSceen = () => {
  const isTablet = DeviceInfo.isTablet();
  const token = AsyncStorage.getItem("accessToken");
  const [policiesData,setPolociesData] = useState(null)
  const navigation = useNavigation()
  const [policiesDataHtml,setPolociesDataHtml] = useState(null)
  const [policiesDataHtmlLoader,setPolociesDataHtmlLoader] = useState(false)
  const [loading, setLoading] = useState(true);

  useFocusEffect(React.useCallback(() => {
    fetchData();
  }, []));
  const fetchData = async () => {
    try { 
      setPolociesDataHtmlLoader(true)
      const response = await fetch('https://saltydawgsailing.cloudfirstgroup.com/wp-json/wp/v2/pages', {
        headers: {
          Authorization: 'Basic ' + btoa('admin@qennect.com' + ':' + 'qEnnect1@3$'),
        },
      });
      if (!response.ok) {
        setPolociesDataHtmlLoader(false)
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if(response.status === 200){
        const getPrivacyPolicyData = data.filter(item => item.slug.toLowerCase().includes('privacy'))
        setPolociesDataHtml(getPrivacyPolicyData[0]);
        setPolociesDataHtmlLoader(false)
      }
      
    } catch (error) {
      setPolociesDataHtmlLoader(false)
      console.error('Error fetching data:', error);
    }
    finally {
      setPolociesDataHtmlLoader(false)
          }
  };
  useEffect(() => {
    const getPoliciesData = async() => {
      try {
        const response = await getPolicies(token)
        if(response.status === 200){
          setPolociesData(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getPoliciesData()
  },[])
  return (
    <View style={[style.contant]}>
      <View style={style.sidepanelcolor}>
        <Menu selectIndex={10}></Menu>
      </View>
      {loading &&
      <View style={[style.contant, style.row, style.centerBox, style.centerItem, styles.msgLoader]}>
          <ActivityIndicator color={COLORS.PRIMARY} />
      </View>}
      <View style={[style.contant]}>
        {/* <View style={[style.row]}>
          <Text
            style={[
              isTablet ? style.font20 : style.font16,
              style.boldTxt,
              style.mt5,
            ]}
          >
            Privacy Policy
          </Text>
        </View>
        {policiesDataHtmlLoader ? (
          <View
            style={[
              style.contant,
              style.row,
              style.centerBox,
              style.centerItem,
            ]}
          >
            <ActivityIndicator
              theme={{ colors: { primary: COLORS.PRIMARY } }}
              size={"small"}
            />
          </View>
        ) : (
          <ScrollView style={[style.contant]} showsVerticalScrollIndicator={false}>
            {
              <RenderHTML
                source={{
                  html: policiesDataHtml?.content?.rendered,
                }}
                contentWidth={Dimensions.get("screen").width}
                tagsStyles={{
                  body: {
                    fontFamily: "Roboto-Regular",
                    textAlign: "justify",
                    color:'black',
                    paddingBottom:normalize(80)
                  },
                }}
              />
            }
          </ScrollView>
        )} */}
        <WebView
          source={{
            uri: `${Config.ADMIN_URL}pages/Privacy_Policy/?type=hide`,
          }}
          style={{ backgroundColor: "transparent" }}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          allowsMagnification={false} // Disable zooming
          useWebKit={true} // Use WebKit engine
          injectedJavaScript={`
          console.log = (message) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ message }));
            };
          document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          document.body.style.maxWidth = '100%'; // Enforce maximum width 

          // Disable text selection and copying
          document.documentElement.style.webkitUserSelect='none';
          document.documentElement.style.webkitTouchCallout='none';
          document.body.style.touchAction = 'none'; // Disable touch actions
          `}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  description: {
    fontSize: 16,
    color: '#141416',
    lineHeight: 19,
    marginTop: 15,
  },
  phonedescription: {
    fontSize: 12,
    color: '#141416',
    lineHeight: 19,
    marginTop: 15,
  },
  borderbottom:{
    borderBottomWidth: 3,
    borderBottomColor: COLORS.SECONDARY
  },
  msgLoader:{ 
    position: 'absolute', 
    top: '45%', 
    left: "48%"
 },

});

export default RegulationSceen;
