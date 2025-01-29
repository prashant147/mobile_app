import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import WebView from 'react-native-webview';
import { LinearProgress } from 'react-native-elements';
import style from '../styles/style';
import COLORS from '../styles/theme/color';
import { normalize } from '../styles/utilities/dimentions';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleSheet } from 'react-native';
import MembersContext from './Members/MembersContext';
import Menu from '../routes/Menu';
import BackIcon from 'react-native-vector-icons/FontAwesome';

const EducationWebview = ({ route }) => {
    const {setHideChatbotMember, setHideChatbot } = useContext(MembersContext);  
    const isTablet = DeviceInfo.isTablet();
    const navigation = useNavigation();
    const webViewRef = useRef(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [loading, setLoading] = useState(true);
    const [siteName, setSiteName] = useState('');
    useFocusEffect(
        React.useCallback(() => {
            setHideChatbotMember(true)
            setHideChatbot(true)
        })
    )
    useEffect(() => {
        const backAction = () => {
            if (canGoBack) {
                webViewRef.current.goBack();
                return true;
            } else if (route?.params?.path) {
                setHideChatbotMember(false)
                setHideChatbot(false)
                navigation.navigate(route.params.path);
                return true;
            } else {
                setHideChatbotMember(false)
                setHideChatbot(false)
                navigation.navigate('Home');
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [canGoBack, navigation, route]);


    const backBtnHandler = () => {
        if (route?.params?.path) {
            navigation.navigate(route?.params?.path)
          } else {
            navigation.navigate('Home')
      
          }
        }

    return (
        <View style={style.contant}>
            <View style={[style.row]}>
            <View style={[style.flexTwo]}>
            <View style={[style.sidepanelcolor]}>
              <Menu selectIndex={13} />
            </View>
        </View>
            </View>
            {loading && (
                <LinearProgress color={COLORS.PRIMARY} style={[styles.loader]} />
            )}
            <View
                style={[
                    style.contant,
                    style.mH5,
                ]}>
                <TouchableOpacity style={[style.row,style.mt20,style.mH20,style.centerBox]} onPress={backBtnHandler}>
              <BackIcon name="chevron-left" size={15} style={[style.mr10,style.mt3]} color={COLORS.PRIMARY} />
              <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
            </TouchableOpacity>
                <WebView
                    ref={webViewRef}
                    source={{ uri: route?.params?.link }}
                    onLoadStart={() => setLoading(true)}
                    onLoad={() => setLoading(false)}
                    onNavigationStateChange={(navState) => {
                        setCanGoBack(navState.canGoBack);
                        setCanGoForward(navState.canGoForward);
                    }}
                    style={{backgroundColor:'transparent'}}
                />
            </View>
        </View>
    );
};

export default EducationWebview;
const styles = StyleSheet.create({
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
    loader: {
        height: normalize(6)
    },
    navBtns: {
        height: normalize(30),
        width: normalize(40)
    }
})