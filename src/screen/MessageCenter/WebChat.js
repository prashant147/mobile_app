import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import WebView from 'react-native-webview';
import { LinearProgress } from 'react-native-elements';
import COLORS from '../../styles/theme/color';
import { normalize } from '../../styles/utilities/dimentions';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleSheet } from 'react-native';
import MembersContext from '../Members/MembersContext';
import style from '../../styles/style';
import Menu from '../../routes/Menu';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { Keyboard } from 'react-native';
import { Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { AppState } from 'react-native';

const WebChat = ({route}) => {

    const { setHideChatbotMember, setHideChatbot, loggedInUser,ChatData,setMsgUnreadCount,setMsgUnreadCountUpdate,applicationRole,setSelectedMenu} = useContext(MembersContext);
    const isTablet = DeviceInfo.isTablet();
    const navigation = useNavigation();
    const webViewRef = useRef('about:blank');
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [webUser, setWebUser] = useState(null);
    const [unReadCountWeb,setUnReadCountWeb] = useState(null);
    const [reloadKey, setReloadKey] = useState(0); // State to trigger reload

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsKeyboardOpen(true);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsKeyboardOpen(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    useFocusEffect(
        useCallback(() => {
            setSelectedMenu(5)
            setMsgUnreadCountUpdate(false)
            setMsgUnreadCountUpdate(true)
            setHideChatbotMember(true)
            setHideChatbot(true)
            getAccessToken()
           return ()=>{
            setWebUser(null)
           }
        }, [ChatData,route,reloadKey])
    )
    useEffect(() => {
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [canGoBack, navigation]);

    useEffect(()=>{
        if(unReadCountWeb !== null){
            setMsgUnreadCount(unReadCountWeb)
        }
    },[unReadCountWeb])
    const getAccessToken = async () => {
        try {
            const getaccessTokenData = await AsyncStorage.getItem('accessToken');
            if (getaccessTokenData !== null) {
                setAccessToken(getaccessTokenData)
                let res = `${Config.CHAT_URL}?accessToken=${getaccessTokenData}&userId=${loggedInUser.id}&applicationRole=${applicationRole}&reload=${reloadKey}`;
                if(ChatData){
                    res=`${Config.CHAT_URL}webchat/?accessToken=${getaccessTokenData}&userId=${loggedInUser.id}&applicationRole=${applicationRole}&id=${ChatData.id}&type=${ChatData.type}&reload=${reloadKey}`
                }else if(route?.params && route?.params?.type){
                    res=`${Config.CHAT_URL}?accessToken=${getaccessTokenData}&userId=${loggedInUser.id}&applicationRole=${applicationRole}&id=''&type=${route.params.type}&reload=${reloadKey}`
                }
                setWebUser(res);
               console.log('webchaturl', res);
            } else {
                console.log('Access Token not found');
                return null;
            }
        } catch (error) {
            console.error('Error retrieving Access Token:', error);
            return null;
        }
    };
    const renderLoader = () => (
        loading &&
        <View style={[style.contant, style.row, style.centerBox, style.centerItem, { position: 'absolute', top: '45%', left: "45%" }]}>
            <ActivityIndicator color={COLORS.PRIMARY} />
        </View>
    );
    return (
        <View style={style.contant}>
            <View style={[style.row]}>
                <View style={[{ flex: 2 }]}>
                    <View style={[style.sidepanelcolor]}>
                        <Menu selectIndex={5} />
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                style={[
                    style.contant,
                ]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={isKeyboardOpen ? Dimensions.get('screen').height * 0.05 : 0}


            >
                
                {loading &&
                <View style={[style.contant, style.row, style.centerBox, style.centerItem, styles.msgLoader]}>
                    <ActivityIndicator color={COLORS.PRIMARY} />
                </View>}
                <WebView
                    renderLoading={renderLoader}
                    ref={webViewRef}
                    source={{ uri: webUser || undefined }}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => {setTimeout(() => {
                        setLoading(false) 
                    }, 1500);}}
                    onLoad={() => {setTimeout(() => {
                        setLoading(false) 
                    }, 1500);}}
                    onLoadProgress={() => setLoading(true)}
                    onNavigationStateChange={(navState) => {
                        setCanGoBack(navState.canGoBack);
                        setCanGoForward(navState.canGoForward);
                    }}
                    cacheEnabled={true}
                    originWhitelist={['*']}
                    useWebView2={true}
                    sharedCookiesEnabled={true}
                    useSharedProcessPool={true}
                    thirdPartyCookiesEnabled={true}
                    cacheMode='LOAD_CACHE_ELSE_NETWORK'
                    scalesPageToFit={true} 
                    javaScriptEnabled={true} // Enable JavaScript for iframe interactions
                    domStorageEnabled={true}
                    onError={(syntheticEvent) => {
                        setReloadKey((prevKey) => prevKey + 1); // Trigger reload
                    }}
                    onHttpError={(syntheticEvent) => {
                        setReloadKey((prevKey) => prevKey + 1); // Trigger reload
                    }}
                    renderError={(syntheticEvent) => {
                        setReloadKey((prevKey) => prevKey + 1); // Trigger reload
                    }}
                    style={{ backgroundColor: 'transparent', height: loading ? 0 : 'auto' }}
                    onMessage={(event) => {
                        const messageData = JSON.parse(event.nativeEvent.data);
                            if (messageData && typeof messageData.message === 'string' && messageData.message.includes("unreadCount")) {
                                const unreadCountStr = messageData?.message?.split("unreadCount ")[1]; // Split the message at "unreadCount " and take the second part
                                const unreadCount = parseInt(unreadCountStr); // Convert the string to a number
                                setUnReadCountWeb(unreadCount)
                            }
                      }}
                    allowsMagnification={false} // Disable zooming
                    useWebKit={true} // Use WebKit engine
                    injectedJavaScript={`
                    console.log = (message) => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ message }));
                      };
                    document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                    document.body.style.maxWidth = '100%'; // Enforce maximum width
            
                    // Disable text selection and copying
                    document.documentElement.style.webkitTouchCallout='none';
                    document.body.style.touchAction = 'none'; // Disable touch actions
                `}
                    scrollEnabled={false}

                />

            </KeyboardAvoidingView>
        </View>
    );
};

export default WebChat;
const styles = StyleSheet.create({
    msgLoader:{ 
        position: 'absolute', 
        top: '45%', 
        left: "45%"
     },
    header: {
        backgroundColor: COLORS.PRIMARY,
        height: normalize(45),
        width: '100%'
    },
    url: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Roboto-Regular',
    },
    loader: {
        height: normalize(6)
    },
    navBtns: {
        height: normalize(30),
        width: normalize(40)
    }
})